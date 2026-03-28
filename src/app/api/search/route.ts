import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { searchPerfumes } from '@/lib/search-index'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { query } = (await req.json()) as { query: string }

    if (!query?.trim()) {
      return NextResponse.json({ answer: '', perfumes: [] })
    }

    const matches = searchPerfumes(query.trim(), 6)

    if (matches.length === 0) {
      return NextResponse.json({
        answer: "Nothing in the catalogue matches that quite yet — try a note, accord, or mood.",
        perfumes: [],
      })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({
          answer: 'AI search is not configured — add ANTHROPIC_API_KEY to .env.local and restart the dev server.',
          perfumes: matches,
        })
      }
      return NextResponse.json({ answer: '', perfumes: matches })
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const context = matches
      .map(p =>
        `${p.brand} ${p.name} ($${p.price ?? '—'})\n` +
        `Description: ${p.description}\n` +
        `Notes: ${p.notes.join(', ')}\n` +
        `Accords: ${p.accords.join(', ')}\n` +
        `Tags: ${p.tags.join(', ')}\n` +
        `Scores: authenticity ${Math.round(p.scores.authenticity * 100)}%, ` +
        `projection ${Math.round(p.scores.projection * 100)}%, ` +
        `longevity ${Math.round(p.scores.longevity * 100)}%, ` +
        `complexity ${Math.round(p.scores.complexity * 100)}%`
      )
      .join('\n\n')

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 320,
      messages: [
        {
          role: 'user',
          content:
            `You are the taste engine at Scentum — a perfume discovery app for people who think of scent as language. ` +
            `Answer the user's query in 2–3 sentences of flowing prose. Be specific and evocative. ` +
            `Mention 1–3 perfumes by name if relevant. No bullet points. No pleasantries.\n\n` +
            `User query: "${query}"\n\n` +
            `Catalogue results:\n${context}`,
        },
      ],
    })

    const answer =
      message.content[0].type === 'text' ? message.content[0].text : ''

    return NextResponse.json({ answer, perfumes: matches })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[/api/search]', message)
    return NextResponse.json(
      { answer: `Search error: ${message}`, perfumes: [] },
      { status: 500 }
    )
  }
}
