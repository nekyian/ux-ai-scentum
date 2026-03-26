import type { Perfume, FilterState } from '../types'

function matchAccords(p: Perfume, accords: string[]): boolean {
  if (accords.length === 0) return true
  return accords.every(a => p.accords.includes(a))
}

function matchTags(p: Perfume, tags: string[]): boolean {
  if (tags.length === 0) return true
  return tags.some(t => p.tags.includes(t))
}

function matchScores(p: Perfume, sliders: FilterState['sliders']): boolean {
  const keys = Object.keys(sliders) as (keyof typeof sliders)[]
  return keys.every(key => {
    const threshold = sliders[key]
    if (threshold === undefined) return true
    return p.scores[key] >= threshold
  })
}

function matchRating(p: Perfume, rating: number): boolean {
  return p.review.ratingAvg >= rating
}

export function filterProducts(products: Perfume[], filters: FilterState): Perfume[] {
  return products.filter(p =>
    matchAccords(p, filters.accords) &&
    matchTags(p, filters.tags) &&
    matchScores(p, filters.sliders) &&
    matchRating(p, filters.rating)
  )
}

export function countActiveFilters(filters: FilterState): number {
  return (
    filters.accords.length +
    filters.tags.length +
    Object.keys(filters.sliders).length +
    (filters.rating > 0 ? 1 : 0)
  )
}

export const DEFAULT_FILTERS: FilterState = {
  accords: [],
  tags: [],
  sliders: {},
  rating: 0,
}
