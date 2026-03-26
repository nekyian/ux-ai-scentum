'use client'

import { useMemo, useRef } from 'react'
import type { FilterState, ScoreVector } from '../types'
import { parseQuery } from '../lib/filter'

type Props = {
  filters: FilterState
  onChange: (f: FilterState) => void
  allAccords: string[]
  allTags: string[]
}

const SCORE_LABELS: Record<keyof ScoreVector, string> = {
  authenticity: 'natural',
  projection: 'projecting',
  longevity: 'lasting',
  complexity: 'complex',
  versatility: 'versatile',
}

const TOKEN_KIND_COLORS: Record<string, string> = {
  accord: 'var(--text)',
  tag: 'var(--accent)',
  dim: 'var(--text-muted)',
  name: 'var(--text)',
}

function removeToken(query: string, token: string): string {
  return query
    .split(/\s+/)
    .filter(t => t.toLowerCase() !== token.toLowerCase())
    .join(' ')
    .trim()
}

export function SearchBar({ filters, onChange, allAccords, allTags }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const parsed = useMemo(
    () => (filters.query ? parseQuery(filters.query, allAccords, allTags) : null),
    [filters.query, allAccords, allTags]
  )

  const recognizedChips: { label: string; token: string; kind: string }[] = []
  if (parsed) {
    parsed.accords.forEach(a => recognizedChips.push({ label: a, token: a, kind: 'accord' }))
    parsed.tags.forEach(t => {
      // find the original token that triggered this tag
      const originalToken = filters.query
        .toLowerCase()
        .split(/\s+/)
        .find(tok => t.toLowerCase().includes(tok) && tok.length >= 2) ?? t
      recognizedChips.push({ label: t, token: originalToken, kind: 'tag' })
    })
    ;(Object.keys(parsed.sliders) as (keyof ScoreVector)[]).forEach(k => {
      const originalToken = filters.query
        .toLowerCase()
        .split(/\s+/)
        .find(tok => tok === k || tok === SCORE_LABELS[k]) ?? k
      recognizedChips.push({ label: `${SCORE_LABELS[k]} ≥60%`, token: originalToken, kind: 'dim' })
    })
    if (parsed.nameTokens.length > 0) {
      parsed.nameTokens.forEach(t =>
        recognizedChips.push({ label: t, token: t, kind: 'name' })
      )
    }
  }

  const hasQuery = filters.query.trim().length > 0

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.45rem',
        pointerEvents: 'none',
      }}
    >
      {/* Recognized token chips */}
      {recognizedChips.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.3rem',
            justifyContent: 'center',
            maxWidth: '480px',
            pointerEvents: 'auto',
          }}
        >
          {recognizedChips.map((chip, i) => (
            <span
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.65rem',
                padding: '0.18rem 0.4rem 0.18rem 0.55rem',
                background: 'var(--bg-float)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: `1px solid var(--border-float)`,
                borderRadius: '100px',
                color: TOKEN_KIND_COLORS[chip.kind],
                letterSpacing: '0.04em',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              {chip.kind === 'accord' && <span style={{ color: 'var(--text-muted)', fontSize: '0.58rem' }}>accord</span>}
              {chip.kind === 'tag' && <span style={{ color: 'var(--text-muted)', fontSize: '0.58rem' }}>vibe</span>}
              {chip.kind === 'dim' && <span style={{ color: 'var(--text-muted)', fontSize: '0.58rem' }}>dim</span>}
              {chip.kind === 'name' && <span style={{ color: 'var(--text-muted)', fontSize: '0.58rem' }}>name</span>}
              {chip.label}
              <button
                onClick={() => onChange({ ...filters, query: removeToken(filters.query, chip.token) })}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  lineHeight: 1,
                  color: 'var(--text-muted)',
                  fontSize: '0.55rem',
                  fontFamily: 'inherit',
                }}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          pointerEvents: 'auto',
          background: 'var(--bg-float)',
          backdropFilter: 'blur(24px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
          border: '2px solid var(--border)',
          borderRadius: '100px',
          padding: '0.85rem 1.1rem 0.85rem 1.4rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          width: '560px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.13), 0 2px 0 var(--border)',
          cursor: 'text',
        }}
      >
        <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)', flexShrink: 0, lineHeight: 1 }}>
          ⌕
        </span>
        <input
          ref={inputRef}
          type="text"
          value={filters.query}
          onChange={e => onChange({ ...filters, query: e.target.value })}
          placeholder="woody · romantic · Chanel · lasting..."
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            outline: 'none',
            fontSize: '0.95rem',
            color: 'var(--text)',
            fontFamily: 'inherit',
            letterSpacing: '0.02em',
          }}
        />
        {hasQuery && (
          <button
            onClick={() => onChange({ ...filters, query: '' })}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              lineHeight: 1,
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              fontFamily: 'inherit',
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
