"use client"
import { useState } from "react"
import { Play, X } from "lucide-react"
import { extractYouTubeId, getYouTubeThumbnail, getYouTubeEmbedUrl } from "@/lib/youtube-utils"

interface YouTubePlayerProps {
  youtubeUrl: string
  title?: string
  className?: string
}

export function YouTubePlayer({ youtubeUrl, title, className }: YouTubePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  // Extrair ID do vídeo da URL
  const videoId = extractYouTubeId(youtubeUrl)

  if (!videoId) {
    return (
      <div className={`${className} bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center`}>
        <p className="text-zinc-500 dark:text-zinc-400">URL do YouTube inválida</p>
      </div>
    )
  }

  // Gerar thumbnail
  const thumbnailUrl = getYouTubeThumbnail(videoId, "max")

  if (isPlaying) {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsPlaying(false)}
          className="absolute top-2 right-2 z-10 bg-black bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90"
        >
          <X className="w-4 h-4" />
        </button>
        <iframe
          src={getYouTubeEmbedUrl(videoId, true)}
          title={title || "YouTube video"}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <div className={`relative cursor-pointer group ${className}`}>
      <img
        src={thumbnailUrl || "/placeholder.svg"}
        alt={title || "YouTube video thumbnail"}
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback para thumbnail de qualidade menor
          const target = e.target as HTMLImageElement
          target.src = getYouTubeThumbnail(videoId, "hq")
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
        <button
          onClick={() => setIsPlaying(true)}
          className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full transition-all duration-300 transform group-hover:scale-110"
        >
          <Play className="w-8 h-8 ml-1" fill="currentColor" />
        </button>
      </div>
      {title && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <p className="text-white text-sm font-medium line-clamp-2">{title}</p>
        </div>
      )}
    </div>
  )
}
