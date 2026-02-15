"use client"

import { useState } from "react"

const CATEGORIES = ["World", "Science", "Animals", "Health", "Tech", "Local", "Feel-Good"]

export default function SubmitPage() {
  const [title, setTitle] = useState("")
  const [link, setLink] = useState("")
  const [category, setCategory] = useState("Feel-Good")
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")

    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, link, category }),
    })

    if (res.ok) {
      setTitle("")
      setLink("")
      setCategory("Feel-Good")
      setStatus("done")
      return
    }

    setStatus("error")
  }

  return (
    <main className="min-h-screen bg-[#f4f1ea] px-6 py-12">
      <div className="mx-auto max-w-xl">
        <h1 className="font-serif text-4xl text-[#3f4b2a] tracking-tight">🌿 Submit a story</h1>
        <p className="mt-2 text-[#6b5e53]">
          Drop a link that’s actually good for your brain. (Rare in 2026.)
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-[#ded6c7] bg-[#fbf8f1] p-6 shadow-sm">
          <div>
            <label className="text-sm text-[#5f5a4e]">Title</label>
            <input
              className="mt-1 w-full rounded-xl border border-[#ded6c7] bg-white px-3 py-2 text-[#2c2b27] outline-none focus:ring-2 focus:ring-[#7a8452]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="A wholesome headline"
            />
          </div>

          <div>
            <label className="text-sm text-[#5f5a4e]">Link</label>
            <input
              className="mt-1 w-full rounded-xl border border-[#ded6c7] bg-white px-3 py-2 text-[#2c2b27] outline-none focus:ring-2 focus:ring-[#7a8452]"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="text-sm text-[#5f5a4e]">Category</label>
            <select
              className="mt-1 w-full rounded-xl border border-[#ded6c7] bg-white px-3 py-2 text-[#2c2b27] outline-none focus:ring-2 focus:ring-[#7a8452]"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#3f4b2a] px-4 py-2 font-medium text-[#fbf8f1] hover:opacity-95 active:opacity-90"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Submitting..." : "Submit"}
          </button>

          {status === "done" && (
            <p className="text-sm text-[#3f4b2a]">✅ Submitted. You just improved the internet by 0.0001%.</p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-700">❌ Something broke. Try again.</p>
          )}
        </form>

        <a href="/" className="mt-6 inline-block text-sm text-[#6b5e53] underline">
          ← Back to feed
        </a>
      </div>
    </main>
  )
}