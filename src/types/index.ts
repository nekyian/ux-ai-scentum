export type ScoreVector = {
  authenticity: number  // 0–1: natural vs synthetic feel
  projection: number    // 0–1: intimate vs loud
  longevity: number     // 0–1
  complexity: number    // 0–1
  versatility: number   // 0–1
}

export type Perfume = {
  id: string
  slug: string
  brand: string
  name: string
  description: string
  imageUrls: string[]
  price?: number
  currency?: string
  notes: string[]
  accords: string[]
  tags: string[]   // vibe tags: quiet-luxury | romantic | archive-core | clean | experimental | late-french-theory
  scores: ScoreVector
  review: {
    ratingAvg: number
    reviewCount: number
    sentiment?: number
  }
  geo?: {
    country?: string
    perfumer?: string
  }
}

export type FilterState = {
  accords: string[]
  tags: string[]
  sliders: Partial<ScoreVector>
  rating: number  // minimum rating threshold
}

export type RecommendContext = 'similar' | 'cheaper' | 'more-intense' | 'more-natural'
