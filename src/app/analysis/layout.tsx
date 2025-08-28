import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Análises - BRICS News",
  description: "Análises aprofundadas sobre o BRICS e cooperação internacional",
}

export default function AnalysisLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
