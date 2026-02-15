import { NextResponse } from "next/server"
import Parser from "rss-parser"
import { FEEDS } from "@/lib/sources"

const parser = new Parser()

type Story = {
  title: string
  link: string
  date?: string
  source?: string
  category?: string
}

// quick cleanup so titles don’t look like they were typed during a car crash
function cleanTitle(t: string) {
  return t.replace(/\s+/g, " ").trim()
}

export async function GET() {
  const results: Story[] = []

  // Pull a few from each feed (keeps it fast + avoids being a menace)
  await Promise.all(
    FEEDS.map(async (feed) => {
      try {
        const parsed = await parser.parseURL(feed.url)
        const items = (parsed.items ?? []).slice(0, 8)

        for (const item of items) {
          const title = item.title ? cleanTitle(item.title) : ""
          const link = item.link || ""
          if (!title || !link) continue

          results.push({
            title,
            link,
            date: (item.isoDate as string) || (item.pubDate as string) || undefined,
            source: feed.name,
            category: feed.category,
          })
        }
      } catch {
        // if one feed dies, the whole site doesn’t have to die with it
      }
    })
  )

  // Sort newest first (if dates exist)
  results.sort((a, b) => {
    const da = a.date ? new Date(a.date).getTime() : 0
    const db = b.date ? new Date(b.date).getTime() : 0
    return db - da
  })

  // Deduplicate by link
  const seen = new Set<string>()
  const deduped = results.filter((s) => {
    if (seen.has(s.link)) return false
    seen.add(s.link)
    return true
  })

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    stories: deduped.slice(0, 40),
    categories: Array.from(new Set(FEEDS.map((f) => f.category))),
  })
}