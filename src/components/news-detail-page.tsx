"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Clock, MapPin, Bookmark, BookmarkCheck, Share2 } from "lucide-react"
import { YouTubePlayer } from "./youtube-player"
import { ImageWithFallback } from "./image-with-fallback"
import { LanguageSelector } from "./language-selector"
import { useLanguage } from "@/contexts/language-context"
import type { NewsArticle, SavedArticle } from "@/types"

interface NewsDetailPageProps {
  article: NewsArticle
}

export function NewsDetailPage({ article }: NewsDetailPageProps) {
  const { t } = useLanguage()
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([])
  const [showShareMenu, setShowShareMenu] = useState(false)

  // Carregar artigos salvos do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("savedArticles")
    if (saved) {
      setSavedArticles(JSON.parse(saved))
    }
  }, [])

  // Salvar no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem("savedArticles", JSON.stringify(savedArticles))
  }, [savedArticles])

  const isArticleSaved = savedArticles.some((saved) => saved.id === article.id)

  const handleSaveArticle = () => {
    if (isArticleSaved) {
      setSavedArticles((prev) => prev.filter((saved) => saved.id !== article.id))
    } else {
      const savedArticle: SavedArticle = {
        ...article,
        savedAt: new Date().toISOString(),
      }
      setSavedArticles((prev) => [...prev, savedArticle])
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Erro ao compartilhar:", err)
      }
    } else {
      // Fallback: copiar URL
      navigator.clipboard.writeText(window.location.href)
      setShowShareMenu(true)
      setTimeout(() => setShowShareMenu(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-zinc-200">
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1440px] md:border-x border-zinc-900 dark:border-zinc-600 md:m-4">
          {/* Header */}
          <header className="border-y border-zinc-900 dark:border-zinc-600 text-black dark:text-zinc-100">
            <div className="flex items-center">
              <div className="w-48 flex-shrink-0 h-16 text-center border-r border-zinc-900 dark:border-zinc-600">
                <div className="flex items-center justify-center h-full gap-2">
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-xs font-bold transition-colors duration-200 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black px-2 py-2"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    VOLTAR
                  </Link>
                  <LanguageSelector />
                </div>
              </div>
              <div className="flex-1 text-center py-3">
                <Link href="/">
                  <img className="w-24 mx-auto" src="/img/brics.png" alt="BRICS News" />
                </Link>
              </div>
              <div className="w-48 flex-shrink-0 h-16 text-center border-l border-zinc-900 dark:border-zinc-600">
                <div className="flex items-center justify-center h-full gap-2">
                  <button
                    onClick={handleSaveArticle}
                    className="flex items-center gap-1 text-xs font-bold transition-colors duration-200 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black px-2 py-2"
                  >
                    {isArticleSaved ? <BookmarkCheck className="w-3 h-3" /> : <Bookmark className="w-3 h-3" />}
                    {isArticleSaved ? t("news.saved") : t("news.save")}
                  </button>
                  <div className="relative">
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-1 text-xs font-bold transition-colors duration-200 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black px-2 py-2"
                    >
                      <Share2 className="w-3 h-3" />
                      SHARE
                    </button>
                    {showShareMenu && (
                      <div className="absolute top-full right-0 mt-1 bg-green-600 text-white px-2 py-1 text-xs rounded">
                        URL copiada!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Hero Image */}
          <section className="relative">
            <ImageWithFallback
              src={article.image || "/placeholder.svg"}
              alt={article.title}
              className="w-full h-[400px] md:h-[600px] object-cover"
              priority={true}
              fallbackSrc="/placeholder.svg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          </section>

          {/* Article Content */}
          <article className="border-b border-zinc-900 dark:border-zinc-600">
            <div className="p-6 md:p-12 max-w-4xl mx-auto">
              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="uppercase tracking-wider font-bold">{article.country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{article.readTime}</span>
                </div>
                <span className="uppercase tracking-wider font-bold">{article.category}</span>
                <span>{new Date(article.publishedAt).toLocaleDateString("pt-BR")}</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-serif leading-tight mb-6 dark:text-zinc-100">{article.title}</h1>

              {/* Summary */}
              <p className="text-xl text-zinc-700 dark:text-zinc-300 mb-8 leading-relaxed font-medium">
                {article.summary}
              </p>

              {/* YouTube Video */}
              {article.youtubeUrl && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3 dark:text-zinc-100">Vídeo Relacionado</h3>
                  <YouTubePlayer
                    youtubeUrl={article.youtubeUrl}
                    title={article.title}
                    className="w-full h-64 md:h-96"
                  />
                </div>
              )}

              {/* Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="whitespace-pre-line text-zinc-800 dark:text-zinc-200 leading-relaxed text-lg">
                  {article.content}
                </div>
              </div>

              {/* Source */}
              <div className="mt-12 pt-8 border-t border-zinc-300 dark:border-zinc-600">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    <span className="font-bold">{t("news.source")}</span> {article.source}
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleSaveArticle}
                      className="flex items-center gap-2 border border-zinc-900 dark:border-white px-6 py-2 text-xs font-bold tracking-widest hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors"
                    >
                      {isArticleSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      {isArticleSaved ? t("news.saved") : t("news.save")}
                    </button>
                    <Link
                      href="/"
                      className="border border-zinc-900 dark:border-white px-6 py-2 text-xs font-bold tracking-widest hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors"
                    >
                      VOLTAR PARA NOTÍCIAS
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Related Articles Section */}
          <section className="border-b border-zinc-900 dark:border-zinc-600 p-6 md:p-12">
            <h2 className="text-2xl md:text-3xl font-serif mb-8 text-center dark:text-zinc-100">Outras Notícias</h2>
            <div className="text-center">
              <Link
                href="/"
                className="inline-block border border-zinc-900 dark:border-white px-8 py-3 text-xs font-bold tracking-widest hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors"
              >
                VER TODAS AS NOTÍCIAS
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
