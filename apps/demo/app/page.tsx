import Link from 'next/link'

export default function Home() {
  return (
    <main className="container">
      <div className="eyebrow">merchant-agent · v0.1 · MIT</div>

      <div className="acronym-stack">
        <span className="ac-old">SEO</span>
        <span className="ac-sep">·</span>
        <span className="ac-old">GEO</span>
        <span className="ac-sep">·</span>
        <span className="ac-old">AEO</span>
        <span className="ac-sep">·</span>
        <span className="ac-new">AAO</span>
      </div>

      <h1>The protocol for agent-to-agent optimization.</h1>

      <p style={{ fontSize: '20px', color: 'var(--muted)', marginTop: '32px' }}>
        SEO optimized content for crawlers. GEO got AI to cite your brand. AEO structured your content for
        answer engines. All three optimize for an <em>intermediary</em> that delivers something to a human.
      </p>

      <p style={{ fontSize: '20px', color: 'var(--muted)' }}>
        <strong>AAO is different.</strong> When a personal agent shops on behalf of a human, the agent <em>is</em>{' '}
        the customer. You're not trying to get cited or ranked. You're trying to win a conversation with another
        agent that controls the purchase decision. That requires optimizing your <em>own agent endpoint</em>, not
        your content.
      </p>

      <p style={{ fontSize: '20px', color: 'var(--muted)' }}>
        OpenAI and Google built the agent cash register (ACP, UCP, ChatGPT Instant Checkout). They forgot the
        rest of the store. merchant-agent is the protocol that brings the merchant&apos;s voice back. One-page
        spec. MIT-licensed SDK. Live demo. Deploy it next to your ACP endpoint in 60 seconds.
      </p>

      <div style={{ marginTop: '40px' }}>
        <Link href="/demo" className="cta">
          See the demo →
        </Link>
        <a
          href="https://github.com/VedSoni-dev/merchant-agent"
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
        <Link href="https://github.com/VedSoni-dev/merchant-agent/blob/main/SPEC.md" target="_blank" rel="noopener">
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
        <a href="https://github.com/VedSoni-dev/merchant-agent" target="_blank" rel="noopener">
          github.com/VedSoni-dev/merchant-agent
        </a>
      </p>
    </main>
  )
}
