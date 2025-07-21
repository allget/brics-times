"use client"

import { useState, useEffect } from "react"
import { getArticles, getAllArticles, getFeaturedArticle, urlFor, testEnglishContent } from "@/lib/sanity"
import { useLanguage } from "@/contexts/language-context"
import type { NewsArticle } from "@/types"

// Mock data como fallback
const MOCK_ARTICLES: NewsArticle[] = [
  {
    id: 1,
    title: "BRICS anuncia nova moeda digital para comércio internacional",
    summary: "Países do bloco desenvolvem sistema de pagamentos alternativo ao dólar americano",
    content: `Os países do BRICS anunciaram hoje o desenvolvimento de uma nova moeda digital para facilitar o comércio internacional entre os países membros.`,
    image: "/img/brics-digital-currency.jpg",
    country: "BRICS",
    category: "Economia",
    publishedAt: "2025-01-20",
    readTime: "5 min",
    source: "Reuters BRICS",
    status: "Destaque",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    slug: "brics-anuncia-nova-moeda-digital",
  },
  {
    id: 2,
    title: "Brasil e China assinam acordo de cooperação tecnológica",
    summary: "Parceria prevê investimentos em inteligência artificial e energia renovável",
    content: `Brasil e China assinaram um amplo acordo de cooperação tecnológica.`,
    image: "/img/brics-digital-currency.jpg",
    country: "Brasil",
    category: "Tecnologia",
    publishedAt: "2025-01-19",
    readTime: "4 min",
    source: "Agência Brasil",
    slug: "brasil-china-acordo-cooperacao-tecnologica",
  },
]

export function useSanityNews() {
  const { language } = useLanguage()
  const [articles, setArticles] = useState<NewsArticle[]>(MOCK_ARTICLES.filter((_, index) => index > 0))
  const [featuredArticle, setFeaturedArticle] = useState<NewsArticle | null>(MOCK_ARTICLES[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isUsingSanity, setIsUsingSanity] = useState(false)

  const convertSanityToNewsArticle = (article: any, index: number): NewsArticle => {

    // Processar conteúdo do Sanity
    let processedContent = "Conteúdo não disponível"
    if (Array.isArray(article.content)) {
      processedContent = article.content
        .map((block: any) => {
          if (block._type === "block" && block.children && Array.isArray(block.children)) {
            return block.children.map((child: any) => child.text || "").join("")
          }
          return ""
        })
        .filter(Boolean)
        .join("\n\n")
    } else if (typeof article.content === "string") {
      processedContent = article.content
    }

    // Se ainda está vazio, usar o summary como fallback
    if (!processedContent || processedContent.trim() === "" || processedContent === "Conteúdo não disponível") {
      processedContent = article.summary || "Conteúdo não disponível"
    }

    const convertedArticle = {
      id: index + 1,
      title: article.title || "Título não disponível",
      summary: article.summary || "Resumo não disponível",
      content: processedContent,
      image: article.image ? urlFor(article.image).width(800).height(600).url() : "/images/brics-news.png",
      country: article.country || "BRICS",
      category: article.category || "Política",
      publishedAt: article.publishedAt
        ? new Date(article.publishedAt).toISOString().split("T")[0]
        : article._createdAt
          ? new Date(article._createdAt).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      readTime: article.readTime || "5 min",
      source: article.source || "BRICS News",
      status: article.featured ? "Destaque" : undefined,
      youtubeUrl: article.youtubeUrl || undefined,
      slug: article.slug || undefined,
    }

    return convertedArticle
  }

  const fetchSanityArticles = async () => {
    setLoading(true)
    setError(null)

    try {
      const lang = language === "pt-BR" ? "pt" : "en"
      
      // 🧪 Fazer teste de conteúdo inglês se for inglês
      if (lang === "en") {
        await testEnglishContent()
      }

      // Buscar artigo em destaque
      const sanityFeatured = await getFeaturedArticle(lang)

      // Buscar artigos regulares (não featured)
      let sanityArticles = await getArticles(lang)

      // Se não encontrar artigos publicados, busca todos (incluindo drafts)
      if (!sanityArticles || sanityArticles.length === 0) {
        sanityArticles = await getAllArticles(lang)
      }

      // Se encontrou dados do Sanity
      if (sanityFeatured || sanityArticles?.length > 0) {
        // Processar artigo em destaque
        if (sanityFeatured) {
          const convertedFeatured = convertSanityToNewsArticle(sanityFeatured, 0)
          setFeaturedArticle(convertedFeatured)
        } else if (sanityArticles?.length > 0) {
          // Se não tem featured, usa o primeiro como destaque
          const convertedFeatured = convertSanityToNewsArticle(sanityArticles[0], 0)
          setFeaturedArticle(convertedFeatured)
          // Remove o primeiro da lista para não duplicar
          sanityArticles = sanityArticles.slice(1)
        }

        // Processar artigos regulares
        if (sanityArticles && sanityArticles.length > 0) {
          const convertedArticles: NewsArticle[] = sanityArticles.map((article: any, index: number) =>
            convertSanityToNewsArticle(article, index + 1),
          )
          setArticles(convertedArticles)
        } else {
          setArticles([])
        }

        setIsUsingSanity(true)

      } else {
        // Fallback para mock data
        setFeaturedArticle(MOCK_ARTICLES[0])
        setArticles(MOCK_ARTICLES.slice(1))
        setIsUsingSanity(false)
      }
    } catch (err) {
      setError(`Falha ao buscar do Sanity: ${err}`)
      setFeaturedArticle(MOCK_ARTICLES[0])
      setArticles(MOCK_ARTICLES.slice(1))
      setIsUsingSanity(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSanityArticles()
  }, [language])

  return {
    articles,
    featuredArticle,
    loading,
    error,
    isUsingSanity,
    refreshNews: fetchSanityArticles,
  }
}
