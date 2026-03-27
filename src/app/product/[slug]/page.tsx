import { notFound } from 'next/navigation'
import Link from 'next/link'
import { perfumes } from '@/data/perfumes'
import { getSimilar } from '@/lib/similarity'
import { ScoreRadar } from '@/components/ScoreRadar'
import { NoteCloud } from '@/components/NoteCloud'
import { CommunitySignal } from '@/components/CommunitySignal'
import { ProductCard } from '@/components/ProductCard'
import { Badge } from '@/components/ui/badge'
import type { ScoreVector } from '@/types'

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
    // Tailwind responsive grid: single col mobile → 2-col desktop
    <div className="grid md:grid-cols-[300px_1fr] min-h-[calc(100vh-52px)]">

      {/* ── Sticky image — desktop only ───────────────────────────────── */}
      <div className="hidden md:flex sticky top-[52px] h-[calc(100vh-52px)] items-center justify-center overflow-hidden border-r border-border"
        style={{ background: 'var(--chip-bg)' }}>
        <img
          src={perfume.imageUrls[0]}
          alt={`${perfume.brand} ${perfume.name}`}
          className="w-full h-full object-contain p-10"
        />
      </div>

      {/* ── Content column ────────────────────────────────────────────── */}
      <div className="min-w-0">

        {/* Mobile hero image */}
        <div className="flex md:hidden items-center justify-center h-[300px] border-b border-border overflow-hidden relative"
          style={{ background: 'var(--chip-bg)' }}>
          <img
            src={perfume.imageUrls[0]}
            alt={`${perfume.brand} ${perfume.name}`}
            className="h-full w-auto max-w-[80%] object-contain p-4"
          />
        </div>

        {/* Identity block */}
        <div className="px-4 py-5 md:px-10 md:py-8 border-b border-border">

          <Link
            href="/"
            className="text-[0.75rem] text-muted-foreground no-underline tracking-wide inline-flex items-center py-2 -ml-0.5 mb-4"
          >
            ← all perfumes
          </Link>

          {/* Brand + name */}
          <p className="text-[0.68rem] text-muted-foreground tracking-[0.12em] uppercase mb-1">
            {perfume.brand}
          </p>
          <h1 className="text-[1.4rem] md:text-[1.75rem] font-normal mb-3 leading-tight tracking-tight">
            {perfume.name}
          </h1>
          <p className="text-[0.9rem] italic text-muted-foreground mb-5 leading-relaxed">
            &ldquo;{perfume.description}&rdquo;
          </p>

          {/* Tags + accords */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {perfume.tags.map(t => (
              <Badge key={t} variant="default" className="text-[0.68rem] h-auto py-0.5 px-2.5 rounded-sm font-normal">
                {t}
              </Badge>
            ))}
            {perfume.accords.map(a => (
              <Badge key={a} variant="outline" className="text-[0.68rem] h-auto py-0.5 px-2.5 rounded-sm font-normal">
                {a}
              </Badge>
            ))}
          </div>

          {/* Score bars */}
          <div className="flex flex-col gap-2.5 mb-6">
            {(Object.keys(perfume.scores) as (keyof ScoreVector)[]).map(key => {
              const pct = Math.round(perfume.scores[key] * 100)
              const avgPct = Math.round(avgScores[key] * 100)
              return (
                <div key={key} className="grid gap-2 items-center" style={{ gridTemplateColumns: '5.5rem 1fr 2.5rem' }}>
                  <span className="text-[0.62rem] text-muted-foreground uppercase tracking-wider">
                    {key}
                  </span>
                  <div className="relative h-0.5 rounded-sm" style={{ background: 'var(--border)' }}>
                    <div className="absolute top-[-3px] w-px h-2 opacity-30" style={{ background: 'var(--muted-foreground)', left: `${avgPct}%` }} />
                    <div className="absolute left-0 top-0 h-full rounded-sm" style={{ width: `${pct}%`, background: 'var(--foreground)' }} />
                  </div>
                  <span className="text-[0.62rem] text-muted-foreground text-right">{pct}%</span>
                </div>
              )
            })}
            <p className="text-[0.58rem] text-muted-foreground opacity-55 mt-0.5">
              grey tick = catalogue average
            </p>
          </div>

          {/* Price + provenance */}
          <div className="flex gap-8 flex-wrap">
            {perfume.price && (
              <div>
                <p className="text-[0.55rem] text-muted-foreground uppercase tracking-widest mb-0.5">Price</p>
                <p className="text-lg font-normal m-0">${perfume.price}</p>
              </div>
            )}
            {perfume.geo?.perfumer && (
              <div>
                <p className="text-[0.55rem] text-muted-foreground uppercase tracking-widest mb-0.5">Perfumer</p>
                <p className="text-[0.82rem] m-0">{perfume.geo.perfumer}</p>
              </div>
            )}
            {perfume.geo?.country && (
              <div>
                <p className="text-[0.55rem] text-muted-foreground uppercase tracking-widest mb-0.5">Origin</p>
                <p className="text-[0.82rem] m-0">{perfume.geo.country}</p>
              </div>
            )}
          </div>

        </div>

        {/* ── Detail grid: 1-col mobile → 3-col desktop ─────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-border">

          <section className="p-6 md:p-7 border-b md:border-b-0 md:border-r border-border">
            <SectionTitle>Dimensions</SectionTitle>
            <ScoreRadar scores={perfume.scores} avgScores={avgScores} />
          </section>

          <section className="p-6 md:p-7 border-b md:border-b-0 md:border-r border-border">
            <SectionTitle>Note DNA</SectionTitle>
            <NoteCloud notes={perfume.notes} />
            <p className="mt-4 text-[0.6rem] text-muted-foreground italic leading-relaxed">
              Larger = more prominent · hover for descriptor
            </p>
          </section>

          <section className="p-6 md:p-7">
            <SectionTitle>Community Signal</SectionTitle>
            <CommunitySignal perfume={perfume} all={perfumes} />
          </section>

        </div>

        {/* ── Similar vibes ─────────────────────────────────────────── */}
        <div className="p-6 md:p-7 pb-12">
          <SectionTitle>if you like this, try —</SectionTitle>
          <div className="product-similar-scroll">
            <div className="flex gap-3">
              {similar.map(p => (
                <div key={p.id} className="similar-card">
                  <ProductCard perfume={p} />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.58rem] tracking-[0.12em] uppercase text-muted-foreground mb-5 mt-0">
      {children}
    </p>
  )
}
