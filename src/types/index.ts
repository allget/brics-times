export interface NewsArticle {
  id: number
  title: string
  summary: string
  content: string
  image: string
  country: string
  category: string
  publishedAt: string
  readTime: string
  status?: string
  source: string
  youtubeUrl?: string
  slug?: string
}

export interface SavedArticle extends NewsArticle {
  savedAt: string
}

// 📊 NOVO: Interface para Análises
export interface AnalysisArticle {
  id: number
  title: string
  summary: string
  content: string
  thumbnail: string
  author: string
  analysisType: string
  publishedAt: string
  readTime: string
  tags?: string[]
  featured?: boolean
  status?: string
  slug?: string
}

export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  size?: string
}
