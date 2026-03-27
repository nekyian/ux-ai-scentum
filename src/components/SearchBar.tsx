'use client'

import { useMemo, useRef } from 'react'
import type { FilterState, ScoreVector } from '../types'
import { parseQuery } from '../lib/filter'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'

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

const KIND_VARIANT: Record<string, 'default' | 'secondary' | 'outline'> = {
  accord: 'secondary',
  tag: 'default',
  dim: 'outline',
  name: 'outline',
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
    parsed.nameTokens.forEach(t =>
      recognizedChips.push({ label: t, token: t, kind: 'name' })
    )
  }

  const hasQuery = filters.query.trim().length > 0

  return (
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center gap-2 pointer-events-none"
    >
      {/* Recognized token chips */}
      {recognizedChips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 justify-center max-w-[500px] pointer-events-auto">
          {recognizedChips.map((chip, i) => (
            <Badge
              key={i}
              variant={KIND_VARIANT[chip.kind]}
              className={cn(
                'gap-1 text-[0.65rem] h-auto py-1 pl-2.5 pr-1.5 rounded-full font-normal',
                'backdrop-blur-md shadow-sm'
              )}
              style={{
                background: 'var(--bg-float)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}
            >
              <span className="text-muted-foreground text-[0.58rem]">{chip.kind}</span>
              {chip.label}
              <button
                onClick={() => onChange({ ...filters, query: removeToken(filters.query, chip.token) })}
                className="text-muted-foreground hover:text-foreground bg-transparent border-none cursor-pointer p-0 leading-none text-[0.55rem] transition-colors"
              >
                ✕
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="pointer-events-auto flex items-center gap-3 rounded-full cursor-text"
        style={{
          background: 'var(--bg-float)',
          backdropFilter: 'blur(24px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
          border: '2px solid var(--border)',
          borderRadius: '100px',
          padding: '0.85rem 1.1rem 0.85rem 1.4rem',
          width: '560px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.13), 0 2px 0 var(--border)',
        }}
      >
        <span className="text-muted-foreground text-base shrink-0 leading-none">⌕</span>
        <input
          ref={inputRef}
          type="text"
          value={filters.query}
          onChange={e => onChange({ ...filters, query: e.target.value })}
          placeholder="woody · romantic · Chanel · lasting..."
          className="flex-1 bg-transparent border-none outline-none text-[0.95rem] text-foreground font-[inherit] tracking-[0.02em] placeholder:text-muted-foreground"
        />
        {hasQuery && (
          <button
            onClick={() => onChange({ ...filters, query: '' })}
            className="text-muted-foreground hover:text-foreground bg-transparent border-none cursor-pointer p-0 leading-none text-[0.75rem] shrink-0 transition-colors font-[inherit]"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
