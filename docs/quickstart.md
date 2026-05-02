# Quickstart

Deploy a merchant-agent in under 5 minutes.

## 1. Install

```bash
npm install merchant-agent
```

## 2. Define your agent

Create `agent.ts` in your project:

```ts
import { defineMerchantAgent } from 'merchant-agent'

export const agent = defineMerchantAgent({
  name: 'Your Store Name',
  description: 'One-sentence description of who you are.',
  brandVoice: 'warm-direct', // or 'minimalist', 'playful', whatever fits
  values: ['craft', 'sustainability'],

  crossSell: async ({ productId, buyerContext }) => {
    // Look up your real recommendations.
    return [
      {
        product_id: 'related-product-id',
        reason: 'Specific, merchant-controlled reason this matters.',
        priority: 1,
      },
    ]
  },

  brandStory: async ({ productId }) => {
    // Real merchants write this in their actual voice.
    return {
      story: 'Where this product comes from. Who made it. Why it exists.',
      values: ['craft'],
      voice: 'warm-direct',
    }
  },

  offer: async ({ buyerContext, productId }) => {
    if (buyerContext.first_time_buyer) {
      return {
        description: '15% off your first order',
        terms: 'One-time use.',
        expires_at: '2026-12-31T23:59:59Z',
        code: 'WELCOME15',
      }
    }
    return null
  },
})
```

## 3. Mount on your server

### Express

```ts
import express from 'express'
import { agent } from './agent.js'

const app = express()
app.use('/.well-known/merchant-agent', agent.handler())
app.listen(3000)
```

### Next.js (App Router)

Create `app/.well-known/merchant-agent/[[...path]]/route.ts`:

```ts
import { agent } from '@/agent'

async function handle(request: Request) {
  return agent.fetch(request)
}

export const GET = handle
export const POST = handle
```

### Hono / Bun / native fetch

```ts
import { agent } from './agent.js'

Bun.serve({
  fetch(request) {
    if (new URL(request.url).pathname.startsWith('/.well-known/merchant-agent')) {
      return agent.fetch(request)
    }
    return new Response('not found', { status: 404 })
  },
})
```

## 4. Advertise the endpoint

Add to your HTML `<head>`:

```html
<link rel="merchant-agent" href="/.well-known/merchant-agent">
```

Or set the `Link` header on responses:

```
Link: </.well-known/merchant-agent>; rel="merchant-agent"
```

## 5. Verify

```bash
curl https://yoursite.com/.well-known/merchant-agent/info \
  -H "Accept: application/merchant-agent;v=0.1"
```

You should see:

```json
{
  "name": "Your Store Name",
  "description": "...",
  "version": "0.1",
  "primitives": ["cross-sell", "brand-story", "offer"],
  "extensions": []
}
```

That's it. Buyer-agents that respect the spec will now find and call your endpoint.

## Next

- Read [primitives.md](./primitives.md) for guidance on writing good cross-sell, brand-story, and offer logic.
- Read [alongside-acp.md](./alongside-acp.md) if you also have an ACP endpoint.
- Read the [full spec](../SPEC.md).
