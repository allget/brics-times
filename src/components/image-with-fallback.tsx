"use client"
import { useState, useEffect } from "react"

interface ImageWithFallbackProps {
  src: string
  alt: string
  className?: string
  fallbackSrc?: string
  priority?: boolean
}

export function ImageWithFallback({
  src,
  alt,
  className,
  fallbackSrc = "/placeholder.svg",
  priority = false,
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Função para determinar a melhor fonte de imagem
  const getBestImageSrc = (originalSrc: string): string => {
    // Se não tem src ou é vazio, usa fallback
    if (!originalSrc || originalSrc.trim() === "") {
      return fallbackSrc
    }

    // Se é uma URL do Sanity, usa diretamente
    if (originalSrc.includes("cdn.sanity.io")) {
      return originalSrc
    }

    // Se é uma URL externa válida, usa diretamente
    if (originalSrc.startsWith("http")) {
      return originalSrc
    }

    // Se é um caminho local, usa diretamente
    if (originalSrc.startsWith("/")) {
      return originalSrc
    }

    // Caso contrário, usa fallback
    return fallbackSrc
  }

  useEffect(() => {
    setIsLoading(true)
    setHasError(false)

    const bestSrc = getBestImageSrc(src)
    setImgSrc(bestSrc)

    // Pre-load da imagem para verificar se carrega
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      setIsLoading(false)
      setHasError(false)
    }

    img.onerror = () => {
      setIsLoading(false)
      setHasError(true)
      setImgSrc(fallbackSrc)
    }

    img.src = bestSrc
  }, [src, fallbackSrc])

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setImgSrc(fallbackSrc)
    }
  }

  // Placeholder enquanto carrega
  if (isLoading) {
    return (
      <div className={`${className} bg-zinc-200 dark:bg-zinc-800 animate-pulse flex items-center justify-center`}>
        <div className="text-zinc-500 dark:text-zinc-400 text-sm">Carregando...</div>
      </div>
    )
  }

  return (
    <img
      src={imgSrc || "/placeholder.svg"}
      alt={alt}
      className={className}
      onError={handleError}
      loading={priority ? "eager" : "lazy"}
    />
  )
}
