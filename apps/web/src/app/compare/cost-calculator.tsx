'use client'

import type { JSX } from 'react'
import { useState, useMemo } from 'react'
import type { Property } from '@propery/api-client'
import { cn } from '@propery/ui/shared'
import { Info, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface CostCalculatorProps {
  properties: Property[]
}

interface MonthlyBreakdown {
  basePayment: number
  expenses: number
  utilities: number
  total: number
}

// Estimated utilities based on property size
function estimateUtilities(property: Property): number {
  const baseUtilities = 35000 // Base in ARS
  const areaFactor = property.features.coveredArea / 50 // Normalize by 50m²
  const amenitiesCost = Object.values(property.amenities).filter(Boolean).length * 2000

  return Math.round(baseUtilities * areaFactor + amenitiesCost)
}

// Convert USD to ARS for rent comparison (approximate exchange rate)
const USD_TO_ARS = 1100

function calculateMonthlyBreakdown(
  property: Property,
  loanTermYears: number,
  downPaymentPercent: number
): MonthlyBreakdown {
  const isRent = property.operationType === 'rent'

  let basePayment: number
  if (isRent) {
    // For rent, price is already monthly
    basePayment =
      property.currency === 'USD' ? property.price * USD_TO_ARS : property.price
  } else {
    // For sale, calculate mortgage payment (simplified French system)
    const priceARS =
      property.currency === 'USD' ? property.price * USD_TO_ARS : property.price
    const loanAmount = priceARS * (1 - downPaymentPercent / 100)
    const annualRate = 0.085 // 8.5% annual rate (approximate UVA rate)
    const monthlyRate = annualRate / 12
    const numPayments = loanTermYears * 12

    basePayment = Math.round(
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1)
    )
  }

  const expenses = property.expenses || 0
  const utilities = estimateUtilities(property)

  return {
    basePayment,
    expenses,
    utilities,
    total: basePayment + expenses + utilities,
  }
}

function formatARS(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(value)
}

export function CostCalculator({ properties }: CostCalculatorProps): JSX.Element {
  const [loanTermYears, setLoanTermYears] = useState(20)
  const [downPaymentPercent, setDownPaymentPercent] = useState(30)

  const hasSale = properties.some((p) => p.operationType === 'sale')

  const breakdowns = useMemo(
    () =>
      properties.map((p) =>
        calculateMonthlyBreakdown(p, loanTermYears, downPaymentPercent)
      ),
    [properties, loanTermYears, downPaymentPercent]
  )

  const minTotal = Math.min(...breakdowns.map((b) => b.total))
  const maxTotal = Math.max(...breakdowns.map((b) => b.total))

  return (
    <div className="space-y-6">
      {/* Settings for sale properties */}
      {hasSale && (
        <div className="flex flex-wrap gap-4 rounded-lg bg-muted/50 p-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Plazo del crédito:</label>
            <select
              value={loanTermYears}
              onChange={(e) => setLoanTermYears(Number(e.target.value))}
              className="rounded border bg-background px-2 py-1 text-sm"
            >
              <option value={10}>10 años</option>
              <option value={15}>15 años</option>
              <option value={20}>20 años</option>
              <option value={30}>30 años</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Anticipo:</label>
            <select
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="rounded border bg-background px-2 py-1 text-sm"
            >
              <option value={10}>10%</option>
              <option value={20}>20%</option>
              <option value={30}>30%</option>
              <option value={40}>40%</option>
              <option value={50}>50%</option>
            </select>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Info className="h-4 w-4" />
            <span>Cálculo estimado con tasa UVA ~8.5% anual</span>
          </div>
        </div>
      )}

      {/* Cost comparison grid */}
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${properties.length}, minmax(0, 1fr))`,
        }}
      >
        {properties.map((property, index) => {
          const breakdown = breakdowns[index]
          const isBest = breakdown.total === minTotal && minTotal !== maxTotal
          const isWorst = breakdown.total === maxTotal && minTotal !== maxTotal

          return (
            <div
              key={property.id}
              className={cn(
                'rounded-lg border p-4',
                isBest && 'border-green-500 bg-green-50',
                isWorst && 'border-red-200 bg-red-50'
              )}
            >
              {/* Property header */}
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{property.location.neighborhood}</h3>
                  <p className="text-xs text-muted-foreground">
                    {property.operationType === 'rent' ? 'Alquiler' : 'Venta (cuota)'}
                  </p>
                </div>
                {isBest && <TrendingDown className="h-5 w-5 text-green-600" />}
                {isWorst && <TrendingUp className="h-5 w-5 text-red-600" />}
                {!isBest && !isWorst && (
                  <Minus className="h-5 w-5 text-muted-foreground" />
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {property.operationType === 'rent' ? 'Alquiler' : 'Cuota crédito'}
                  </span>
                  <span>{formatARS(breakdown.basePayment)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expensas</span>
                  <span>
                    {breakdown.expenses > 0 ? formatARS(breakdown.expenses) : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Servicios est.</span>
                  <span>{formatARS(breakdown.utilities)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total mensual</span>
                    <span
                      className={cn(
                        isBest && 'text-green-700',
                        isWorst && 'text-red-700'
                      )}
                    >
                      {formatARS(breakdown.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comparison indicator */}
              {(isBest || isWorst) && (
                <div
                  className={cn(
                    'mt-3 rounded-full px-2 py-1 text-center text-xs font-medium',
                    isBest && 'bg-green-100 text-green-700',
                    isWorst && 'bg-red-100 text-red-700'
                  )}
                >
                  {isBest && 'Menor costo mensual'}
                  {isWorst &&
                    `+${formatARS(breakdown.total - minTotal)} vs más económico`}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="text-xs text-muted-foreground">
        <p>
          * Los servicios se estiman según la superficie y amenities del edificio.
          Incluye electricidad, gas, agua e internet.
        </p>
        {hasSale && (
          <p>
            * Las cuotas del crédito se calculan con el sistema francés y tasa UVA
            aproximada. Consultá con tu banco para valores exactos.
          </p>
        )}
      </div>
    </div>
  )
}
