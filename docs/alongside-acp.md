# Deploying alongside ACP / UCP

merchant-agent is intentionally not a transactional protocol. ACP (OpenAI + Stripe) and UCP (Google + Shopify + Etsy + Walmart + Target + Wayfair + 20 others) already won that lane. They define how a buyer-agent finds your products, places orders, and handles payment + fulfillment.

merchant-agent fills the gap they left: how the merchant *speaks* to the buyer-agent. Recommendations, brand voice, conditional offers.

The two layers are independent. Deploy both.

## Recommended HTML head

```html
<link rel="agentic-commerce" href="/.well-known/agentic-commerce">
<link rel="merchant-agent"   href="/.well-known/merchant-agent">
```

Buyer-agents read both. ACP handles the catalog, the cart, and the checkout. merchant-agent handles the merchandising voice that surrounds those transactions.

## What goes where

| Concern | Protocol |
| --- | --- |
| Product catalog (SKUs, prices, inventory, photos) | ACP / UCP |
| Order placement, payment, fulfillment | ACP / UCP |
| Returns, post-purchase support | UCP |
| **What to recommend with this product** | **merchant-agent** |
| **The brand story behind a product** | **merchant-agent** |
| **Conditional offers (first-time buyer, etc.)** | **merchant-agent** |

Don't try to put a catalog in `/cross-sell`. Don't try to put checkout in `/offer`. The boundary is deliberate.

## Worked example

A buyer-agent shopping at GoldenHour Coffee, with both protocols deployed:

1. Buyer-agent fetches the homepage. Sees both `<link>` tags.
2. Calls ACP `/products` to list the catalog. Sees 12 SKUs with prices and inventory.
3. Calls merchant-agent `/cross-sell?for=pour-over-bundle` to ask the merchant: "if I buy this, what should I also consider?" Gets `grinder-pro` and `scale-mini` with merchant-controlled reasons.
4. Calls merchant-agent `/brand-story?for=pour-over-bundle` to get the merchant's voice. Threads the story into its summary for the human.
5. Calls merchant-agent `/offer` with `{first_time_buyer: true}`. Gets the FIRSTPOUR15 code.
6. Calls ACP `/checkout` with the cart and the offer code. Pays. Done.

ACP and merchant-agent never collide. Each does its job.

## What if I don't have ACP yet?

merchant-agent works standalone — buyer-agents will still call your `/info`, `/cross-sell`, `/brand-story`, and `/offer` endpoints. They just won't be able to complete a purchase without you also exposing a catalog + checkout (whether via ACP, UCP, or your own custom flow).

For most use cases, deploying both is the right move. ACP is a few hours of integration work. merchant-agent is a few minutes.
