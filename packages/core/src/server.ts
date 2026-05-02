// merchant-agent v0.1 — server SDK
// Framework-agnostic. Returns a handler that takes a Request and returns a Response.
// Adapters for Express, Next.js, Hono, etc. are thin wrappers around this core handler.

import {
  type AgentInfo,
  type BrandStoryResponse,
  type BuyerContext,
  type CrossSellResponse,
  type MerchantAgentDefinition,
  MEDIA_TYPE,
  type OfferResponse,
  type Primitive,
  SPEC_VERSION,
  VERSION_HEADER,
} from './types.js'

export type { MerchantAgentDefinition } from './types.js'

interface MerchantAgentInstance {
  /** Framework-agnostic handler. Pass any Request, get back a Response. */
  fetch: (request: Request) => Promise<Response>
  /** Express/Connect-style middleware adapter. Lazily detects req/res shape. */
  handler: () => (req: unknown, res: unknown, next?: () => void) => void
  /** Inspect the agent's declared primitives. */
  info: () => AgentInfo
}

const ROUTES = {
  info: '/info',
  crossSell: '/cross-sell',
  brandStory: '/brand-story',
  offer: '/offer',
} as const

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': `${MEDIA_TYPE};v=${SPEC_VERSION}`,
      [VERSION_HEADER]: SPEC_VERSION,
      'Cache-Control': 'public, max-age=60',
    },
  })
}

function errorResponse(status: number, message: string): Response {
  return jsonResponse({ error: message }, status)
}

function extractEndpoint(pathname: string): string {
  // Match the suffix of common mount paths so the handler works whether
  // the merchant mounts at /.well-known/merchant-agent or /agent or /api/agent.
  for (const route of Object.values(ROUTES)) {
    if (pathname === route || pathname.endsWith(route)) {
      return route
    }
  }
  return ''
}

export function defineMerchantAgent(definition: MerchantAgentDefinition): MerchantAgentInstance {
  const primitives: Primitive[] = []
  if (definition.crossSell) primitives.push('cross-sell')
  if (definition.brandStory) primitives.push('brand-story')
  if (definition.offer) primitives.push('offer')

  const info: AgentInfo = {
    name: definition.name,
    description: definition.description ?? '',
    version: SPEC_VERSION,
    primitives,
    extensions: [],
  }

  async function fetchHandler(request: Request): Promise<Response> {
    const url = new URL(request.url)
    const endpoint = extractEndpoint(url.pathname)

    if (endpoint === ROUTES.info) {
      return jsonResponse(info)
    }

    if (endpoint === ROUTES.crossSell) {
      if (!definition.crossSell) {
        return errorResponse(404, 'cross-sell primitive not supported')
      }
      const productId = url.searchParams.get('for')
      if (!productId) {
        return errorResponse(400, 'missing required query parameter: for')
      }
      const buyerContext = parseBuyerContext(url.searchParams.get('context'))
      const recommendations = await definition.crossSell({ productId, buyerContext })
      const body: CrossSellResponse = { for: productId, recommendations }
      return jsonResponse(body)
    }

    if (endpoint === ROUTES.brandStory) {
      if (!definition.brandStory) {
        return errorResponse(404, 'brand-story primitive not supported')
      }
      const productId = url.searchParams.get('for')
      if (!productId) {
        return errorResponse(400, 'missing required query parameter: for')
      }
      const style = url.searchParams.get('style')
      const result = await definition.brandStory({
        productId,
        style: style === 'long' ? 'long' : style === 'short' ? 'short' : undefined,
      })
      const body: BrandStoryResponse = { for: productId, ...result }
      return jsonResponse(body)
    }

    if (endpoint === ROUTES.offer) {
      if (!definition.offer) {
        return errorResponse(404, 'offer primitive not supported')
      }
      if (request.method !== 'POST') {
        return errorResponse(405, 'offer endpoint requires POST')
      }
      let body: { product_id?: string; buyer_context?: BuyerContext }
      try {
        body = (await request.json()) as typeof body
      } catch {
        return errorResponse(400, 'invalid JSON body')
      }
      if (!body.product_id) {
        return errorResponse(400, 'missing required field: product_id')
      }
      const offer = await definition.offer({
        productId: body.product_id,
        buyerContext: body.buyer_context ?? {},
      })
      const responseBody: OfferResponse = { for: body.product_id, offer: offer ?? null }
      return jsonResponse(responseBody)
    }

    return errorResponse(404, 'unknown merchant-agent endpoint')
  }

  function expressMiddleware() {
    return (req: unknown, res: unknown, next?: () => void): void => {
      // Minimal duck-typed Express adapter.
      const r = req as { url: string; method: string; headers: Record<string, string>; body?: unknown; on?: never }
      const response = res as {
        statusCode: number
        setHeader: (k: string, v: string) => void
        end: (body: string) => void
      }

      const host = r.headers.host ?? 'localhost'
      const protocol = r.headers['x-forwarded-proto'] ?? 'http'
      const fullUrl = `${protocol}://${host}${r.url}`

      void (async () => {
        try {
          const init: RequestInit = { method: r.method, headers: r.headers }
          if (r.method === 'POST' && r.body !== undefined) {
            init.body = typeof r.body === 'string' ? r.body : JSON.stringify(r.body)
          }
          const fetchRequest = new Request(fullUrl, init)
          const fetchResponse = await fetchHandler(fetchRequest)
          response.statusCode = fetchResponse.status
          fetchResponse.headers.forEach((value, key) => {
            response.setHeader(key, value)
          })
          const text = await fetchResponse.text()
          response.end(text)
        } catch (err) {
          if (next) next()
          else {
            response.statusCode = 500
            response.end(JSON.stringify({ error: (err as Error).message }))
          }
        }
      })()
    }
  }

  return {
    fetch: fetchHandler,
    handler: expressMiddleware,
    info: () => info,
  }
}

function parseBuyerContext(raw: string | null): BuyerContext {
  if (!raw) return {}
  try {
    // Buyer context is base64-encoded JSON in the query string per the spec.
    const decoded = typeof atob !== 'undefined' ? atob(raw) : Buffer.from(raw, 'base64').toString('utf-8')
    return JSON.parse(decoded) as BuyerContext
  } catch {
    return {}
  }
}
