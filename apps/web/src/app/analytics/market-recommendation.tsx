'use client'

import type { JSX } from 'react'
import type { NeighborhoodStats, PriceHistoryPoint } from '@propery/api-client'
import { cn } from '@propery/ui/shared'
import { Sparkles, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react'

interface MarketRecommendationProps {
  stats: NeighborhoodStats
  priceHistory: PriceHistoryPoint[]
}

type Recommendation = 'strong_buy' | 'buy' | 'hold' | 'wait'

interface Analysis {
  recommendation: Recommendation
  title: string
  description: string
  factors: Array<{
    label: string
    impact: 'positive' | 'negative' | 'neutral'
    detail: string
  }>
}

function analyzeMarket(stats: NeighborhoodStats, _priceHistory: PriceHistoryPoint[]): Analysis {
  const factors: Analysis['factors'] = []

  // Analyze price trend
  const trend = stats.priceTrend6m
  if (trend > 5) {
    factors.push({
      label: 'Tendencia alcista fuerte',
      impact: 'negative',
      detail: `Precios subiendo ${trend.toFixed(1)}% en 6 meses - Comprar ahora antes de más aumentos`,
    })
  } else if (trend > 2) {
    factors.push({
      label: 'Tendencia alcista moderada',
      impact: 'neutral',
      detail: `Crecimiento estable del ${trend.toFixed(1)}% semestral`,
    })
  } else if (trend > 0) {
    factors.push({
      label: 'Mercado estable',
      impact: 'positive',
      detail: 'Precios estables, buen momento para negociar',
    })
  } else {
    factors.push({
      label: 'Tendencia a la baja',
      impact: 'positive',
      detail: `Precios bajando ${Math.abs(trend).toFixed(1)}% - Oportunidad de compra`,
    })
  }

  // Analyze days on market
  if (stats.avgDaysOnMarket < 40) {
    factors.push({
      label: 'Mercado dinámico',
      impact: 'negative',
      detail: `Propiedades se venden rápido (${stats.avgDaysOnMarket} días) - Actuar con rapidez`,
    })
  } else if (stats.avgDaysOnMarket < 60) {
    factors.push({
      label: 'Tiempo de decisión razonable',
      impact: 'neutral',
      detail: `Promedio de ${stats.avgDaysOnMarket} días en mercado`,
    })
  } else {
    factors.push({
      label: 'Mercado relajado',
      impact: 'positive',
      detail: `${stats.avgDaysOnMarket} días promedio - Hay tiempo para comparar opciones`,
    })
  }

  // Analyze price per m²
  if (stats.avgPricePerM2Sale > 4000) {
    factors.push({
      label: 'Zona premium',
      impact: 'neutral',
      detail: `USD ${stats.avgPricePerM2Sale}/m² - Barrio de alta gama`,
    })
  } else if (stats.avgPricePerM2Sale > 2500) {
    factors.push({
      label: 'Precio competitivo',
      impact: 'positive',
      detail: `USD ${stats.avgPricePerM2Sale}/m² - Buena relación calidad-precio`,
    })
  } else {
    factors.push({
      label: 'Zona accesible',
      impact: 'positive',
      detail: `USD ${stats.avgPricePerM2Sale}/m² - Oportunidad de entrada al mercado`,
    })
  }

  // Analyze inventory
  if (stats.totalListings > 800) {
    factors.push({
      label: 'Amplia oferta',
      impact: 'positive',
      detail: `${stats.totalListings} propiedades disponibles - Más opciones para elegir`,
    })
  } else if (stats.totalListings > 400) {
    factors.push({
      label: 'Oferta moderada',
      impact: 'neutral',
      detail: `${stats.totalListings} propiedades en el mercado`,
    })
  } else {
    factors.push({
      label: 'Oferta limitada',
      impact: 'negative',
      detail: `Solo ${stats.totalListings} propiedades - Actuar rápido al encontrar algo`,
    })
  }

  // Calculate recommendation
  const positiveCount = factors.filter((f) => f.impact === 'positive').length
  const negativeCount = factors.filter((f) => f.impact === 'negative').length

  let recommendation: Recommendation
  let title: string
  let description: string

  if (positiveCount >= 3) {
    recommendation = 'strong_buy'
    title = 'Excelente momento para comprar'
    description = `${stats.name} presenta condiciones favorables para compradores. Los indicadores sugieren que es un buen momento para hacer una oferta.`
  } else if (positiveCount >= 2) {
    recommendation = 'buy'
    title = 'Buen momento para comprar'
    description = `Las condiciones en ${stats.name} son favorables. Considera hacer tu búsqueda activa y estar listo para ofertar.`
  } else if (negativeCount >= 2) {
    recommendation = 'wait'
    title = 'Considera esperar'
    description = `El mercado en ${stats.name} está algo caliente. Podrías esperar a que se estabilice o buscar en barrios cercanos.`
  } else {
    recommendation = 'hold'
    title = 'Momento neutral'
    description = `${stats.name} muestra condiciones mixtas. Es un buen momento para investigar y prepararse, pero sin urgencia.`
  }

  return { recommendation, title, description, factors }
}

const recommendationStyles: Record<
  Recommendation,
  { bg: string; icon: typeof CheckCircle; iconColor: string }
> = {
  strong_buy: { bg: 'bg-green-50 border-green-200', icon: CheckCircle, iconColor: 'text-green-600' },
  buy: { bg: 'bg-blue-50 border-blue-200', icon: TrendingUp, iconColor: 'text-blue-600' },
  hold: { bg: 'bg-yellow-50 border-yellow-200', icon: AlertCircle, iconColor: 'text-yellow-600' },
  wait: { bg: 'bg-orange-50 border-orange-200', icon: TrendingDown, iconColor: 'text-orange-600' },
}

export function MarketRecommendation({
  stats,
  priceHistory,
}: MarketRecommendationProps): JSX.Element {
  const analysis = analyzeMarket(stats, priceHistory)
  const style = recommendationStyles[analysis.recommendation]
  const Icon = style.icon

  return (
    <div className={cn('rounded-lg border p-4', style.bg)}>
      <div className="flex items-start gap-3">
        <div className={cn('rounded-full p-2', style.bg)}>
          <Icon className={cn('h-5 w-5', style.iconColor)} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{analysis.title}</h3>
            <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
              <Sparkles className="h-3 w-3" />
              Análisis AI
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{analysis.description}</p>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {analysis.factors.map((factor, index) => (
              <div
                key={index}
                className="flex items-start gap-2 rounded-lg bg-background/50 p-2"
              >
                <div
                  className={cn(
                    'mt-0.5 h-2 w-2 rounded-full',
                    factor.impact === 'positive' && 'bg-green-500',
                    factor.impact === 'negative' && 'bg-red-500',
                    factor.impact === 'neutral' && 'bg-yellow-500'
                  )}
                />
                <div>
                  <p className="text-sm font-medium">{factor.label}</p>
                  <p className="text-xs text-muted-foreground">{factor.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
