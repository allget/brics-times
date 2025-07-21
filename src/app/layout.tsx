import type React from "react"
import type { Metadata } from "next"
import { Unica_One, IBM_Plex_Mono, Russo_One } from "next/font/google"
import { LanguageProvider } from "@/contexts/language-context"
import "./globals.css"

const unicaOne = Unica_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-unica-one",
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
})

const russoOne = Russo_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-russo-one",
})

export const metadata: Metadata = {
  title: "BRICS News",
  description: "Latest news from BRICS countries",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${unicaOne.variable} ${ibmPlexMono.variable} ${russoOne.variable}`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
