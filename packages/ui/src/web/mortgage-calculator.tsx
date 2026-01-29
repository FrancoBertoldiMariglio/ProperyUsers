'use client'

import * as React from 'react'
import { Calculator, Info, TrendingUp, DollarSign } from 'lucide-react'
import { cn } from '../shared/utils'
import { Button } from './button'

interface MortgageBreakdown {
  monthlyPayment: number
  firstPayment: number
  lastPayment: number
  totalPayment: number
  totalInterest: number
}

interface MortgageCalculatorProps {
  initialPrice?: number
  onCalculate?: (breakdown: MortgageBreakdown) => void
  className?: string
}

function formatCurrency(amount: number, currency: string = 'ARS'): string {
  if (currency === 'USD') {
    return `US$ ${amount.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`
  }
  return `$ ${amount.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`
}

function calculateFrenchPayment(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  const monthlyRate = annualRate / 100 / 12
  if (monthlyRate === 0) return principal / termMonths

  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1)
  )
}

function calculateGermanFirstPayment(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  const monthlyRate = annualRate / 100 / 12
  const fixedPrincipal = principal / termMonths
  return fixedPrincipal + principal * monthlyRate
}

function calculateGermanLastPayment(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  const monthlyRate = annualRate / 100 / 12
  const fixedPrincipal = principal / termMonths
  return fixedPrincipal + fixedPrincipal * monthlyRate
}

export function MortgageCalculator({
  initialPrice = 100000,
  onCalculate,
  className,
}: MortgageCalculatorProps): JSX.Element {
  const [propertyPrice, setPropertyPrice] = React.useState(initialPrice)
  const [downPaymentPercent, setDownPaymentPercent] = React.useState(20)
  const [annualRate, setAnnualRate] = React.useState(5.5)
  const [termYears, setTermYears] = React.useState(20)
  const [system, setSystem] = React.useState<'french' | 'german'>('french')
  const [currency, setCurrency] = React.useState<'USD' | 'ARS'>('USD')

  const loanAmount = propertyPrice * (1 - downPaymentPercent / 100)
  const termMonths = termYears * 12

  const breakdown = React.useMemo(() => {
    if (system === 'french') {
      const payment = calculateFrenchPayment(loanAmount, annualRate, termMonths)
      const totalPayment = payment * termMonths
      return {
        monthlyPayment: payment,
        firstPayment: payment,
        lastPayment: payment,
        totalPayment,
        totalInterest: totalPayment - loanAmount,
      }
    } else {
      const firstPayment = calculateGermanFirstPayment(loanAmount, annualRate, termMonths)
      const lastPayment = calculateGermanLastPayment(loanAmount, annualRate, termMonths)
      // German total is more complex, approximate with average
      const avgPayment = (firstPayment + lastPayment) / 2
      const totalPayment = avgPayment * termMonths
      return {
        monthlyPayment: avgPayment,
        firstPayment,
        lastPayment,
        totalPayment,
        totalInterest: totalPayment - loanAmount,
      }
    }
  }, [loanAmount, annualRate, termMonths, system])

  React.useEffect(() => {
    onCalculate?.(breakdown)
  }, [breakdown, onCalculate])

  return (
    <div className={cn('rounded-xl border border-border bg-card p-6', className)}>
      <div className="mb-6 flex items-center gap-2">
        <Calculator className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Calculadora de Crédito Hipotecario</h2>
      </div>

      <div className="space-y-6">
        {/* Currency Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setCurrency('USD')}
            className={cn(
              'flex-1 rounded-lg border-2 py-2 text-sm font-medium transition-colors',
              currency === 'USD'
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border hover:border-primary/50'
            )}
          >
            USD
          </button>
          <button
            onClick={() => setCurrency('ARS')}
            className={cn(
              'flex-1 rounded-lg border-2 py-2 text-sm font-medium transition-colors',
              currency === 'ARS'
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border hover:border-primary/50'
            )}
          >
            ARS
          </button>
        </div>

        {/* Property Price */}
        <div>
          <label className="mb-2 flex items-center justify-between text-sm font-medium">
            <span>Precio de la propiedad</span>
            <span className="text-primary">{formatCurrency(propertyPrice, currency)}</span>
          </label>
          <input
            type="range"
            min={currency === 'USD' ? 50000 : 10000000}
            max={currency === 'USD' ? 1000000 : 500000000}
            step={currency === 'USD' ? 10000 : 1000000}
            value={propertyPrice}
            onChange={(e) => setPropertyPrice(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        {/* Down Payment */}
        <div>
          <label className="mb-2 flex items-center justify-between text-sm font-medium">
            <span>Anticipo</span>
            <span className="text-primary">
              {downPaymentPercent}% ({formatCurrency(propertyPrice * downPaymentPercent / 100, currency)})
            </span>
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

        {/* Annual Rate */}
        <div>
          <label className="mb-2 flex items-center justify-between text-sm font-medium">
            <span>Tasa anual (TNA)</span>
            <span className="text-primary">{annualRate.toFixed(1)}%</span>
          </label>
          <input
            type="range"
            min={3}
            max={15}
            step={0.5}
            value={annualRate}
            onChange={(e) => setAnnualRate(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        {/* Term */}
        <div>
          <label className="mb-2 flex items-center justify-between text-sm font-medium">
            <span>Plazo</span>
            <span className="text-primary">{termYears} años</span>
          </label>
          <input
            type="range"
            min={5}
            max={30}
            step={5}
            value={termYears}
            onChange={(e) => setTermYears(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        {/* Amortization System */}
        <div>
          <label className="mb-2 block text-sm font-medium">Sistema de amortización</label>
          <div className="flex gap-2">
            <button
              onClick={() => setSystem('french')}
              className={cn(
                'flex-1 rounded-lg border-2 px-4 py-2 text-sm font-medium transition-colors',
                system === 'french'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border hover:border-primary/50'
              )}
            >
              Francés
              <span className="block text-xs font-normal text-muted-foreground">
                Cuota fija
              </span>
            </button>
            <button
              onClick={() => setSystem('german')}
              className={cn(
                'flex-1 rounded-lg border-2 px-4 py-2 text-sm font-medium transition-colors',
                system === 'german'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border hover:border-primary/50'
              )}
            >
              Alemán
              <span className="block text-xs font-normal text-muted-foreground">
                Cuota decreciente
              </span>
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="rounded-xl bg-primary/5 p-4">
          <div className="mb-4 text-center">
            <p className="text-sm text-muted-foreground">Cuota mensual estimada</p>
            <p className="text-3xl font-bold text-primary">
              {formatCurrency(breakdown.monthlyPayment, currency)}
            </p>
            {system === 'german' && (
              <p className="mt-1 text-xs text-muted-foreground">
                Primera: {formatCurrency(breakdown.firstPayment, currency)} ·
                Última: {formatCurrency(breakdown.lastPayment, currency)}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Monto del crédito</p>
              <p className="font-semibold">{formatCurrency(loanAmount, currency)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total a pagar</p>
              <p className="font-semibold">{formatCurrency(breakdown.totalPayment, currency)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total intereses</p>
              <p className="font-semibold text-amber-600">
                {formatCurrency(breakdown.totalInterest, currency)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Relación cuota/precio</p>
              <p className="font-semibold">
                {((breakdown.monthlyPayment / propertyPrice) * 100).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Este cálculo es estimativo y no incluye seguros, gastos de escrituración ni otros costos
            asociados. Consultá con tu banco para obtener una cotización precisa.
          </p>
        </div>
      </div>
    </div>
  )
}
