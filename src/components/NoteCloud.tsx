// Note tooltips — brief descriptor for common perfumery notes
const NOTE_HINTS: Record<string, string> = {
  sandalwood: 'creamy, warm wood',
  cedar: 'dry, pencil shavings',
  vetiver: 'smoky, earthy root',
  patchouli: 'dark, musty earth',
  oakmoss: 'forest floor, green',
  bergamot: 'citrus, slightly floral',
  lemon: 'sharp citrus',
  rose: 'classic floral',
  jasmine: 'heady white floral',
  iris: 'powdery, carroty',
  violet: 'powdery, soft floral',
  vanilla: 'sweet, warm, balsamic',
  musk: 'skin-like, soft',
  amber: 'warm resin, golden',
  tonka: 'coumarin, almond, hay',
  labdanum: 'animalic resin',
  oud: 'woody, animalic, smoky',
  leather: 'smoky, animal hide',
  tobacco: 'dry, sweet, smoky',
  coffee: 'roasted, bitter sweet',
  pepper: 'sharp, spicy',
  cardamom: 'spicy, green, herbal',
  ginger: 'sharp, warm spice',
  cinnamon: 'warm, sweet spice',
  clove: 'intensely spicy',
  lavender: 'herbal, clean, floral',
  geranium: 'rosy, green, herbal',
  neroli: 'orange blossom, sweet',
  'orange blossom': 'sweet, white floral',
  tuberose: 'creamy, heady floral',
  ylang: 'tropical, banana-floral',
  heliotrope: 'almond, powdery',
  benzoin: 'balsamic, vanilla-like',
  frankincense: 'resinous, ceremonial',
  myrrh: 'bitter resin, ancient',
  praline: 'caramelised nuts',
  chocolate: 'dark, sweet',
  coconut: 'tropical, milky',
  peach: 'soft fruit, skin-like',
}

function noteHint(note: string): string | undefined {
  const lower = note.toLowerCase()
  for (const [key, val] of Object.entries(NOTE_HINTS)) {
    if (lower.includes(key)) return val
  }
  return undefined
}

type Props = { notes: string[] }

export function NoteCloud({ notes }: Props) {
  // Weight by position: first notes are most prominent
  const total = notes.length

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'baseline' }}>
      {notes.map((note, i) => {
        const weight = 1 - i / total               // 1 → 0 across the array
        const fontSize = 0.72 + weight * 0.46       // 0.72rem → 1.18rem
        const opacity = 0.45 + weight * 0.55        // 0.45 → 1.0
        const hint = noteHint(note)

        return (
          <span
            key={note}
            title={hint}
            style={{
              fontSize: `${fontSize}rem`,
              opacity,
              color: 'var(--foreground)',
              letterSpacing: '0.03em',
              cursor: hint ? 'help' : 'default',
              lineHeight: 1.4,
              transition: 'opacity 0.15s ease',
              borderBottom: hint ? '1px dotted var(--border)' : 'none',
              paddingBottom: hint ? '1px' : 0,
            }}
          >
            {note}
            {i < total - 1 && (
              <span style={{ color: 'var(--border)', marginLeft: '0.5rem', fontSize: '0.65rem' }}>·</span>
            )}
          </span>
        )
      })}
    </div>
  )
}
