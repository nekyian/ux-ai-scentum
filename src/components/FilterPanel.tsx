'use client'

import React from 'react'
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
  floated: boolean
  onToggleFloat: () => void
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

const miniButtonStyle: React.CSSProperties = {
  fontSize: '0.62rem',
  color: 'var(--text-muted)',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  textDecoration: 'underline',
  textUnderlineOffset: '2px',
  fontFamily: 'inherit',
}

const floatColumnStyle: React.CSSProperties = {
  width: '120px',
  flexShrink: 0,
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  background: 'var(--bg-float)',
  backdropFilter: 'blur(20px) saturate(1.6)',
  WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
  border: '1px solid var(--border-float)',
  borderRadius: '4px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.08), 0 1px 0 var(--border-float)',
  padding: '1rem 0.65rem',
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
}

const floatSectionTitle: React.CSSProperties = {
  fontSize: '0.58rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  marginBottom: '0.6rem',
  marginTop: 0,
}

export function FilterPanel({ filters, onChange, allAccords, allTags, floated, onToggleFloat }: Props) {
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
    onChange({ accords: [], tags: [], sliders: {}, rating: 0, query: filters.query })
  }

  // ── Floated: 3 tall narrow columns ──────────────────────────────────────
  if (floated) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '64px',
          left: '12px',
          bottom: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          zIndex: 100,
        }}
      >
        {/* dock + clear row */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingRight: '2px' }}>
          {activeCount > 0 && (
            <button onClick={reset} style={miniButtonStyle}>clear</button>
          )}
          <button onClick={onToggleFloat} style={{ ...miniButtonStyle, color: 'var(--text)' }}>dock</button>
        </div>

        {/* 3 columns */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minHeight: 0 }}>

          {/* Vibe */}
          <div style={floatColumnStyle}>
            <p style={floatSectionTitle}>Vibe</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {allTags.map(t => (
                <button
                  key={t}
                  onClick={() => toggleTag(t)}
                  style={{
                    fontSize: '0.62rem',
                    padding: '0.22rem 0.4rem',
                    borderRadius: '2px',
                    border: `1px solid ${filters.tags.includes(t) ? 'var(--chip-active)' : 'var(--border-float)'}`,
                    background: filters.tags.includes(t) ? 'var(--chip-active)' : 'transparent',
                    color: filters.tags.includes(t) ? 'var(--chip-active-text)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    lineHeight: 1.35,
                    letterSpacing: '0.02em',
                    fontFamily: 'inherit',
                    transition: 'all 0.15s ease',
                    width: '100%',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Accord */}
          <div style={floatColumnStyle}>
            <p style={floatSectionTitle}>Accord</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {allAccords.map(a => (
                <button
                  key={a}
                  onClick={() => toggleAccord(a)}
                  style={{
                    fontSize: '0.62rem',
                    padding: '0.22rem 0.4rem',
                    borderRadius: '2px',
                    border: `1px solid ${filters.accords.includes(a) ? 'var(--chip-active)' : 'var(--border-float)'}`,
                    background: filters.accords.includes(a) ? 'var(--chip-active)' : 'transparent',
                    color: filters.accords.includes(a) ? 'var(--chip-active-text)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    lineHeight: 1.35,
                    letterSpacing: '0.02em',
                    fontFamily: 'inherit',
                    transition: 'all 0.15s ease',
                    width: '100%',
                  }}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Dimensions + Rating */}
          <div style={floatColumnStyle}>
            <p style={floatSectionTitle}>Dim.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {(Object.keys(SCORE_SLIDER_LABELS) as (keyof ScoreVector)[]).map(key => {
                const [, high] = SCORE_SLIDER_LABELS[key]
                const current = filters.sliders[key] ?? 0
                return (
                  <div key={key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.58rem', color: current > 0 ? 'var(--text)' : 'var(--text-muted)', letterSpacing: '0.02em' }}>
                        {high}
                      </span>
                      {current > 0 && (
                        <button
                          onClick={() => setSlider(key, undefined)}
                          style={{ ...miniButtonStyle, fontSize: '0.55rem', textDecoration: 'none' }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <input
                      type="range"
                      min={0} max={1} step={0.05}
                      value={current}
                      onChange={e => {
                        const v = parseFloat(e.target.value)
                        setSlider(key, v === 0 ? undefined : v)
                      }}
                      style={{ width: '100%' }}
                    />
                    {current > 0 && (
                      <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>
                        ≥{Math.round(current * 100)}%
                      </span>
                    )}
                  </div>
                )
              })}

              {/* Rating */}
              <div style={{ marginTop: '0.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-float)' }}>
                <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)', letterSpacing: '0.02em' }}>Rating</span>
                <input
                  type="range"
                  min={0} max={5} step={0.5}
                  value={filters.rating}
                  onChange={e => onChange({ ...filters, rating: parseFloat(e.target.value) })}
                  style={{ width: '100%', marginTop: '0.25rem' }}
                />
                {filters.rating > 0 && (
                  <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>{filters.rating}+</span>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }

  // ── Docked: standard sidebar ─────────────────────────────────────────────
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
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {activeCount > 0 && (
            <button onClick={reset} style={miniButtonStyle}>clear</button>
          )}
          <button onClick={onToggleFloat} style={miniButtonStyle}>float</button>
        </div>
      </div>

      {/* Vibe / Tags */}
      <div style={{ marginBottom: '1.5rem' }}>
        <SectionTitle>Vibe</SectionTitle>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {allTags.map(t => (
            <Chip key={t} label={t} active={filters.tags.includes(t)} onClick={() => toggleTag(t)} />
          ))}
        </div>
      </div>

      {/* Accords */}
      <div style={{ marginBottom: '1.5rem' }}>
        <SectionTitle>Accord</SectionTitle>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {allAccords.map(a => (
            <Chip key={a} label={a} active={filters.accords.includes(a)} onClick={() => toggleAccord(a)} />
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
            min={0} max={5} step={0.5}
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
