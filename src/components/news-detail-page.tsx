"use client"
import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, Clock, MapPin, Bookmark, BookmarkCheck, Share2 } from "lucide-react"
import { YouTubePlayer } from "./youtube-player"
import { ImageWithFallback } from "./image-with-fallback"
import { LanguageSelector } from "./language-selector"
import { useLanguage } from "@/contexts/language-context"
import { useSavedArticles } from "@/contexts/saved-articles-context"
import { useSanityNews } from "@/hooks/use-sanity-news"
import type { NewsArticle, SavedArticle } from "@/types"
import { fetchAndActivate, getValue } from "firebase/remote-config"
import { remoteConfig } from "../../firebaseConfig"
import { SavedNewsSidebar } from "./saved-news-sidebar"
import { AnimatePresence } from "framer-motion"

interface NewsDetailPageProps {
  article: NewsArticle
}

export function NewsDetailPage({ article }: NewsDetailPageProps) {
  const { t } = useLanguage()
  const { savedArticles, saveArticle, removeSavedArticle, isArticleSaved, savedCount } = useSavedArticles()
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [bannerPropaganda, setBannerPropaganda] = useState<string | null>(null)
  const [isSavedNewsOpen, setIsSavedNewsOpen] = useState(false)
  const { articles: allArticles } = useSanityNews()

  useEffect(() => {
    const loadRemoteConfig = async () => {
      if (!remoteConfig) {
        console.warn("Remote Config não disponível (provavelmente execução no servidor).")
        setBannerPropaganda("Banner indisponível")
        return
      }

      try {
        await fetchAndActivate(remoteConfig)
        const value = getValue(remoteConfig, "banner_detalhe")
        setBannerPropaganda(value.asString())
      } catch (err) {
        console.error("Erro ao carregar Remote Config:", err)
        setBannerPropaganda("Erro ao carregar banner")
      }
    }

    loadRemoteConfig()
  }, [])

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

  const handleReadSavedArticle = (article: SavedArticle) => {
    setIsSavedNewsOpen(false)
    if (article.slug) {
      window.location.href = `/news/${article.slug}`
    }
  }

  const relatedArticles = useMemo(() => {
    const filtered = allArticles.filter((a) => a.id !== article.id)

    let related = filtered.filter((a) => a.category === article.category)

    if (related.length < 4) {
      const sameCountry = filtered.filter((a) => a.country === article.country && !related.find((r) => r.id === a.id))
      related = [...related, ...sameCountry]
    }

    if (related.length < 4) {
      const recent = filtered
        .filter((a) => !related.find((r) => r.id === a.id))
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      related = [...related, ...recent]
    }

    return related.slice(0, 4)
  }, [allArticles, article])

  if (!article) return null

  return (
    <>
      <AnimatePresence>
        {isSavedNewsOpen && (
          <SavedNewsSidebar
            isOpen={isSavedNewsOpen}
            onClose={() => setIsSavedNewsOpen(false)}
            savedArticles={savedArticles}
            onRemoveArticle={removeSavedArticle}
            onReadArticle={handleReadSavedArticle}
          />
        )}
      </AnimatePresence>

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
                      onClick={() => setIsSavedNewsOpen(true)}
                      className="flex items-center gap-1 text-xs font-bold transition-colors duration-200 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black px-2 py-2"
                    >
                      <Bookmark className="w-3 h-3" />
                      {t("saved.button")} {savedCount}
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
                className="w-full h-[200px] md:h-[300px] object-cover"
                priority={true}
                fallbackSrc="/placeholder.svg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </section>

            {/* Article Content */}
            <article className="flex border-b border-zinc-900 dark:border-zinc-600">
              <div className="p-6 md:p-12 max-w-4xl mx-auto">
                <div className="w-full mx-auto flex mb-10">
                  <div className="">
                    {bannerPropaganda && bannerPropaganda.startsWith("http") ? (
                      <img className="w-full" src={bannerPropaganda || "/placeholder.svg"} alt="Propaganda" />
                    ) : (
                      <p className="text-center py-4 text-sm text-zinc-500 dark:text-zinc-400">
                        {bannerPropaganda || "Carregando..."}
                      </p>
                    )}
                  </div>
                </div>

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
                <h1 className="text-3xl md:text-5xl font-serif leading-tight mb-6 dark:text-zinc-100">
                  {article.title}
                </h1>

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
                        onClick={() => saveArticle(article)}
                        className="flex items-center gap-2 border border-zinc-900 dark:border-white px-6 py-2 text-xs font-bold tracking-widest hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors"
                      >
                        {isArticleSaved(article.id) ? (
                          <BookmarkCheck className="w-4 h-4" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                        {isArticleSaved(article.id) ? t("news.saved") : t("news.save")}
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

              {relatedArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {relatedArticles.map((relatedArticle) => (
                    <Link
                      key={relatedArticle.id}
                      href={relatedArticle.slug ? `/news/${relatedArticle.slug}` : "#"}
                      className="group"
                    >
                      <div className="border border-zinc-300 dark:border-zinc-600 hover:border-zinc-900 dark:hover:border-zinc-400 transition-colors">
                        <ImageWithFallback
                          src={relatedArticle.image || "/placeholder.svg"}
                          alt={relatedArticle.title}
                          className="w-full h-48 object-cover"
                          fallbackSrc="/placeholder.svg"
                        />
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-2 text-xs text-zinc-500 dark:text-zinc-400">
                            <MapPin className="w-3 h-3" />
                            <span className="uppercase font-bold">{relatedArticle.country}</span>
                            <span>•</span>
                            <span>{relatedArticle.category}</span>
                          </div>
                          <h3 className="font-serif text-sm leading-tight dark:text-zinc-200 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors line-clamp-3">
                            {relatedArticle.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                            <Clock className="w-3 h-3" />
                            <span>{relatedArticle.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-zinc-600 dark:text-zinc-400 mb-4">Nenhuma notícia relacionada encontrada.</p>
                </div>
              )}

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
    </>
  )
}
