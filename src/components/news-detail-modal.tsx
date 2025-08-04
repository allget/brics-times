"use client"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { X, Clock, MapPin, Bookmark, BookmarkCheck } from "lucide-react"
import type { NewsArticle } from "@/types"
import { YouTubePlayer } from "./youtube-player"
import { fetchAndActivate, getValue } from 'firebase/remote-config';
import { remoteConfig } from '../../firebaseConfig';


interface NewsDetailModalProps {
  article: NewsArticle | null
  onClose: () => void
  onSaveArticle: (article: NewsArticle) => void
  isSaved: boolean
}

export function NewsDetailModal({ article, onClose, onSaveArticle, isSaved }: NewsDetailModalProps) {
    // const [bannerPropaganda, setBannerPropaganda] = useState('Carregando...');
    const [bannerPropaganda, setBannerPropaganda] = useState<string | null>(null)
 
useEffect(() => {
  const loadRemoteConfig = async () => {
    if (!remoteConfig) {
      console.warn("Remote Config não disponível (provavelmente execução no servidor).");
      setBannerPropaganda("Banner indisponível");
      return;
    }

    try {
      await fetchAndActivate(remoteConfig);
      const value = getValue(remoteConfig, 'banner_detalhe');
      setBannerPropaganda(value.asString());
    } catch (err) {
      console.error('Erro ao carregar Remote Config:', err);
      setBannerPropaganda('Erro ao carregar banner');
    }
  };

  loadRemoteConfig();
}, []);
  if (!article) return null

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white dark:bg-[#1C1C1C] max-w-4xl max-h-[90vh] overflow-y-auto border border-black dark:border-zinc-600 scrollbar-thin"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <img
              src={article.image || "/placeholder.svg"}
              alt={article.title}
              className="w-full h-64 md:h-80 object-cover"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-2 hover:bg-opacity-90"
            >
              <X className="w-6 h-6" />
            </button>
            <button
              onClick={() => article && onSaveArticle(article)}
              className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-2 hover:bg-opacity-90 flex items-center gap-2"
            >
              {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex">
            <div className="flex gap-2">
                  {/* <img src={bannerPropaganda}/> */}
              {bannerPropaganda ? (
                <img src={bannerPropaganda} alt="Propaganda" />
              ) : (
                <p>Carregando...</p>
              )}
            </div>
          
          <div className="p-6 md:p-12">
          
            <div className="flex items-center gap-4 mb-6 text-sm text-zinc-600 dark:text-zinc-400">
                
              <div className="flex gap-2">
                <MapPin className="w-4 h-4" />
                <span className="uppercase tracking-wider font-bold">{article.country}</span>
              </div>
              <div className="flex gap-2">
                <Clock className="w-4 h-4" />
                <span>{article.readTime}</span>
              </div>
              <span className="uppercase tracking-wider font-bold">{article.category}</span>
              <span>{new Date(article.publishedAt).toLocaleDateString("pt-BR")}</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-serif leading-tight mb-6 dark:text-zinc-100">{article.title}</h1>

            <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-8 leading-relaxed">{article.summary}</p>

            {/* 🎥 Vídeo do YouTube se disponível */}
            {article.youtubeUrl && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3 dark:text-zinc-100">Vídeo Relacionado</h3>
                <YouTubePlayer youtubeUrl={article.youtubeUrl} title={article.title} className="w-full h-64 md:h-96" />
              </div>
            )}

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="whitespace-pre-line text-zinc-800 dark:text-zinc-200 leading-relaxed">
                {article.content}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-300 dark:border-zinc-600">
              <div className="flex items-center justify-between">
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="font-bold">Fonte:</span> {article.source}
                </div>
                <button
                  onClick={onClose}
                  className="border border-black dark:border-white px-8 py-3 text-xs font-bold tracking-widest hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors"
                >
                  FECHAR
                </button>
              </div>
            </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
