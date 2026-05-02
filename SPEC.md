# merchant-agent — Specification v0.1

A merchandising layer for the agentic web. Designed to be deployed alongside transactional protocols (ACP, UCP) so buyer-agents see merchant-controlled product recommendations, brand stories, and conditional offers — not just transactional metadata.

This document is the single source of truth for v0.1. The reference implementation lives at [`packages/core`](./packages/core).

---

## 1. Discovery

A site advertises a merchant-agent endpoint via any of:

**HTML link element (preferred for HTML sites):**
```html
<link rel="merchant-agent" href="https://example.com/.well-known/merchant-agent">
```

**HTTP `Link` header (for non-HTML responses):**
```
Link: </.well-known/merchant-agent>; rel="merchant-agent"
```

**Well-known path (canonical mount):**
```
https://example.com/.well-known/merchant-agent
```

Sites MAY alias `/.well-known/merchant-agent` to a shorter path (e.g. `/agent`); buyer-agents MUST follow `<link>` href values verbatim and MUST NOT assume any specific path.

---

## 2. Capability discovery

```http
GET /.well-known/merchant-agent/info
Accept: application/merchant-agent;v=0.1
```

**Response:**
```json
{
  "name": "GoldenHour Coffee",
  "description": "Single-origin pour-over coffee, direct from a 4-generation farm in Huehuetenango.",
  "version": "0.1",
  "primitives": ["cross-sell", "brand-story", "offer"],
  "extensions": []
}
```

Response MUST include header: `Merchant-Agent-Version: 0.1`.

The `primitives` array tells the buyer-agent which of the endpoints below are supported. A merchant-agent MAY support a subset.

The `extensions` array allows vendors to declare prefixed custom methods (`x-loyalty`, `x-reviews`) without breaking the core spec. Extensions are reserved for v0.2+.

---

## 3. Cross-sell primitive

```http
GET /.well-known/merchant-agent/cross-sell?for=<product-id>[&context=<base64-json>]
Accept: application/merchant-agent;v=0.1
```

The optional `context` parameter is base64-encoded JSON containing buyer signals (first-time buyer, cart value, country, etc.). Servers MUST ignore unrecognized fields.

**Response:**
```json
{
  "for": "pour-over-bundle",
  "recommendations": [
    {
      "product_id": "grinder-pro",
      "reason": "Most pour-over buyers come back for this within two weeks.",
      "priority": 1
    },
    {
      "product_id": "scale-mini",
      "reason": "Pairs with the grinder for repeatable pours.",
      "priority": 2
    }
  ]
}
```

The merchant controls the order and reasoning. Buyer-agents MUST present recommendations in the priority order given. Buyer-agents MUST NOT silently re-rank by price.

---

## 4. Brand-story primitive

```http
GET /.well-known/merchant-agent/brand-story?for=<product-id>[&style=short|long]
Accept: application/merchant-agent;v=0.1
```

**Response:**
```json
{
  "for": "pour-over-bundle",
  "story": "Sourced from a 4-generation farm in Huehuetenango, Guatemala. The Lopez family has worked this land since 1924, and we've been their only export buyer for the last 11 years.",
  "values": ["craft", "farm-direct", "long-term-relationships"],
  "voice": "warm-direct"
}
```

Long-form stories MAY be streamed via Server-Sent Events when the request includes `Accept: text/event-stream`. Streamed responses emit `story-chunk` events terminated by a `story-complete` event.

---

## 5. Offer primitive

```http
POST /.well-known/merchant-agent/offer
Content-Type: application/json
Accept: application/merchant-agent;v=0.1
```

**Request body:**
```json
{
  "product_id": "pour-over-bundle",
  "buyer_context": {
    "first_time_buyer": true,
    "cart_value": 38.00,
    "country": "US"
  }
}
```

The `buyer_context` object is opaque — buyer-agents include whatever signals are relevant. Merchants ignore unrecognized fields.

**Response (when an offer applies):**
```json
{
  "for": "pour-over-bundle",
  "offer": {
    "description": "15% off your first bag",
    "terms": "First-time buyers only. One-time use.",
    "expires_at": "2026-06-01T00:00:00Z",
    "code": "FIRSTPOUR15"
  }
}
```

**Response (no offer):**
```json
{
  "for": "pour-over-bundle",
  "offer": null
}
```

Merchants MUST NOT use offer responses for behavioral profiling beyond what was sent in `buyer_context`. Buyer-agents SHOULD disclose the offer source ("merchant-controlled") to the human user.

---

## 6. Versioning and compatibility

- Version is negotiated via `Accept: application/merchant-agent;v=<version>`. Defaults to latest if omitted.
- Servers MUST include `Merchant-Agent-Version: <version>` in responses.
- Breaking changes increment the major version. Additive changes increment minor.
- Servers MUST ignore unknown request fields. Buyer-agents MUST ignore unknown response fields.

---

## 7. Coexistence with ACP / UCP

merchant-agent is designed to be deployed alongside transactional protocols. Recommended HTML head:

```html
<link rel="agentic-commerce" href="/.well-known/agentic-commerce">
<link rel="merchant-agent" href="/.well-known/merchant-agent">
```

Buyer-agents SHOULD read both: the transactional protocol for product catalog, inventory, and checkout; merchant-agent for merchandising primitives. The two layers are independent — neither requires the other.

---

## 8. Security and trust

- All endpoints MUST be served over HTTPS in production.
- v0.1 endpoints are public (no auth). v0.2 will add optional bearer-token agent identity (`X-Buyer-Agent: <verified-agent-id>`).
- Merchants MUST NOT block buyer-agents based on `User-Agent` if those agents announce themselves through `Accept: application/merchant-agent;v=*`. Doing so violates the spec.
- Buyer-agents SHOULD disclose to the human user when output is merchant-controlled (cross-sell reasons, brand stories, offers) vs. buyer-agent-derived.

---

## 9. Conformance

A conforming server MUST:
- Implement `/info` and at least one of the three primitives.
- Respond with `Content-Type: application/merchant-agent;v=0.1` and the version header on success.
- Return `404 Not Found` for unsupported endpoints.
- Return `400 Bad Request` for missing required parameters.

A conforming client MUST:
- Discover via `<link>` element, `Link` header, or well-known path probe — in that order.
- Honor merchant-supplied recommendation order (no silent re-ranking).
- Disclose merchant-controlled output to the human user.

---

## 10. Reference implementation

A TypeScript reference SDK is published at [`merchant-agent` on npm](https://www.npmjs.com/package/merchant-agent). Source: [`packages/core`](./packages/core).

A live demo runs at the demo site shipped with this repo (`apps/demo`).

---

## 11. License

This specification is published under MIT. The reference implementation is MIT. Forks and vendor extensions are encouraged.

---

*Specification authored 2026-05. Feedback and PRs: [github.com/merchant-agent/spec/issues](https://github.com/merchant-agent/spec/issues).*
