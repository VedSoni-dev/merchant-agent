import Link from 'next/link'

export default function Home() {
  return (
    <div className="retro-landing">
      {/* Status bar — thin orange strip at the very top, terminal-flavored */}
      <div className="retro-statusbar">
        <span>
          [ <strong>merchant-agent</strong> ] v0.1 · MIT · open source · 4 endpoints · spec stable
        </span>
        <span className="retro-statusbar-right">last updated 2026-05-02</span>
      </div>

      {/* Subreddit-style header card */}
      <header className="retro-header">
        <div className="retro-header-inner">
          <div className="retro-header-left">
            <div className="retro-mascot" aria-hidden="true">
              <pre>{`  ___    ___
 [ o ]<-[ o ]
  ---    ---`}</pre>
            </div>
          </div>
          <div className="retro-header-main">
            <h1 className="retro-title">merchant-agent</h1>
            <p className="retro-tagline">
              Hire a salesperson for the agents shopping at your store.
            </p>
            <p className="retro-subtagline">
              The open protocol for <strong>AAO</strong> (Agent-to-Agent Optimization).
              SEO/GEO/AEO optimize content for an intermediary. AAO optimizes your
              endpoint for the buyer-agent itself.
            </p>
            <div className="retro-cta-row">
              <a
                className="retro-btn retro-btn-primary"
                href="https://github.com/VedSoni-dev/merchant-agent"
                target="_blank"
                rel="noopener"
              >
                [ GitHub (open source) ]
              </a>
              <Link className="retro-btn" href="/demo">
                [ ▶ live demo ]
              </Link>
              <a
                className="retro-btn"
                href="https://github.com/VedSoni-dev/merchant-agent/blob/main/SPEC.md"
                target="_blank"
                rel="noopener"
              >
                [ read the spec ]
              </a>
            </div>
          </div>
          <div className="retro-header-right">
            <table className="retro-meta">
              <tbody>
                <tr>
                  <td>version</td>
                  <td>0.1</td>
                </tr>
                <tr>
                  <td>license</td>
                  <td>MIT</td>
                </tr>
                <tr>
                  <td>endpoints</td>
                  <td>4</td>
                </tr>
                <tr>
                  <td>primitives</td>
                  <td>3</td>
                </tr>
                <tr>
                  <td>spec pages</td>
                  <td>1</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </header>

      {/* Two-column body */}
      <div className="retro-grid">
        <main className="retro-main">
          {/* TOC */}
          <nav className="retro-toc" aria-label="Table of contents">
            <div className="retro-toc-label">
              ── table of contents ─────────────────────────
            </div>
            <ol className="retro-toc-list">
              <li>
                <a href="#what-is-aao">What is AAO?</a>
              </li>
              <li>
                <a href="#salespeople">Salespeople, but for agents</a>
              </li>
              <li>
                <a href="#action-alley">Where 30% of your basket comes from</a>
              </li>
              <li>
                <a href="#is-it-ai">Is merchant-agent an AI agent?</a>
              </li>
              <li>
                <a href="#integrate">Integrate in 60 seconds</a>
              </li>
              <li>
                <a href="#endpoints">The four endpoints</a>
              </li>
              <li>
                <a href="#alongside-acp">Deploy alongside ACP / UCP</a>
              </li>
            </ol>
          </nav>

          {/* 1. What is AAO */}
          <section id="what-is-aao" className="retro-section">
            <h2 className="retro-h2">1. What is AAO?</h2>

            <table className="retro-table retro-acronym-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>ACRONYM</th>
                  <th>ERA</th>
                  <th>OPTIMIZE FOR</th>
                  <th>WHO READS IT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1.</td>
                  <td className="retro-acro">SEO</td>
                  <td>1995–</td>
                  <td>crawlers</td>
                  <td>a human (after a search)</td>
                </tr>
                <tr>
                  <td>2.</td>
                  <td className="retro-acro">GEO</td>
                  <td>2024–</td>
                  <td>generative AI</td>
                  <td>a human (in an AI summary)</td>
                </tr>
                <tr>
                  <td>3.</td>
                  <td className="retro-acro">AEO</td>
                  <td>2024–</td>
                  <td>answer engines</td>
                  <td>a human (in a featured snippet)</td>
                </tr>
                <tr className="retro-acronym-table-new">
                  <td>4.</td>
                  <td className="retro-acro retro-acro-new">AAO</td>
                  <td>2026–</td>
                  <td>buyer-agents</td>
                  <td>
                    <strong>nobody. the agent IS the customer.</strong>
                  </td>
                </tr>
              </tbody>
            </table>

            <p>
              SEO, GEO, and AEO are passive content tweaks aimed at an intermediary
              that delivers something to a human reader. <strong>AAO is different.</strong>{' '}
              When a personal agent shops on behalf of a human, it doesn&apos;t read
              your &quot;About&quot; page. It hits an endpoint, asks structured
              questions, and decides. The optimization target is the buyer.
            </p>

            <p>
              <strong>AAO = Agent-to-Agent Optimization.</strong> The discipline of
              tuning the agent your store publishes so it converts visiting
              buyer-agents at a higher rate. merchant-agent is the open protocol
              that defines the conversation those two agents have.
            </p>
          </section>

          <hr className="retro-hr" />

          {/* 2. Salespeople, but for agents */}
          <section id="salespeople" className="retro-section">
            <h2 className="retro-h2">2. Salespeople, but for agents</h2>

            <p>
              Walk into a real store. A salesperson greets you. Tells you about
              the brand. Suggests something that pairs well with the thing
              you&apos;re holding. Closes the deal with a perk. That conversation
              is worth real money — it&apos;s why retail still hires humans.
            </p>

            <p>
              Now picture a personal agent &quot;walking in&quot; to your website.
              There&apos;s nobody there. It scrapes your HTML. Reads the lowest
              price. Picks. Done.
            </p>

            <p>
              merchant-agent is the salesperson your website hires for that
              moment. Four things a salesperson does — four endpoints:
            </p>

            <table className="retro-table retro-mapping-table">
              <thead>
                <tr>
                  <th>WHAT A SALESPERSON DOES</th>
                  <th>merchant-agent ENDPOINT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>&quot;Hi, welcome in. We&apos;re GoldenHour Coffee.&quot;</td>
                  <td>
                    <code>GET /info</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    Tell the brand story. The farm. The 11-year relationship. The
                    why.
                  </td>
                  <td>
                    <code>GET /brand-story</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    Suggest what pairs with this. &quot;Pour-over folks come back for
                    a grinder.&quot;
                  </td>
                  <td>
                    <code>GET /cross-sell</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    Close the deal with a perk. &quot;Tell you what — 15% off your
                    first bag.&quot;
                  </td>
                  <td>
                    <code>POST /offer</code>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <hr className="retro-hr" />

          {/* 3. Action Alley */}
          <section id="action-alley" className="retro-section">
            <h2 className="retro-h2">3. Where 30% of your basket comes from</h2>

            <div className="retro-callout">
              <div className="retro-callout-label">[ FIELD NOTE ]</div>
              <p>
                HEB&apos;s &quot;Action Alley&quot; — the wide aisle right after
                the entrance — is estimated to drive ~30% of basket lift through
                merchandising alone. End caps. Seasonal displays. The impulse
                rack at the register. Brand storytelling on shelf talkers. <em>You
                came in for toothpaste. You walked out with a $15 pumpkin.</em>
              </p>
            </div>

            <p>
              The agent web has zero version of any of this. When agents start
              doing the shopping, that 30% disappears — unless the merchant
              publishes a way for the agent to hear them.
            </p>

            <p>
              That&apos;s what merchant-agent is for. The live A/B in the demo
              shows the gap directly:
            </p>

            <table className="retro-table retro-aov-table">
              <thead>
                <tr>
                  <th>FLOW</th>
                  <th>WHAT THE BUYER-AGENT DOES</th>
                  <th>AOV</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>scrape</td>
                  <td>parses HTML, picks cheapest visible product</td>
                  <td>$24</td>
                </tr>
                <tr className="retro-aov-win">
                  <td>AAO</td>
                  <td>
                    finds <code>&lt;link rel=&quot;merchant-agent&quot;&gt;</code>,
                    talks to the merchant&apos;s agent, takes the cross-sell, takes
                    the offer
                  </td>
                  <td>
                    <strong>$71</strong>
                  </td>
                </tr>
              </tbody>
            </table>

            <p className="retro-small">
              Same buyer. Same product page. The merchant&apos;s voice did the
              work. <Link href="/demo">→ Watch it run live</Link>.
            </p>
          </section>

          <hr className="retro-hr" />

          {/* 4. Is merchant-agent an AI agent? */}
          <section id="is-it-ai" className="retro-section">
            <h2 className="retro-h2">4. Is merchant-agent an AI agent?</h2>

            <p>
              <strong>It can be. The protocol doesn&apos;t care.</strong>
            </p>

            <p>
              merchant-agent defines the <em>conversation shape</em> — four endpoints,
              structured request/response. What runs behind those endpoints is your
              call. The SDK is shape-only; you bring the brain.
            </p>

            <table className="retro-table retro-impl-table">
              <thead>
                <tr>
                  <th>BACKING</th>
                  <th>WHAT IT IS</th>
                  <th>WHEN TO USE IT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>deterministic</strong>
                  </td>
                  <td>
                    plain functions over your catalog. rules, lookups, joins, no LLM.
                  </td>
                  <td>
                    small catalogs, predictable upsell paths, latency &lt; 50ms,
                    zero per-request cost.
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>LLM-backed</strong>
                  </td>
                  <td>
                    real AI agent. system prompt with your brand voice + catalog;
                    each request is a model call.
                  </td>
                  <td>
                    long-tail catalogs, dynamic merchandising, conversational
                    cross-sell, you want the agent to actually <em>argue</em> for
                    the product.
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>hybrid</strong>
                  </td>
                  <td>
                    LLM for brand-story + offer (high-creativity), deterministic
                    rules for cross-sell (high-frequency).
                  </td>
                  <td>
                    most production stores. cap LLM cost where it doesn&apos;t add
                    lift; spend it where it does.
                  </td>
                </tr>
              </tbody>
            </table>

            <p className="retro-small" style={{ marginTop: '12px' }}>
              The live demo on this site uses <strong>deterministic</strong> rules
              so it can run forever for free. Production stores will mostly want
              LLM-backed or hybrid. The post-it is real.
            </p>

            <p style={{ marginTop: '16px' }}>
              Same SDK, two backings. Below is the same{' '}
              <code>crossSell</code> handler written both ways:
            </p>

            <div className="retro-step">
              <div className="retro-step-num">deterministic</div>
              <div className="retro-step-body">
                <div className="retro-step-title">
                  rules over your catalog (~5ms, $0/req)
                </div>
                <pre className="retro-code">
                  <code>{`crossSell: ({ productId, buyerContext }) => {
  const product = catalog.find((p) => p.id === productId)
  if (product?.category === 'coffee') {
    return [
      {
        product_id: 'grinder-pro',
        reason: 'Most pour-over buyers come back for this within two weeks.',
        priority: 1,
      },
    ]
  }
  return []
}`}</code>
                </pre>
              </div>
            </div>

            <div className="retro-step">
              <div className="retro-step-num">LLM-backed</div>
              <div className="retro-step-body">
                <div className="retro-step-title">
                  real AI agent (~600ms, ~$0.001/req on Haiku 4.5)
                </div>
                <pre className="retro-code">
                  <code>{`import Anthropic from '@anthropic-ai/sdk'

const claude = new Anthropic()
const SYSTEM = \`You are the website-agent for GoldenHour Coffee.
Voice: warm-direct. Values: craft, farm-direct.
Catalog: \${JSON.stringify(catalog)}.
When asked for cross-sells, reply ONLY with a JSON array of
[{ product_id, reason, priority }] — merchant-controlled order,
real reasons, not generic ad copy.\`

crossSell: async ({ productId, buyerContext }) => {
  const res = await claude.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    system: SYSTEM,
    messages: [{
      role: 'user',
      content: \`Buyer-agent wants cross-sells for \${productId}.
Buyer context: \${JSON.stringify(buyerContext)}.
What should they consider, in priority order?\`,
    }],
  })
  const text = res.content[0].type === 'text' ? res.content[0].text : '[]'
  return JSON.parse(text)
}`}</code>
                </pre>
              </div>
            </div>

            <div className="retro-callout">
              <div className="retro-callout-label">[ KEY POINT ]</div>
              <p>
                The buyer-agent calling your endpoint can&apos;t tell which
                version is running — and shouldn&apos;t. That&apos;s the whole
                point of a structured protocol. You optimize the merchandising
                <em> behind</em> your endpoint. The buyer-agent gets the same
                shape either way.
              </p>
            </div>
          </section>

          <hr className="retro-hr" />

          {/* 5. Integrate in 60 seconds */}
          <section id="integrate" className="retro-section">
            <h2 className="retro-h2">5. Integrate in 60 seconds</h2>

            <p>
              Five steps. The whole thing fits in one screen.
            </p>

            <div className="retro-step">
              <div className="retro-step-num">step 1.</div>
              <div className="retro-step-body">
                <div className="retro-step-title">Install the SDK</div>
                <pre className="retro-code">
                  <code>{`$ npm install merchant-agent`}</code>
                </pre>
              </div>
            </div>

            <div className="retro-step">
              <div className="retro-step-num">step 2.</div>
              <div className="retro-step-body">
                <div className="retro-step-title">Define your agent</div>
                <pre className="retro-code">
                  <code>{`import { defineMerchantAgent } from 'merchant-agent'

export const agent = defineMerchantAgent({
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
})`}</code>
                </pre>
              </div>
            </div>

            <div className="retro-step">
              <div className="retro-step-num">step 3.</div>
              <div className="retro-step-body">
                <div className="retro-step-title">Mount the endpoint (Express)</div>
                <pre className="retro-code">
                  <code>{`import express from 'express'
import { agent } from './agent.js'

const app = express()
app.use('/.well-known/merchant-agent', agent.handler())
app.listen(3000)`}</code>
                </pre>
                <p className="retro-step-note">
                  Next.js, Hono, Bun, native fetch all work too. Use{' '}
                  <code>agent.fetch(request)</code> with any standard{' '}
                  <code>Request</code>.
                </p>
              </div>
            </div>

            <div className="retro-step">
              <div className="retro-step-num">step 4.</div>
              <div className="retro-step-body">
                <div className="retro-step-title">
                  Advertise it from your HTML &lt;head&gt;
                </div>
                <pre className="retro-code">
                  <code>{`<link rel="merchant-agent" href="/.well-known/merchant-agent">`}</code>
                </pre>
              </div>
            </div>

            <div className="retro-step">
              <div className="retro-step-num">step 5.</div>
              <div className="retro-step-body">
                <div className="retro-step-title">Verify</div>
                <pre className="retro-code">
                  <code>{`$ curl https://yoursite.com/.well-known/merchant-agent/info \\
       -H "Accept: application/merchant-agent;v=0.1"

{ "name": "...", "primitives": ["cross-sell","brand-story","offer"], ... }`}</code>
                </pre>
              </div>
            </div>

            <p className="retro-callout retro-callout-success">
              <strong>Done.</strong> Buyer-agents that respect the spec will now
              find your endpoint and call it. Total deployed code: ~50 lines.
            </p>
          </section>

          <hr className="retro-hr" />

          {/* 6. The four endpoints */}
          <section id="endpoints" className="retro-section">
            <h2 className="retro-h2">6. The four endpoints</h2>

            <p>
              The whole v0.1 spec surface. Four routes, three primitives + one
              capability handshake. Anything beyond these four is bikeshed bait
              and gets punted to v0.2.
            </p>

            <table className="retro-table retro-endpoints-table">
              <thead>
                <tr>
                  <th>METHOD</th>
                  <th>PATH</th>
                  <th>TO A HUMAN, IT&apos;S...</th>
                  <th>TO A BUYER-AGENT, IT&apos;S...</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>GET</code>
                  </td>
                  <td>
                    <code>/info</code>
                  </td>
                  <td>&quot;Hi, I&apos;m GoldenHour Coffee.&quot;</td>
                  <td>capability handshake — what primitives are supported</td>
                </tr>
                <tr>
                  <td>
                    <code>GET</code>
                  </td>
                  <td>
                    <code>/cross-sell</code>
                  </td>
                  <td>&quot;Folks who buy this also love...&quot;</td>
                  <td>merchant-ranked recommendation list with reasons</td>
                </tr>
                <tr>
                  <td>
                    <code>GET</code>
                  </td>
                  <td>
                    <code>/brand-story</code>
                  </td>
                  <td>&quot;Let me tell you about the farm...&quot;</td>
                  <td>structured brand voice + values + narrative</td>
                </tr>
                <tr>
                  <td>
                    <code>POST</code>
                  </td>
                  <td>
                    <code>/offer</code>
                  </td>
                  <td>&quot;Tell you what — 15% off today.&quot;</td>
                  <td>conditional offer based on buyer context</td>
                </tr>
              </tbody>
            </table>

            <p className="retro-small">
              v0.2 will add: bearer-token auth, an extensions registry
              (<code>x-loyalty</code>, <code>x-reviews</code>, etc.), and a
              JSON-RPC mirror for MCP-compatible transports.
            </p>
          </section>

          <hr className="retro-hr" />

          {/* 7. Alongside ACP */}
          <section id="alongside-acp" className="retro-section">
            <h2 className="retro-h2">7. Deploy alongside ACP / UCP</h2>

            <p>
              merchant-agent is intentionally <em>not</em> a transactional
              protocol. ACP (OpenAI + Stripe) and UCP (Google + Shopify + Etsy +
              Walmart + Target + Wayfair + 20 others) already won that lane.
              Publish both link tags side-by-side:
            </p>

            <pre className="retro-code">
              <code>{`<link rel="agentic-commerce" href="/.well-known/agentic-commerce">
<link rel="merchant-agent"   href="/.well-known/merchant-agent">`}</code>
            </pre>

            <p>
              Buyer-agents read both. ACP for the cash register. merchant-agent
              for the rest of the store.
            </p>
          </section>

          <hr className="retro-hr" />

          {/* CTA bottom */}
          <section className="retro-section retro-cta-end">
            <h2 className="retro-h2">Ready?</h2>
            <div className="retro-cta-row">
              <a
                className="retro-btn retro-btn-primary"
                href="https://github.com/VedSoni-dev/merchant-agent"
                target="_blank"
                rel="noopener"
              >
                [ GitHub (open source) ]
              </a>
              <Link className="retro-btn" href="/demo">
                [ ▶ live demo ]
              </Link>
              <a
                className="retro-btn"
                href="https://github.com/VedSoni-dev/merchant-agent/blob/main/SPEC.md"
                target="_blank"
                rel="noopener"
              >
                [ read the spec ]
              </a>
              <a
                className="retro-btn"
                href="https://www.npmjs.com/package/merchant-agent"
                target="_blank"
                rel="noopener"
              >
                [ npm ]
              </a>
            </div>
            <p className="retro-small" style={{ marginTop: '12px' }}>
              Free and open source under MIT. Fork it, extend it, ship a
              buyer-agent that respects it.
            </p>
          </section>
        </main>

        {/* Right rail */}
        <aside className="retro-rail">
          <div className="retro-card">
            <div className="retro-card-header">about merchant-agent</div>
            <div className="retro-card-body">
              <p>
                The protocol for AAO. Open source. MIT-licensed. v0.1 spec
                stable. Created May 2026.
              </p>
            </div>
          </div>

          <div className="retro-card">
            <div className="retro-card-header">links</div>
            <ul className="retro-linklist">
              <li>
                →{' '}
                <a
                  href="https://github.com/VedSoni-dev/merchant-agent"
                  target="_blank"
                  rel="noopener"
                >
                  github / source
                </a>
              </li>
              <li>
                →{' '}
                <a
                  href="https://github.com/VedSoni-dev/merchant-agent/blob/main/SPEC.md"
                  target="_blank"
                  rel="noopener"
                >
                  spec.md (v0.1)
                </a>
              </li>
              <li>
                →{' '}
                <a
                  href="https://www.npmjs.com/package/merchant-agent"
                  target="_blank"
                  rel="noopener"
                >
                  npm package
                </a>
              </li>
              <li>
                → <Link href="/demo">live A/B demo</Link>
              </li>
              <li>
                →{' '}
                <a
                  href="https://merchant-agent.vercel.app/.well-known/merchant-agent/info"
                  target="_blank"
                  rel="noopener"
                >
                  this site&apos;s /info
                </a>
              </li>
            </ul>
          </div>

          <div className="retro-card">
            <div className="retro-card-header">primitives (v0.1)</div>
            <ul className="retro-linklist retro-linklist-plain">
              <li>cross-sell</li>
              <li>brand-story</li>
              <li>offer</li>
            </ul>
          </div>

          <div className="retro-card">
            <div className="retro-card-header">house rules</div>
            <ol className="retro-linklist retro-linklist-numbered">
              <li>v0.1 surface is locked at four endpoints.</li>
              <li>Spec changes → open an issue tagged v0.2 first.</li>
              <li>Bug fixes / docs → straight to PR.</li>
              <li>No vibes. Show evidence.</li>
            </ol>
          </div>

          <div className="retro-postit">
            <div className="retro-postit-tape" aria-hidden="true" />
            <div className="retro-postit-label">→ note from the author</div>
            <p>
              this landing page itself isn&apos;t running AAO — i&apos;m broke
              for tokens rn.
            </p>
            <p>
              the <Link href="/demo">/demo</Link> page is a real working
              agent-to-agent interaction. go see it.
            </p>
          </div>

          <div className="retro-card retro-card-quiet">
            <div className="retro-card-header">created by</div>
            <div className="retro-card-body retro-card-body-mono">
              <a
                href="https://github.com/VedSoni-dev"
                target="_blank"
                rel="noopener"
              >
                @VedSoni-dev
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="retro-footer">
        <div>
          merchant-agent v0.1 · MIT · open source · 2026-05 ·{' '}
          <a
            href="https://github.com/VedSoni-dev/merchant-agent"
            target="_blank"
            rel="noopener"
          >
            github.com/VedSoni-dev/merchant-agent
          </a>
        </div>
        <div className="retro-footer-mono">
          spec → SDK → demo. forks encouraged.
        </div>
      </footer>
    </div>
  )
}
