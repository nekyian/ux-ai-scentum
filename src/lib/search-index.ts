import lunr from 'lunr'
import { perfumes } from '@/data/perfumes'
import type { Perfume } from '@/types'

// Module-level cache — built once per server process
let _index: lunr.Index | null = null

function buildIndex(): lunr.Index {
  return lunr(function () {
    this.ref('id')
    this.field('name',        { boost: 10 })
    this.field('brand',       { boost: 8 })
    this.field('accords',     { boost: 6 })
    this.field('tags',        { boost: 5 })
    this.field('notes',       { boost: 4 })
    this.field('description', { boost: 2 })

    perfumes.forEach(p => {
      this.add({
        id:          p.id,
        name:        p.name,
        brand:       p.brand,
        accords:     p.accords.join(' '),
        tags:        p.tags.join(' '),
        notes:       p.notes.join(' '),
        description: p.description,
      })
    })
  })
}

export function searchPerfumes(query: string, limit = 6): Perfume[] {
  if (!_index) _index = buildIndex()

  let results: lunr.Index.Result[] = []
  try {
    results = _index.search(query)
  } catch {
    // Lunr throws on malformed query (bare ~, *, etc.) — fall back to fuzzy
    try {
      results = _index.search(query.trim().split(/\s+/).map(t => `${t}~1`).join(' '))
    } catch {
      results = []
    }
  }

  const scored = new Map(results.map(r => [r.ref, r.score]))

  return perfumes
    .filter(p => scored.has(p.id))
    .sort((a, b) => (scored.get(b.id) ?? 0) - (scored.get(a.id) ?? 0))
    .slice(0, limit)
}
