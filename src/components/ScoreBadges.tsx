'use client'

import type { ScoreVector } from '../types'

const SCORE_LABELS: Record<keyof ScoreVector, [string, string]> = {
  authenticity: ['synthetic', 'natural'],
  projection: ['intimate', 'projecting'],
  longevity: ['fleeting', 'lasting'],
  complexity: ['simple', 'complex'],
  versatility: ['singular', 'versatile'],
}

function ScoreBar({ value, label }: { value: number; label: string }) {
  const filled = Math.round(value * 5)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.72rem' }}>
      <span style={{ color: 'var(--text-muted)', width: '5.5rem', flexShrink: 0 }}>{label}</span>
      <div style={{ display: 'flex', gap: '2px' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: i < filled ? 'var(--text)' : 'var(--border)',
              transition: 'background 0.2s ease',
            }}
          />
        ))}
      </div>
    </div>
  )
}

type Props = {
  scores: ScoreVector
  keys?: (keyof ScoreVector)[]
}

export function ScoreBadges({ scores, keys }: Props) {
  const dimensions = keys ?? (Object.keys(scores) as (keyof ScoreVector)[])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      {dimensions.map(key => (
        <ScoreBar
          key={key}
          value={scores[key]}
          label={SCORE_LABELS[key][1]}
        />
      ))}
    </div>
  )
}

export function ScoreBarInline({
  scores,
  limit = 3,
}: {
  scores: ScoreVector
  limit?: number
}) {
  const top = (Object.keys(scores) as (keyof ScoreVector)[])
    .sort((a, b) => scores[b] - scores[a])
    .slice(0, limit)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
      {top.map(key => (
        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', width: '4.8rem', flexShrink: 0 }}>
            {SCORE_LABELS[key][1]}
          </span>
          <div
            style={{
              height: '2px',
              width: `${scores[key] * 40}px`,
              background: 'var(--text)',
              borderRadius: '1px',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      ))}
    </div>
  )
}
