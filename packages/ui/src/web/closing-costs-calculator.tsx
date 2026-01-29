'use client'

import * as React from 'react'
import { FileText, Info } from 'lucide-react'
import { cn } from '../shared/utils'

interface ClosingCosts {
  notaryFee: number
  registrationTax: number
  stampTax: number
  realEstateCommission: number
  bankFees: number
  appraisalFee: number
  titleInsurance: number
  total: number
}

interface ClosingCostsCalculatorProps {
  initialPrice?: number
  onCalculate?: (costs: ClosingCosts) => void
  className?: string
}

function formatCurrency(amount: number): string {
  return `$ ${amount.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`
}

function calculateClosingCosts(
  propertyPrice: number,
  isNewConstruction: boolean,
  includeCommission: boolean
): ClosingCosts {
  const notaryFee = propertyPrice * 0.02
  const registrationTax = propertyPrice * 0.025
  const stampTax = isNewConstruction ? 0 : propertyPrice * 0.036
  const realEstateCommission = includeCommission ? propertyPrice * 0.03 : 0
  const bankFees = 50000
  const appraisalFee = 30000
  const titleInsurance = propertyPrice * 0.003

  const total =
    notaryFee +
    registrationTax +
    stampTax +
    realEstateCommission +
    bankFees +
    appraisalFee +
    titleInsurance

  return {
    notaryFee,
    registrationTax,
    stampTax,
    realEstateCommission,
    bankFees,
    appraisalFee,
    titleInsurance,
    total,
  }
}

export function ClosingCostsCalculator({
  initialPrice = 50000000,
  onCalculate,
  className,
}: ClosingCostsCalculatorProps): JSX.Element {
  const [propertyPrice, setPropertyPrice] = React.useState(initialPrice)
  const [isNewConstruction, setIsNewConstruction] = React.useState(false)
  const [includeCommission, setIncludeCommission] = React.useState(true)

  const costs = React.useMemo(
    () => calculateClosingCosts(propertyPrice, isNewConstruction, includeCommission),
    [propertyPrice, isNewConstruction, includeCommission]
  )

  React.useEffect(() => {
    onCalculate?.(costs)
  }, [costs, onCalculate])

  const costItems = [
    { label: 'Escribanía (2%)', value: costs.notaryFee, info: 'Honorarios del escribano' },
    { label: 'Inscripción (2.5%)', value: costs.registrationTax, info: 'Registro de la propiedad' },
    {
      label: 'Sellos (3.6%)',
      value: costs.stampTax,
      info: isNewConstruction ? 'Exento por ser a estrenar' : 'Impuesto de sellos provincial',
    },
    {
      label: 'Comisión inmobiliaria (3%)',
      value: costs.realEstateCommission,
      info: includeCommission ? 'Comisión del comprador' : 'No incluida',
    },
    { label: 'Gastos bancarios', value: costs.bankFees, info: 'Tasación, informes, etc.' },
    { label: 'Tasación', value: costs.appraisalFee, info: 'Valuación de la propiedad' },
    { label: 'Seguro de título (0.3%)', value: costs.titleInsurance, info: 'Protección legal' },
  ]

  return (
    <div className={cn('rounded-xl border border-border bg-card p-6', className)}>
      <div className="mb-6 flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Gastos de Escrituración</h2>
      </div>

      <div className="space-y-6">
        {/* Property Price */}
        <div>
          <label className="mb-2 flex items-center justify-between text-sm font-medium">
            <span>Precio de la propiedad (ARS)</span>
            <span className="text-primary">{formatCurrency(propertyPrice)}</span>
          </label>
          <input
            type="range"
            min={10000000}
            max={500000000}
            step={5000000}
            value={propertyPrice}
            onChange={(e) => setPropertyPrice(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        {/* Options */}
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isNewConstruction}
              onChange={(e) => setIsNewConstruction(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm">Propiedad a estrenar</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeCommission}
              onChange={(e) => setIncludeCommission(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm">Incluir comisión inmobiliaria</span>
          </label>
        </div>

        {/* Cost Breakdown */}
        <div className="space-y-2">
          {costItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{item.label}</span>
                <span
                  className="cursor-help text-muted-foreground"
                  title={item.info}
                >
                  <Info className="h-3 w-3" />
                </span>
              </div>
              <span
                className={cn(
                  'font-medium',
                  item.value === 0 ? 'text-muted-foreground' : ''
                )}
              >
                {item.value === 0 ? '-' : formatCurrency(item.value)}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="rounded-xl bg-primary/5 p-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total gastos estimados</span>
            <span className="text-2xl font-bold text-primary">{formatCurrency(costs.total)}</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Representa el {((costs.total / propertyPrice) * 100).toFixed(1)}% del precio de la
            propiedad
          </p>
        </div>

        {/* Info */}
        <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Los valores son estimativos y pueden variar según la jurisdicción, el escribano y las
            condiciones específicas de la operación. Consultá con un profesional para obtener valores exactos.
          </p>
        </div>
      </div>
    </div>
  )
}
