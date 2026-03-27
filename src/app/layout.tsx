import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import './globals.css'
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from '@/components/ThemeProvider'
import { ThemeToggle } from '@/components/ThemeToggle'

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  metadataBase: new URL('https://scentum.space'),
  title: 'Scentum',
  description: 'A taste engine disguised as a shop.',
  alternates: {
    canonical: 'https://scentum.space',
  },
  openGraph: {
    title: 'Scentum',
    description: 'A taste engine disguised as a shop.',
    url: 'https://scentum.space',
    siteName: 'Scentum',
    locale: 'en_US',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <header
            style={{
              borderBottom: '1px solid var(--border)',
              padding: '0 2rem',
              height: '52px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--background)',
              position: 'sticky',
              top: 0,
              zIndex: 10,
            }}
          >
            <Link href="/" style={{ fontSize: '1.1rem', letterSpacing: '0.15em', fontStyle: 'italic', textDecoration: 'none', color: 'inherit' }}>
              scentum
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', letterSpacing: '0.08em' }}>
                taste engine
              </span>
              <ThemeToggle />
            </div>
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
