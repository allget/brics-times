export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-zinc-200 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 dark:border-white mx-auto mb-4"></div>
        <p className="text-zinc-600 dark:text-zinc-400">Carregando análise...</p>
      </div>
    </div>
  )
}
