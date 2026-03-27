'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Perfume } from '../types'
import { ScoreBarInline } from './ScoreBadges'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'

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
      <Card
        className={cn(
          'gap-0 rounded-sm py-0 transition-all duration-200 cursor-pointer',
          hovered
            ? 'ring-foreground/30 shadow-md'
            : 'ring-foreground/10 shadow-none'
        )}
      >
        {/* Image */}
        <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: 'var(--chip-bg)', borderRadius: '2px 2px 0 0' }}>
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
        <CardContent className="pt-3.5 pb-4 px-4">
          {/* Brand + Name */}
          <div className="mb-2">
            <p className="text-[0.68rem] text-muted-foreground tracking-[0.08em] uppercase mb-0.5">
              {perfume.brand}
            </p>
            <h3 className="text-[0.95rem] font-normal m-0 leading-snug">
              {perfume.name}
            </h3>
          </div>

          {/* Accords */}
          <div className="flex flex-wrap gap-1 mb-2.5">
            {perfume.accords.slice(0, 3).map(a => (
              <Badge key={a} variant="secondary" className="text-[0.65rem] h-auto py-0.5 px-2 rounded-sm font-normal">
                {a}
              </Badge>
            ))}
          </div>

          {/* Score bars */}
          <ScoreBarInline scores={perfume.scores} limit={3} />

          {/* Hover interpretive line */}
          <p
            className={cn(
              'mt-2.5 text-[0.72rem] text-muted-foreground italic transition-all duration-200',
              hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
            )}
          >
            &ldquo;{interpretiveSentence(perfume)}&rdquo;
          </p>

          {/* Tags + Price */}
          <div className="flex justify-between items-end mt-3">
            <div className="flex gap-1 flex-wrap">
              {perfume.tags.slice(0, 2).map(t => (
                <Badge
                  key={t}
                  variant="outline"
                  className="text-[0.6rem] h-auto py-0.5 px-2 rounded-sm font-normal border-accent-light text-accent"
                >
                  {t}
                </Badge>
              ))}
            </div>
            {perfume.price && (
              <span className="text-[0.78rem] text-muted-foreground">
                ${perfume.price}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
