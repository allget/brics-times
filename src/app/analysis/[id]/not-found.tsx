import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-zinc-200 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-serif mb-4">404</h1>
        <h2 className="text-2xl font-serif mb-6">Análise não encontrada</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          A análise que você está procurando não existe ou foi removida.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 border border-zinc-900 dark:border-white px-8 py-3 text-xs font-bold tracking-widest hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          VOLTAR PARA HOME
        </Link>
      </div>
    </div>
  )
}
