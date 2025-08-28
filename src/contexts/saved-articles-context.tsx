"use client"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { NewsArticle, SavedArticle } from "@/types"

interface SavedArticlesContextType {
  savedArticles: SavedArticle[]
  saveArticle: (article: NewsArticle) => void
  removeSavedArticle: (articleId: number) => void
  isArticleSaved: (articleId: number) => boolean
  savedCount: number
}

const SavedArticlesContext = createContext<SavedArticlesContextType | undefined>(undefined)

export function SavedArticlesProvider({ children }: { children: ReactNode }) {
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([])

  // Carregar artigos salvos do localStorage na inicialização
  useEffect(() => {
    const saved = localStorage.getItem("savedArticles")
    if (saved) {
      try {
        const parsedSaved = JSON.parse(saved)
        setSavedArticles(parsedSaved)
      } catch (error) {
        console.error("Erro ao carregar artigos salvos:", error)
        setSavedArticles([])
      }
    }
  }, [])

  // Salvar no localStorage sempre que o estado mudar
  useEffect(() => {
    localStorage.setItem("savedArticles", JSON.stringify(savedArticles))
  }, [savedArticles])

  const saveArticle = (article: NewsArticle) => {
    const isAlreadySaved = savedArticles.some((saved) => saved.id === article.id)

    if (isAlreadySaved) {
      // Remove se já estiver salvo
      setSavedArticles((prev) => prev.filter((saved) => saved.id !== article.id))
    } else {
      // Adiciona se não estiver salvo
      const savedArticle: SavedArticle = {
        ...article,
        savedAt: new Date().toISOString(),
      }
      setSavedArticles((prev) => [...prev, savedArticle])
    }
  }

  const removeSavedArticle = (articleId: number) => {
    setSavedArticles((prev) => prev.filter((saved) => saved.id !== articleId))
  }

  const isArticleSaved = (articleId: number) => {
    return savedArticles.some((saved) => saved.id === articleId)
  }

  const savedCount = savedArticles.length

  return (
    <SavedArticlesContext.Provider
      value={{
        savedArticles,
        saveArticle,
        removeSavedArticle,
        isArticleSaved,
        savedCount,
      }}
    >
      {children}
    </SavedArticlesContext.Provider>
  )
}

export function useSavedArticles() {
  const context = useContext(SavedArticlesContext)
  if (context === undefined) {
    throw new Error("useSavedArticles must be used within a SavedArticlesProvider")
  }
  return context
}
