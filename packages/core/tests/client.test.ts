import { describe, expect, it, vi } from 'vitest'
import { discover, talk } from '../src/client.js'

describe('discover', () => {
  it('finds the agent endpoint from an HTTP Link header', async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(
      new Response('<html></html>', {
        headers: {
          'Content-Type': 'text/html',
          Link: '</.well-known/merchant-agent>; rel="merchant-agent"',
        },
      }),
    )
    const endpoint = await discover('https://example.com', { fetch: fetcher })
    expect(endpoint).toBe('https://example.com/.well-known/merchant-agent')
  })

  it('finds the agent endpoint from an HTML <link> element', async () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <link rel="merchant-agent" href="/agent">
        </head>
        <body></body>
      </html>
    `
    const fetcher = vi.fn().mockResolvedValueOnce(
      new Response(html, {
        headers: { 'Content-Type': 'text/html' },
      }),
    )
    const endpoint = await discover('https://example.com', { fetch: fetcher })
    expect(endpoint).toBe('https://example.com/agent')
  })

  it('handles href-before-rel attribute ordering', async () => {
    const html = `<link href="/x" rel="merchant-agent">`
    const fetcher = vi.fn().mockResolvedValueOnce(
      new Response(html, { headers: { 'Content-Type': 'text/html' } }),
    )
    const endpoint = await discover('https://example.com', { fetch: fetcher })
    expect(endpoint).toBe('https://example.com/x')
  })

  it('falls back to /.well-known/merchant-agent when no link is present', async () => {
    const fetcher = vi
      .fn()
      // First: HTML with no link
      .mockResolvedValueOnce(
        new Response('<html><body>no link here</body></html>', {
          headers: { 'Content-Type': 'text/html' },
        }),
      )
      // Second: well-known probe succeeds
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ name: 'x', version: '0.1', primitives: [], extensions: [] }), {
          status: 200,
          headers: { 'Content-Type': 'application/merchant-agent;v=0.1' },
        }),
      )
    const endpoint = await discover('https://example.com', { fetch: fetcher })
    expect(endpoint).toBe('https://example.com/.well-known/merchant-agent')
  })

  it('returns null when no agent is published', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(
        new Response('<html></html>', { headers: { 'Content-Type': 'text/html' } }),
      )
      .mockResolvedValueOnce(new Response('not found', { status: 404 }))
    const endpoint = await discover('https://example.com', { fetch: fetcher })
    expect(endpoint).toBeNull()
  })
})

describe('talk', () => {
  it('GETs /info with the right Accept header', async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(
      new Response(
        JSON.stringify({ name: 'x', description: '', version: '0.1', primitives: [], extensions: [] }),
        { status: 200 },
      ),
    )
    const client = talk('https://example.com/.well-known/merchant-agent', { fetch: fetcher })
    await client.info()
    expect(fetcher).toHaveBeenCalledWith(
      'https://example.com/.well-known/merchant-agent/info',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ Accept: 'application/merchant-agent;v=0.1' }),
      }),
    )
  })

  it('encodes buyerContext as base64 query param for crossSell', async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(
      new Response(JSON.stringify({ for: 'x', recommendations: [] }), { status: 200 }),
    )
    const client = talk('https://example.com/agent', { fetch: fetcher })
    await client.crossSell({ productId: 'x', buyerContext: { first_time_buyer: true } })

    const callUrl = fetcher.mock.calls[0]?.[0] as string
    const url = new URL(callUrl)
    const ctx = url.searchParams.get('context')
    expect(ctx).not.toBeNull()
    const decoded = JSON.parse(atob(ctx!))
    expect(decoded).toEqual({ first_time_buyer: true })
  })

  it('POSTs offer with the JSON body', async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(
      new Response(JSON.stringify({ for: 'x', offer: null }), { status: 200 }),
    )
    const client = talk('https://example.com/agent', { fetch: fetcher })
    await client.offer({ productId: 'x', buyerContext: { country: 'US' } })

    const init = fetcher.mock.calls[0]?.[1] as RequestInit
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body as string)).toEqual({
      product_id: 'x',
      buyer_context: { country: 'US' },
    })
  })

  it('throws MerchantAgentError on non-2xx responses', async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(new Response('nope', { status: 500 }))
    const client = talk('https://example.com/agent', { fetch: fetcher })
    await expect(client.info()).rejects.toThrow(/500/)
  })
})
