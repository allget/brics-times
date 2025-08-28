import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { AnalysisDetailPage } from "@/components/analysis-detail-page"

interface AnalysisPageProps {
  params: Promise<{
    id: string
  }>
}

// Mock data das análises (mesmo do hook)
const MOCK_ANALYSIS = [
  {
    id: 1,
    title: "O Futuro da Cooperação Sul-Sul",
    summary: "Análise aprofundada sobre as perspectivas de cooperação entre países emergentes do BRICS.",
    content: `A cooperação Sul-Sul representa um dos pilares fundamentais da nova ordem mundial multipolar que está emergindo no século XXI. Os países do BRICS, ao liderarem essa transformação, estão redefinindo as relações internacionais e criando alternativas viáveis ao sistema tradicional dominado pelas potências ocidentais.

Esta análise examina as principais tendências e desafios da cooperação entre economias emergentes, com foco especial nas iniciativas do BRICS. Desde a criação do bloco em 2009, observamos uma evolução significativa nas formas de colaboração, que vão desde acordos comerciais bilaterais até a criação de instituições financeiras alternativas.

O Novo Banco de Desenvolvimento (NBD) e o Arranjo Contingente de Reservas (ACR) são exemplos concretos de como os países do BRICS estão construindo uma arquitetura financeira independente. Essas instituições já financiaram projetos de infraestrutura no valor de bilhões de dólares, demonstrando a viabilidade prática da cooperação Sul-Sul.

Olhando para o futuro, as perspectivas são promissoras. A expansão do BRICS com a inclusão de novos membros fortalece ainda mais essa dinâmica de cooperação. Países como Irã, Egito, Etiópia, Emirados Árabes Unidos e Arábia Saudita trazem recursos energéticos, posições geográficas estratégicas e mercados em crescimento.

No entanto, desafios permanecem. As diferenças políticas, econômicas e culturais entre os países membros exigem mecanismos sofisticados de coordenação. A questão da governança global, as tensões geopolíticas regionais e a necessidade de equilibrar interesses nacionais com objetivos coletivos são aspectos que demandam atenção contínua.

A cooperação tecnológica emerge como uma área particularmente promissora. Iniciativas em inteligência artificial, energia renovável, biotecnologia e infraestrutura digital podem acelerar o desenvolvimento dos países membros e reduzir a dependência tecnológica do Norte Global.

Em conclusão, a cooperação Sul-Sul liderada pelo BRICS representa uma transformação histórica nas relações internacionais. Seu sucesso dependerá da capacidade dos países membros de superar diferenças, construir confiança mútua e desenvolver mecanismos eficazes de coordenação política e econômica.`,
    thumbnail: "/img/in-farmacia.jpg",
    author: "Dr. Maria Santos",
    analysisType: "Análise Geopolítica",
    publishedAt: "2025-01-20",
    readTime: "8 min",
    tags: ["cooperação", "geopolítica", "brics"],
    featured: true,
    slug: "futuro-cooperacao-sul-sul",
  },
  {
    id: 2,
    title: "Impacto Geopolítico do BRICS",
    summary: "Como a expansão do BRICS está redefinindo o cenário geopolítico mundial.",
    content: `A expansão do BRICS marca um ponto de inflexão na geopolítica global. Com a adesão de novos membros em 2024, o bloco não apenas aumentou sua representatividade geográfica, mas também consolidou sua posição como alternativa credível à ordem internacional estabelecida.

O impacto geopolítico dessa expansão é multifacetado. Primeiro, há o aspecto econômico: o BRICS expandido representa agora mais de 45% da população mundial e cerca de 30% do PIB global. Essa massa crítica confere ao bloco um poder de barganha significativo nas negociações internacionais.

Segundo, a dimensão energética é crucial. Com a inclusão de grandes produtores de petróleo e gás como Irã, Emirados Árabes Unidos e Arábia Saudita, o BRICS controla uma parcela substancial dos recursos energéticos globais. Isso tem implicações diretas para a segurança energética mundial e para a transição para fontes renováveis.

A criação de sistemas de pagamento alternativos ao SWIFT representa outro aspecto fundamental. O desenvolvimento de moedas digitais de bancos centrais (CBDCs) e sistemas de pagamento bilaterais reduz a dependência do dólar americano e oferece maior autonomia financeira aos países membros.

No campo da governança global, o BRICS propõe reformas nas instituições internacionais existentes, como o FMI e o Banco Mundial, ao mesmo tempo em que constrói instituições paralelas. Essa estratégia dual - reforma e criação - demonstra uma abordagem pragmática para a mudança do sistema internacional.

Os desafios são consideráveis. As tensões entre alguns membros, como Índia e China, ou as diferentes visões sobre questões regionais, podem limitar a eficácia do bloco. Além disso, a pressão externa de potências estabelecidas pode criar obstáculos à cooperação.

A resposta do Ocidente tem sido mista. Enquanto alguns veem o BRICS como uma ameaça à ordem liberal internacional, outros reconhecem a necessidade de acomodar as aspirações legítimas das economias emergentes. Essa dinâmica está redefinindo as alianças globais e criando um mundo mais multipolar.

O futuro do impacto geopolítico do BRICS dependerá de sua capacidade de manter a coesão interna enquanto expande sua influência externa. O sucesso nessa empreitada pode acelerar a transição para uma nova ordem mundial mais equilibrada e representativa.`,
    thumbnail: "/img/brics-geopolitics.jpg",
    author: "Prof. João Silva",
    analysisType: "Análise Estratégica",
    publishedAt: "2025-01-18",
    readTime: "10 min",
    tags: ["geopolítica", "estratégia", "expansão"],
    slug: "impacto-geopolitico-brics",
  },
]

export async function generateMetadata({ params }: AnalysisPageProps): Promise<Metadata> {
  const { id } = await params
  const analysisId = Number.parseInt(id)
  const analysis = MOCK_ANALYSIS.find((a) => a.id === analysisId)

  if (!analysis) {
    return {
      title: "Análise não encontrada - BRICS News",
    }
  }

  return {
    title: `${analysis.title} - BRICS News`,
    description: analysis.summary,
    openGraph: {
      title: analysis.title,
      description: analysis.summary,
      type: "article",
      publishedTime: analysis.publishedAt,
    },
  }
}

export default async function AnalysisPage({ params }: AnalysisPageProps) {
  const { id } = await params
  const analysisId = Number.parseInt(id)
  const analysis = MOCK_ANALYSIS.find((a) => a.id === analysisId)

  if (!analysis) {
    notFound()
  }

  return <AnalysisDetailPage analysis={analysis} />
}
