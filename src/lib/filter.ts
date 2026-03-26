import type { Perfume, FilterState, ScoreVector } from '../types'

// Maps typed words → ScoreVector dimension keys
export const DIMENSION_ALIASES: Record<string, keyof ScoreVector> = {
  authenticity: 'authenticity',
  natural: 'authenticity',
  synthetic: 'authenticity',
  projection: 'projection',
  projecting: 'projection',
  intimate: 'projection',
  longevity: 'longevity',
  lasting: 'longevity',
  fleeting: 'longevity',
  complexity: 'complexity',
  complex: 'complexity',
  simple: 'complexity',
  versatility: 'versatility',
  versatile: 'versatility',
  singular: 'versatility',
}

export type ParsedQuery = {
  accords: string[]
  tags: string[]
  sliders: Partial<ScoreVector>
  nameTokens: string[]
}

export function parseQuery(
  query: string,
  allAccords: string[],
  allTags: string[]
): ParsedQuery {
  const tokens = query
    .toLowerCase()
    .split(/[\s,]+/)
    .filter(t => t.length >= 2)

  const accords: string[] = []
  const tags: string[] = []
  const sliders: Partial<ScoreVector> = {}
  const nameTokens: string[] = []

  for (const token of tokens) {
    // Exact accord match
    const accord = allAccords.find(a => a.toLowerCase() === token)
    if (accord) { accords.push(accord); continue }

    // Tag: substring match handles "luxury" → "quiet-luxury", "archive" → "archive-core"
    const tag = allTags.find(t => t.toLowerCase().includes(token))
    if (tag) { tags.push(tag); continue }

    // Dimension alias
    const dim = DIMENSION_ALIASES[token]
    if (dim) { sliders[dim] = 0.6; continue }

    // Otherwise treat as name/brand search token
    nameTokens.push(token)
  }

  return { accords, tags, sliders, nameTokens }
}

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

function matchQuery(p: Perfume, parsed: ParsedQuery): boolean {
  const { accords, tags, sliders, nameTokens } = parsed
  if (accords.length && !accords.every(a => p.accords.includes(a))) return false
  if (tags.length && !tags.some(t => p.tags.includes(t))) return false
  const sliderKeys = Object.keys(sliders) as (keyof ScoreVector)[]
  if (sliderKeys.some(k => p.scores[k] < (sliders[k] ?? 0))) return false
  if (nameTokens.length) {
    const haystack = (p.brand + ' ' + p.name).toLowerCase()
    if (!nameTokens.every(t => haystack.includes(t))) return false
  }
  return true
}

export function filterProducts(
  products: Perfume[],
  filters: FilterState,
  allAccords: string[] = [],
  allTags: string[] = []
): Perfume[] {
  const parsed = filters.query
    ? parseQuery(filters.query, allAccords, allTags)
    : null

  return products.filter(p =>
    matchAccords(p, filters.accords) &&
    matchTags(p, filters.tags) &&
    matchScores(p, filters.sliders) &&
    matchRating(p, filters.rating) &&
    (parsed ? matchQuery(p, parsed) : true)
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
  query: '',
}
