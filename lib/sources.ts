export type FeedSource = {
  name: string
  url: string
  category: "World" | "Science" | "Animals" | "Health" | "Tech" | "Local" | "Feel-Good"
}

export const FEEDS: FeedSource[] = [
  {
    name: "Positive News",
    url: "https://www.positive.news/feed/",
    category: "Feel-Good",
  },
  {
    name: "Good News Network",
    url: "https://www.goodnewsnetwork.org/feed/",
    category: "Feel-Good",
  },
  {
    name: "The Optimist Daily",
    url: "https://www.optimistdaily.com/feed/",
    category: "World",
  },
  {
    name: "NASA Image of the Day",
    url: "https://www.nasa.gov/feeds/iotd-feed/",
    category: "Science",
  },
  {
    name: "Smithsonian Smart News",
    url: "https://www.smithsonianmag.com/rss/smart-news/",
    category: "Science",
  },
]