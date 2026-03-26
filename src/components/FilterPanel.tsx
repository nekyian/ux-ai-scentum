'use client'

import type { FilterState, ScoreVector } from '../types'
import { countActiveFilters } from '../lib/filter'

const SCORE_SLIDER_LABELS: Record<keyof ScoreVector, [string, string]> = {
  authenticity: ['Synthetic', 'Natural'],
  projection: ['Intimate', 'Projecting'],
  longevity: ['Fleeting', 'Lasting'],
  complexity: ['Simple', 'Complex'],
  versatility: ['Singular', 'Versatile'],
}

type Props = {
  filters: FilterState
  onChange: (f: FilterState) => void
  allAccords: string[]
  allTags: string[]
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: '0.62rem',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: '0.65rem',
      marginTop: 0,
    }}>
      {children}
    </p>
  )
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: '0.68rem',
        padding: '0.25rem 0.6rem',
        borderRadius: '1px',
        border: `1px solid ${active ? 'var(--chip-active)' : 'var(--border)'}`,
        background: active ? 'var(--chip-active)' : 'transparent',
        color: active ? 'var(--chip-active-text)' : 'var(--text-muted)',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        letterSpacing: '0.03em',
      }}
    >
      {label}
    </button>
  )
}

function SliderRow({
  dimension,
  value,
  onChange,
}: {
  dimension: keyof ScoreVector
  value: number | undefined
  onChange: (v: number | undefined) => void
}) {
  const [low, high] = SCORE_SLIDER_LABELS[dimension]
  const current = value ?? 0

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{low}</span>
        <span style={{ fontSize: '0.68rem', color: current > 0 ? 'var(--text)' : 'var(--text-muted)' }}>
          {high}
          {current > 0 && (
            <span style={{ marginLeft: '0.3rem', color: 'var(--text-muted)' }}>
              ≥{Math.round(current * 100)}%
            </span>
          )}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={current}
          onChange={e => {
            const v = parseFloat(e.target.value)
            onChange(v === 0 ? undefined : v)
          }}
          style={{ flex: 1 }}
        />
        {current > 0 && (
          <button
            onClick={() => onChange(undefined)}
            style={{
              fontSize: '0.6rem',
              color: 'var(--text-muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

export function FilterPanel({ filters, onChange, allAccords, allTags }: Props) {
  const activeCount = countActiveFilters(filters)

  function toggleAccord(a: string) {
    const next = filters.accords.includes(a)
      ? filters.accords.filter(x => x !== a)
      : [...filters.accords, a]
    onChange({ ...filters, accords: next })
  }

  function toggleTag(t: string) {
    const next = filters.tags.includes(t)
      ? filters.tags.filter(x => x !== t)
      : [...filters.tags, t]
    onChange({ ...filters, tags: next })
  }

  function setSlider(key: keyof ScoreVector, v: number | undefined) {
    const next = { ...filters.sliders }
    if (v === undefined) {
      delete next[key]
    } else {
      next[key] = v
    }
    onChange({ ...filters, sliders: next })
  }

  function reset() {
    onChange({ accords: [], tags: [], sliders: {}, rating: 0 })
  }

  return (
    <aside
      style={{
        width: '220px',
        flexShrink: 0,
        borderRight: '1px solid var(--border)',
        padding: '1.5rem 1.25rem',
        overflowY: 'auto',
        position: 'sticky',
        top: '52px',
        height: 'calc(100vh - 52px)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Filter
          {activeCount > 0 && (
            <span
              style={{
                marginLeft: '0.4rem',
                background: 'var(--text)',
                color: 'var(--bg)',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.6rem',
              }}
            >
              {activeCount}
            </span>
          )}
        </span>
        {activeCount > 0 && (
          <button
            onClick={reset}
            style={{
              fontSize: '0.62rem',
              color: 'var(--text-muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
            }}
          >
            clear
          </button>
        )}
      </div>

      {/* Vibe / Tags */}
      <div style={{ marginBottom: '1.5rem' }}>
        <SectionTitle>Vibe</SectionTitle>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {allTags.map(t => (
            <Chip
              key={t}
              label={t}
              active={filters.tags.includes(t)}
              onClick={() => toggleTag(t)}
            />
          ))}
        </div>
      </div>

      {/* Accords */}
      <div style={{ marginBottom: '1.5rem' }}>
        <SectionTitle>Accord</SectionTitle>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {allAccords.map(a => (
            <Chip
              key={a}
              label={a}
              active={filters.accords.includes(a)}
              onClick={() => toggleAccord(a)}
            />
          ))}
        </div>
      </div>

      {/* Dimensions */}
      <div style={{ marginBottom: '1.5rem' }}>
        <SectionTitle>Dimensions</SectionTitle>
        {(Object.keys(SCORE_SLIDER_LABELS) as (keyof ScoreVector)[]).map(key => (
          <SliderRow
            key={key}
            dimension={key}
            value={filters.sliders[key]}
            onChange={v => setSlider(key, v)}
          />
        ))}
      </div>

      {/* Rating */}
      <div>
        <SectionTitle>Min Rating</SectionTitle>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="range"
            min={0}
            max={5}
            step={0.5}
            value={filters.rating}
            onChange={e => onChange({ ...filters, rating: parseFloat(e.target.value) })}
            style={{ flex: 1 }}
          />
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', width: '2rem' }}>
            {filters.rating > 0 ? `${filters.rating}+` : '—'}
          </span>
        </div>
      </div>
    </aside>
  )
}
