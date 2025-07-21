"use client"
import { useLanguage } from "@/contexts/language-context"
import { Globe } from "lucide-react"

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as "pt-BR" | "en-US")}
        className="bg-transparent text-xs font-bold tracking-widest border-none focus:outline-none text-zinc-900 dark:text-zinc-100"
      >
        <option value="pt-BR" className="bg-white dark:bg-zinc-900">
          PT
        </option>
        <option value="en-US" className="bg-white dark:bg-zinc-900">
          EN
        </option>
      </select>
    </div>
  )
}
