import Link from 'next/link'

export default function Home() {
  return (
    <main className="container">
      <div className="eyebrow">merchant-agent · v0.1 · MIT</div>

      <h1>OpenAI and Google built the agent cash register. They forgot the rest of the store.</h1>

      <p style={{ fontSize: '20px', color: 'var(--muted)', marginTop: '32px' }}>
        When personal agents start doing the shopping, merchants lose every lever they spent a hundred years
        building: front-of-store placement, end caps, shelf talkers, upsell, brand story. ACP and UCP define how
        an agent finds a product and pays for it. They don&apos;t define how a merchant tells the agent why this
        matters, what to recommend with it, or what offer applies right now.
      </p>

      <p style={{ fontSize: '20px', color: 'var(--muted)' }}>
        This is the missing layer. One-page spec. MIT-licensed TypeScript SDK. Live demo. Deploy it next to your
        ACP endpoint in 60 seconds.
      </p>

      <div style={{ marginTop: '40px' }}>
        <Link href="/demo" className="cta">
          See the demo →
        </Link>
        <a
          href="https://github.com/merchant-agent/spec"
          className="cta cta-secondary"
          target="_blank"
          rel="noopener"
        >
          Read the spec →
        </a>
      </div>

      <hr className="rule" />

      <h2>The 60-second install</h2>

      <pre>
        <code>{`npm install merchant-agent`}</code>
      </pre>

      <pre>
        <code>{`import { defineMerchantAgent } from 'merchant-agent'
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
    story: "Sourced direct from the Lopez family's 4-generation farm in Huehuetenango.",
    values: ['craft', 'farm-direct'],
    voice: 'warm-direct',
  }),

  offer: ({ buyerContext, productId }) => {
    if (buyerContext.first_time_buyer) {
      return { description: '15% off your first bag', terms: 'one-time', expires_at: '2026-12-31', code: 'FIRSTPOUR15' }
    }
    return null
  },
})

const app = express()
app.use('/.well-known/merchant-agent', agent.handler())`}</code>
      </pre>

      <p>
        Then in your HTML <code>&lt;head&gt;</code>:
      </p>

      <pre>
        <code>{`<link rel="merchant-agent" href="/.well-known/merchant-agent">`}</code>
      </pre>

      <hr className="rule" />

      <h2>The four endpoints</h2>

      <p>
        That&apos;s the entire v0 spec.{' '}
        <Link href="https://github.com/merchant-agent/spec/blob/main/SPEC.md" target="_blank" rel="noopener">
          Full spec on GitHub
        </Link>
        .
      </p>

      <pre>
        <code>{`GET  /info          → capability discovery
GET  /cross-sell    → ordered, merchant-controlled recommendations
GET  /brand-story   → the merchant's voice, values, narrative
POST /offer         → conditional offers based on buyer context`}</code>
      </pre>

      <hr className="rule" />

      <h2>Deploy alongside ACP, not against it</h2>

      <p>
        merchant-agent is intentionally not a transactional protocol. ACP and UCP already won that lane. Publish
        both link tags side-by-side in your HTML head:
      </p>

      <pre>
        <code>{`<link rel="agentic-commerce" href="/.well-known/agentic-commerce">
<link rel="merchant-agent" href="/.well-known/merchant-agent">`}</code>
      </pre>

      <p>
        Buyer-agents read both: ACP for the cash register, merchant-agent for the rest of the store.
      </p>

      <hr className="rule" />

      <h2>Why this matters</h2>

      <p>
        HEB&apos;s Action Alley generates an estimated 30% of basket lift through merchandising alone — the
        end-cap, the seasonal display, the impulse rack at the register. The agent web has zero version of any of
        this. When agents start doing the shopping, that 30% disappears. Merchants who deployed merchant-agent
        keep it. Merchants who didn&apos;t, watched their AOV flatten to whatever the agent picked first on
        price.
      </p>

      <p>
        This is the wedge. The spec is intentionally tiny — three primitives, four endpoints, one weekend to
        deploy — so the long tail of merchants on WooCommerce, BigCommerce, Substack-shaped commerce, and custom
        stacks can ship it as fast as the Shopify+Etsy-Walmart consortium can.
      </p>

      <hr className="rule" />

      <p className="muted" style={{ fontSize: '14px' }}>
        v0.1 · MIT · feedback welcome ·{' '}
        <a href="https://github.com/merchant-agent/spec" target="_blank" rel="noopener">
          github.com/merchant-agent/spec
        </a>
      </p>
    </main>
  )
}
