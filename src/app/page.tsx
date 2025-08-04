"use client"

import { useState, useEffect, useMemo } from "react"
import { AnimatePresence } from "framer-motion"
import { SavedNewsSidebar } from "@/components/saved-news-sidebar"
import { NewsDetailModal } from "@/components/news-detail-modal"
import { Menu } from "@/components/menu"
import { Ticker } from "@/components/ticker"
import { LanguageSelector } from "@/components/language-selector"
import { ImageWithFallback } from "@/components/image-with-fallback"
import { useLanguage } from "@/contexts/language-context"
import { useSanityNews } from "@/hooks/use-sanity-news"
import { useAnalysis } from "@/hooks/use-analysis"
import { fetchAndActivate, getValue } from 'firebase/remote-config';
import { remoteConfig } from '../../firebaseConfig';

import {
  Bookmark,
  BookmarkCheck,
  Clock,
  MapPin,
  Search,
  Filter,
  RefreshCw,
  HardDrive,
  X,
  CheckCircle,
} from "lucide-react"
import type { NewsArticle, SavedArticle } from "@/types"

export default function Home() {
  const { t, language } = useLanguage()
  const { articles, featuredArticle, loading, error, isUsingSanity, refreshNews } = useSanityNews()
  const { analyses, loading: analysesLoading, isUsingSanity: isUsingAnalysisSanity } = useAnalysis()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSavedNewsOpen, setIsSavedNewsOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("TODOS")
  const [selectedCategory, setSelectedCategory] = useState("TODAS")
  const [showFilters, setShowFilters] = useState(false)
  // const [bannerPropaganda, setBannerPropaganda] = useState('Carregando...');
  const [bannerPropaganda, setBannerPropaganda] = useState<string | null>(null)

  // 🔧 CORREÇÃO: Atualizar filtros quando o idioma mudar
  useEffect(() => {
    // console.log("🌐 Idioma mudou para:", language)
    // console.log("🔄 Resetando filtros para o novo idioma")
    setSelectedCountry(t("country.all"))
    setSelectedCategory(t("category.all"))
  }, [language, t])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }

    if (mediaQuery.matches) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  const countries = [
    t("country.all"),
    t("country.brics"),
    t("country.brazil"),
    t("country.russia"),
    t("country.india"),
    t("country.china"),
    t("country.south-africa"),
    t("country.iran"),
    t("country.egypt"),
    t("country.ethiopia"),
    t("country.uae"),
    t("country.saudi-arabia"),
  ]

  const categories = [
    t("category.all"),
    t("category.economy"),
    t("category.technology"),
    t("category.health"),
    t("category.energy"),
    t("category.investments"),
    t("category.agriculture"),
    t("category.education"),
    t("category.environment"),
  ]

  const filteredArticles = useMemo(() => {

    return articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCountry = selectedCountry === t("country.all") || article.country === selectedCountry
      const matchesCategory = selectedCategory === t("category.all") || article.category === selectedCategory

      return matchesSearch && matchesCountry && matchesCategory
    })
  }, [articles, searchTerm, selectedCountry, selectedCategory, t])

  const handleSaveArticle = (article: NewsArticle) => {
    const isAlreadySaved = savedArticles.some((saved) => saved.id === article.id)

    if (isAlreadySaved) {
      setSavedArticles((prev) => prev.filter((saved) => saved.id !== article.id))
    } else {
      const savedArticle: SavedArticle = {
        ...article,
        savedAt: new Date().toISOString(),
      }
      setSavedArticles((prev) => [...prev, savedArticle])
    }
  }

  const handleRemoveSavedArticle = (articleId: number) => {
    setSavedArticles((prev) => prev.filter((saved) => saved.id !== articleId))
  }

  const handleReadSavedArticle = (article: SavedArticle) => {
    setSelectedArticle(article)
    setIsSavedNewsOpen(false)
  }

  const savedArticlesCount = savedArticles.length

  const handleMenuSavedNewsClick = () => {
    setIsMenuOpen(false)
    setIsSavedNewsOpen(true)
  }

  const isArticleSaved = (articleId: number) => {
    return savedArticles.some((saved) => saved.id === articleId)
  }

  const heroArticle = featuredArticle

useEffect(() => {
  const loadRemoteConfig = async () => {
    if (!remoteConfig) {
      console.warn("Remote Config não está disponível (SSR ou erro na inicialização).");
      setBannerPropaganda("Banner indisponível");
      return;
    }

    try {
      await fetchAndActivate(remoteConfig);
      const value = getValue(remoteConfig, 'banner_home');
      setBannerPropaganda(value.asString());
    } catch (err) {
      console.error('Erro ao carregar Remote Config:', err);
      setBannerPropaganda('Erro ao carregar banner');
    }
  };

  loadRemoteConfig();
}, []);


  const getHeroImageSrc = (): string => {
    // Prioridade 1: Imagem do artigo em destaque
    if (featuredArticle?.image && featuredArticle.image.trim() !== "") {
      return featuredArticle.image
    }

    // Prioridade 2: Imagem padrão do Unsplash
    return "https://images.unsplash.com/photo-1541746972996-4e0b0f93e586?w=1200&h=400&fit=crop"
  }

  return (
    <>
      <AnimatePresence>
        {isMenuOpen && (
          <Menu
            onClose={() => setIsMenuOpen(false)}
            onCartClick={handleMenuSavedNewsClick}
            cartItemCount={savedArticlesCount}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSavedNewsOpen && (
          <SavedNewsSidebar
            isOpen={isSavedNewsOpen}
            onClose={() => setIsSavedNewsOpen(false)}
            savedArticles={savedArticles}
            onRemoveArticle={handleRemoveSavedArticle}
            onReadArticle={handleReadSavedArticle}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedArticle && (
          <NewsDetailModal
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
            onSaveArticle={handleSaveArticle}
            isSaved={isArticleSaved(selectedArticle.id)}
          />
        )}
      </AnimatePresence>

      <main className="min-h-screen bg-white dark:bg-black text-black dark:text-zinc-200">
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[1440px] md:border-x border-zinc-900 dark:border-zinc-600 md:m-4">
            <header className="border-y border-zinc-900 dark:border-zinc-600 text-black dark:text-zinc-100">
              <div className="flex flex-wrap md:flex-nowrap items-center">
                <div className="order-2 md:order-1 w-1/3 md:w-48 flex-shrink-0 h-16 text-center border-r border-zinc-900 dark:border-zinc-600">
                  <div className="flex items-center justify-center h-full gap-2">
                    <button
                      onClick={() => setIsMenuOpen(true)}
                      className="text-xs font-bold transition-colors duration-200 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black px-2 py-2"
                    >
                      {t("menu.button")}
                    </button>
                    <LanguageSelector />
                  </div>
                </div>
                <div className="order-1 md:order-2 w-full md:flex-1 text-center py-3 border-b border-zinc-900 dark:border-zinc-600 md:border-b-0">
                  {/* <h1 className="text-3xl md:text-4xl tracking-[0.2em] font-normal font-unica-one">
                    {t("site.title")}
                  </h1> */}
                  <img className="w-24 mx-auto" src="/img/brics.png" />
                </div>
                <div className="order-3 md:order-3 w-2/3 md:w-48 flex-shrink-0 h-16 text-center border-l-0 md:border-l border-zinc-900 dark:border-zinc-600">
                  <div className="flex items-center justify-center h-full gap-2">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-1 text-xs font-bold transition-colors duration-200 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black px-2 py-2"
                    >
                      <Filter className="w-3 h-3" />
                      {t("filters.button")}
                    </button>
                    <button
                      onClick={() => setIsSavedNewsOpen(true)}
                      className="text-xs font-bold transition-colors duration-200 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black px-2 py-2"
                    >
                      {t("saved.button")} {savedArticlesCount}
                    </button>
                  </div>
                </div>
              </div>
            </header>

            <Ticker />

            {/* Data Source Indicator */}
            <div className="border-b border-zinc-900 dark:border-zinc-600 px-4 py-2 bg-zinc-50 dark:bg-zinc-900">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {isUsingSanity ? (
                    <>
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <span className="text-green-600 font-bold">SANITY CMS CONECTADO</span>
                      <span className="text-zinc-500">
                        • {isUsingSanity ? "1 destaque + " : ""}
                        {articles.length} artigos carregados
                      </span>
                    </>
                  ) : (
                    <>
                      <HardDrive className="w-3 h-3 text-orange-600" />
                      <span className="text-orange-600 font-bold">MODO DEMO</span>
                      <span className="text-zinc-500">• Usando dados de exemplo</span>
                    </>
                  )}
                </div>
                <button
                  onClick={refreshNews}
                  disabled={loading}
                  className="flex items-center gap-1 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
                  <span>REFRESH</span>
                </button>
              </div>
              {error && <div className="mt-1 text-xs text-orange-600">{error}</div>}
            </div>

            {/* Collapsible Filters Section */}
            <AnimatePresence>
              {showFilters && (
                <section className="border-b border-zinc-900 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900">
                  <div className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold tracking-widest">{t("filters.button")}</h3>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-center">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                          type="text"
                          placeholder={t("search.placeholder")}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-zinc-900 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-400"
                        />
                      </div>
                      <div className="flex gap-4">
                        <select
                          value={selectedCountry}
                          onChange={(e) => setSelectedCountry(e.target.value)}
                          className="p-3 border border-zinc-900 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm min-w-[120px]"
                        >
                          {countries.map((country) => (
                            <option key={country} value={country} className="bg-white dark:bg-zinc-800">
                              {country}
                            </option>
                          ))}
                        </select>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="p-3 border border-zinc-900 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm min-w-[120px]"
                        >
                          {categories.map((category) => (
                            <option key={category} value={category} className="bg-white dark:bg-zinc-800">
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">
                        {filteredArticles.length}{" "}
                        {filteredArticles.length === 1 ? t("filters.results") : t("filters.results.plural")}
                      </span>
                      <button
                        onClick={() => {
                          setSearchTerm("")
                          setSelectedCountry(t("country.all"))
                          setSelectedCategory(t("category.all"))
                        }}
                        className="text-xs font-bold tracking-widest text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                      >
                        {t("filters.clear")}
                      </button>
                    </div>
                  </div>
                </section>
              )}
            </AnimatePresence>

            {/* HERO SECTION - CORRIGIDA */}
            <section>
              <div className="relative border-b border-zinc-900 dark:border-zinc-600">
                <ImageWithFallback
                  src={getHeroImageSrc() || "/placeholder.svg"}
                  alt={heroArticle?.title || "Cúpula dos países BRICS"}
                  className="w-full h-[550px] object-cover"
                  priority={true}
                  fallbackSrc="https://images.unsplash.com/photo-1541746972996-4e0b0f93e586?w=1200&h=400&fit=crop"
                />
              </div>
            </section>

            {/* Rest of the component remains the same... */}
            <section className="border-t border-b border-zinc-900 dark:border-zinc-600">
              <div className="flex flex-col md:flex-row justify-between items-center p-4 md:p-10 text-center md:text-left">
                <div className="mb-4 md:mb-0">
                  <p className="text-base md:text-xl font-semibold tracking-wider uppercase dark:text-zinc-200">
                    {t("section.cooperation")}
                  </p>
                  {/* <p className="text-base md:text-xl font-semibold tracking-wider uppercase dark:text-zinc-200">
                    {t("section.cooperation.subtitle")}
                  </p> */}
                  {heroArticle && (
                    <p className="text-base md:text-xl font-semibold tracking-wider uppercase dark:text-zinc-200 line-clamp-2">
                      {heroArticle.title}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => heroArticle && setSelectedArticle(heroArticle)}
                  className="border border-zinc-900 dark:border-white px-6 py-4 text-xs font-bold tracking-widest hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors"
                >
                  {t("news.read.more")}
                </button>
              </div>
            </section>

            <section>
              <h2 className="text-center text-3xl md:text-4xl py-10 font-serif tracking-wider dark:text-zinc-100">
                {searchTerm || selectedCountry !== t("country.all") || selectedCategory !== t("category.all")
                  ? t("news.search.results")
                  : t("news.recent")}
              </h2>

              {loading && (
                <div className="text-center py-10">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-zinc-600" />
                  <p className="text-zinc-600 dark:text-zinc-400">Loading fresh news...</p>
                </div>
              )}
            
              <div>
                {bannerPropaganda && bannerPropaganda.startsWith("http") ? (
                  <img src={bannerPropaganda} alt="Propaganda" />
                ) : (
                  <p className="text-center py-4 text-sm text-zinc-500 dark:text-zinc-400">
                    {bannerPropaganda || "Carregando..."}
                  </p>
                )}
                {/* <img src={bannerPropaganda}/> */}
              </div>
              {!loading && filteredArticles.length === 0 ? (
                <div className="text-center py-20 border-t border-zinc-900 dark:border-zinc-600">
                  <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-4">{t("news.no.results")}</p>
                  <button
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCountry(t("country.all"))
                      setSelectedCategory(t("category.all"))
                    }}
                    className="border border-zinc-900 dark:border-white px-6 py-3 text-xs font-bold tracking-widest hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors"
                  >
                    {t("news.see.all")}
                  </button>
                </div>
              ) : (
                !loading && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-zinc-900 dark:border-zinc-600">
                    {filteredArticles.map((article) => (
                      <div key={article.id} className="flex flex-col">
                        <div className="group relative border-r border-b border-zinc-900 dark:border-zinc-600 p-4 md:p-10 last:border-r-0">
                          {article.status && (
                            <div className="absolute top-2 right-2 bg-red-700 text-white text-xs px-2 py-1 z-10">
                              {article.status}
                            </div>
                          )}
                          <div className="relative">
                            <ImageWithFallback
                              src={article.image || "/placeholder.svg"}
                              alt={article.title}
                              className="w-full h-auto object-cover aspect-square"
                              fallbackSrc="/placeholder.svg"
                            />
                            <div className="absolute inset-0 bg-white dark:bg-black bg-opacity-70 dark:bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="text-center space-y-3">
                                <button
                                  onClick={() => setSelectedArticle(article)}
                                  className="block w-full bg-zinc-900 dark:bg-white text-white dark:text-black py-3 text-xs tracking-widest font-bold px-10"
                                >
                                  {t("news.read")}
                                </button>
                                <button
                                  onClick={() => handleSaveArticle(article)}
                                  className="flex items-center justify-center gap-2 w-full border border-zinc-900 dark:border-white py-2 text-xs tracking-widest font-bold px-6 hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors"
                                >
                                  {isArticleSaved(article.id) ? (
                                    <>
                                      <BookmarkCheck className="w-4 h-4" />
                                      {t("news.saved")}
                                    </>
                                  ) : (
                                    <>
                                      <Bookmark className="w-4 h-4" />
                                      {t("news.save")}
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col justify-center items-center border-zinc-900 dark:border-zinc-600 w-full px-4 border-r dark:border-r-zinc-600 min-h-[120px]">
                          <h3 className="font-serif text-center py-2 text-sm leading-tight dark:text-zinc-200 line-clamp-2">
                            {article.title}
                          </h3>
                          <div className="flex items-center gap-4 text-xs text-zinc-600 dark:text-zinc-400 mt-2">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span className="uppercase font-bold">{article.country}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{article.readTime}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </section>

            {/* Rest of sections remain the same as before... */}
            {/* <section className="border-b border-zinc-900 dark:border-zinc-600">
              <div className="flex flex-wrap">
                <div className="w-full md:w-1/3 p-4 md:p-10">
                  <ImageWithFallback
                    src="/images/brics-economy.png"
                    alt="Cooperação econômica BRICS"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-full md:w-2/3 p-6 md:p-12 lg:p-20 flex flex-col justify-between border-t md:border-t-0 md:border-l border-zinc-900 dark:border-zinc-600">
                  <div>
                    <h2 className="text-2xl md:text-4xl font-serif tracking-wider leading-tight dark:text-zinc-100">
                      {t("section.economic")}
                    </h2>
                    <p className="mt-6 text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                      {t("section.economic.description")}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCategory(t("category.economy"))
                      setShowFilters(true)
                    }}
                    className="mt-8 self-start border border-zinc-900 dark:border-white px-8 py-3 text-xs font-bold tracking-widest hover:bg-zinc-800 dark:hover:bg-white dark:hover:text-black hover:text-white transition-colors"
                  >
                    {t("section.economic.button")}
                  </button>
                </div>
              </div>
            </section> */}

            {/* <section className="border-b border-zinc-900 dark:border-zinc-600">
              <div className="flex flex-wrap">
                <div className="w-full md:w-2/3 p-6 md:p-12 lg:p-20 flex flex-col justify-center">
                  <h2 className="text-2xl md:text-3xl font-serif tracking-wider leading-snug dark:text-zinc-100">
                    {t("section.technology")}
                  </h2>
                  <button
                    onClick={() => {
                      setSelectedCategory(t("category.technology"))
                      setShowFilters(true)
                    }}
                    className="mt-8 self-start border border-zinc-900 dark:border-white px-8 py-3 text-xs font-bold tracking-widest hover:bg-zinc-800 dark:hover:bg-white dark:hover:text-black hover:text-white transition-colors"
                  >
                    {t("section.technology.button")}
                  </button>
                </div>
                <div className="w-full md:w-1/3 p-4 md:p-10 border-t md:border-t-0 md:border-l border-zinc-900 dark:border-zinc-600">
                  <ImageWithFallback
                    src="/images/brics-technology.png"
                    alt="Inovação tecnológica BRICS"
                    className="w-full object-cover aspect-video"
                  />
                </div>
              </div>
            </section> */}

            {/* <section className="border-b border-zinc-900 dark:border-zinc-600">
              <div className="flex flex-wrap">
                <div className="w-full md:w-2/3 p-6 md:p-12 lg:p-20 flex flex-col justify-center">
                  <h2 className="text-2xl md:text-3xl font-serif tracking-wider leading-snug dark:text-zinc-100">
                    {t("section.health")}
                  </h2>
                  <button
                    onClick={() => {
                      setSelectedCategory(t("category.health"))
                      setShowFilters(true)
                    }}
                    className="mt-8 self-start border border-zinc-900 dark:border-white px-8 py-3 text-xs font-bold tracking-widest hover:bg-zinc-800 dark:hover:bg-white dark:hover:text-black hover:text-white transition-colors"
                  >
                    {t("section.health.button")}
                  </button>
                </div>
                <div className="w-full md:w-1/3 p-4 md:p-10 border-t md:border-t-0 md:border-l border-zinc-900 dark:border-zinc-600">
                  <ImageWithFallback
                    src="/images/brics-health.png"
                    alt="Cooperação em saúde BRICS"
                    className="w-full object-cover aspect-video"
                  />
                </div>
              </div>
            </section> */}

            <section className="border-t border-zinc-900 dark:border-zinc-600 ">
              <h2 className="text-center text-3xl md:text-4xl py-10 font-serif tracking-wider dark:text-zinc-100">
                {t("section.members")}
              </h2>
              <div className="grid grid-cols-6 lg:grid-cols-12 gap-6 border-t border-zinc-900 dark:border-zinc-600 p-8">
                <div>
                  <a href="https://www.gov.br/planalto/en" target="_blank" rel="noreferrer">
                    <img className="rounded-md" src="/img/flags/br.svg" />
                  </a>
                </div>
                <div>
                  <a href="https://www.gov.cn/" target="_blank" rel="noreferrer">
                    <img className="rounded-md" src="/img/flags/cn.svg" />
                  </a>
                </div>
                <div>
                  <a href="https://www.presidency.eg/en" target="_blank" rel="noreferrer">
                    <img className="rounded-md" src="/img/flags/eg.svg" />
                  </a>
                </div>
                <div>
                  <a href="https://www.ethiopia.gov.et/" target="_blank" rel="noreferrer">
                    <img className="rounded-md" src="/img/flags/et.svg" />
                  </a>
                </div>
                <div>
                  <a href="https://www.indonesia.go.id/" target="_blank" rel="noreferrer">
                    <img className="rounded-md" src="/img/flags/id.svg" />
                  </a>
                </div>
                <div>
                  <a href="https://www.india.gov.in/" target="_blank" rel="noreferrer">
                    <img className="rounded-md" src="/img/flags/in.svg" />
                  </a>
                </div>
                <div>
                  <a href="https://president.ir/en" target="_blank" rel="noreferrer">
                    <img className="rounded-md" src="/img/flags/ir.svg" />
                  </a>
                </div>
                <div>
                  <a href="http://government.ru/en/" target="_blank" rel="noreferrer">
                    <img className="rounded-md" src="/img/flags/ru.svg" />
                  </a>
                </div>
                <div>
                  <a href="https://my.gov.sa/en" target="_blank" rel="noreferrer">
                    <img className="rounded-md" src="/img/flags/sa.svg" />
                  </a>
                </div>
                <div>
                  <a href="https://www.gov.za/" target="_blank" rel="noreferrer">
                    <img className="rounded-md" src="/img/flags/za.svg" />
                  </a>
                </div>
                <div>
                  <a href="https://u.ae/" target="_blank" rel="noreferrer">
                    <img className="rounded-md" src="/img/flags/ae.svg" />
                  </a>
                </div>
              </div>
            </section>

            <section className="border-b border-t border-zinc-900 dark:border-zinc-600 p-4">
              <div className="relative text-center text-white">
                <ImageWithFallback
                  src={
                    articles[1]?.image ||
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop" ||
                    "/placeholder.svg" ||
                    "/placeholder.svg" ||
                    "/placeholder.svg" ||
                    "/placeholder.svg" ||
                    "/placeholder.svg" ||
                    "/placeholder.svg" ||
                    "/placeholder.svg"
                  }
                  alt="Arquivo BRICS"
                  className="w-full h-[400px] md:h-[600px] object-cover"
                  fallbackSrc="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70">
                  <h2 className="text-4xl md:text-7xl font-serif tracking-[0.3em] text-center px-4">
                    {t("section.archive")}
                  </h2>
                  <p className="mt-4 text-sm tracking-wider text-center px-4">{t("section.archive.subtitle")}</p>
                  <button
                    onClick={() => articles[1] && setSelectedArticle(articles[1])}
                    className="mt-8 border-2 border-white px-10 py-3 text-xs font-bold tracking-widest hover:bg-white hover:text-black transition-colors"
                  >
                    {t("section.archive.button")}
                  </button>
                </div>
              </div>
            </section>

            <section className="border-b border-zinc-900 dark:border-zinc-600">
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-zinc-900 dark:border-zinc-600">
                <h2 className="text-3xl md:text-4xl font-serif tracking-wider dark:text-zinc-100">
                  {t("section.analyses")}
                </h2>
                <div className="flex items-center gap-2 text-xs">
                  {isUsingAnalysisSanity ? (
                    <>
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <span className="text-green-600 font-bold">SANITY</span>
                    </>
                  ) : (
                    <>
                      <HardDrive className="w-3 h-3 text-orange-600" />
                      <span className="text-orange-600 font-bold">DEMO</span>
                    </>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2">
                {analysesLoading ? (
                  <div className="p-8 text-center">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-zinc-600" />
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">Carregando análises...</p>
                  </div>
                ) : (
                  <>
                    {analyses.slice(0, 2).map((analysis, index) => (
                      <div
                        key={analysis.id}
                        className={`p-4 md:p-8 flex flex-col sm:flex-row gap-4 ${index === 0 ? "border-b md:border-b-0 md:border-r" : ""} border-zinc-900 dark:border-zinc-600`}
                      >
                        <div className="w-full sm:w-1/2">
                          <ImageWithFallback
                            src={analysis.thumbnail || "/placeholder.svg"}
                            alt={analysis.title}
                            className="w-full h-auto object-cover aspect-square"
                            fallbackSrc="/img/analysis-default.jpg"
                          />
                        </div>
                        <div className="w-full sm:w-1/2 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs bg-zinc-200 dark:bg-zinc-700 px-2 py-1 rounded">
                                {analysis.analysisType}
                              </span>
                              {analysis.featured && (
                                <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">DESTAQUE</span>
                              )}
                            </div>
                            <h3 className="text-lg md:text-xl font-serif font-bold dark:text-zinc-100 line-clamp-2">
                              {analysis.title}
                            </h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 uppercase">
                              {new Date(analysis.publishedAt).toLocaleDateString("pt-BR")} • {analysis.author}
                            </p>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-2">
                              {analysis.summary}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              // Converter análise para NewsArticle para usar o modal existente
                              const analysisAsNews = {
                                id: analysis.id,
                                title: analysis.title,
                                summary: analysis.summary,
                                content: analysis.content,
                                image: analysis.thumbnail, // Já vem processada do hook
                                country: "BRICS",
                                category: analysis.analysisType,
                                publishedAt: analysis.publishedAt,
                                readTime: analysis.readTime,
                                source: `Análise por ${analysis.author}`,
                              }
                              setSelectedArticle(analysisAsNews)
                            }}
                            className="text-xs font-bold tracking-widest self-start dark:text-zinc-300 dark:hover:text-white hover:underline mt-3"
                          >
                            LER ANÁLISE
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
              <div className="border-t border-zinc-900 dark:border-zinc-600 p-6 md:p-12 flex flex-col md:flex-row justify-between items-center">
                <div className="w-full md:w-2/3 md:pr-8 mb-4 md:mb-0 text-center md:text-left">
                  <p className="text-xl md:text-2xl font-serif leading-snug dark:text-zinc-200">
                    {t("section.newsletter")}
                  </p>
                </div>
                <div className="w-full md:w-1/3">
                  <form className="flex" onSubmit={(e) => e.preventDefault()}>
                    <input
                      type="email"
                      placeholder={t("section.newsletter.placeholder")}
                      className="border border-r-0 border-zinc-900 dark:border-white px-4 py-3 w-full text-sm bg-transparent dark:placeholder-zinc-400"
                    />
                    <button
                      type="submit"
                      className="bg-zinc-900 dark:bg-white text-white dark:text-black px-6 py-3 text-xs font-bold tracking-widest border border-zinc-900 dark:border-white hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                    >
                      {t("section.newsletter.button")}
                    </button>
                  </form>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  )
}
