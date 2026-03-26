'use client'

import { useState, useMemo } from 'react'
import { FilterPanel } from '../components/FilterPanel'
import { ProductCard } from '../components/ProductCard'
import { perfumes, ALL_ACCORDS, ALL_TAGS } from '../data/perfumes'
import { filterProducts, DEFAULT_FILTERS } from '../lib/filter'
import type { FilterState, ScoreVector } from '../types'

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        fontSize: '0.65rem',
        padding: '0.18rem 0.35rem 0.18rem 0.5rem',
        border: '1px solid var(--border)',
        borderRadius: '1px',
        color: 'var(--text)',
        background: 'var(--chip-bg)',
        letterSpacing: '0.03em',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
      <button
        onClick={onRemove}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          lineHeight: 1,
          color: 'var(--text-muted)',
          fontSize: '0.58rem',
          fontFamily: 'inherit',
        }}
      >
        ✕
      </button>
    </span>
  )
}

export default function ListingPage() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [floated, setFloated] = useState(false)

  const results = useMemo(
    () => filterProducts(perfumes, filters),
    [filters]
  )

  function removeTag(t: string) {
    setFilters({ ...filters, tags: filters.tags.filter(x => x !== t) })
  }

  function removeAccord(a: string) {
    setFilters({ ...filters, accords: filters.accords.filter(x => x !== a) })
  }

  function removeSlider(key: keyof ScoreVector) {
    const next = { ...filters.sliders }
    delete next[key]
    setFilters({ ...filters, sliders: next })
  }

  const activeSliderKeys = Object.keys(filters.sliders) as (keyof ScoreVector)[]
  const hasActiveFilters =
    filters.tags.length > 0 ||
    filters.accords.length > 0 ||
    activeSliderKeys.length > 0 ||
    filters.rating > 0

  // In float mode, the filter panels end at 132px. Main paddingLeft is 116px.
  // The topbar needs an extra 20px nudge so it clears the panel edge at 132px.
  const topbarStyle = floated ? { paddingLeft: '20px' } : {}

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 52px)' }}>
      <FilterPanel
        filters={filters}
        onChange={setFilters}
        allAccords={ALL_ACCORDS}
        allTags={ALL_TAGS}
        floated={floated}
        onToggleFloat={() => setFloated(f => !f)}
      />

      <main style={{ flex: 1, padding: '1.5rem 2rem', overflowY: 'auto', ...(floated && { paddingLeft: '116px' }) }}>

        {/* Status + active filter chips */}
        <div
          style={{
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.4rem',
            ...topbarStyle,
          }}
        >
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginRight: '0.25rem', flexShrink: 0 }}>
            {results.length} {results.length === 1 ? 'perfume' : 'perfumes'}
            {results.length < perfumes.length && (
              <span style={{ fontStyle: 'italic' }}> · filtered from {perfumes.length}</span>
            )}
          </span>

          {hasActiveFilters && (
            <>
              {filters.tags.map(t => (
                <FilterChip key={`tag-${t}`} label={t} onRemove={() => removeTag(t)} />
              ))}
              {filters.accords.map(a => (
                <FilterChip key={`accord-${a}`} label={a} onRemove={() => removeAccord(a)} />
              ))}
              {activeSliderKeys.map(key => (
                <FilterChip
                  key={`slider-${key}`}
                  label={`${key} ≥${Math.round(filters.sliders[key]! * 100)}%`}
                  onRemove={() => removeSlider(key)}
                />
              ))}
              {filters.rating > 0 && (
                <FilterChip
                  label={`★ ${filters.rating}+`}
                  onRemove={() => setFilters({ ...filters, rating: 0 })}
                />
              )}
            </>
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
