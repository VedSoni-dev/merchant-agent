// merchant-agent v0.1 — client SDK
// Discover a merchant-agent endpoint on a site, then talk to it.

import {
  type AgentInfo,
  type BrandStoryResponse,
  type BuyerContext,
  type CrossSellResponse,
  MEDIA_TYPE,
  type OfferResponse,
  SPEC_VERSION,
} from './types.js'

const LINK_REL = 'merchant-agent'
const WELL_KNOWN_PATH = '/.well-known/merchant-agent'

interface DiscoveryOptions {
  signal?: AbortSignal
  /** Override the discovery fetcher (testing, custom transports). */
  fetch?: typeof globalThis.fetch
}

/**
 * Discover a merchant-agent endpoint on a site.
 * Tries (in order): HTTP Link header → HTML <link rel="merchant-agent"> → /.well-known/merchant-agent
 * Returns the absolute URL of the agent root, or null if no agent is published.
 */
export async function discover(siteUrl: string, options: DiscoveryOptions = {}): Promise<string | null> {
  const fetcher = options.fetch ?? globalThis.fetch
  const url = new URL(siteUrl)

  try {
    const response = await fetcher(url.toString(), {
      method: 'GET',
      headers: { Accept: 'text/html, */*' },
      signal: options.signal,
    })

    // Try HTTP Link header first.
    const linkHeader = response.headers.get('Link')
    if (linkHeader) {
      const fromHeader = parseLinkHeader(linkHeader, url)
      if (fromHeader) return fromHeader
    }

    const contentType = response.headers.get('Content-Type') ?? ''
    if (contentType.includes('text/html')) {
      const html = await response.text()
      const fromHtml = parseLinkElement(html, url)
      if (fromHtml) return fromHtml
    }
  } catch {
    // Discovery is allowed to fail on network errors; fall through to well-known probe.
  }

  // Fallback: probe the well-known path directly.
  try {
    const wellKnown = new URL(WELL_KNOWN_PATH, url).toString()
    const response = await fetcher(`${wellKnown}/info`, {
      method: 'GET',
      headers: { Accept: `${MEDIA_TYPE};v=${SPEC_VERSION}` },
      signal: options.signal,
    })
    if (response.ok) return wellKnown
  } catch {
    // No agent published.
  }

  return null
}

interface TalkOptions {
  signal?: AbortSignal
  fetch?: typeof globalThis.fetch
}

interface TalkClient {
  info(): Promise<AgentInfo>
  crossSell(input: { productId: string; buyerContext?: BuyerContext }): Promise<CrossSellResponse>
  brandStory(input: { productId: string; style?: 'short' | 'long' }): Promise<BrandStoryResponse>
  offer(input: { productId: string; buyerContext: BuyerContext }): Promise<OfferResponse>
}

export function talk(endpoint: string, options: TalkOptions = {}): TalkClient {
  const fetcher = options.fetch ?? globalThis.fetch
  const acceptHeader = `${MEDIA_TYPE};v=${SPEC_VERSION}`
  const root = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint

  async function get<T>(path: string): Promise<T> {
    const response = await fetcher(`${root}${path}`, {
      method: 'GET',
      headers: { Accept: acceptHeader },
      signal: options.signal,
    })
    if (!response.ok) {
      throw new MerchantAgentError(response.status, `${path} returned ${response.status}`)
    }
    return (await response.json()) as T
  }

  return {
    info: () => get<AgentInfo>('/info'),

    crossSell: ({ productId, buyerContext }) => {
      const params = new URLSearchParams({ for: productId })
      if (buyerContext && Object.keys(buyerContext).length > 0) {
        const encoded = btoa(JSON.stringify(buyerContext))
        params.set('context', encoded)
      }
      return get<CrossSellResponse>(`/cross-sell?${params}`)
    },

    brandStory: ({ productId, style }) => {
      const params = new URLSearchParams({ for: productId })
      if (style) params.set('style', style)
      return get<BrandStoryResponse>(`/brand-story?${params}`)
    },

    offer: async ({ productId, buyerContext }) => {
      const response = await fetcher(`${root}/offer`, {
        method: 'POST',
        headers: {
          Accept: acceptHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_id: productId, buyer_context: buyerContext }),
        signal: options.signal,
      })
      if (!response.ok) {
        throw new MerchantAgentError(response.status, `/offer returned ${response.status}`)
      }
      return (await response.json()) as OfferResponse
    },
  }
}

export class MerchantAgentError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'MerchantAgentError'
  }
}

function parseLinkHeader(header: string, base: URL): string | null {
  // RFC 8288: Link: <uri>; rel="..."
  for (const segment of header.split(',')) {
    const match = segment.match(/<([^>]+)>\s*;\s*rel\s*=\s*"?([^";\s]+)/i)
    if (match && match[2] === LINK_REL) {
      return new URL(match[1] ?? '', base).toString()
    }
  }
  return null
}

function parseLinkElement(html: string, base: URL): string | null {
  // Cheap HTML scan for <link rel="merchant-agent" href="...">
  // We avoid a full HTML parser to keep the client dependency-free.
  const linkRegex = /<link\b[^>]*\brel\s*=\s*["']([^"']+)["'][^>]*\bhref\s*=\s*["']([^"']+)["']/gi
  let match: RegExpExecArray | null = linkRegex.exec(html)
  while (match !== null) {
    if (match[1]?.toLowerCase() === LINK_REL && match[2]) {
      return new URL(match[2], base).toString()
    }
    match = linkRegex.exec(html)
  }

  // href before rel ordering
  const linkRegex2 = /<link\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*\brel\s*=\s*["']([^"']+)["']/gi
  match = linkRegex2.exec(html)
  while (match !== null) {
    if (match[2]?.toLowerCase() === LINK_REL && match[1]) {
      return new URL(match[1], base).toString()
    }
    match = linkRegex2.exec(html)
  }

  return null
}
