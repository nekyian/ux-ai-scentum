'use client'

import React from 'react'
import type { FilterState, ScoreVector } from '../types'
import { countActiveFilters } from '../lib/filter'
import { Slider } from './ui/slider'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { cn } from '@/lib/utils'

const val0 = (v: number | readonly number[]): number =>
  Array.isArray(v) ? (v as readonly number[])[0] : (v as number)

const SCORE_LABELS: Record<keyof ScoreVector, [string, string]> = {
  authenticity: ['Synthetic', 'Natural'],
  projection:   ['Intimate',  'Projecting'],
  longevity:    ['Fleeting',  'Lasting'],
  complexity:   ['Simple',    'Complex'],
  versatility:  ['Singular',  'Versatile'],
}

type Props = {
  open: boolean
  onClose: () => void
  filters: FilterState
  onChange: (f: FilterState) => void
  allAccords: string[]
  allTags: string[]
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.62rem] uppercase tracking-[0.1em] text-muted-foreground mb-2.5 mt-0">
      {children}
    </p>
  )
}

export function MobileFilterSheet({ open, onClose, filters, onChange, allAccords, allTags }: Props) {
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
    if (v === undefined) delete next[key]
    else next[key] = v
    onChange({ ...filters, sliders: next })
  }

  function reset() {
    onChange({ accords: [], tags: [], sliders: {}, rating: 0, query: filters.query })
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 300,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 301,
          background: 'var(--card)',
          borderRadius: '16px 16px 0 0',
          borderTop: '1px solid var(--border)',
          maxHeight: '78vh',
          display: 'flex',
          flexDirection: 'column',
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        {/* Handle + header */}
        <div style={{ padding: '0.75rem 1.25rem 0.5rem', flexShrink: 0 }}>
          <div style={{ width: '36px', height: '3px', background: 'var(--border)', borderRadius: '2px', margin: '0 auto 1rem' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Filter
              {activeCount > 0 && (
                <span style={{
                  marginLeft: '0.5rem',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--foreground)', color: 'var(--background)',
                  borderRadius: '100px', width: '1rem', height: '1rem',
                  fontSize: '0.6rem',
                }}>
                  {activeCount}
                </span>
              )}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {activeCount > 0 && (
                <Button variant="ghost" size="sm" onClick={reset} className="h-auto py-1 px-2 text-[0.65rem] text-muted-foreground">
                  clear all
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose} className="h-auto py-1 px-2 text-[0.65rem]">
                Done
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* Scrollable content */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '1.25rem 1.25rem 2rem', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>

          {/* Vibe */}
          <div style={{ marginBottom: '1.5rem' }}>
            <SectionLabel>Vibe</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {allTags.map(t => (
                <Badge
                  key={t}
                  variant={filters.tags.includes(t) ? 'default' : 'outline'}
                  render={<button />}
                  onClick={() => toggleTag(t)}
                  className="cursor-pointer text-[0.72rem] h-auto py-1.5 px-3 rounded-full"
                >
                  {t}
                </Badge>
              ))}
            </div>
          </div>

          <Separator style={{ marginBottom: '1.5rem' }} />

          {/* Accord */}
          <div style={{ marginBottom: '1.5rem' }}>
            <SectionLabel>Accord</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {allAccords.map(a => (
                <Badge
                  key={a}
                  variant={filters.accords.includes(a) ? 'default' : 'outline'}
                  render={<button />}
                  onClick={() => toggleAccord(a)}
                  className="cursor-pointer text-[0.72rem] h-auto py-1.5 px-3 rounded-full"
                >
                  {a}
                </Badge>
              ))}
            </div>
          </div>

          <Separator style={{ marginBottom: '1.5rem' }} />

          {/* Dimensions */}
          <div style={{ marginBottom: '1.5rem' }}>
            <SectionLabel>Dimensions</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {(Object.keys(SCORE_LABELS) as (keyof ScoreVector)[]).map(key => {
                const [low, high] = SCORE_LABELS[key]
                const current = filters.sliders[key] ?? 0
                return (
                  <div key={key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.68rem', color: 'var(--muted-foreground)' }}>{low}</span>
                      <span className={cn('text-[0.68rem]', current > 0 ? 'text-foreground' : 'text-muted-foreground')}>
                        {high}
                        {current > 0 && (
                          <span style={{ marginLeft: '0.25rem', color: 'var(--muted-foreground)' }}>
                            ≥{Math.round(current * 100)}%
                          </span>
                        )}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <Slider
                        value={[current]}
                        min={0} max={1} step={0.05}
                        onValueChange={vals => setSlider(key, val0(vals) === 0 ? undefined : val0(vals))}
                        className="flex-1"
                      />
                      {current > 0 && (
                        <button
                          onClick={() => setSlider(key, undefined)}
                          className="text-[0.6rem] text-muted-foreground hover:text-foreground bg-transparent border-none cursor-pointer p-0 leading-none"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <Separator style={{ marginBottom: '1.5rem' }} />

          {/* Rating */}
          <div>
            <SectionLabel>Min Rating</SectionLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Slider
                value={[filters.rating]}
                min={0} max={5} step={0.5}
                onValueChange={vals => onChange({ ...filters, rating: val0(vals) })}
                className="flex-1"
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--muted-foreground)', width: '2rem', flexShrink: 0, textAlign: 'right' }}>
                {filters.rating > 0 ? `${filters.rating}+` : '—'}
              </span>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
