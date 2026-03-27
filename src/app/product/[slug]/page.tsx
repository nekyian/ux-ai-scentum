import { notFound } from 'next/navigation'
import Link from 'next/link'
import { perfumes } from '@/data/perfumes'
import { getSimilar } from '@/lib/similarity'
import { ScoreRadar } from '@/components/ScoreRadar'
import { NoteCloud } from '@/components/NoteCloud'
import { CommunitySignal } from '@/components/CommunitySignal'
import { ProductCard } from '@/components/ProductCard'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { ScoreVector } from '@/types'

// Catalogue average scores — computed once at module level
const avgScores: ScoreVector = (() => {
  const keys = ['authenticity', 'projection', 'longevity', 'complexity', 'versatility'] as (keyof ScoreVector)[]
  const result = {} as ScoreVector
  for (const k of keys) {
    result[k] = perfumes.reduce((s, p) => s + p.scores[k], 0) / perfumes.length
  }
  return result
})()

export function generateStaticParams() {
  return perfumes.map(p => ({ slug: p.slug }))
}

type Props = { params: Promise<{ slug: string }> }

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const perfume = perfumes.find(p => p.slug === slug)
  if (!perfume) notFound()

  const similar = getSimilar(perfume, perfumes, 6)

  return (
    <div style={{ minHeight: 'calc(100vh - 52px)', background: 'var(--background)' }}>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '380px 1fr',
        minHeight: '72vh',
        borderBottom: '1px solid var(--border)',
      }}>

        {/* Image column */}
        <div style={{
          position: 'sticky',
          top: '52px',
          height: 'calc(100vh - 52px)',
          background: 'var(--chip-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
          <img
            src={perfume.imageUrls[0]}
            alt={`${perfume.brand} ${perfume.name}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'center',
              padding: '2rem',
            }}
          />
        </div>

        {/* Info column */}
        <div style={{ padding: '3rem 3.5rem 3rem 3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Back */}
          <Link
            href="/"
            style={{ fontSize: '0.72rem', color: 'var(--muted-foreground)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', letterSpacing: '0.04em' }}
          >
            ← all perfumes
          </Link>

          {/* Brand + name */}
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--muted-foreground)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              {perfume.brand}
            </p>
            <h1 style={{ fontSize: '2rem', fontWeight: 400, margin: 0, lineHeight: 1.15, letterSpacing: '-0.01em' }}>
              {perfume.name}
            </h1>
          </div>

          {/* Description */}
          <p style={{ fontSize: '1rem', fontStyle: 'italic', color: 'var(--muted-foreground)', margin: 0, lineHeight: 1.6, maxWidth: '36rem' }}>
            &ldquo;{perfume.description}&rdquo;
          </p>

          {/* Tags + accords */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {perfume.tags.map(t => (
              <Badge key={t} variant="default" className="text-xs h-auto py-1 px-3 rounded-sm font-normal">
                {t}
              </Badge>
            ))}
            {perfume.accords.map(a => (
              <Badge key={a} variant="outline" className="text-xs h-auto py-1 px-3 rounded-sm font-normal">
                {a}
              </Badge>
            ))}
          </div>

          <Separator />

          {/* Score bars — all 5 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(Object.keys(perfume.scores) as (keyof ScoreVector)[]).map(key => {
              const pct = Math.round(perfume.scores[key] * 100)
              const avgPct = Math.round(avgScores[key] * 100)
              return (
                <div key={key} style={{ display: 'grid', gridTemplateColumns: '5.5rem 1fr 2.5rem', gap: '0.75rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {key}
                  </span>
                  <div style={{ position: 'relative', height: '3px', background: 'var(--border)', borderRadius: '2px' }}>
                    {/* avg marker */}
                    <div style={{
                      position: 'absolute', top: '-3px', width: '1px', height: '9px',
                      background: 'var(--muted-foreground)', opacity: 0.35,
                      left: `${avgPct}%`,
                    }} />
                    <div style={{
                      position: 'absolute', left: 0, top: 0, height: '100%',
                      width: `${pct}%`,
                      background: 'var(--foreground)',
                      borderRadius: '2px',
                    }} />
                  </div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--muted-foreground)', textAlign: 'right' }}>
                    {pct}%
                  </span>
                </div>
              )
            })}
            <p style={{ fontSize: '0.62rem', color: 'var(--muted-foreground)', margin: '0.25rem 0 0', opacity: 0.65 }}>
              grey tick = catalogue average
            </p>
          </div>

          <Separator />

          {/* Price + provenance */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            {perfume.price && (
              <div>
                <p style={{ fontSize: '0.58rem', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>Price</p>
                <p style={{ fontSize: '1.35rem', fontWeight: 400, margin: 0 }}>${perfume.price}</p>
              </div>
            )}
            {perfume.geo?.perfumer && (
              <div>
                <p style={{ fontSize: '0.58rem', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>Perfumer</p>
                <p style={{ fontSize: '0.88rem', margin: 0 }}>{perfume.geo.perfumer}</p>
              </div>
            )}
            {perfume.geo?.country && (
              <div>
                <p style={{ fontSize: '0.58rem', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>Origin</p>
                <p style={{ fontSize: '0.88rem', margin: 0 }}>{perfume.geo.country}</p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── Content sections ──────────────────────────────────────────── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 3rem' }}>

        {/* 3-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '3rem', alignItems: 'start', marginBottom: '4rem' }}>

          {/* Dimensions radar */}
          <section>
            <SectionTitle>Dimensions</SectionTitle>
            <ScoreRadar scores={perfume.scores} avgScores={avgScores} />
          </section>

          {/* Note DNA */}
          <section>
            <SectionTitle>Note DNA</SectionTitle>
            <NoteCloud notes={perfume.notes} />
            <p style={{ marginTop: '1.25rem', fontSize: '0.65rem', color: 'var(--muted-foreground)', fontStyle: 'italic', lineHeight: 1.5 }}>
              Larger = more prominent. Hover for descriptor. Order reflects typical prominence in the fragrance.
            </p>
          </section>

          {/* Community signal */}
          <section>
            <SectionTitle>Community Signal</SectionTitle>
            <CommunitySignal perfume={perfume} all={perfumes} />
          </section>

        </div>

        <Separator style={{ marginBottom: '3.5rem' }} />

        {/* Similar vibes */}
        <section>
          <SectionTitle>if you like this, try —</SectionTitle>
          <ScrollArea className="w-full">
            <div style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem' }}>
              {similar.map(p => (
                <div key={p.id} style={{ width: '200px', flexShrink: 0 }}>
                  <ProductCard perfume={p} />
                </div>
              ))}
            </div>
          </ScrollArea>
        </section>

      </div>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: '0.62rem',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--muted-foreground)',
      marginBottom: '1.5rem',
      marginTop: 0,
    }}>
      {children}
    </p>
  )
}
