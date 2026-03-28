'use client'

type Props = {
  query: string
  answer: string
  count: number
  loading: boolean
  onDismiss: () => void
}

export function AISearchResult({ query, answer, count, loading, onDismiss }: Props) {
  return (
    <div
      style={{
        marginBottom: '1.25rem',
        border: '1px solid var(--border)',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        background: 'var(--card)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem 0.875rem',
          borderBottom: '1px solid var(--border)',
          background: 'var(--muted)',
        }}
      >
        <span style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>
          AI · &ldquo;{query}&rdquo;
          {!loading && count > 0 && (
            <span style={{ marginLeft: '0.5rem', opacity: 0.6 }}>· {count} results</span>
          )}
        </span>
        <button
          onClick={onDismiss}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--muted-foreground)',
            fontSize: '0.7rem',
            padding: '0.1rem 0.3rem',
            lineHeight: 1,
            fontFamily: 'inherit',
          }}
        >
          ✕
        </button>
      </div>

      {/* Answer prose */}
      <div style={{ padding: '0.875rem' }}>
        {loading ? (
          <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', padding: '0.25rem 0' }}>
            {[0, 1, 2].map(i => (
              <span
                key={i}
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: 'var(--muted-foreground)',
                  animation: `aiPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                  display: 'inline-block',
                }}
              />
            ))}
            <style>{`
              @keyframes aiPulse {
                0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
                40% { opacity: 1; transform: scale(1); }
              }
            `}</style>
          </div>
        ) : (
          <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.65, color: 'var(--foreground)', fontStyle: 'italic' }}>
            {answer}
          </p>
        )}
      </div>
    </div>
  )
}
