"use client"
import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "pt-BR" | "en-US"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  "pt-BR": {
    // Header
    "site.title": "BRICS NEWS.",
    "menu.button": "MENU",
    "saved.button": "SALVAS",
    "close.button": "FECHAR",

    // Ticker
    "ticker.currencies": "MOEDAS:",
    "ticker.weather": "CLIMA:",

    // Search and Filters
    "search.placeholder": "Buscar notícias...",
    "filters.button": "FILTROS",
    "filters.country": "PAÍS",
    "filters.category": "CATEGORIA",
    "filters.clear": "LIMPAR FILTROS",
    "filters.results": "notícia encontrada",
    "filters.results.plural": "notícias encontradas",

    // Countries
    "country.all": "TODOS",
    "country.brics": "BRICS",
    "country.brazil": "Brasil",
    "country.russia": "Rússia",
    "country.india": "Índia",
    "country.china": "China",
    "country.south-africa": "África do Sul",
    "country.iran": "Irã",
    "country.egypt": "Egito",
    "country.ethiopia": "Etiópia",
    "country.uae": "Emirados Árabes Unidos",
    "country.saudi-arabia": "Arábia Saudita",

    // Categories
    "category.all": "TODAS",
    "category.economy": "Economia",
    "category.technology": "Tecnologia",
    "category.health": "Saúde",
    "category.energy": "Energia",
    "category.investments": "Investimentos",
    "category.agriculture": "Agricultura",
    "category.education": "Educação",
    "category.environment": "Meio Ambiente",

    // News
    "news.recent": "Notícias Recentes",
    "news.search.results": "Resultados da Busca",
    "news.read": "LER NOTÍCIA",
    "news.save": "SALVAR",
    "news.saved": "SALVA",
    "news.read.more": "LER MAIS",
    "news.no.results": "Nenhuma notícia encontrada",
    "news.see.all": "VER TODAS AS NOTÍCIAS",
    "news.source": "Fonte:",
    "news.close": "FECHAR",
    "news.saved.none": "Nenhuma notícia salva ainda.",
    "news.saved.title": "Notícias Salvas",
    "news.saved.at": "Salvo em",

    // Sections
    "section.cooperation": "ÚLTIMAS NOTÍCIAS // Cooperação BRICS:",
    "section.cooperation.subtitle": "Fortalecendo laços entre economias emergentes",
    "section.economic": "COOPERAÇÃO ECONÔMICA / Fortalecendo o comércio entre economias emergentes",
    "section.economic.description":
      "Os países do BRICS continuam expandindo sua cooperação econômica através de acordos comerciais bilaterais, sistemas de pagamento alternativos e investimentos em infraestrutura. O bloco representa mais de 40% da população mundial e cerca de 25% do PIB global.",
    "section.economic.button": "VER NOTÍCIAS ECONÔMICAS",
    "section.technology": "TECNOLOGIA E INOVAÇÃO / Parcerias estratégicas em IA, 5G e energia renovável",
    "section.technology.button": "VER NOTÍCIAS DE TECNOLOGIA",
    "section.health": "SAÚDE E COOPERAÇÃO / Medicamentos essenciais e pesquisa médica colaborativa",
    "section.health.button": "VER NOTÍCIAS DE SAÚDE",
    "section.archive": "ARQUIVO BRICS",
    "section.archive.subtitle": "HISTÓRICO COMPLETO DE NOTÍCIAS E DOCUMENTOS OFICIAIS",
    "section.archive.button": "ACESSAR ARQUIVO",
    "section.about":
      "O BRICS representa uma nova ordem mundial multipolar, onde economias emergentes lideram a cooperação internacional em áreas estratégicas como economia, tecnologia e sustentabilidade.",
    "section.about.button": "SAIBA MAIS",
    "section.analyses": "Análises",
    "section.newsletter": "Receba as últimas notícias e análises sobre o BRICS diretamente no seu email.",
    "section.newsletter.placeholder": "Digite seu email",
    "section.newsletter.button": "INSCREVER",
    "section.members": "Países membros",

    // Menu
    "menu.news": "Notícias",
    "menu.resources": "Recursos",
    "menu.latest": "ÚLTIMAS",
    "menu.all.news": "TODAS AS NOTÍCIAS",
    "menu.new.members": "NOVOS MEMBROS",
    "menu.about.brics": "SOBRE O BRICS",
    "menu.archive": "ARQUIVO",
    "menu.analyses": "ANÁLISES",
    "menu.newsletter": "NEWSLETTER",
    "menu.contact": "CONTATO",
    "menu.account": "CONTA",
    "menu.search": "SEARCH",

    // Cities
    "city.brasilia": "Brasília",
    "city.moscow": "Moscou",
    "city.new-delhi": "Nova Delhi",
    "city.beijing": "Pequim",
    "city.pretoria": "Pretória",
    "city.tehran": "Teerã",
    "city.cairo": "Cairo",
    "city.addis-ababa": "Adis Abeba",
    "city.abu-dhabi": "Abu Dhabi",
    "city.riyadh": "Riad",
  },
  "en-US": {
    // Header
    "site.title": "BRICS NEWS.",
    "menu.button": "MENU",
    "saved.button": "SAVED",
    "close.button": "CLOSE",

    // Ticker
    "ticker.currencies": "CURRENCIES:",
    "ticker.weather": "WEATHER:",

    // Search and Filters
    "search.placeholder": "Search news...",
    "filters.button": "FILTERS",
    "filters.country": "COUNTRY",
    "filters.category": "CATEGORY",
    "filters.clear": "CLEAR FILTERS",
    "filters.results": "news found",
    "filters.results.plural": "news found",

    // Countries
    "country.all": "ALL",
    "country.brics": "BRICS",
    "country.brazil": "Brazil",
    "country.russia": "Russia",
    "country.india": "India",
    "country.china": "China",
    "country.south-africa": "South Africa",
    "country.iran": "Iran",
    "country.egypt": "Egypt",
    "country.ethiopia": "Ethiopia",
    "country.uae": "United Arab Emirates",
    "country.saudi-arabia": "Saudi Arabia",

    // Categories
    "category.all": "ALL",
    "category.economy": "Economy",
    "category.technology": "Technology",
    "category.health": "Health",
    "category.energy": "Energy",
    "category.investments": "Investments",
    "category.agriculture": "Agriculture",
    "category.education": "Education",
    "category.environment": "Environment",

    // News
    "news.recent": "Recent News",
    "news.search.results": "Search Results",
    "news.read": "READ NEWS",
    "news.save": "SAVE",
    "news.saved": "SAVED",
    "news.read.more": "READ MORE",
    "news.no.results": "No news found",
    "news.see.all": "SEE ALL NEWS",
    "news.source": "Source:",
    "news.close": "CLOSE",
    "news.saved.none": "No saved news yet.",
    "news.saved.title": "Saved News",
    "news.saved.at": "Saved on",

    // Sections
    "section.cooperation": "LATEST NEWS // BRICS Cooperation:",
    "section.cooperation.subtitle": "Strengthening ties between emerging economies",
    "section.economic": "ECONOMIC COOPERATION / Strengthening trade between emerging economies",
    "section.economic.description":
      "BRICS countries continue to expand their economic cooperation through bilateral trade agreements, alternative payment systems and infrastructure investments. The bloc represents more than 40% of the world's population and about 25% of global GDP.",
    "section.economic.button": "SEE ECONOMIC NEWS",
    "section.technology": "TECHNOLOGY & INNOVATION / Strategic partnerships in AI, 5G and renewable energy",
    "section.technology.button": "SEE TECHNOLOGY NEWS",
    "section.health": "HEALTH & COOPERATION / Essential medicines and collaborative medical research",
    "section.health.button": "SEE HEALTH NEWS",
    "section.archive": "BRICS ARCHIVE",
    "section.archive.subtitle": "COMPLETE HISTORY OF NEWS AND OFFICIAL DOCUMENTS",
    "section.archive.button": "ACCESS ARCHIVE",
    "section.about":
      "BRICS represents a new multipolar world order, where emerging economies lead international cooperation in strategic areas such as economy, technology and sustainability.",
    "section.about.button": "LEARN MORE",
    "section.analyses": "Analysis",
    "section.newsletter": "Get the latest BRICS news and analysis directly in your email.",
    "section.newsletter.placeholder": "Enter your email",
    "section.newsletter.button": "SUBSCRIBE",
    "section.members": "Member countries",

    // Menu
    "menu.news": "News",
    "menu.resources": "Resources",
    "menu.latest": "LATEST",
    "menu.all.news": "ALL NEWS",
    "menu.new.members": "NEW MEMBERS",
    "menu.about.brics": "ABOUT BRICS",
    "menu.archive": "ARCHIVE",
    "menu.analyses": "ANALYSIS",
    "menu.newsletter": "NEWSLETTER",
    "menu.contact": "CONTACT",
    "menu.account": "ACCOUNT",
    "menu.search": "SEARCH",

    // Cities
    "city.brasilia": "Brasília",
    "city.moscow": "Moscow",
    "city.new-delhi": "New Delhi",
    "city.beijing": "Beijing",
    "city.pretoria": "Pretoria",
    "city.tehran": "Tehran",
    "city.cairo": "Cairo",
    "city.addis-ababa": "Addis Ababa",
    "city.abu-dhabi": "Abu Dhabi",
    "city.riyadh": "Riyadh",
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("pt-BR")

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
