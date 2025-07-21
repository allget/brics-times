/**
 * Extrai o ID do vídeo de uma URL do YouTube
 * Suporta formatos: youtube.com/watch?v=ID e youtu.be/ID
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null

  // Padrão para youtube.com/watch?v=VIDEO_ID
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)

  if (youtubeMatch && youtubeMatch[1]) {
    return youtubeMatch[1]
  }

  return null
}

/**
 * Gera URL do thumbnail do YouTube
 */
export function getYouTubeThumbnail(videoId: string, quality: "default" | "hq" | "max" = "hq"): string {
  const qualityMap = {
    default: "default",
    hq: "hqdefault",
    max: "maxresdefault",
  }

  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`
}

/**
 * Gera URL de embed do YouTube
 */
export function getYouTubeEmbedUrl(videoId: string, autoplay = false): string {
  const params = new URLSearchParams({
    rel: "0", // Não mostrar vídeos relacionados
    modestbranding: "1", // Logo menor do YouTube
    ...(autoplay && { autoplay: "1" }),
  })

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
}
