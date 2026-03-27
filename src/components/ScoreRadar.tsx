import type { ScoreVector } from '../types'

const DIMS: { key: keyof ScoreVector; low: string; high: string }[] = [
  { key: 'authenticity', low: 'Synthetic', high: 'Natural' },
  { key: 'projection',   low: 'Intimate',  high: 'Projecting' },
  { key: 'longevity',    low: 'Fleeting',  high: 'Lasting' },
  { key: 'complexity',   low: 'Simple',    high: 'Complex' },
  { key: 'versatility',  low: 'Singular',  high: 'Versatile' },
]

const SIZE = 260
const CX = SIZE / 2
const CY = SIZE / 2
const R = 90
const LABEL_R = R + 28

function polarToXY(angle: number, r: number) {
  return {
    x: CX + r * Math.cos(angle),
    y: CY + r * Math.sin(angle),
  }
}

// Pentagon vertices — top vertex offset so "Natural" is at the top
function axisAngle(i: number) {
  return (Math.PI * 2 * i) / DIMS.length - Math.PI / 2
}

function scorePolygon(scores: ScoreVector, scale = 1): string {
  return DIMS.map((d, i) => {
    const { x, y } = polarToXY(axisAngle(i), scores[d.key] * R * scale)
    return `${x},${y}`
  }).join(' ')
}

function gridPolygon(fraction: number): string {
  return DIMS.map((_, i) => {
    const { x, y } = polarToXY(axisAngle(i), R * fraction)
    return `${x},${y}`
  }).join(' ')
}

type Props = {
  scores: ScoreVector
  avgScores?: ScoreVector
}

export function ScoreRadar({ scores, avgScores }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
      <svg
        width="100%"
        height="auto"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ overflow: 'hidden', maxWidth: SIZE }}
      >
        {/* Grid rings */}
        {[0.25, 0.5, 0.75, 1].map(f => (
          <polygon
            key={f}
            points={gridPolygon(f)}
            fill="none"
            stroke="var(--border)"
            strokeWidth={f === 1 ? 1.5 : 1}
            opacity={f === 1 ? 0.6 : 0.35}
          />
        ))}

        {/* Axis spokes */}
        {DIMS.map((_, i) => {
          const outer = polarToXY(axisAngle(i), R)
          return (
            <line
              key={i}
              x1={CX} y1={CY}
              x2={outer.x} y2={outer.y}
              stroke="var(--border)"
              strokeWidth={1}
              opacity={0.4}
            />
          )
        })}

        {/* Catalogue average polygon */}
        {avgScores && (
          <polygon
            points={scorePolygon(avgScores)}
            fill="var(--muted-foreground)"
            fillOpacity={0.08}
            stroke="var(--muted-foreground)"
            strokeWidth={1}
            strokeDasharray="3 3"
            opacity={0.5}
          />
        )}

        {/* Score polygon */}
        <polygon
          points={scorePolygon(scores)}
          fill="var(--foreground)"
          fillOpacity={0.1}
          stroke="var(--foreground)"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />

        {/* Score dots */}
        {DIMS.map((d, i) => {
          const { x, y } = polarToXY(axisAngle(i), scores[d.key] * R)
          return (
            <circle
              key={d.key}
              cx={x} cy={y} r={3.5}
              fill="var(--foreground)"
            />
          )
        })}

        {/* Axis labels */}
        {DIMS.map((d, i) => {
          const angle = axisAngle(i)
          const { x, y } = polarToXY(angle, LABEL_R)
          const anchor =
            Math.abs(Math.cos(angle)) < 0.15 ? 'middle'
            : Math.cos(angle) > 0 ? 'start'
            : 'end'
          const dy = Math.sin(angle) > 0.3 ? '1em' : Math.sin(angle) < -0.3 ? '-0.2em' : '0.35em'
          return (
            <text
              key={d.key}
              x={x} y={y}
              textAnchor={anchor}
              dy={dy}
              fontSize={10}
              fill="var(--foreground)"
              fontFamily="inherit"
              letterSpacing="0.04em"
            >
              {d.high.toUpperCase()}
            </text>
          )
        })}
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.68rem', color: 'var(--muted-foreground)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <svg width={20} height={8}>
            <line x1={0} y1={4} x2={20} y2={4} stroke="var(--foreground)" strokeWidth={1.5} />
          </svg>
          this perfume
        </span>
        {avgScores && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <svg width={20} height={8}>
              <line x1={0} y1={4} x2={20} y2={4} stroke="var(--muted-foreground)" strokeWidth={1} strokeDasharray="3 3" />
            </svg>
            catalogue avg
          </span>
        )}
      </div>

      {/* Dimension detail rows */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {DIMS.map(d => {
          const v = scores[d.key]
          const pct = Math.round(v * 100)
          const interpretation = interpretDimension(d.key, v)
          return (
            <div key={d.key} style={{ display: 'grid', gridTemplateColumns: '6rem 1fr auto', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {d.high}
              </span>
              <div style={{ position: 'relative', height: '3px', background: 'var(--border)', borderRadius: '2px' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${pct}%`, background: 'var(--foreground)', borderRadius: '2px', transition: 'width 0.4s ease' }} />
              </div>
              <span style={{ fontSize: '0.65rem', color: 'var(--muted-foreground)', whiteSpace: 'nowrap', minWidth: '2.5rem', textAlign: 'right' }}>
                {interpretation}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function interpretDimension(key: keyof ScoreVector, v: number): string {
  if (key === 'authenticity') return v > 0.75 ? 'natural' : v > 0.55 ? 'semi-natural' : 'synthetic'
  if (key === 'projection')   return v > 0.72 ? 'loud' : v > 0.48 ? 'moderate' : 'skin-close'
  if (key === 'longevity')    return v > 0.78 ? 'all-day' : v > 0.55 ? 'several hours' : 'fleeting'
  if (key === 'complexity')   return v > 0.72 ? 'layered' : v > 0.48 ? 'balanced' : 'linear'
  if (key === 'versatility')  return v > 0.72 ? 'any occasion' : v > 0.48 ? 'most occasions' : 'signature'
  return ''
}
