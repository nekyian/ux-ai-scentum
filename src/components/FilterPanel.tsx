'use client'

import React from 'react'
import type { FilterState, ScoreVector } from '../types'
import { countActiveFilters } from '../lib/filter'
import { Slider } from './ui/slider'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { ScrollArea } from './ui/scroll-area'
import { cn } from '@/lib/utils'

const val0 = (v: number | readonly number[]): number =>
  Array.isArray(v) ? (v as readonly number[])[0] : (v as number)

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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.62rem] uppercase tracking-[0.1em] text-muted-foreground mb-2.5 mt-0">
      {children}
    </p>
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
    <div className="mb-4">
      <div className="flex justify-between mb-2">
        <span className="text-[0.68rem] text-muted-foreground">{low}</span>
        <span className={cn('text-[0.68rem]', current > 0 ? 'text-foreground' : 'text-muted-foreground')}>
          {high}
          {current > 0 && (
            <span className="ml-1 text-muted-foreground">≥{Math.round(current * 100)}%</span>
          )}
        </span>
      </div>
      <div className="flex gap-2 items-center">
        <Slider
          value={[current]}
          min={0}
          max={1}
          step={0.05}
          onValueChange={(vals) => onChange(val0(vals) === 0 ? undefined : val0(vals))}
          className="flex-1"
        />
        {current > 0 && (
          <button
            onClick={() => onChange(undefined)}
            className="text-[0.6rem] text-muted-foreground hover:text-foreground transition-colors leading-none p-0 bg-transparent border-none cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
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
        <div className="flex justify-end gap-3 pr-0.5">
          {activeCount > 0 && (
            <Button variant="ghost" size="sm" onClick={reset} className="h-auto py-0.5 px-1.5 text-[0.62rem]">
              clear
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onToggleFloat} className="h-auto py-0.5 px-1.5 text-[0.62rem]">
            dock
          </Button>
        </div>

        {/* 3 columns */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minHeight: 0 }}>

          {/* Vibe */}
          <div style={floatColumnStyle}>
            <p className="text-[0.58rem] uppercase tracking-[0.12em] text-muted-foreground mb-2.5 mt-0">Vibe</p>
            <div className="flex flex-col gap-1">
              {allTags.map(t => (
                <Badge
                  key={t}
                  variant={filters.tags.includes(t) ? 'default' : 'outline'}
                  render={<button />}
                  onClick={() => toggleTag(t)}
                  className="cursor-pointer justify-start text-[0.62rem] h-auto py-1 px-2 rounded-sm w-full"
                >
                  {t}
                </Badge>
              ))}
            </div>
          </div>

          {/* Accord */}
          <div style={floatColumnStyle}>
            <p className="text-[0.58rem] uppercase tracking-[0.12em] text-muted-foreground mb-2.5 mt-0">Accord</p>
            <div className="flex flex-col gap-1">
              {allAccords.map(a => (
                <Badge
                  key={a}
                  variant={filters.accords.includes(a) ? 'default' : 'outline'}
                  render={<button />}
                  onClick={() => toggleAccord(a)}
                  className="cursor-pointer justify-start text-[0.62rem] h-auto py-1 px-2 rounded-sm w-full"
                >
                  {a}
                </Badge>
              ))}
            </div>
          </div>

          {/* Dimensions + Rating */}
          <div style={floatColumnStyle}>
            <p className="text-[0.58rem] uppercase tracking-[0.12em] text-muted-foreground mb-2.5 mt-0">Dim.</p>
            <div className="flex flex-col gap-3.5">
              {(Object.keys(SCORE_SLIDER_LABELS) as (keyof ScoreVector)[]).map(key => {
                const [, high] = SCORE_SLIDER_LABELS[key]
                const current = filters.sliders[key] ?? 0
                return (
                  <div key={key}>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className={cn('text-[0.58rem] tracking-[0.02em]', current > 0 ? 'text-foreground' : 'text-muted-foreground')}>
                        {high}
                      </span>
                      {current > 0 && (
                        <button
                          onClick={() => setSlider(key, undefined)}
                          className="text-[0.55rem] text-muted-foreground hover:text-foreground bg-transparent border-none cursor-pointer p-0 leading-none"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <Slider
                      value={[current]}
                      min={0}
                      max={1}
                      step={0.05}
                      onValueChange={(vals) => setSlider(key, val0(vals) === 0 ? undefined : val0(vals))}
                    />
                    {current > 0 && (
                      <span className="text-[0.55rem] text-muted-foreground">≥{Math.round(current * 100)}%</span>
                    )}
                  </div>
                )
              })}

              {/* Rating */}
              <div className="pt-3 border-t border-border/50">
                <span className="text-[0.58rem] text-muted-foreground tracking-[0.02em]">Rating</span>
                <Slider
                  value={[filters.rating]}
                  min={0}
                  max={5}
                  step={0.5}
                  onValueChange={(vals) => onChange({ ...filters, rating: val0(vals) })}
                  className="mt-1"
                />
                {filters.rating > 0 && (
                  <span className="text-[0.55rem] text-muted-foreground">{filters.rating}+</span>
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
      className="catalog-sidebar"
      style={{
        width: '220px',
        flexShrink: 0,
        borderRight: '1px solid var(--border)',
        position: 'sticky',
        top: '52px',
        height: 'calc(100vh - 52px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ScrollArea className="flex-1">
        <div className="px-5 py-6">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-[0.72rem] tracking-[0.08em] uppercase">
              Filter
              {activeCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center bg-foreground text-background rounded-full w-4 h-4 text-[0.6rem]">
                  {activeCount}
                </span>
              )}
            </span>
            <div className="flex gap-2 items-center">
              {activeCount > 0 && (
                <Button variant="ghost" size="sm" onClick={reset} className="h-auto py-0.5 px-1.5 text-[0.62rem] text-muted-foreground">
                  clear
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onToggleFloat} className="h-auto py-0.5 px-1.5 text-[0.62rem] text-muted-foreground">
                float
              </Button>
            </div>
          </div>

          {/* Vibe / Tags */}
          <div className="mb-6">
            <SectionLabel>Vibe</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map(t => (
                <Badge
                  key={t}
                  variant={filters.tags.includes(t) ? 'default' : 'outline'}
                  render={<button />}
                  onClick={() => toggleTag(t)}
                  className="cursor-pointer text-[0.68rem] h-auto py-1 px-2.5 rounded-sm"
                >
                  {t}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Accords */}
          <div className="mb-6">
            <SectionLabel>Accord</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {allAccords.map(a => (
                <Badge
                  key={a}
                  variant={filters.accords.includes(a) ? 'default' : 'outline'}
                  render={<button />}
                  onClick={() => toggleAccord(a)}
                  className="cursor-pointer text-[0.68rem] h-auto py-1 px-2.5 rounded-sm"
                >
                  {a}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Dimensions */}
          <div className="mb-6">
            <SectionLabel>Dimensions</SectionLabel>
            {(Object.keys(SCORE_SLIDER_LABELS) as (keyof ScoreVector)[]).map(key => (
              <SliderRow
                key={key}
                dimension={key}
                value={filters.sliders[key]}
                onChange={v => setSlider(key, v)}
              />
            ))}
          </div>

          <Separator className="mb-6" />

          {/* Rating */}
          <div>
            <SectionLabel>Min Rating</SectionLabel>
            <div className="flex items-center gap-2">
              <Slider
                value={[filters.rating]}
                min={0}
                max={5}
                step={0.5}
                onValueChange={(vals) => onChange({ ...filters, rating: val0(vals) })}
                className="flex-1"
              />
              <span className="text-[0.72rem] text-muted-foreground w-8 shrink-0">
                {filters.rating > 0 ? `${filters.rating}+` : '—'}
              </span>
            </div>
          </div>

        </div>
      </ScrollArea>
    </aside>
  )
}
