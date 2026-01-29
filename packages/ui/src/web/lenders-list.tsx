'use client'

import * as React from 'react'
import { Building2, Phone, Globe, Mail, ChevronDown, ChevronUp, Percent, Clock } from 'lucide-react'
import { cn } from '../shared/utils'
import { Badge } from './badge'
import { Button } from './button'

interface LenderProduct {
  id: string
  name: string
  type: 'mortgage' | 'personal' | 'uva'
  currency: 'USD' | 'ARS' | 'UVA'
  minAmount: number
  maxAmount: number
  minTermMonths: number
  maxTermMonths: number
  annualRate: number
  system: 'french' | 'german'
  downPaymentMin: number
  maxLTV: number
  features: string[]
}

interface Lender {
  id: string
  name: string
  logo: string
  type: 'bank' | 'fintech' | 'government'
  products: LenderProduct[]
  contact: {
    phone: string
    website: string
    email?: string
  }
  requirements: string[]
}

interface LendersListProps {
  lenders: Lender[]
  onSelectProduct?: (lender: Lender, product: LenderProduct) => void
  className?: string
}

function formatCurrency(amount: number, currency: string): string {
  if (currency === 'USD') {
    return `US$ ${(amount / 1000).toLocaleString('es-AR')}k`
  }
  if (currency === 'UVA') {
    return `${amount.toLocaleString('es-AR')} UVAs`
  }
  return `$ ${(amount / 1000000).toLocaleString('es-AR')}M`
}

function LenderCard({
  lender,
  onSelectProduct,
}: {
  lender: Lender
  onSelectProduct?: (product: LenderProduct) => void
}): JSX.Element {
  const [isExpanded, setIsExpanded] = React.useState(false)

  const typeLabel = {
    bank: 'Banco',
    fintech: 'Fintech',
    government: 'Programa estatal',
  }

  const typeColor = {
    bank: 'bg-blue-100 text-blue-700',
    fintech: 'bg-purple-100 text-purple-700',
    government: 'bg-green-100 text-green-700',
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-center gap-4 p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
          <Building2 className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{lender.name}</h3>
          <Badge className={cn('text-xs', typeColor[lender.type])}>
            {typeLabel[lender.type]}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Products */}
      <div className="border-t border-border bg-muted/30 px-4 py-3">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          {lender.products.length} producto{lender.products.length !== 1 && 's'} disponible{lender.products.length !== 1 && 's'}
        </p>
        <div className="flex flex-wrap gap-2">
          {lender.products.map((product) => (
            <button
              key={product.id}
              onClick={() => onSelectProduct?.(product)}
              className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm transition-colors hover:border-primary hover:bg-primary/5"
            >
              <Percent className="h-4 w-4 text-primary" />
              <span className="font-medium">{product.annualRate}% TNA</span>
              <span className="text-muted-foreground">· {product.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-border p-4">
          {/* Products Detail */}
          <div className="mb-4 space-y-3">
            {lender.products.map((product) => (
              <div
                key={product.id}
                className="rounded-lg border border-border p-3"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-medium">{product.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {product.currency}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Tasa</p>
                    <p className="font-medium">{product.annualRate}% TNA</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Plazo</p>
                    <p className="font-medium">
                      {product.minTermMonths / 12} - {product.maxTermMonths / 12} años
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Anticipo mín.</p>
                    <p className="font-medium">{product.downPaymentMin}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Monto</p>
                    <p className="font-medium">
                      {formatCurrency(product.minAmount, product.currency)} -{' '}
                      {formatCurrency(product.maxAmount, product.currency)}
                    </p>
                  </div>
                </div>
                {product.features.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {product.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Requirements */}
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-medium">Requisitos</h4>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              {lender.requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-wrap gap-2">
            <a
              href={`tel:${lender.contact.phone}`}
              className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm hover:bg-muted/80"
            >
              <Phone className="h-4 w-4" />
              {lender.contact.phone}
            </a>
            <a
              href={lender.contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm hover:bg-muted/80"
            >
              <Globe className="h-4 w-4" />
              Sitio web
            </a>
            {lender.contact.email && (
              <a
                href={`mailto:${lender.contact.email}`}
                className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm hover:bg-muted/80"
              >
                <Mail className="h-4 w-4" />
                Email
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function LendersList({
  lenders,
  onSelectProduct,
  className,
}: LendersListProps): JSX.Element {
  const [filter, setFilter] = React.useState<'all' | 'bank' | 'government'>('all')

  const filteredLenders = lenders.filter(
    (lender) => filter === 'all' || lender.type === filter
  )

  // Sort by best rate
  const sortedLenders = [...filteredLenders].sort((a, b) => {
    const aMinRate = Math.min(...a.products.map((p) => p.annualRate))
    const bMinRate = Math.min(...b.products.map((p) => p.annualRate))
    return aMinRate - bMinRate
  })

  return (
    <div className={className}>
      {/* Filter */}
      <div className="mb-4 flex gap-2">
        {[
          { value: 'all' as const, label: 'Todos' },
          { value: 'bank' as const, label: 'Bancos' },
          { value: 'government' as const, label: 'Estatales' },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-colors',
              filter === option.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {sortedLenders.map((lender) => (
          <LenderCard
            key={lender.id}
            lender={lender}
            onSelectProduct={(product) => onSelectProduct?.(lender, product)}
          />
        ))}
      </div>

      {sortedLenders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Building2 className="mb-4 h-16 w-16 text-muted-foreground/30" />
          <p className="text-lg font-medium text-muted-foreground">
            No hay financiadoras disponibles
          </p>
        </div>
      )}
    </div>
  )
}
