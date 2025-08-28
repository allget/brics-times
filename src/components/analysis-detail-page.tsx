"use client"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Clock, User, Share2, Tag } from "lucide-react"
import { ImageWithFallback } from "./image-with-fallback"
import { LanguageSelector } from "./language-selector"
import { useLanguage } from "@/contexts/language-context"
import type { AnalysisArticle } from "@/types"

interface AnalysisDetailPageProps {
  analysis: AnalysisArticle
}

export function AnalysisDetailPage({ analysis }: AnalysisDetailPageProps) {
  const { t } = useLanguage()
  const [showShareMenu, setShowShareMenu] = useState(false)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: analysis.title,
          text: analysis.summary,
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
              src={analysis.thumbnail || "/placeholder.svg"}
              alt={analysis.title}
              className="w-full h-[400px] md:h-[500px] object-cover"
              priority={true}
              fallbackSrc="/placeholder.svg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            {/* Analysis Type Badge */}
            <div className="absolute top-4 left-4">
              <span className="bg-red-600 text-white px-3 py-1 text-xs font-bold tracking-wider">
                {analysis.analysisType}
              </span>
            </div>

            {analysis.featured && (
              <div className="absolute top-4 right-4">
                <span className="bg-yellow-600 text-white px-3 py-1 text-xs font-bold tracking-wider">DESTAQUE</span>
              </div>
            )}
          </section>

          {/* Article Content */}
          <article className="border-b border-zinc-900 dark:border-zinc-600">
            <div className="p-6 md:p-12 max-w-4xl mx-auto">
              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-bold">{analysis.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{analysis.readTime}</span>
                </div>
                <span>{new Date(analysis.publishedAt).toLocaleDateString("pt-BR")}</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-serif leading-tight mb-6 dark:text-zinc-100">
                {analysis.title}
              </h1>

              {/* Summary */}
              <p className="text-xl text-zinc-700 dark:text-zinc-300 mb-8 leading-relaxed font-medium border-l-4 border-red-600 pl-6 italic">
                {analysis.summary}
              </p>

              {/* Tags */}
              {analysis.tags && analysis.tags.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                    <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                      Tags
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 px-3 py-1 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="whitespace-pre-line text-zinc-800 dark:text-zinc-200 leading-relaxed text-lg">
                  {analysis.content}
                </div>
              </div>

              {/* Author Info */}
              <div className="mt-12 pt-8 border-t border-zinc-300 dark:border-zinc-600">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    <span className="font-bold">Análise por:</span> {analysis.author}
                    <br />
                    <span className="font-bold">Tipo:</span> {analysis.analysisType}
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-2 border border-zinc-900 dark:border-white px-6 py-2 text-xs font-bold tracking-widest hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      COMPARTILHAR
                    </button>
                    <Link
                      href="/"
                      className="border border-zinc-900 dark:border-white px-6 py-2 text-xs font-bold tracking-widest hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors"
                    >
                      VOLTAR PARA HOME
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Related Analysis Section */}
          <section className="border-b border-zinc-900 dark:border-zinc-600 p-6 md:p-12">
            <h2 className="text-2xl md:text-3xl font-serif mb-8 text-center dark:text-zinc-100">Outras Análises</h2>
            <div className="text-center">
              <Link
                href="/"
                className="inline-block border border-zinc-900 dark:border-white px-8 py-3 text-xs font-bold tracking-widest hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors"
              >
                VER TODAS AS ANÁLISES
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
