"use client"
import { motion } from "framer-motion"
import { X, Clock, MapPin, Trash2 } from "lucide-react"
import type { SavedArticle } from "@/types"

interface SavedNewsSidebarProps {
  isOpen: boolean
  onClose: () => void
  savedArticles: SavedArticle[]
  onRemoveArticle: (id: number) => void
  onReadArticle: (article: SavedArticle) => void
}

export function SavedNewsSidebar({
  isOpen,
  onClose,
  savedArticles,
  onRemoveArticle,
  onReadArticle,
}: SavedNewsSidebarProps) {
  if (!isOpen) return null

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-[#1C1C1C] text-black dark:text-gray-100 z-50 shadow-lg border-l border-gray-300 dark:border-gray-600 flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-300 dark:border-gray-600">
          <h2 className="text-xl font-serif dark:text-gray-50">Notícias Salvas</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {savedArticles.length === 0 ? (
          <div className="flex-grow flex items-center justify-center">
            <p className="text-center text-zinc-600 dark:text-zinc-400">Nenhuma notícia salva ainda.</p>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto">
            {savedArticles.map((article) => (
              <div key={article.id} className="border-b border-gray-300 dark:border-gray-600 p-4">
                <div className="flex gap-4">
                  <img
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    className="w-20 h-20 object-cover flex-shrink-0"
                  />
                  <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3
                        className="font-semibold text-sm leading-tight cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300 line-clamp-2"
                        onClick={() => onReadArticle(article)}
                      >
                        {article.title}
                      </h3>
                      <button
                        onClick={() => onRemoveArticle(article.id)}
                        className="ml-2 text-zinc-500 hover:text-red-600 flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                      <MapPin className="w-3 h-3" />
                      <span className="uppercase font-bold">{article.country}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                      <Clock className="w-3 h-3" />
                      <span>Salvo em {new Date(article.savedAt).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {savedArticles.length > 0 && (
          <div className="p-6 border-t border-gray-300 dark:border-gray-600">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              {savedArticles.length} notícia{savedArticles.length !== 1 ? "s" : ""} salva
              {savedArticles.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </motion.div>
    </>
  )
}
