// Flow A: a buyer-agent scrapes the GoldenHour HTML and picks based on price.
// This is the dumb baseline. No merchant input. Cheapest plausible coffee wins.

import { CATALOG } from '@merchant-agent/example-goldenhour'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface FlowEvent {
  type: 'log' | 'cart-add' | 'done'
  [key: string]: unknown
}

function ndjson(event: FlowEvent): string {
  return `${JSON.stringify(event)}\n`
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function GET(): Promise<Response> {
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const enc = new TextEncoder()
      const send = (e: FlowEvent) => controller.enqueue(enc.encode(ndjson(e)))

      send({ type: 'log', kind: 'agent', text: 'GET https://goldenhour.coffee' })
      await delay(400)
      send({ type: 'log', kind: 'agent', text: 'parsing HTML, looking for products...' })
      await delay(500)

      const coffees = CATALOG.filter((p) => p.category === 'coffee')
      for (const c of coffees) {
        send({
          type: 'log',
          kind: 'agent',
          text: `found: ${c.name} — $${c.price}`,
        })
        await delay(200)
      }

      const cheapest = coffees.reduce((min, p) => (p.price < min.price ? p : min), coffees[0]!)
      await delay(400)
      send({ type: 'log', kind: 'agent', text: `picking cheapest: ${cheapest.name} ($${cheapest.price})` })
      send({
        type: 'cart-add',
        id: cheapest.id,
        price: cheapest.price,
        reason: 'cheapest visible price',
      })
      await delay(500)
      send({ type: 'log', kind: 'agent', text: 'no cross-sell signal in HTML. proceeding to checkout.' })
      await delay(400)
      send({ type: 'log', kind: 'agent', text: 'checkout complete.' })

      send({ type: 'done' })
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson',
      'Cache-Control': 'no-cache',
    },
  })
}
