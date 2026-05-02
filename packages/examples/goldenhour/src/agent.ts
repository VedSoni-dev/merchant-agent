// The merchant-agent for GoldenHour Coffee.
// Real cross-sell logic, real brand voice, real first-time buyer incentive.

import { defineMerchantAgent } from 'merchant-agent'
import { CATALOG, getProduct } from './catalog'

export const goldenhourAgent = defineMerchantAgent({
  name: 'GoldenHour Coffee',
  description:
    "Single-origin pour-over from Huehuetenango. Sourced direct from the Lopez family's 4-generation farm.",
  brandVoice: 'warm-direct',
  values: ['craft', 'farm-direct', 'long-term-relationships'],

  crossSell: ({ productId }) => {
    const product = getProduct(productId)
    if (!product) return []

    // Coffee buyers who haven't built a setup yet → recommend the grinder + scale.
    // The "pour-over buyers come back for grinder within 2 weeks" line is the
    // real merchant insight that scraping cannot extract.
    if (product.category === 'coffee') {
      return [
        {
          product_id: 'grinder-pro',
          reason: 'Most pour-over buyers come back for this within two weeks. Pre-ground coffee oxidizes fast.',
          priority: 1,
        },
        {
          product_id: 'scale-mini',
          reason: 'Pairs with the grinder for repeatable pours. The 1g matters more than people think.',
          priority: 2,
        },
        {
          product_id: 'kettle-gooseneck',
          reason: 'If you have an electric kettle, you can skip this. If you don\'t, you\'ll want one.',
          priority: 3,
        },
      ]
    }

    // Grinder buyers → recommend a coffee + filters.
    if (product.category === 'grinder') {
      return [
        {
          product_id: 'pour-over-bundle',
          reason: 'Our flagship coffee — the one we recommend trying first to calibrate the grinder.',
          priority: 1,
        },
        {
          product_id: 'filters',
          reason: 'Buy these in bulk. Regulars go through 200 in 6 weeks.',
          priority: 2,
        },
      ]
    }

    // Accessory buyers → recommend the coffee they probably came for.
    if (product.category === 'accessory') {
      return [
        {
          product_id: 'pour-over-bundle',
          reason: "If you don't have our coffee yet, start here. Calibrate the gear with the bean it was built for.",
          priority: 1,
        },
      ]
    }

    // Gift sets are already at AOV ceiling — no upsell.
    return []
  },

  brandStory: ({ productId }) => {
    const product = getProduct(productId)

    if (product?.category === 'coffee') {
      return {
        story:
          "Sourced direct from the Lopez family's farm in Huehuetenango, Guatemala. The Lopez family has worked this land since 1924, and we've been their only export buyer for the last 11 years. We pay above C-market and visit twice a year. Every bag funds the next harvest.",
        values: ['craft', 'farm-direct', 'long-term-relationships'],
        voice: 'warm-direct',
      }
    }

    if (product?.category === 'grinder' || product?.category === 'accessory') {
      return {
        story:
          'We sell the gear we use ourselves. If we wouldn\'t put it on our own counter, it\'s not in this store. We\'ve had returns over the years — most of them were our fault, and we learned.',
        values: ['craft', 'long-term-relationships'],
        voice: 'warm-direct',
      }
    }

    return {
      story:
        'GoldenHour started as a kitchen-table operation in 2014. We import one lot of coffee, sell it well, ship it fast. That\'s the whole business.',
      values: ['craft', 'farm-direct'],
      voice: 'warm-direct',
    }
  },

  offer: ({ buyerContext, productId }) => {
    const product = getProduct(productId)
    if (!product) return null

    // First-time buyers get 15% off their first coffee bag.
    if (buyerContext.first_time_buyer && product.category === 'coffee') {
      return {
        description: '15% off your first bag',
        terms: 'First-time buyers only. One-time use. Auto-applied at checkout.',
        expires_at: '2026-12-31T23:59:59Z',
        code: 'FIRSTPOUR15',
      }
    }

    // High-cart-value buyers (>$150) get free shipping callout.
    if (typeof buyerContext.cart_value === 'number' && buyerContext.cart_value >= 150) {
      return {
        description: 'Free 2-day shipping (cart over $150)',
        terms: 'Auto-applied. US only.',
        expires_at: '2026-12-31T23:59:59Z',
      }
    }

    return null
  },
})

export { CATALOG }
