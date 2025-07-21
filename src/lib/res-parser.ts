interface RSSFeed {
  url: string
  source: string
  country: string
  language: string
  category: string
}

interface ParsedArticle {
  id: string
  title: string
  summary: string
  content: string
  image: string
  country: string
  category: string
  publishedAt: string
  readTime: string
  source: string
  language: string
  url: string
}

const RSS_FEEDS: RSSFeed[] = [
  // English feeds
  {
    url: "https://feeds.reuters.com/reuters/businessNews",
    source: "Reuters",
    country: "BRICS",
    language: "en",
    category: "Economy",
  },
  {
    url: "https://www.rt.com/rss/",
    source: "RT International",
    country: "Russia",
    language: "en",
    category: "Politics",
  },
  {
    url: "https://www.cgtn.com/subscribe/rss/section/world.xml",
    source: "CGTN",
    country: "China",
    language: "en",
    category: "World",
  },
  {
    url: "https://www.presstv.ir/rss",
    source: "Press TV",
    country: "Iran",
    language: "en",
    category: "Politics",
  },
  // Portuguese feeds
  {
    url: "https://agenciabrasil.ebc.com.br/rss/ultimasnoticias/feed.xml",
    source: "Agência Brasil",
    country: "Brazil",
    language: "pt",
    category: "Politics",
  },
  {
    url: "https://sputnikbrasil.com.br/export/rss2/archive/index.xml",
    source: "Sputnik Brasil",
    country: "Russia",
    language: "pt",
    category: "Politics",
  },
]

// Keywords for BRICS-related content
const BRICS_KEYWORDS = [
  "brics",
  "brazil",
  "russia",
  "india",
  "china",
  "south africa",
  "brasil",
  "rússia",
  "índia",
  "china",
  "áfrica do sul",
  "cooperation",
  "cooperação",
  "trade",
  "comércio",
  "economy",
  "economia",
  "partnership",
  "parceria",
  "summit",
  "cúpula",
  "agreement",
  "acordo",
]

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.split(" ").length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min`
}

function categorizeArticle(title: string, content: string): string {
  const text = (title + " " + content).toLowerCase()

  if (text.includes("economy") || text.includes("economia") || text.includes("trade") || text.includes("comércio")) {
    return "Economy"
  }
  if (text.includes("technology") || text.includes("tecnologia") || text.includes("digital") || text.includes("ai")) {
    return "Technology"
  }
  if (text.includes("health") || text.includes("saúde") || text.includes("medicine") || text.includes("medicina")) {
    return "Health"
  }
  if (text.includes("energy") || text.includes("energia") || text.includes("renewable") || text.includes("renovável")) {
    return "Energy"
  }

  return "Politics"
}

function isBRICSRelated(title: string, content: string): boolean {
  const text = (title + " " + content).toLowerCase()
  return BRICS_KEYWORDS.some((keyword) => text.includes(keyword.toLowerCase()))
}

function generateImageForArticle(title: string, category: string): string {
  // Generate specific images based on article content
  const titleLower = title.toLowerCase()

  if (titleLower.includes("digital") || titleLower.includes("currency") || titleLower.includes("moeda")) {
    return "/images/brics-digital-currency.png"
  }
  if (titleLower.includes("cooperation") || titleLower.includes("cooperação") || titleLower.includes("agreement")) {
    return "/images/brics-cooperation.png"
  }
  if (titleLower.includes("trade") || titleLower.includes("comércio")) {
    return "/images/brics-trade.png"
  }
  if (titleLower.includes("technology") || titleLower.includes("tecnologia")) {
    return "/images/brics-technology.png"
  }
  if (titleLower.includes("energy") || titleLower.includes("energia")) {
    return "/images/brics-energy.png"
  }

  // Default images by category
  switch (category) {
    case "Economy":
      return "/images/brics-economy.png"
    case "Technology":
      return "/images/brics-tech.png"
    case "Health":
      return "/images/brics-health.png"
    case "Energy":
      return "/images/brics-energy.png"
    default:
      return "/images/brics-news.png"
  }
}

async function fetchRSSFeed(feed: RSSFeed): Promise<ParsedArticle[]> {
  try {
    // Using a CORS proxy for RSS feeds
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feed.url)}`
    const response = await fetch(proxyUrl)
    const data = await response.json()

    // Parse XML
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(data.contents, "text/xml")
    const items = xmlDoc.querySelectorAll("item")

    const articles: ParsedArticle[] = []

    items.forEach((item, index) => {
      const title = item.querySelector("title")?.textContent || ""
      const description = item.querySelector("description")?.textContent || ""
      const link = item.querySelector("link")?.textContent || ""
      const pubDate = item.querySelector("pubDate")?.textContent || ""

      // Only include BRICS-related articles
      if (isBRICSRelated(title, description)) {
        const category = categorizeArticle(title, description)
        const cleanDescription = description.replace(/<[^>]*>/g, "").substring(0, 200) + "..."

        articles.push({
          id: `${feed.source}-${index}-${Date.now()}`,
          title: title.substring(0, 100),
          summary: cleanDescription,
          content: description.replace(/<[^>]*>/g, ""),
          image: generateImageForArticle(title, category),
          country: feed.country,
          category: category,
          publishedAt: new Date(pubDate || Date.now()).toISOString().split("T")[0],
          readTime: calculateReadTime(description),
          source: feed.source,
          language: feed.language,
          url: link,
        })
      }
    })

    return articles.slice(0, 5) // Limit to 5 articles per feed
  } catch (error) {
    console.error(`Error fetching RSS feed ${feed.url}:`, error)
    return []
  }
}

export async function fetchAllRSSFeeds(): Promise<ParsedArticle[]> {
  try {
    const feedPromises = RSS_FEEDS.map((feed) => fetchRSSFeed(feed))
    const feedResults = await Promise.all(feedPromises)

    // Flatten and sort by date
    const allArticles = feedResults.flat()
    return allArticles
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 20) // Return top 20 most recent articles
  } catch (error) {
    console.error("Error fetching RSS feeds:", error)
    return []
  }
}

// Cache system
let cachedArticles: ParsedArticle[] = []
let lastFetch = 0
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

export async function getCachedRSSArticles(): Promise<ParsedArticle[]> {
  const now = Date.now()

  if (now - lastFetch > CACHE_DURATION || cachedArticles.length === 0) {
    console.log("Fetching fresh RSS data...")
    cachedArticles = await fetchAllRSSFeeds()
    lastFetch = now
  }

  return cachedArticles
}
