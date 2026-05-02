// merchant-agent v0.1 — type definitions
// Specification: https://github.com/VedSoni-dev/merchant-agent

export const SPEC_VERSION = '0.1' as const
export const MEDIA_TYPE = 'application/merchant-agent' as const
export const VERSION_HEADER = 'Merchant-Agent-Version' as const

export type Primitive = 'cross-sell' | 'brand-story' | 'offer'

export interface AgentInfo {
  name: string
  description: string
  version: typeof SPEC_VERSION
  primitives: Primitive[]
  extensions: string[]
}

export interface CrossSellRecommendation {
  product_id: string
  reason: string
  priority: number
}

export interface CrossSellResponse {
  for: string
  recommendations: CrossSellRecommendation[]
}

export interface BrandStoryResponse {
  for: string
  story: string
  values: string[]
  voice: string
}

export interface BuyerContext {
  first_time_buyer?: boolean
  cart_value?: number
  country?: string
  [key: string]: unknown
}

export interface OfferRequest {
  product_id: string
  buyer_context: BuyerContext
}

export interface Offer {
  description: string
  terms: string
  expires_at: string
  code?: string
}

export interface OfferResponse {
  for: string
  offer: Offer | null
}

// Server-side handler types

export interface CrossSellInput {
  productId: string
  buyerContext: BuyerContext
}

export interface BrandStoryInput {
  productId: string
  style?: 'short' | 'long'
}

export interface OfferInput {
  productId: string
  buyerContext: BuyerContext
}

export interface MerchantAgentDefinition {
  name: string
  description?: string
  brandVoice?: string
  values?: string[]
  crossSell?: (input: CrossSellInput) => Promise<CrossSellRecommendation[]> | CrossSellRecommendation[]
  brandStory?: (
    input: BrandStoryInput,
  ) => Promise<Omit<BrandStoryResponse, 'for'>> | Omit<BrandStoryResponse, 'for'>
  offer?: (input: OfferInput) => Promise<Offer | null> | Offer | null
}
