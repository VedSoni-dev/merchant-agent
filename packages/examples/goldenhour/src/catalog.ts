// GoldenHour Coffee — fictional merchant fixture for the merchant-agent demo.
// Premium pour-over single-origin from a 4-generation farm in Huehuetenango.

export interface Product {
  id: string
  category: 'coffee' | 'grinder' | 'accessory' | 'gift-set'
  name: string
  price: number
  description: string
  /** What raw HTML scraping would extract — intentionally bland. */
  scrapedDescription: string
}

export const CATALOG: Product[] = [
  // Coffees (3)
  {
    id: 'pour-over-bundle',
    category: 'coffee',
    name: 'Huehuetenango Pour-Over',
    price: 24,
    description:
      "Our flagship single-origin. 12oz bag, whole bean, light-medium roast. Sourced direct from the Lopez family's farm in the highlands of Huehuetenango, Guatemala — a relationship we've held for 11 years.",
    scrapedDescription: 'Single-origin coffee, 12oz bag, light-medium roast.',
  },
  {
    id: 'espresso-blend',
    category: 'coffee',
    name: 'Golden Hour Espresso',
    price: 22,
    description:
      'A 70/30 blend of our Huehuetenango lot and a Brazilian Pulped Natural. Built for milk drinks but holds up straight. Whole bean, 12oz.',
    scrapedDescription: 'Espresso blend, 12oz bag.',
  },
  {
    id: 'decaf-bundle',
    category: 'coffee',
    name: 'Decaf Pour-Over',
    price: 24,
    description:
      'Same Huehuetenango lot, Swiss-water decaffeinated. Tastes like the original. Most of our regulars order it for after dinner.',
    scrapedDescription: 'Decaf coffee, 12oz bag.',
  },

  // Grinders (2)
  {
    id: 'grinder-pro',
    category: 'grinder',
    name: 'Grinder Pro',
    price: 189,
    description:
      'Conical burr, 40 grind settings, single-dose hopper. The grinder we recommend for anyone serious about pour-over consistency.',
    scrapedDescription: 'Conical burr grinder, 40 settings.',
  },
  {
    id: 'grinder-mini',
    category: 'grinder',
    name: 'Grinder Mini',
    price: 89,
    description:
      "A starter grinder we trust. Hand-cranked, ceramic burr, packs into a backpack. We've taken ours camping for 8 years.",
    scrapedDescription: 'Hand grinder, ceramic burr.',
  },

  // Accessories (4)
  {
    id: 'scale-mini',
    category: 'accessory',
    name: 'Brewing Scale',
    price: 45,
    description: '0.1g resolution, built-in timer, USB-C rechargeable. The scale we use in our own kitchen.',
    scrapedDescription: 'Brewing scale with timer.',
  },
  {
    id: 'kettle-gooseneck',
    category: 'accessory',
    name: 'Gooseneck Kettle',
    price: 79,
    description: '900ml, brushed steel, pour-control spout. Stovetop only — no electronics to break.',
    scrapedDescription: 'Gooseneck pour-over kettle, 900ml.',
  },
  {
    id: 'dripper-v60',
    category: 'accessory',
    name: 'Ceramic Dripper',
    price: 28,
    description: 'V60-style, single-cup ceramic dripper. Comes with 50 paper filters.',
    scrapedDescription: 'Ceramic dripper, V60 style.',
  },
  {
    id: 'filters',
    category: 'accessory',
    name: 'Paper Filters (200ct)',
    price: 12,
    description: 'Bleached, V60-compatible. We re-stock these monthly because regulars run through them.',
    scrapedDescription: 'Paper filters, 200 count.',
  },

  // Gift sets (3)
  {
    id: 'starter-kit',
    category: 'gift-set',
    name: 'Pour-Over Starter Kit',
    price: 129,
    description:
      'One bag of Huehuetenango, the Grinder Mini, the ceramic dripper, and 50 filters. Everything you need for your first pour-over, in one box.',
    scrapedDescription: 'Pour-over starter set.',
  },
  {
    id: 'subscription-3mo',
    category: 'gift-set',
    name: '3-Month Subscription',
    price: 65,
    description: 'Three months of our Huehuetenango lot, shipped on the 1st. Most popular gift in December.',
    scrapedDescription: '3-month coffee subscription.',
  },
  {
    id: 'gift-card',
    category: 'gift-set',
    name: 'Gift Card',
    price: 50,
    description: 'Digital, never expires. The coward\'s gift. (Joking. Sometimes this is the right answer.)',
    scrapedDescription: 'Digital gift card.',
  },
]

export function getProduct(id: string): Product | undefined {
  return CATALOG.find((p) => p.id === id)
}
