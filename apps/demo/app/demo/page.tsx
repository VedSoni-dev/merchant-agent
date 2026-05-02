'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

interface FlowState {
  lines: { kind: 'agent' | 'merchant'; text: string }[]
  cart: { id: string; price: number; reason: string }[]
  done: boolean
}

const initialState: FlowState = { lines: [], cart: [], done: false }

export default function DemoPage() {
  const [scrape, setScrape] = useState<FlowState>(initialState)
  const [agentic, setAgentic] = useState<FlowState>(initialState)
  const [running, setRunning] = useState(false)
  const scrapeRef = useRef<HTMLDivElement>(null)
  const agenticRef = useRef<HTMLDivElement>(null)

  async function runDemo() {
    setRunning(true)
    setScrape(initialState)
    setAgentic(initialState)

    // Run both flows in parallel.
    await Promise.all([
      streamFlow('/api/scrape', (state) => setScrape(state)),
      streamFlow('/api/agent-flow', (state) => setAgentic(state)),
    ])
    setRunning(false)
  }

  // Auto-scroll the logs as they grow.
  useEffect(() => {
    if (scrapeRef.current) scrapeRef.current.scrollTop = scrapeRef.current.scrollHeight
  }, [scrape.lines.length])
  useEffect(() => {
    if (agenticRef.current) agenticRef.current.scrollTop = agenticRef.current.scrollHeight
  }, [agentic.lines.length])

  // Auto-run on first load so the demo plays itself.
  useEffect(() => {
    void runDemo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const scrapeAOV = scrape.cart.reduce((sum, item) => sum + item.price, 0)
  const agenticAOV = agentic.cart.reduce((sum, item) => sum + item.price, 0)

  return (
    <main className="wide-container">
      <div className="eyebrow">live a/b — aao in action</div>

      <h1 style={{ fontSize: '40px', marginBottom: '16px' }}>Same product. Two flows.</h1>

      <p className="muted" style={{ marginBottom: '12px', fontSize: '18px' }}>
        A buyer-agent visits goldenhour.coffee for a 12oz bag of pour-over.
      </p>
      <p className="muted" style={{ marginBottom: '40px', fontSize: '18px' }}>
        <strong style={{ color: 'var(--text)' }}>Left:</strong> scrape flow. Agent parses HTML, picks cheapest.
        Standard SEO/GEO-style content optimization wins you nothing here.{' '}
        <strong style={{ color: 'var(--text)' }}>Right:</strong> AAO flow. Agent finds the merchant-agent
        endpoint, gets cross-sell, brand story, first-time-buyer offer. Watch what merchant voice does to AOV.
      </p>

      <div className="split">
        <div className="flow">
          <div className="flow-label">flow a · scrape</div>
          <div className="flow-title">Personal agent scrapes the page</div>
          <div className="flow-subtitle">No merchant input. Picks based on visible price.</div>
          <div className="log" ref={scrapeRef}>
            {scrape.lines.map((line, i) => (
              <div key={i} className={`log-line ${line.kind}`}>
                {line.kind === 'agent' ? '→ ' : '⟵ '}
                {line.text}
              </div>
            ))}
            {scrape.lines.length === 0 && <div className="muted">waiting...</div>}
          </div>
          <div className="aov">
            <div className="aov-label">checkout aov</div>
            <div className="aov-value">${scrapeAOV.toFixed(0)}</div>
          </div>
        </div>

        <div className="split-divider" />

        <div className="flow">
          <div className="flow-label">flow b · merchant-agent</div>
          <div className="flow-title">Personal agent talks to GoldenHour&apos;s agent</div>
          <div className="flow-subtitle">
            Cross-sell · brand story · first-time-buyer offer.
          </div>
          <div className="log" ref={agenticRef}>
            {agentic.lines.map((line, i) => (
              <div key={i} className={`log-line ${line.kind}`}>
                {line.kind === 'agent' ? '→ ' : '⟵ '}
                {line.text}
              </div>
            ))}
            {agentic.lines.length === 0 && <div className="muted">waiting...</div>}
          </div>
          <div className="aov">
            <div className="aov-label">checkout aov</div>
            <div className={`aov-value ${agenticAOV > scrapeAOV ? 'win' : ''}`}>${agenticAOV.toFixed(0)}</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <button className="cta" onClick={runDemo} disabled={running} type="button">
          {running ? 'running...' : 'run again'}
        </button>
        <Link href="/" className="cta cta-secondary">
          ← back to manifesto
        </Link>
      </div>

      {!running && agenticAOV > 0 && scrapeAOV > 0 && (
        <div style={{ marginTop: '60px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--muted)' }}>
            AOV LIFT
          </p>
          <p
            style={{
              fontFamily: 'var(--serif)',
              fontSize: '64px',
              fontWeight: 600,
              color: 'var(--accent)',
              margin: '8px 0',
            }}
          >
            +{Math.round(((agenticAOV - scrapeAOV) / scrapeAOV) * 100)}%
          </p>
          <p className="muted">
            Same buyer. Same product. The merchant&apos;s voice did the work.
          </p>
        </div>
      )}
    </main>
  )
}

async function streamFlow(url: string, onUpdate: (state: FlowState) => void): Promise<void> {
  const response = await fetch(url)
  if (!response.body) return

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  const state: FlowState = { lines: [], cart: [], done: false }

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const raw of lines) {
      if (!raw.trim()) continue
      try {
        const event = JSON.parse(raw) as
          | { type: 'log'; kind: 'agent' | 'merchant'; text: string }
          | { type: 'cart-add'; id: string; price: number; reason: string }
          | { type: 'done' }
        if (event.type === 'log') {
          state.lines = [...state.lines, { kind: event.kind, text: event.text }]
        } else if (event.type === 'cart-add') {
          state.cart = [...state.cart, { id: event.id, price: event.price, reason: event.reason }]
        } else if (event.type === 'done') {
          state.done = true
        }
        onUpdate({ ...state })
      } catch {
        // ignore malformed line
      }
    }
  }
}
