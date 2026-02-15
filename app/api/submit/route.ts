import { NextResponse } from "next/server"

type Submission = {
  title: string
  link: string
  category: string
  submittedAt: string
}

const GLOBAL_KEY = "__good_news_submissions__"

// @ts-ignore
const store: Submission[] = globalThis[GLOBAL_KEY] ?? []
// @ts-ignore
globalThis[GLOBAL_KEY] = store

export async function GET() {
  return NextResponse.json({
    submissions: store.slice().reverse().slice(0, 30),
  })
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)

  const title = (body?.title ?? "").toString().trim()
  const link = (body?.link ?? "").toString().trim()
  const category = (body?.category ?? "Feel-Good").toString().trim()

  if (!title || !link) {
    return NextResponse.json({ error: "Missing title or link" }, { status: 400 })
  }

  store.push({
    title,
    link,
    category,
    submittedAt: new Date().toISOString(),
  })

  return NextResponse.json({ ok: true })
}