type Story = {
  title: string
  link: string
  date?: string
  source?: string
  category?: string
}

export default function StoryCard({ story }: { story: Story }) {
  const niceDate = story.date ? new Date(story.date).toLocaleDateString() : ""

  return (
    <a
      href={story.link}
      target="_blank"
      rel="noreferrer"
      className="group block rounded-2xl border border-[#ded6c7] bg-[#fbf8f1] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-serif text-lg leading-snug text-[#3f4b2a] group-hover:underline">
          {story.title}
        </h3>
        <span className="shrink-0 rounded-full bg-[#e8e1d3] px-2 py-1 text-xs text-[#5f5a4e]">
          {story.category ?? "Good"}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#6b5e53]">
        {story.source ? <span>📰 {story.source}</span> : null}
        {niceDate ? <span>• {niceDate}</span> : null}
      </div>
    </a>
  )
}