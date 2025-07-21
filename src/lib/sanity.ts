import { createClient } from "@sanity/client"
import imageUrlBuilder from "@sanity/image-url"

export const client = createClient({
  projectId: "e1afdefg",
  dataset: "production",
  useCdn: false,
  apiVersion: "2024-01-01",
  // Removi o token por enquanto para testar sem autenticação
})

const builder = imageUrlBuilder(client)
export const urlFor = (source: any) => builder.image(source)

// Função para buscar artigo em destaque
export async function getFeaturedArticle(language: "pt" | "en" = "pt") {
  const query = `*[_type == "newsArticle" && featured == true && status == "published"] | order(publishedAt desc) [0] {
    _id,
    "title": title.${language},
    "summary": summary.${language},
    "content": content.${language},
    image,
    youtubeUrl,
    "slug": slug.current,
    country,
    category,
    publishedAt,
    readTime,
    source,
    featured,
    status
  }`

  try {
    const featured = await client.fetch(query)
    return featured
  } catch (error) {
    console.error("❌ Erro ao buscar artigo em destaque:", error)
    return null
  }
}

// Função para buscar artigos publicados (EXCLUINDO o featured)
export async function getArticles(language: "pt" | "en" = "pt") {
  const query = `*[_type == "newsArticle" && status == "published" && featured != true] | order(publishedAt desc) {
    _id,
    "title": title.${language},
    "summary": summary.${language},
    "content": content.${language},
    image,
    youtubeUrl,
    "slug": slug.current,
    country,
    category,
    publishedAt,
    readTime,
    source,
    featured,
    status
  }`

  try {
    const articles = await client.fetch(query)
    return articles
  } catch (error) {
    return []
  }
}

// Função para buscar TODOS os artigos (incluindo drafts) - EXCLUINDO featured
export async function getAllArticles(language: "pt" | "en" = "pt") {
  const query = `*[_type == "newsArticle" && featured != true] | order(_createdAt desc) {
    _id,
    "title": title.${language},
    "summary": summary.${language},
    "content": content.${language},
    image,
    youtubeUrl,
    "slug": slug.current,
    country,
    category,
    publishedAt,
    readTime,
    source,
    featured,
    status,
    _createdAt
  }`

  try {
    const articles = await client.fetch(query)
    return articles
  } catch (error) {
    return []
  }
}

// 🔗 NOVA: Função para buscar artigo por slug
export async function getArticleBySlug(slug: string, language: "pt" | "en" = "pt") {
  const query = `*[_type == "newsArticle" && slug.current == $slug][0] {
    _id,
    "title": title.${language},
    "summary": summary.${language},
    "content": content.${language},
    image,
    youtubeUrl,
    "slug": slug.current,
    country,
    category,
    publishedAt,
    readTime,
    source,
    featured,
    status
  }`

  try {
    return await client.fetch(query, { slug })
  } catch (error) {
    console.error("Error fetching article by slug from Sanity:", error)
    return null
  }
}

// Função para buscar artigo específico
export async function getArticle(id: string, language: "pt" | "en" = "pt") {
  const query = `*[_type == "newsArticle" && _id == $id][0] {
    _id,
    "title": title.${language},
    "summary": summary.${language},
    "content": content.${language},
    image,
    youtubeUrl,
    "slug": slug.current,
    country,
    category,
    publishedAt,
    readTime,
    source,
    featured,
    status
  }`

  try {
    return await client.fetch(query, { id })
  } catch (error) {
    console.error("Error fetching article from Sanity:", error)
    return null
  }
}

// 🔧 NOVA: Função para testar se existem artigos em inglês
export async function testEnglishContent() {
  try {
    
    // Buscar todos os artigos e ver a estrutura
    const allArticles = await client.fetch(`*[_type == "newsArticle"][0...3] {
      _id,
      title,
      summary,
      status,
      featured
    }`)

    // Testar query específica para inglês
    const englishTest = await client.fetch(`*[_type == "newsArticle" && status == "published"][0...2] {
      _id,
      "titlePt": title.pt,
      "titleEn": title.en,
      "summaryPt": summary.pt,
      "summaryEn": summary.en,
      status,
      featured
    }`)

    
    return { allArticles, englishTest }
  } catch (error) {
    console.error("❌ Erro no teste:", error)
    return null
  }
}

// Função para testar conexão
export async function testConnection() {
  try {
    const result = await client.fetch('*[_type == "newsArticle"][0]')
    return true
  } catch (error) {
    return false
  }
}
