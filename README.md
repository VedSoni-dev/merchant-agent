# merchant-agent

[![npm](https://img.shields.io/npm/v/merchant-agent.svg)](https://www.npmjs.com/package/merchant-agent)
[![license](https://img.shields.io/badge/license-MIT-black.svg)](./LICENSE)

> **SEO. GEO. AEO. AAO.**
> The protocol for agent-to-agent optimization.

SEO optimized content for crawlers. GEO got AI to cite your brand. AEO structured your content for answer engines. All three optimize for an **intermediary** that delivers something to a human.

**AAO — agent-to-agent optimization — is different.** When a personal agent shops on behalf of a human, the agent *is* the customer. You're not trying to get cited or ranked. You're trying to win a conversation with another agent that controls the purchase decision. That requires optimizing your **own agent endpoint**, not your content.

OpenAI and Google built the agent cash register (ACP, UCP, ChatGPT Instant Checkout). They forgot the rest of the store. When agents start doing the shopping, merchants lose every lever they spent a hundred years building: front-of-store placement, end caps, shelf talkers, upsell, brand story. The merchant's voice disappears.

merchant-agent is the protocol that brings it back. A one-page spec, an MIT-licensed TypeScript SDK, a live demo. Deploy it next to your ACP endpoint in 60 seconds.

> *"AAO" is a coined term. The acronym may or may not stick — but the discipline is real, and it needs a name. Use whatever you want; we just shipped the protocol it runs on.*

- **Spec:** [SPEC.md](./SPEC.md)
- **SDK:** [`packages/core`](./packages/core) → [`merchant-agent` on npm](https://www.npmjs.com/package/merchant-agent)
- **Live demo:** [merchant-agent.vercel.app](https://merchant-agent.vercel.app) — and the demo site is itself a working merchant-agent. Try [`/.well-known/merchant-agent/info`](https://merchant-agent.vercel.app/.well-known/merchant-agent/info).
- **License:** MIT

---

## Quick start

```bash
npm install merchant-agent
```

```ts
import { defineMerchantAgent } from 'merchant-agent'
import express from 'express'

const agent = defineMerchantAgent({
  name: 'GoldenHour Coffee',
  brandVoice: 'warm-direct',
  values: ['craft', 'farm-direct'],

  crossSell: ({ productId, buyerContext }) => [
    {
      product_id: 'grinder-pro',
      reason: 'Most pour-over buyers come back for this within two weeks.',
      priority: 1,
    },
  ],

  brandStory: ({ productId }) => ({
    story: "Sourced from the Lopez family's 4-generation farm in Huehuetenango.",
    values: ['craft', 'farm-direct'],
    voice: 'warm-direct',
  }),

  offer: ({ buyerContext, productId }) => {
    if (buyerContext.first_time_buyer) {
      return {
        description: '15% off your first bag',
        terms: 'First-time buyers only.',
        expires_at: '2026-12-31T23:59:59Z',
        code: 'FIRSTPOUR15',
      }
    }
    return null
  },
})

const app = express()
app.use('/.well-known/merchant-agent', agent.handler())
```

In your HTML `<head>`:

```html
<link rel="merchant-agent" href="/.well-known/merchant-agent">
```

That's it. Buyer-agents that respect the spec will now find your endpoint and call it.

---

## How it works

```
                                   ┌─────────────────────────────────┐
   Buyer agent                     │   Merchant site                 │
   (Claude / GPT / extension)      │                                 │
   ┌──────────────┐  ① GET / ────► │  HTML <head>                    │
   │              │                │   <link rel="merchant-agent">   │
   │              │  ② follow ───► │   ┌─────────────────────────┐   │
   │              │                │   │ /.well-known/           │   │
   │              │  ③ /info ────► │   │   merchant-agent/       │   │
   │              │  ◄ primitives  │   │     /info               │   │
   │              │                │   │     /cross-sell         │   │
   │              │  ④ talk ─────► │   │     /brand-story        │   │
   │              │  ◄ structured  │   │     /offer              │   │
   │              │    response    │   └─────────────────────────┘   │
   └──────────────┘                │                                 │
                                   └─────────────────────────────────┘
```

The buyer-agent finds the merchant-agent endpoint via `<link>` tag, then calls four endpoints. The merchant controls every response — what to recommend, what story to tell, what offer to extend. No scraping, no guessing.

---

## The four endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/info` | Capability discovery — what primitives this agent supports. |
| GET | `/cross-sell?for=<id>` | Merchant-ordered recommendations. |
| GET | `/brand-story?for=<id>` | The merchant's voice, values, narrative. |
| POST | `/offer` | Conditional offers based on buyer context. |

Full spec: [SPEC.md](./SPEC.md).

---

## Deploy alongside ACP / UCP

merchant-agent is intentionally not a transactional protocol. ACP (OpenAI + Stripe) and UCP (Google + Shopify + Etsy + Walmart + Target + Wayfair) already won that lane. Publish both link tags side-by-side:

```html
<link rel="agentic-commerce" href="/.well-known/agentic-commerce">
<link rel="merchant-agent" href="/.well-known/merchant-agent">
```

Buyer-agents read both. ACP for the cash register. merchant-agent for the rest of the store.

---

## Why this matters

HEB's Action Alley generates an estimated 30% of basket lift through merchandising alone — the end-cap, the seasonal display, the impulse rack at the register. The agent web has zero version of any of this. When agents start doing the shopping, that 30% disappears. Merchants who deployed merchant-agent keep it. Merchants who didn't, watched their AOV flatten to whatever the agent picked first on price.

This spec is intentionally tiny — three primitives, four endpoints, one weekend to deploy — so the long tail of merchants on WooCommerce, BigCommerce, Substack-shaped commerce, and custom stacks can ship it as fast as the Shopify+Etsy-Walmart consortium can.

## The AAO category, summarized

|  | SEO | GEO | AEO | **AAO** |
| --- | --- | --- | --- | --- |
| What you optimize | Content | Content | Content | **Your agent endpoint** |
| Target | Crawler | LLM | Answer engine | **Another agent (the buyer)** |
| Mode | Passive | Passive | Passive | **Active, conversational** |
| Conversion event | Click | Citation | Featured snippet | **Purchase decision** |
| Levers | Keywords, schema | Prompt-friendly content | Direct answers | **Recommendations, brand story, conditional offers** |
| Measured by | Rank | Mention rate | Snippet rate | **Agent conversion rate, agent AOV** |

SEO/GEO/AEO are about getting noticed. AAO is about getting bought. That is a fundamentally different stakes profile — higher leverage, harder to measure, dramatically more valuable per unit of effort.

---

## Repo structure

```
merchant-agent/
├── SPEC.md                       The v0.1 specification.
├── packages/
│   └── core/                     SDK source + tests. Published as `merchant-agent`.
│   └── examples/
│       └── goldenhour/           Reference merchant fixture used by the demo.
├── apps/
│   └── demo/                     The merchant-agent.dev site (Next.js).
└── docs/                         Quickstart, primitives reference, alongside-acp guide.
```

---

## v0.2 roadmap

- Optional bearer-token auth + verified-buyer-agent identity (`X-Buyer-Agent`).
- JSON-RPC mirror for MCP-compatible transports.
- Extensions registry (`x-loyalty`, `x-reviews`, `x-subscriptions`).
- Server-Sent Events for streaming long-form brand stories.

---

## Contributing

PRs welcome. Open an issue first for spec changes — small SDK bugs and docs fixes can go straight to PR. v0.1 is intentionally locked at four endpoints; new primitives are deferred to v0.2.

---

## License

MIT. Forks, vendor extensions, and competing implementations are encouraged.
