import type { Perfume, ScoreVector } from '../types'
import { getCataloguePercentiles } from '../lib/similarity'

// ── Derived labels ────────────────────────────────────────────────────────

function sentimentLabel(s: number): { label: string; sub: string } {
  if (s >= 0.85) return { label: 'universally adored',   sub: 'near-universal praise' }
  if (s >= 0.75) return { label: 'widely loved',         sub: 'strong community approval' }
  if (s >= 0.65) return { label: 'well regarded',        sub: 'broadly positive reception' }
  if (s >= 0.55) return { label: 'mixed reception',      sub: 'love it or leave it' }
  return           { label: 'polarizing',                 sub: 'deeply divisive fragrance' }
}

function popularityLabel(n: number): { label: string; sub: string } {
  if (n >= 15000) return { label: 'mainstream icon',  sub: 'one of the most reviewed' }
  if (n >= 5000)  return { label: 'widely known',     sub: 'strong cultural footprint' }
  if (n >= 1000)  return { label: 'niche favourite',  sub: 'loyal following' }
  return           { label: 'hidden gem',              sub: 'under the radar' }
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`
  return String(n)
}

const DIM_NAMES: Record<keyof ScoreVector, string> = {
  authenticity: 'natural',
  projection: 'projecting',
  longevity: 'long-lasting',
  complexity: 'complex',
  versatility: 'versatile',
}

// ── Stars ─────────────────────────────────────────────────────────────────

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = rating - i
        const pct = Math.max(0, Math.min(1, filled)) * 100
        return (
          <svg key={i} width={14} height={14} viewBox="0 0 14 14">
            <defs>
              <linearGradient id={`star-${i}`} x1="0" x2="1" y1="0" y2="0">
                <stop offset={`${pct}%`} stopColor="var(--foreground)" />
                <stop offset={`${pct}%`} stopColor="var(--border)" />
              </linearGradient>
            </defs>
            <polygon
              points="7,1 8.8,5.4 13.6,5.7 10,8.9 11.1,13.6 7,11 2.9,13.6 4,8.9 0.4,5.7 5.2,5.4"
              fill={`url(#star-${i})`}
            />
          </svg>
        )
      })}
    </div>
  )
}

// ── Block wrapper ─────────────────────────────────────────────────────────

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: '4px',
      padding: '1.25rem 1.4rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    }}>
      <span style={{ fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>
        {label}
      </span>
      {children}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────

type Props = { perfume: Perfume; all: Perfume[] }

export function CommunitySignal({ perfume, all }: Props) {
  const { ratingAvg, reviewCount, sentiment = 0.72 } = perfume.review
  const sent = sentimentLabel(sentiment)
  const pop = popularityLabel(reviewCount)
  const percentiles = getCataloguePercentiles(perfume, all).slice(0, 3)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>

      {/* Block A — Score */}
      <Block label="Fragrantica rating">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontSize: '2.2rem', fontWeight: 400, lineHeight: 1, letterSpacing: '-0.02em' }}>
            {ratingAvg.toFixed(1)}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>/5</span>
        </div>
        <Stars rating={ratingAvg} />
        <span style={{ fontSize: '0.68rem', color: 'var(--muted-foreground)', marginTop: '0.1rem' }}>
          {formatCount(reviewCount)} reviews
        </span>
      </Block>

      {/* Block B — Sentiment */}
      <Block label="Community sentiment">
        <span style={{ fontSize: '1rem', letterSpacing: '-0.01em' }}>{sent.label}</span>
        <span style={{ fontSize: '0.72rem', color: 'var(--muted-foreground)', fontStyle: 'italic' }}>
          {sent.sub}
        </span>
        <div style={{ marginTop: '0.25rem', height: '3px', background: 'var(--border)', borderRadius: '2px', position: 'relative' }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, height: '100%',
            width: `${sentiment * 100}%`,
            background: 'var(--foreground)',
            borderRadius: '2px',
          }} />
        </div>
      </Block>

      {/* Block C — Popularity */}
      <Block label="Cultural footprint">
        <span style={{ fontSize: '1rem', letterSpacing: '-0.01em' }}>{pop.label}</span>
        <span style={{ fontSize: '0.72rem', color: 'var(--muted-foreground)', fontStyle: 'italic' }}>
          {pop.sub}
        </span>
        <span style={{ fontSize: '0.65rem', color: 'var(--muted-foreground)', marginTop: '0.15rem' }}>
          {reviewCount.toLocaleString()} people weighed in
        </span>
      </Block>

      {/* Block D — Catalogue percentiles */}
      <Block label="Stands out for">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {percentiles.map(({ dimension, percentile }) => (
            <div key={dimension} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '0.72rem' }}>
                  more {DIM_NAMES[dimension]}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--muted-foreground)' }}>
                  top {100 - percentile}%
                </span>
              </div>
              <div style={{ height: '2px', background: 'var(--border)', borderRadius: '1px', position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: 0, top: 0, height: '100%',
                  width: `${percentile}%`,
                  background: 'var(--foreground)',
                  borderRadius: '1px',
                }} />
              </div>
            </div>
          ))}
        </div>
      </Block>

    </div>
  )
}
