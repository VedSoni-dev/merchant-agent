// Flow B: a buyer-agent finds the merchant-agent endpoint, calls all four
// primitives, and threads merchant input into its decision.

import { goldenhourAgent, getProduct } from '@merchant-agent/example-goldenhour'

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

const HOST = 'https://goldenhour.coffee/.well-known/merchant-agent'

export async function GET(): Promise<Response> {
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const enc = new TextEncoder()
      const send = (e: FlowEvent) => controller.enqueue(enc.encode(ndjson(e)))

      send({ type: 'log', kind: 'agent', text: 'GET https://goldenhour.coffee' })
      await delay(300)
      send({
        type: 'log',
        kind: 'agent',
        text: 'found <link rel="merchant-agent" href="/.well-known/merchant-agent">',
      })
      await delay(300)

      // /info
      send({ type: 'log', kind: 'agent', text: 'GET /.well-known/merchant-agent/info' })
      const infoResponse = await goldenhourAgent.fetch(new Request(`${HOST}/info`))
      const info = (await infoResponse.json()) as {
        name: string
        primitives: string[]
      }
      await delay(200)
      send({
        type: 'log',
        kind: 'merchant',
        text: `agent: ${info.name} · primitives: ${info.primitives.join(', ')}`,
      })
      await delay(400)

      // Browse the catalog (this would also be from /info or ACP in a real flow).
      send({ type: 'log', kind: 'agent', text: 'browsing catalog. starting with the flagship coffee.' })
      const flagship = getProduct('pour-over-bundle')!
      send({ type: 'log', kind: 'agent', text: `interested in: ${flagship.name} ($${flagship.price})` })
      await delay(400)

      // /brand-story
      send({ type: 'log', kind: 'agent', text: `GET /brand-story?for=${flagship.id}` })
      const storyResponse = await goldenhourAgent.fetch(new Request(`${HOST}/brand-story?for=${flagship.id}`))
      const story = (await storyResponse.json()) as { story: string; voice: string; values: string[] }
      await delay(300)
      const storyExcerpt = story.story.slice(0, 110)
      send({ type: 'log', kind: 'merchant', text: `"${storyExcerpt}..."` })
      send({ type: 'log', kind: 'merchant', text: `voice: ${story.voice} · values: ${story.values.join(', ')}` })
      await delay(500)
      send({
        type: 'log',
        kind: 'agent',
        text: 'noted: 11-year direct relationship with farm. signal of quality + provenance.',
      })
      await delay(400)

      send({
        type: 'cart-add',
        id: flagship.id,
        price: flagship.price,
        reason: 'flagship coffee',
      })
      send({ type: 'log', kind: 'agent', text: `added: ${flagship.name} ($${flagship.price})` })
      await delay(400)

      // /cross-sell
      send({ type: 'log', kind: 'agent', text: `GET /cross-sell?for=${flagship.id}` })
      const csResponse = await goldenhourAgent.fetch(new Request(`${HOST}/cross-sell?for=${flagship.id}`))
      const cs = (await csResponse.json()) as {
        recommendations: { product_id: string; reason: string; priority: number }[]
      }
      await delay(300)
      send({
        type: 'log',
        kind: 'merchant',
        text: `${cs.recommendations.length} recommendations, merchant-ordered:`,
      })
      for (const rec of cs.recommendations.slice(0, 2)) {
        const product = getProduct(rec.product_id)
        if (!product) continue
        send({ type: 'log', kind: 'merchant', text: `  · ${product.name}: ${rec.reason}` })
        await delay(250)
      }
      await delay(300)

      // Apply the top cross-sell (the grinder — high signal, high AOV).
      const topRec = cs.recommendations[0]
      const grinder = topRec ? getProduct(topRec.product_id) : undefined
      if (grinder) {
        send({
          type: 'log',
          kind: 'agent',
          text: `merchant signal accepted: "buyers come back within 2 weeks." adding ${grinder.name}.`,
        })
        send({
          type: 'cart-add',
          id: grinder.id,
          price: grinder.price,
          reason: topRec?.reason ?? '',
        })
        await delay(400)
      }

      // Apply the second cross-sell (the scale — paired with grinder).
      const second = cs.recommendations[1]
      const scale = second ? getProduct(second.product_id) : undefined
      if (scale) {
        send({
          type: 'log',
          kind: 'agent',
          text: `also taking: ${scale.name}. pairs with grinder per merchant.`,
        })
        send({
          type: 'cart-add',
          id: scale.id,
          price: scale.price,
          reason: second?.reason ?? '',
        })
        await delay(400)
      }

      // /offer
      const cartValue = (flagship?.price ?? 0) + (grinder?.price ?? 0) + (scale?.price ?? 0)
      send({ type: 'log', kind: 'agent', text: `POST /offer (first_time_buyer: true, cart: $${cartValue})` })
      const offerResponse = await goldenhourAgent.fetch(
        new Request(`${HOST}/offer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product_id: flagship.id,
            buyer_context: { first_time_buyer: true, cart_value: cartValue, country: 'US' },
          }),
        }),
      )
      const offer = (await offerResponse.json()) as {
        offer: { description: string; code?: string } | null
      }
      await delay(300)
      if (offer.offer) {
        send({
          type: 'log',
          kind: 'merchant',
          text: `${offer.offer.description}${offer.offer.code ? ` · code: ${offer.offer.code}` : ''}`,
        })
        send({ type: 'log', kind: 'agent', text: 'offer applied at checkout.' })
      } else {
        send({ type: 'log', kind: 'merchant', text: 'no offer applies.' })
      }

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
