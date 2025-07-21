"use client"

import { useState, useEffect } from "react"
import { client, urlFor } from "@/lib/sanity"
import { useLanguage } from "@/contexts/language-context"
import type { AnalysisArticle } from "@/types"

// Mock data para análises
const MOCK_ANALYSIS: AnalysisArticle[] = [
  {
    id: 1,
    title: "O Futuro da Cooperação Sul-Sul",
    summary: "Análise aprofundada sobre as perspectivas de cooperação entre países emergentes do BRICS.",
    content: "Análise detalhada sobre cooperação Sul-Sul...",
    thumbnail: "/img/in-farmacia.jpg",
    author: "Dr. Maria Santos",
    analysisType: "Análise Geopolítica",
    publishedAt: "2025-01-20",
    readTime: "8 min",
    tags: ["cooperação", "geopolítica", "brics"],
    featured: true,
    slug: "futuro-cooperacao-sul-sul",
  },
  {
    id: 2,
    title: "Impacto Geopolítico do BRICS",
    summary: "Como a expansão do BRICS está redefinindo o cenário geopolítico mundial.",
    content: "Análise sobre impacto geopolítico...",
    thumbnail: "/img/brics-geopolitics.jpg",
    author: "Prof. João Silva",
    analysisType: "Análise Estratégica",
    publishedAt: "2025-01-18",
    readTime: "10 min",
    tags: ["geopolítica", "estratégia", "expansão"],
    slug: "impacto-geopolitico-brics",
  },
]

export function useAnalysis() {
  const { language } = useLanguage()
  const [analyses, setAnalyses] = useState<AnalysisArticle[]>(MOCK_ANALYSIS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isUsingSanity, setIsUsingSanity] = useState(false)

  const convertSanityToAnalysis = (analysis: any, index: number): AnalysisArticle => {
    let processedContent = "Conteúdo não disponível"
    if (Array.isArray(analysis.content)) {
      processedContent = analysis.content
        .map((block: any) => {
          if (block.children && Array.isArray(block.children)) {
            return block.children.map((child: any) => child.text || "").join("")
          }
          return ""
        })
        .filter(Boolean)
        .join("\n\n")
    }

    return {
      id: index + 1,
      title: analysis.title || "Título não disponível",
      summary: analysis.summary || "Resumo não disponível",
      content: processedContent,
      thumbnail: analysis.thumbnail
        ? urlFor(analysis.thumbnail).width(400).height(400).url()
        : "/img/analysis-default.jpg",
      author: analysis.author || "Analista BRICS",
      analysisType: analysis.analysisType || "Análise Geral",
      publishedAt: analysis.publishedAt
        ? new Date(analysis.publishedAt).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      readTime: analysis.readTime || "5 min",
      tags: analysis.tags || [],
      featured: analysis.featured || false,
      slug: analysis.slug || undefined,
    }
  }

  const fetchAnalyses = async () => {
    setLoading(true)
    setError(null)

    try {
      const lang = language === "pt-BR" ? "pt" : "en"

      const query = `*[_type == "analysisArticle" && status == "published"] | order(publishedAt desc) {
        _id,
        "title": title.${lang},
        "summary": summary.${lang},
        "content": content.${lang},
        thumbnail,
        author,
        analysisType,
        publishedAt,
        readTime,
        tags,
        featured,
        "slug": slug.current,
        status
      }`

      const sanityAnalyses = await client.fetch(query)

      if (sanityAnalyses && sanityAnalyses.length > 0) {
        const convertedAnalyses = sanityAnalyses.map((analysis: any, index: number) =>
          convertSanityToAnalysis(analysis, index),
        )
        setAnalyses(convertedAnalyses)
        setIsUsingSanity(true)

      } else {
        setAnalyses(MOCK_ANALYSIS)
        setIsUsingSanity(false)
      }
    } catch (err) {
      setError(`Falha ao buscar análises: ${err}`)
      setAnalyses(MOCK_ANALYSIS)
      setIsUsingSanity(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalyses()
  }, [language])

  return {
    analyses,
    loading,
    error,
    isUsingSanity,
    refreshAnalyses: fetchAnalyses,
  }
}
