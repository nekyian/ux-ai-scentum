'use client'

import { useState, useMemo } from 'react'
import { FilterPanel } from '../components/FilterPanel'
import { ProductCard } from '../components/ProductCard'
import { perfumes, ALL_ACCORDS, ALL_TAGS } from '../data/perfumes'
import { filterProducts, DEFAULT_FILTERS } from '../lib/filter'
import type { FilterState } from '../types'

export default function ListingPage() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)

  const results = useMemo(
    () => filterProducts(perfumes, filters),
    [filters]
  )

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 52px)' }}>
      <FilterPanel
        filters={filters}
        onChange={setFilters}
        allAccords={ALL_ACCORDS}
        allTags={ALL_TAGS}
      />

      <main style={{ flex: 1, padding: '1.5rem 2rem', overflowY: 'auto' }}>
        {/* Count */}
        <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {results.length} {results.length === 1 ? 'perfume' : 'perfumes'}
          </span>
          {results.length < perfumes.length && (
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              filtered from {perfumes.length}
            </span>
          )}
        </div>

        {/* Grid */}
        {results.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1rem',
            }}
          >
            {results.map(p => (
              <ProductCard key={p.id} perfume={p} />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: '4rem 0',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              fontStyle: 'italic',
            }}
          >
            nothing matches — try softening the filters
          </div>
        )}
      </main>
    </div>
  )
}
