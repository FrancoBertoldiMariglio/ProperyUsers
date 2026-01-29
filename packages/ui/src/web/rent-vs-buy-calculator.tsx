'use client'

import * as React from 'react'
import { Home, Key, TrendingUp, AlertCircle } from 'lucide-react'
import { cn } from '../shared/utils'

interface RentVsBuyResult {
  recommendation: 'rent' | 'buy' | 'neutral'
  rentTotalCost: number
  buyTotalCost: number
  breakEvenYears: number | null
  equity: number
}

interface RentVsBuyCalculatorProps {
  initialRent?: number
  initialPrice?: number
  onCalculate?: (result: RentVsBuyResult) => void
  className?: string
}

function formatCurrency(amount: number): string {
  return `$ ${Math.abs(amount).toLocaleString('es-AR', { maximumFractionDigits: 0 })}`
}

function analyzeRentVsBuy(
  monthlyRent: number,
  propertyPrice: number,
  downPaymentPercent: number,
  mortgageRate: number,
  mortgageTermYears: number,
  analysisYears: number
): RentVsBuyResult {
  const downPayment = propertyPrice * (downPaymentPercent / 100)
  const loanAmount = propertyPrice - downPayment
  const termMonths = mortgageTermYears * 12

  // Calculate monthly mortgage payment (French system)
  const monthlyRate = mortgageRate / 100 / 12
  const mortgagePayment =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1)

  // Rent scenario
  const annualRentIncrease = 0.05 // 5% annual increase
  let totalRentPaid = 0
  let currentRent = monthlyRent
  for (let year = 1; year <= analysisYears; year++) {
    totalRentPaid += currentRent * 12
    currentRent *= 1 + annualRentIncrease
  }

  // Opportunity cost of down payment (7% annual return)
  const opportunityCost = downPayment * (Math.pow(1.07, analysisYears) - 1)
  const rentTotalCost = totalRentPaid - opportunityCost

  // Buy scenario
  const yearsOfPayments = Math.min(analysisYears, mortgageTermYears)
  const totalMortgagePayments = mortgagePayment * yearsOfPayments * 12

  // Closing costs (~10% of property price)
  const closingCosts = propertyPrice * 0.1

  // Maintenance (1% of property value per year)
  const maintenanceCosts = propertyPrice * 0.01 * analysisYears

  // Property appreciation (3% annual)
  const annualAppreciation = 0.03
  const futureValue = propertyPrice * Math.pow(1 + annualAppreciation, analysisYears)
  const appreciation = futureValue - propertyPrice

  // Calculate equity
  const monthsElapsed = analysisYears * 12
  let paidPrincipal = 0
  let balance = loanAmount
  for (let month = 1; month <= Math.min(monthsElapsed, termMonths); month++) {
    const interest = balance * monthlyRate
    const principal = mortgagePayment - interest
    paidPrincipal += principal
    balance -= principal
  }
  const equity = downPayment + paidPrincipal + appreciation

  const buyTotalCost =
    downPayment + totalMortgagePayments + closingCosts + maintenanceCosts - appreciation

  // Find break-even point
  let breakEvenYears: number | null = null
  for (let y = 1; y <= 30; y++) {
    const rentCost = calculateSimpleRentCost(monthlyRent, y)
    const buyCost = calculateSimpleBuyCost(propertyPrice, downPaymentPercent, mortgageRate, mortgageTermYears, y)
    if (buyCost < rentCost && !breakEvenYears) {
      breakEvenYears = y
      break
    }
  }

  const recommendation: 'rent' | 'buy' | 'neutral' =
    rentTotalCost < buyTotalCost * 0.95
      ? 'rent'
      : buyTotalCost < rentTotalCost * 0.95
        ? 'buy'
        : 'neutral'

  return {
    recommendation,
    rentTotalCost,
    buyTotalCost,
    breakEvenYears,
    equity,
  }
}

function calculateSimpleRentCost(monthlyRent: number, years: number): number {
  let total = 0
  let rent = monthlyRent
  for (let y = 1; y <= years; y++) {
    total += rent * 12
    rent *= 1.05
  }
  return total
}

function calculateSimpleBuyCost(
  price: number,
  downPercent: number,
  rate: number,
  termYears: number,
  years: number
): number {
  const down = price * (downPercent / 100)
  const loan = price - down
  const monthlyRate = rate / 100 / 12
  const termMonths = termYears * 12
  const payment = (loan * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1)

  const payments = Math.min(years, termYears) * 12 * payment
  const closing = price * 0.1
  const maintenance = price * 0.01 * years
  const appreciation = price * (Math.pow(1.03, years) - 1)

  return down + payments + closing + maintenance - appreciation
}

export function RentVsBuyCalculator({
  initialRent = 500000,
  initialPrice = 50000000,
  onCalculate,
  className,
}: RentVsBuyCalculatorProps): JSX.Element {
  const [monthlyRent, setMonthlyRent] = React.useState(initialRent)
  const [propertyPrice, setPropertyPrice] = React.useState(initialPrice)
  const [downPaymentPercent, setDownPaymentPercent] = React.useState(20)
  const [mortgageRate, setMortgageRate] = React.useState(5.5)
  const [analysisYears, setAnalysisYears] = React.useState(10)

  const result = React.useMemo(
    () =>
      analyzeRentVsBuy(
        monthlyRent,
        propertyPrice,
        downPaymentPercent,
        mortgageRate,
        20, // Fixed 20-year mortgage
        analysisYears
      ),
    [monthlyRent, propertyPrice, downPaymentPercent, mortgageRate, analysisYears]
  )

  React.useEffect(() => {
    onCalculate?.(result)
  }, [result, onCalculate])

  return (
    <div className={cn('rounded-xl border border-border bg-card p-6', className)}>
      <div className="mb-6 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">¿Alquilar o Comprar?</h2>
      </div>

      <div className="space-y-6">
        {/* Monthly Rent */}
        <div>
          <label className="mb-2 flex items-center justify-between text-sm font-medium">
            <span>Alquiler mensual actual</span>
            <span className="text-primary">{formatCurrency(monthlyRent)}</span>
          </label>
          <input
            type="range"
            min={100000}
            max={2000000}
            step={50000}
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        {/* Property Price */}
        <div>
          <label className="mb-2 flex items-center justify-between text-sm font-medium">
            <span>Precio de compra</span>
            <span className="text-primary">{formatCurrency(propertyPrice)}</span>
          </label>
          <input
            type="range"
            min={10000000}
            max={200000000}
            step={5000000}
            value={propertyPrice}
            onChange={(e) => setPropertyPrice(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        {/* Down Payment */}
        <div>
          <label className="mb-2 flex items-center justify-between text-sm font-medium">
            <span>Anticipo</span>
            <span className="text-primary">{downPaymentPercent}%</span>
          </label>
          <input
            type="range"
            min={10}
            max={50}
            step={5}
            value={downPaymentPercent}
            onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        {/* Mortgage Rate */}
        <div>
          <label className="mb-2 flex items-center justify-between text-sm font-medium">
            <span>Tasa hipotecaria anual</span>
            <span className="text-primary">{mortgageRate}%</span>
          </label>
          <input
            type="range"
            min={3}
            max={12}
            step={0.5}
            value={mortgageRate}
            onChange={(e) => setMortgageRate(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        {/* Analysis Period */}
        <div>
          <label className="mb-2 flex items-center justify-between text-sm font-medium">
            <span>Período de análisis</span>
            <span className="text-primary">{analysisYears} años</span>
          </label>
          <input
            type="range"
            min={3}
            max={20}
            step={1}
            value={analysisYears}
            onChange={(e) => setAnalysisYears(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        {/* Recommendation */}
        <div
          className={cn(
            'rounded-xl p-4 text-center',
            result.recommendation === 'buy'
              ? 'bg-green-500/10'
              : result.recommendation === 'rent'
                ? 'bg-blue-500/10'
                : 'bg-amber-500/10'
          )}
        >
          <div className="mb-2 flex justify-center">
            {result.recommendation === 'buy' ? (
              <Home className="h-8 w-8 text-green-600" />
            ) : result.recommendation === 'rent' ? (
              <Key className="h-8 w-8 text-blue-600" />
            ) : (
              <AlertCircle className="h-8 w-8 text-amber-600" />
            )}
          </div>
          <p className="text-lg font-bold">
            {result.recommendation === 'buy'
              ? 'Te conviene COMPRAR'
              : result.recommendation === 'rent'
                ? 'Te conviene ALQUILAR'
                : 'Están muy parejos'}
          </p>
          {result.breakEvenYears && (
            <p className="mt-1 text-sm text-muted-foreground">
              La compra se vuelve rentable después de {result.breakEvenYears} años
            </p>
          )}
        </div>

        {/* Comparison */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-blue-500/5 p-4 text-center">
            <Key className="mx-auto mb-2 h-6 w-6 text-blue-600" />
            <p className="text-xs text-muted-foreground">Costo total alquilar</p>
            <p className="text-lg font-bold text-blue-600">
              {formatCurrency(result.rentTotalCost)}
            </p>
            <p className="text-xs text-muted-foreground">en {analysisYears} años</p>
          </div>
          <div className="rounded-lg bg-green-500/5 p-4 text-center">
            <Home className="mx-auto mb-2 h-6 w-6 text-green-600" />
            <p className="text-xs text-muted-foreground">Costo total comprar</p>
            <p className="text-lg font-bold text-green-600">
              {formatCurrency(result.buyTotalCost)}
            </p>
            <p className="text-xs text-muted-foreground">en {analysisYears} años</p>
          </div>
        </div>

        {/* Equity */}
        <div className="rounded-lg bg-muted/50 p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Patrimonio acumulado si comprás
          </p>
          <p className="text-2xl font-bold text-primary">{formatCurrency(result.equity)}</p>
          <p className="text-xs text-muted-foreground">
            (capital pagado + apreciación estimada)
          </p>
        </div>
      </div>
    </div>
  )
}
