# merchant-agent

The TypeScript SDK for the [merchant-agent v0.1 spec](https://github.com/VedSoni-dev/merchant-agent).

**SEO. GEO. AEO. AAO.** The protocol for agent-to-agent optimization.

When a personal agent shops on behalf of a human, the agent *is* the customer. SEO/GEO/AEO all optimize content for an intermediary. AAO optimizes the merchant's own agent endpoint to win conversations with the buyer-agent directly.

OpenAI and Google built the agent cash register. They forgot the rest of the store. Drop merchant-agent next to your ACP / UCP endpoint so buyer-agents see merchant-controlled cross-sells, brand stories, and conditional offers — not just transactional metadata.

## Install

```bash
npm install merchant-agent
```

## Server

```ts
import { defineMerchantAgent } from 'merchant-agent'
import express from 'express'

const agent = defineMerchantAgent({
  name: 'GoldenHour Coffee',
  description: 'Single-origin pour-over from Huehuetenango.',
  brandVoice: 'warm-direct',
  values: ['craft', 'farm-direct'],

  crossSell: ({ productId, buyerContext }) => [
    {
      product_id: 'grinder-pro',
      reason: 'Most pour-over buyers come back for this within 2 weeks.',
      priority: 1,
    },
  ],

  brandStory: ({ productId }) => ({
    story: 'Sourced direct from a 4-generation farm in Huehuetenango.',
    values: ['craft', 'farm-direct'],
    voice: 'warm-direct',
  }),

  offer: ({ buyerContext, productId }) => {
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

const app = express()
app.use('/.well-known/merchant-agent', agent.handler())
```

For Next.js / Hono / Bun / native fetch, use `agent.fetch(request)` directly — it takes any standard `Request` and returns a standard `Response`.

## Client

```ts
import { discover, talk } from 'merchant-agent/client'

const endpoint = await discover('https://goldenhour.coffee')

if (endpoint) {
  const client = talk(endpoint)
  const recs = await client.crossSell({ productId: 'pour-over-bundle' })
  const story = await client.brandStory({ productId: 'pour-over-bundle' })
  const offer = await client.offer({
    productId: 'pour-over-bundle',
    buyerContext: { first_time_buyer: true, country: 'US' },
  })
}
```

## Discovery

A site advertises a merchant-agent endpoint via any of:

```html
<link rel="merchant-agent" href="/.well-known/merchant-agent">
```

```
HTTP/1.1 200 OK
Link: </.well-known/merchant-agent>; rel="merchant-agent"
```

```
GET /.well-known/merchant-agent/info
```

The client tries all three in order.

## Spec

The full v0.1 specification is at [github.com/VedSoni-dev/merchant-agent/blob/main/SPEC.md](https://github.com/VedSoni-dev/merchant-agent/blob/main/SPEC.md).

## License

MIT.
