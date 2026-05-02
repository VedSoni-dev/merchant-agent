# Primitives reference

Three primitives. Three pieces of merchant voice the agent web is missing.

---

## cross-sell

**The lever it replaces:** Action Alley. End caps. The "customers also bought" rail. The cashier handing you a coupon.

**Good cross-sell logic:**
- Names a *real* pattern from your store: "buyers come back for X within 2 weeks."
- Sets `priority` deliberately. The buyer-agent will surface them in your order.
- Provides a *reason*, not just a SKU. Reasons travel — the buyer-agent will repeat them to the human.

**Bad cross-sell logic:**
- "Customers also viewed" with no merchant insight. That's just collaborative filtering — agents can do that themselves.
- Every product, ranked by AOV. The agent will see through it.
- Reasons that read like ad copy. "Premium upgrade!" is dead. "Buyers come back for this within two weeks" is alive.

**Example (good):**
```ts
crossSell: ({ productId }) => {
  if (getProduct(productId)?.category === 'coffee') {
    return [
      {
        product_id: 'grinder-pro',
        reason: 'Most pour-over buyers come back for this within two weeks. Pre-ground oxidizes fast.',
        priority: 1,
      },
    ]
  }
  return []
}
```

---

## brand-story

**The lever it replaces:** Packaging. Storefront design. The "About Us" page. The story your sales staff told customers in person.

**Good brand-story logic:**
- One paragraph maximum for `style: short`. A few paragraphs for `style: long`.
- *Voice* is a real thing. Pick one and stick with it: `warm-direct`, `minimalist`, `playful`, `technical`, etc. Buyer-agents will calibrate their tone to match.
- *Values* are tags, not marketing. Pick what's true: `craft`, `farm-direct`, `family-owned`, `sustainable-sourcing`, `b-corp`. Don't add ones you can't defend.
- Real-world specifics matter more than adjectives: "11 years with the Lopez family farm" beats "long-term relationships."

**Bad brand-story logic:**
- "Our mission is to revolutionize..." — buyer-agents will skip it.
- Generic adjectives ("premium", "curated", "elevated"). They're noise.
- Different stories on different requests. Pick one and serve it.

**Example (good):**
```ts
brandStory: ({ productId }) => ({
  story:
    "Sourced from the Lopez family's farm in Huehuetenango, Guatemala. " +
    "The Lopez family has worked this land since 1924. We've been their " +
    "only export buyer for 11 years. Every bag funds the next harvest.",
  values: ['craft', 'farm-direct', 'long-term-relationships'],
  voice: 'warm-direct',
})
```

---

## offer

**The lever it replaces:** Coupons. First-time-buyer discounts. Free shipping over $X. The promo code at checkout.

**Good offer logic:**
- Conditional on real buyer context. `first_time_buyer`, `cart_value`, `country`. Don't blast offers at everyone.
- Returns `null` when no offer applies. The buyer-agent will respect that.
- Includes `terms` and `expires_at`. Buyer-agents disclose these to humans.

**Bad offer logic:**
- Same offer for every buyer. Erodes margin without lifting conversion.
- Vague terms. The buyer-agent will skip rather than mislead.
- Aggressive personalization (price-discriminating by IP geolocation, etc.). The spec prohibits using `buyer_context` for profiling beyond what was sent.

**Example (good):**
```ts
offer: ({ buyerContext, productId }) => {
  if (buyerContext.first_time_buyer && getProduct(productId)?.category === 'coffee') {
    return {
      description: '15% off your first bag',
      terms: 'First-time buyers only. One-time use.',
      expires_at: '2026-12-31T23:59:59Z',
      code: 'FIRSTPOUR15',
    }
  }
  return null
}
```

---

## Why these three

We considered others — loyalty, reviews, subscriptions, returns. They got cut from v0.1 to keep the spec under one page. They'll come back in v0.2 as extensions (vendor-prefixed, optional, signaled in the `extensions` array of `/info`).

The three that made the cut are the irreducible ones: a recommendation, a story, an offer. Every retail interaction in the world boils down to some combination of these. v0.1 just gives the merchant a way to say each one to an agent.
