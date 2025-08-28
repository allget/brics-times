import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { NewsDetailPage } from "@/components/news-detail-page"
import { getArticleBySlug, urlFor } from "@/lib/sanity"

interface NewsPageProps {
  params: {
    slug: string
  }
}

// Função para gerar metadados dinâmicos
export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug, "pt")

  if (!article) {
    return {
      title: "Notícia não encontrada - BRICS News",
    }
  }

  return {
    title: `${article.title} - BRICS News`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      images: article.image ? [urlFor(article.image).width(1200).height(630).url()] : [],
      type: "article",
      publishedTime: article.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary,
      images: article.image ? [urlFor(article.image).width(1200).height(630).url()] : [],
    },
  }
}

export default async function NewsPage({ params }: NewsPageProps) {
  // Buscar artigo em português por padrão
  const article = await getArticleBySlug(params.slug, "pt")

  if (!article) {
    notFound()
  }

  // Converter para o formato NewsArticle
  const newsArticle = {
    id: 1,
    title: article.title,
    summary: article.summary,
    content: Array.isArray(article.content)
      ? article.content
          .map((block: any) => {
            if (block._type === "block" && block.children && Array.isArray(block.children)) {
              return block.children.map((child: any) => child.text || "").join("")
            }
            return ""
          })
          .filter(Boolean)
          .join("\n\n")
      : article.content || article.summary,
    image: article.image ? urlFor(article.image).width(1200).height(800).url() : "/images/brics-news.png",
    country: article.country || "BRICS",
    category: article.category || "Política",
    publishedAt: article.publishedAt
      ? new Date(article.publishedAt).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    readTime: article.readTime || "5 min",
    source: article.source || "BRICS News",
    youtubeUrl: article.youtubeUrl,
    slug: article.slug,
  }

  return <NewsDetailPage article={newsArticle} />
}
