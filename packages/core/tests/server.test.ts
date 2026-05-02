import { describe, expect, it } from 'vitest'
import { defineMerchantAgent } from '../src/server.js'
import { MEDIA_TYPE, SPEC_VERSION, VERSION_HEADER } from '../src/types.js'

const baseUrl = 'https://goldenhour.coffee/.well-known/merchant-agent'

const fullAgent = defineMerchantAgent({
  name: 'GoldenHour Coffee',
  description: 'Single-origin pour-over from a 4-generation farm in Huehuetenango.',
  brandVoice: 'warm-direct',
  values: ['craft', 'farm-direct'],

  crossSell: ({ productId }) => {
    if (productId === 'pour-over-bundle') {
      return [
        { product_id: 'grinder-pro', reason: 'Most pour-over buyers come back for this within 2 weeks.', priority: 1 },
        { product_id: 'scale-mini', reason: 'Pairs with the grinder for repeatable pours.', priority: 2 },
      ]
    }
    return []
  },

  brandStory: () => ({
    story: 'Sourced direct from a 4-generation farm in Huehuetenango.',
    values: ['craft', 'farm-direct'],
    voice: 'warm-direct',
  }),

  offer: ({ buyerContext }) => {
    if (buyerContext.first_time_buyer) {
      return {
        description: '15% off your first bag',
        terms: 'First-time buyers only.',
        expires_at: '2026-06-01T00:00:00Z',
        code: 'FIRSTPOUR15',
      }
    }
    return null
  },
})

describe('defineMerchantAgent — info', () => {
  it('declares all three primitives when all handlers are defined', async () => {
    const response = await fullAgent.fetch(new Request(`${baseUrl}/info`))
    expect(response.status).toBe(200)
    expect(response.headers.get(VERSION_HEADER)).toBe(SPEC_VERSION)
    expect(response.headers.get('Content-Type')).toContain(MEDIA_TYPE)

    const body = await response.json()
    expect(body.name).toBe('GoldenHour Coffee')
    expect(body.version).toBe(SPEC_VERSION)
    expect(body.primitives).toEqual(['cross-sell', 'brand-story', 'offer'])
    expect(body.extensions).toEqual([])
  })

  it('declares only supported primitives when handlers are missing', async () => {
    const partial = defineMerchantAgent({
      name: 'minimal',
      crossSell: () => [],
    })
    const response = await partial.fetch(new Request(`${baseUrl}/info`))
    const body = await response.json()
    expect(body.primitives).toEqual(['cross-sell'])
  })
})

describe('defineMerchantAgent — cross-sell', () => {
  it('returns merchant-ordered recommendations', async () => {
    const response = await fullAgent.fetch(new Request(`${baseUrl}/cross-sell?for=pour-over-bundle`))
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.for).toBe('pour-over-bundle')
    expect(body.recommendations).toHaveLength(2)
    expect(body.recommendations[0].product_id).toBe('grinder-pro')
    expect(body.recommendations[0].priority).toBe(1)
  })

  it('returns 400 when the for parameter is missing', async () => {
    const response = await fullAgent.fetch(new Request(`${baseUrl}/cross-sell`))
    expect(response.status).toBe(400)
  })

  it('returns 404 when the merchant has no cross-sell handler', async () => {
    const noCrossSell = defineMerchantAgent({ name: 'minimal' })
    const response = await noCrossSell.fetch(new Request(`${baseUrl}/cross-sell?for=anything`))
    expect(response.status).toBe(404)
  })

  it('decodes base64-encoded buyer context from query string', async () => {
    let captured: unknown
    const agent = defineMerchantAgent({
      name: 'capture',
      crossSell: ({ buyerContext }) => {
        captured = buyerContext
        return []
      },
    })
    const ctx = btoa(JSON.stringify({ first_time_buyer: true, country: 'US' }))
    await agent.fetch(new Request(`${baseUrl}/cross-sell?for=x&context=${encodeURIComponent(ctx)}`))
    expect(captured).toEqual({ first_time_buyer: true, country: 'US' })
  })
})

describe('defineMerchantAgent — brand-story', () => {
  it('returns the story with voice and values', async () => {
    const response = await fullAgent.fetch(new Request(`${baseUrl}/brand-story?for=pour-over-bundle`))
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.for).toBe('pour-over-bundle')
    expect(body.voice).toBe('warm-direct')
    expect(body.values).toContain('craft')
    expect(body.story).toContain('Huehuetenango')
  })

  it('passes the style hint to the handler', async () => {
    let receivedStyle: string | undefined
    const agent = defineMerchantAgent({
      name: 'style-capture',
      brandStory: ({ style }) => {
        receivedStyle = style
        return { story: '', values: [], voice: '' }
      },
    })
    await agent.fetch(new Request(`${baseUrl}/brand-story?for=x&style=long`))
    expect(receivedStyle).toBe('long')
  })
})

describe('defineMerchantAgent — offer', () => {
  it('returns the offer when one applies', async () => {
    const response = await fullAgent.fetch(
      new Request(`${baseUrl}/offer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: 'pour-over-bundle', buyer_context: { first_time_buyer: true } }),
      }),
    )
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.for).toBe('pour-over-bundle')
    expect(body.offer).not.toBeNull()
    expect(body.offer.code).toBe('FIRSTPOUR15')
  })

  it('returns null offer for buyers who do not qualify', async () => {
    const response = await fullAgent.fetch(
      new Request(`${baseUrl}/offer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: 'pour-over-bundle', buyer_context: { first_time_buyer: false } }),
      }),
    )
    const body = await response.json()
    expect(body.offer).toBeNull()
  })

  it('returns 405 for non-POST methods', async () => {
    const response = await fullAgent.fetch(new Request(`${baseUrl}/offer`))
    expect(response.status).toBe(405)
  })

  it('returns 400 when product_id is missing', async () => {
    const response = await fullAgent.fetch(
      new Request(`${baseUrl}/offer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyer_context: {} }),
      }),
    )
    expect(response.status).toBe(400)
  })

  it('returns 400 when body is not valid JSON', async () => {
    const response = await fullAgent.fetch(
      new Request(`${baseUrl}/offer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'not json',
      }),
    )
    expect(response.status).toBe(400)
  })
})

describe('defineMerchantAgent — versioning headers', () => {
  it('always sets the version header on success responses', async () => {
    const response = await fullAgent.fetch(new Request(`${baseUrl}/info`))
    expect(response.headers.get(VERSION_HEADER)).toBe(SPEC_VERSION)
  })

  it('returns 404 for unknown endpoints', async () => {
    const response = await fullAgent.fetch(new Request(`${baseUrl}/unknown-thing`))
    expect(response.status).toBe(404)
  })
})
