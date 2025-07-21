"use client"

import { useState, useEffect } from "react"
import { getCachedRSSArticles } from "@/lib/res-parser"
import { useLanguage } from "@/contexts/language-context"
import type { NewsArticle } from "@/types"

// Mock data as fallback
const MOCK_ARTICLES: NewsArticle[] = [
  {
    id: 1,
    title: "BRICS anuncia nova moeda digital para comércio internacional",
    summary: "Países do bloco desenvolvem sistema de pagamentos alternativo ao dólar americano",
    content: `Os países do BRICS anunciaram hoje o desenvolvimento de uma nova moeda digital para facilitar o comércio internacional entre os países membros. A iniciativa visa reduzir a dependência do dólar americano nas transações comerciais.

O projeto, liderado pela China e Rússia, conta com o apoio de Brasil, Índia e África do Sul. A nova moeda digital será baseada em blockchain e permitirá transações mais rápidas e seguras entre os países do bloco.

Segundo especialistas, esta é uma das iniciativas mais ambiciosas do BRICS para criar um sistema financeiro alternativo ao dominado pelo Ocidente. A implementação está prevista para começar em 2025, com testes piloto já iniciados entre alguns países membros.

A medida representa um marco importante na busca por maior autonomia financeira dos países emergentes e pode ter impactos significativos no sistema monetário internacional.`,
    image: "/img/brics-coin.jpg",
    country: "BRICS",
    category: "Economia",
    publishedAt: "2025-01-20",
    readTime: "5 min",
    source: "Reuters BRICS",
  },
  {
    id: 2,
    title: "Brasil e China assinam acordo de cooperação tecnológica",
    summary: "Parceria prevê investimentos em inteligência artificial e energia renovável",
    content: `Brasil e China assinaram um amplo acordo de cooperação tecnológica que prevê investimentos bilionários em inteligência artificial, energia renovável e infraestrutura digital.

O acordo foi assinado durante a visita do presidente chinês ao Brasil e estabelece parcerias em áreas estratégicas como 5G, veículos elétricos e tecnologias verdes.

As empresas chinesas se comprometem a investir US$ 10 bilhões em projetos de energia solar e eólica no Brasil nos próximos cinco anos. Em contrapartida, o Brasil oferecerá acesso privilegiado ao seu mercado de commodities agrícolas.

A parceria também inclui programas de intercâmbio acadêmico e transferência de tecnologia, fortalecendo os laços entre os dois maiores países do BRICS.`,
    image: "/img/br-cn.jpg",
    country: "Brasil",
    category: "Tecnologia",
    publishedAt: "2025-01-19",
    readTime: "4 min",
    source: "Agência Brasil",
  },
  {
    id: 3,
    title: "Rússia propõe novo sistema de pagamentos para países BRICS",
    summary: "Sistema alternativo ao SWIFT ganha força entre países emergentes",
    content: `A Rússia apresentou uma proposta detalhada para um novo sistema de pagamentos internacionais que conectaria todos os países do BRICS, oferecendo uma alternativa ao sistema SWIFT controlado pelo Ocidente.

O sistema, chamado de "BRICS Pay", permitiria transações diretas entre bancos centrais dos países membros, eliminando intermediários e reduzindo custos de transação.

Índia e China já demonstraram interesse na proposta, que poderia revolucionar o comércio internacional entre economias emergentes. O sistema utilizaria tecnologia blockchain e seria respaldado por uma cesta de moedas dos países membros.

A implementação do BRICS Pay está prevista para 2026, com testes piloto começando ainda este ano entre Rússia, China e Índia.`,
    image: "/img/brics-coin.jpg",
    country: "Rússia",
    category: "Economia",
    publishedAt: "2025-01-18",
    readTime: "6 min",
    source: "RT International",
    status: "Destaque",
  },
  {
    id: 4,
    title: "Índia lidera produção de medicamentos genéricos para BRICS",
    summary: "País se torna fornecedor principal de medicamentos essenciais para o bloco",
    content: `A Índia consolidou sua posição como principal fornecedor de medicamentos genéricos para os países do BRICS, atendendo mais de 60% da demanda do bloco por medicamentos essenciais.

O programa, iniciado durante a pandemia, expandiu significativamente e agora inclui medicamentos para doenças crônicas, antibióticos e vacinas. A Índia investiu pesadamente em sua capacidade de produção farmacêutica.

Brasil e África do Sul são os maiores importadores dos medicamentos indianos dentro do BRICS, com acordos que garantem preços preferenciais e acesso prioritário a novos tratamentos.

A iniciativa fortalece a cooperação em saúde entre os países do bloco e reduz a dependência de fornecedores ocidentais para medicamentos essenciais.`,
    image: "/img/in-farmacia.jpg",
    country: "Índia",
    category: "Saúde",
    publishedAt: "2025-01-17",
    readTime: "4 min",
    source: "Times of India",
  },
  {
    id: 5,
    title: "China investe US$ 50 bilhões em infraestrutura na África do Sul",
    summary: "Maior investimento chinês no continente africano fortalece laços BRICS",
    content: `A China anunciou um investimento de US$ 50 bilhões em projetos de infraestrutura na África do Sul, incluindo ferrovias, portos e usinas de energia renovável.

O investimento faz parte da Iniciativa do Cinturão e Rota e representa o maior aporte chinês em um país africano. Os projetos criarão mais de 200 mil empregos diretos e indiretos.

A parceria inclui a construção de uma nova linha ferroviária de alta velocidade conectando Johannesburgo ao Porto de Durban, além de três usinas solares de grande escala.

O acordo fortalece significativamente a posição da África do Sul como porta de entrada da China para o continente africano e consolida a cooperação Sul-Sul dentro do BRICS.`,
    image: "/img/in-farmacia.jpg",
    country: "África do Sul",
    category: "Economia",
    publishedAt: "2025-01-16",
    readTime: "5 min",
    source: "South African Broadcasting Corporation",
  },
]

export function useNewsData() {
  const { language } = useLanguage()
  const [articles, setArticles] = useState<NewsArticle[]>(MOCK_ARTICLES)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isUsingRealData, setIsUsingRealData] = useState(false)

  const fetchRealNews = async () => {
    setLoading(true)
    setError(null)

    try {
      const rssArticles = await getCachedRSSArticles()

      if (rssArticles.length > 0) {
        // Filter articles by current language and ensure BRICS relevance
        const languageFilteredArticles = rssArticles.filter((rss) => {
          // For Portuguese, prefer Portuguese sources or translate-friendly content
          if (language === "pt-BR") {
            return (
              rss.language === "pt" ||
              (rss.language === "en" &&
                (rss.source === "Reuters" || rss.source === "RT International") &&
                !rss.title.toLowerCase().includes("ukraine") &&
                !rss.title.toLowerCase().includes("war") &&
                !rss.title.toLowerCase().includes("conflict"))
            )
          }
          // For English, use English sources
          return (
            rss.language === "en" &&
            !rss.title.toLowerCase().includes("ukraine") &&
            !rss.title.toLowerCase().includes("war")
          )
        })

        if (languageFilteredArticles.length > 0) {
          // Convert RSS articles to NewsArticle format
          const convertedArticles: NewsArticle[] = languageFilteredArticles.map((rss, index) => ({
            id: index + 1,
            title: rss.title,
            summary: rss.summary,
            content: rss.content,
            image: rss.image,
            country: rss.country,
            category: rss.category,
            publishedAt: rss.publishedAt,
            readTime: rss.readTime,
            source: rss.source,
            status: index === 0 ? "Destaque" : undefined,
          }))

          setArticles(convertedArticles)
          setIsUsingRealData(true)
          console.log(`✅ Loaded ${convertedArticles.length} real articles for ${language}`)
        } else {
          // Fallback to mock data
          setArticles(MOCK_ARTICLES)
          setIsUsingRealData(false)
          console.log("⚠️ No suitable RSS articles found, using mock data")
        }
      } else {
        // Fallback to mock data
        setArticles(MOCK_ARTICLES)
        setIsUsingRealData(false)
        console.log("⚠️ No RSS articles found, using mock data")
      }
    } catch (err) {
      console.error("Error fetching real news:", err)
      setError("Failed to fetch real news, using mock data")
      setArticles(MOCK_ARTICLES)
      setIsUsingRealData(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Fetch real news on component mount and language change
    fetchRealNews()
  }, [language])

  useEffect(() => {
    // Set up interval to refresh every 30 minutes
    const interval = setInterval(fetchRealNews, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return {
    articles,
    loading,
    error,
    isUsingRealData,
    refreshNews: fetchRealNews,
  }
}
