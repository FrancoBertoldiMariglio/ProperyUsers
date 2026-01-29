'use client'

import type { JSX } from 'react'
import { useMemo } from 'react'
import type { Property } from '@propery/api-client'
import { cn } from '@propery/ui/shared'
import { TrendingUp, AlertCircle, CheckCircle, Info } from 'lucide-react'

interface InvestmentScoreProps {
  properties: Property[]
}

interface ScoreBreakdown {
  total: number
  priceFairness: number
  locationPremium: number
  amenitiesValue: number
  roiProjection: number
  confidence: number
}

// Premium neighborhoods in Buenos Aires
const premiumNeighborhoods = [
  'Palermo',
  'Recoleta',
  'Belgrano',
  'Puerto Madero',
  'Núñez',
  'Las Cañitas',
]

const midTierNeighborhoods = [
  'Caballito',
  'Villa Urquiza',
  'Colegiales',
  'Villa Crespo',
  'Almagro',
  'San Telmo',
]

function calculateInvestmentScore(property: Property): ScoreBreakdown {
  // Price fairness score (based on ML prediction)
  let priceFairness = 50
  if (property.prediction) {
    const diff = property.prediction.percentageDiff
    if (diff <= -15) priceFairness = 95
    else if (diff <= -10) priceFairness = 85
    else if (diff <= -5) priceFairness = 75
    else if (diff <= 0) priceFairness = 65
    else if (diff <= 5) priceFairness = 55
    else if (diff <= 10) priceFairness = 40
    else priceFairness = 25
  }

  // Location premium score
  let locationPremium = 50
  const neighborhood = property.location.neighborhood
  if (premiumNeighborhoods.some((n) => neighborhood.includes(n))) {
    locationPremium = 85
  } else if (midTierNeighborhoods.some((n) => neighborhood.includes(n))) {
    locationPremium = 70
  }

  // Amenities value score
  const amenitiesCount = Object.values(property.amenities).filter(Boolean).length
  const amenitiesValue = Math.min(30 + amenitiesCount * 7, 95)

  // ROI projection (simplified - based on rent yield potential)
  const pricePerM2 =
    property.features.coveredArea > 0
      ? property.price / property.features.coveredArea
      : 0
  let roiProjection = 50

  // Buenos Aires average price/m² is around $2500-3500 USD
  if (pricePerM2 > 0) {
    if (pricePerM2 < 2000) roiProjection = 90 // Very cheap, high ROI potential
    else if (pricePerM2 < 2500) roiProjection = 80
    else if (pricePerM2 < 3000) roiProjection = 70
    else if (pricePerM2 < 3500) roiProjection = 60
    else if (pricePerM2 < 4000) roiProjection = 45
    else roiProjection = 30 // Expensive, lower ROI
  }

  // Confidence based on ML prediction confidence
  const confidence = property.prediction
    ? Math.round(property.prediction.confidence * 100)
    : 50

  // Total score (weighted average)
  const total = Math.round(
    priceFairness * 0.35 +
      locationPremium * 0.25 +
      amenitiesValue * 0.15 +
      roiProjection * 0.25
  )

  return {
    total,
    priceFairness,
    locationPremium,
    amenitiesValue,
    roiProjection,
    confidence,
  }
}

function ScoreBar({ value, label }: { value: number; label: string }): JSX.Element {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}/100</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            value >= 70 && 'bg-green-500',
            value >= 50 && value < 70 && 'bg-yellow-500',
            value < 50 && 'bg-red-500'
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

function ScoreCircle({ score }: { score: number }): JSX.Element {
  const getColor = () => {
    if (score >= 70) return 'text-green-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getBgColor = () => {
    if (score >= 70) return 'bg-green-100'
    if (score >= 50) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <div
      className={cn(
        'flex h-20 w-20 flex-col items-center justify-center rounded-full',
        getBgColor()
      )}
    >
      <span className={cn('text-2xl font-bold', getColor())}>{score}</span>
      <span className="text-xs text-muted-foreground">/100</span>
    </div>
  )
}

function getRating(score: number): { label: string; icon: typeof CheckCircle } {
  if (score >= 80) return { label: 'Excelente inversión', icon: CheckCircle }
  if (score >= 70) return { label: 'Buena inversión', icon: CheckCircle }
  if (score >= 60) return { label: 'Inversión aceptable', icon: Info }
  if (score >= 50) return { label: 'Inversión regular', icon: AlertCircle }
  return { label: 'Inversión riesgosa', icon: AlertCircle }
}

export function InvestmentScore({ properties }: InvestmentScoreProps): JSX.Element {
  const scores = useMemo(
    () => properties.map((p) => calculateInvestmentScore(p)),
    [properties]
  )

  const maxScore = Math.max(...scores.map((s) => s.total))

  return (
    <div className="space-y-6">
      {/* Score cards grid */}
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${properties.length}, minmax(0, 1fr))`,
        }}
      >
        {properties.map((property, index) => {
          const score = scores[index]
          const isBest = score.total === maxScore && scores.length > 1
          const rating = getRating(score.total)
          const RatingIcon = rating.icon

          return (
            <div
              key={property.id}
              className={cn(
                'rounded-lg border p-4',
                isBest && 'border-primary ring-2 ring-primary/20'
              )}
            >
              {/* Header with score */}
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{property.location.neighborhood}</h3>
                  <div
                    className={cn(
                      'mt-1 flex items-center gap-1 text-sm',
                      score.total >= 70
                        ? 'text-green-600'
                        : score.total >= 50
                          ? 'text-yellow-600'
                          : 'text-red-600'
                    )}
                  >
                    <RatingIcon className="h-4 w-4" />
                    <span>{rating.label}</span>
                  </div>
                </div>
                <ScoreCircle score={score.total} />
              </div>

              {/* Score breakdown */}
              <div className="space-y-3">
                <ScoreBar value={score.priceFairness} label="Precio justo" />
                <ScoreBar value={score.locationPremium} label="Ubicación" />
                <ScoreBar value={score.amenitiesValue} label="Amenities" />
                <ScoreBar value={score.roiProjection} label="Proyección ROI" />
              </div>

              {/* Confidence */}
              <div className="mt-4 flex items-center gap-2 rounded bg-muted/50 p-2 text-xs text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Confianza del análisis: {score.confidence}%</span>
              </div>

              {/* Best badge */}
              {isBest && (
                <div className="mt-3 rounded-full bg-primary px-3 py-1 text-center text-xs font-medium text-primary-foreground">
                  Mejor opción de inversión
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 5-year projection */}
      <div className="rounded-lg border bg-muted/30 p-4">
        <h4 className="mb-3 font-semibold">Proyección a 5 años</h4>
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${properties.length}, minmax(0, 1fr))`,
          }}
        >
          {properties.map((property, index) => {
            const annualAppreciation = scores[index].locationPremium > 70 ? 0.05 : 0.03
            const projectedValue = Math.round(
              property.price * Math.pow(1 + annualAppreciation, 5)
            )
            const gain = projectedValue - property.price

            return (
              <div key={property.id} className="text-center">
                <p className="text-sm text-muted-foreground">
                  {property.location.neighborhood}
                </p>
                <p className="text-lg font-bold text-primary">
                  {new Intl.NumberFormat('es-AR', {
                    style: 'currency',
                    currency: property.currency,
                    minimumFractionDigits: 0,
                  }).format(projectedValue)}
                </p>
                <p className="text-sm text-green-600">
                  +
                  {new Intl.NumberFormat('es-AR', {
                    style: 'currency',
                    currency: property.currency,
                    minimumFractionDigits: 0,
                  }).format(gain)}{' '}
                  ({Math.round((gain / property.price) * 100)}%)
                </p>
              </div>
            )
          })}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          * Proyección basada en tendencias históricas del mercado inmobiliario de
          CABA. Las apreciaciones varían según la zona.
        </p>
      </div>
    </div>
  )
}
