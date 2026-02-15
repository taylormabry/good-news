"use client"

import { useEffect, useMemo, useState } from "react"
import StoryCard from "@/components/StoryCard"

type Story = {
  title: string
  link: string
  date?: string
  source?: string
  category?: string
}

export default function Home() {
  const [stories, setStories] = useState<Story[]>([])
  const [subs, setSubs] = useState<Story[]>([])
  const [updatedAt, setUpdatedAt] = useState<string>("")
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<string>("All")
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<string[]>([])

  async function loadAll() {
    setLoading(true)
    try {
      const res = await fetch("/api/stories", { cache: "no-store" })
      const data = await res.json()
      setStories(data.stories ?? [])
      setUpdatedAt(data.updatedAt ?? "")
      setCategories(["All", ...(data.categories ?? [])])
    } finally {
      setLoading(false)
    }

    const subRes = await fetch("/api/submit", { cache: "no-store" }).catch(() => null)
    if (subRes?.ok) {
      const subData = await subRes.json()
      const mapped = (subData.submissions ?? []).map((s: any) => ({
        title: s.title,
        link: s.link,
        category: s.category,
        source: "Community",
        date: s.submittedAt,
      }))
      setSubs(mapped)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return stories.filter((s) => {
      const matchesQuery =
        !q ||
        s.title.toLowerCase().includes(q) ||
        (s.source ?? "").toLowerCase().includes(q)
      const matchesCat = category === "All" || (s.category ?? "Good") === category
      return matchesQuery && matchesCat
    })
  }, [stories, query, category])

  const randomPick = () => {
    const pool = filtered.length ? filtered : stories
    if (!pool.length) return
    const pick = pool[Math.floor(Math.random() * pool.length)]
    window.open(pick.link, "_blank")
  }

  return (
    <main className="min-h-screen bg-[#f4f1ea] px-6 py-14">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h1 className="font-serif text-5xl text-[#556b2f] tracking-tight">
            🌿 Good News Only
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[#6b5e53] leading-relaxed">
            Welcome to the internet’s calmest corner. Only positive, uplifting, and hopeful stories live here.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            <input
              className="w-full max-w-md rounded-xl border border-[#ded6c7] bg-white px-4 py-2 text-[#2c2b27] outline-none focus:ring-2 focus:ring-[#7a8452]"
              placeholder="Search headlines or sources…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <select
              className="w-full sm:w-56 rounded-xl border border-[#ded6c7] bg-white px-4 py-2 text-[#2c2b27] outline-none focus:ring-2 focus:ring-[#7a8452]"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={loadAll}
              className="rounded-xl bg-[#3f4b2a] px-4 py-2 font-medium text-[#fbf8f1] hover:opacity-95 active:opacity-90"
            >
              {loading ? "Refreshing…" : "Refresh"}
            </button>

            <button
              onClick={randomPick}
              className="rounded-xl border border-[#3f4b2a] bg-[#fbf8f1] px-4 py-2 font-medium text-[#3f4b2a] hover:bg-[#efe8dc]"
            >
              🎲 Random good news
            </button>

            <a
              href="/submit"
              className="rounded-xl border border-[#ded6c7] bg-white px-4 py-2 font-medium text-[#6b5e53] hover:bg-[#efe8dc]"
            >
              ➕ Submit a story
            </a>
          </div>

          {updatedAt ? (
            <p className="mt-3 text-xs text-[#6b5e53]">
              Updated {new Date(updatedAt).toLocaleString()}
            </p>
          ) : null}
        </div>

        <div className="mt-10 grid gap-4">
          {filtered.map((s) => (
            <StoryCard key={s.link} story={s} />
          ))}
        </div>

        {subs.length ? (
          <>
            <div className="mt-14 border-t border-[#ded6c7] pt-10">
              <h2 className="font-serif text-3xl text-[#3f4b2a]">Community submissions</h2>
              <p className="mt-2 text-sm text-[#6b5e53]">
                Stuff your friends submitted instead of doomscrolling.
              </p>
              <div className="mt-6 grid gap-4">
                {subs.map((s) => (
                  <StoryCard key={s.link + (s.date ?? "")} story={s} />
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </main>
  )
}