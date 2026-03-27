import type { Perfume, ScoreVector } from '../types'

function euclidean(a: ScoreVector, b: ScoreVector): number {
  const keys = Object.keys(a) as (keyof ScoreVector)[]
  return Math.sqrt(keys.reduce((sum, k) => sum + (a[k] - b[k]) ** 2, 0))
}

function sharedCount(a: string[], b: string[]): number {
  return a.filter(x => b.includes(x)).length
}

export function scoreSimilarity(source: Perfume, candidate: Perfume): number {
  if (source.id === candidate.id) return -Infinity
  const tagScore = sharedCount(source.tags, candidate.tags) * 3
  const accordScore = sharedCount(source.accords, candidate.accords) * 2
  const vectorScore = 1 - euclidean(source.scores, candidate.scores)
  return tagScore + accordScore + vectorScore
}

export function getSimilar(source: Perfume, all: Perfume[], limit = 6): Perfume[] {
  return all
    .filter(p => p.id !== source.id)
    .map(p => ({ perfume: p, score: scoreSimilarity(source, p) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(x => x.perfume)
}

export function getCataloguePercentiles(
  source: Perfume,
  all: Perfume[]
): { dimension: keyof ScoreVector; percentile: number }[] {
  const keys = Object.keys(source.scores) as (keyof ScoreVector)[]
  return keys.map(k => {
    const below = all.filter(p => p.id !== source.id && p.scores[k] < source.scores[k]).length
    const percentile = Math.round((below / (all.length - 1)) * 100)
    return { dimension: k, percentile }
  }).sort((a, b) => b.percentile - a.percentile)
}
