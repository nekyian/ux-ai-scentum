'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Perfume } from '../types'
import { ScoreBarInline } from './ScoreBadges'

function interpretiveSentence(p: Perfume): string {
  const projection = p.scores.projection > 0.65 ? 'projecting' : p.scores.projection < 0.4 ? 'intimate' : 'balanced'
  const authenticity = p.scores.authenticity > 0.7 ? 'natural' : 'synthetic-leaning'
  const topAccord = p.accords[0] ?? ''
  return `${topAccord}, ${authenticity}, ${projection}`
}

type Props = { perfume: Perfume }

export function ProductCard({ perfume }: Props) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={`/product/${perfume.slug}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <article
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '2px',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          borderColor: hovered ? 'var(--muted-foreground)' : 'var(--border)',
          boxShadow: hovered ? '0 2px 12px rgba(0,0,0,0.06)' : 'none',
        }}
      >
        {/* Image */}
        <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: 'var(--chip-bg)' }}>
          <img
            src={perfume.imageUrls[0]}
            alt={`${perfume.brand} ${perfume.name}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              display: 'block',
              transition: 'transform 0.4s ease',
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
            }}
          />
        </div>

        {/* Body */}
        <div style={{ padding: '0.9rem 1rem 1rem' }}>
          {/* Brand + Name */}
          <div style={{ marginBottom: '0.5rem' }}>
            <p style={{ fontSize: '0.68rem', color: 'var(--muted-foreground)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.15rem' }}>
              {perfume.brand}
            </p>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 400, margin: 0, lineHeight: 1.3 }}>
              {perfume.name}
            </h3>
          </div>

          {/* Accords */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.7rem' }}>
            {perfume.accords.slice(0, 3).map(a => (
              <span
                key={a}
                style={{
                  fontSize: '0.65rem',
                  color: 'var(--muted-foreground)',
                  background: 'var(--chip-bg)',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '1px',
                  letterSpacing: '0.04em',
                }}
              >
                {a}
              </span>
            ))}
          </div>

          {/* Score bars */}
          <ScoreBarInline scores={perfume.scores} limit={3} />

          {/* Hover interpretive line */}
          <div
            style={{
              marginTop: '0.65rem',
              fontSize: '0.72rem',
              color: 'var(--muted-foreground)',
              fontStyle: 'italic',
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'translateY(0)' : 'translateY(4px)',
              transition: 'opacity 0.2s ease, transform 0.2s ease',
            }}
          >
            &ldquo;{interpretiveSentence(perfume)}&rdquo;
          </div>

          {/* Tags + Price */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
              {perfume.tags.slice(0, 2).map(t => (
                <span
                  key={t}
                  style={{
                    fontSize: '0.6rem',
                    color: 'var(--accent)',
                    border: '1px solid var(--accent-light)',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '1px',
                    letterSpacing: '0.04em',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
            {perfume.price && (
              <span style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)' }}>
                ${perfume.price}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
