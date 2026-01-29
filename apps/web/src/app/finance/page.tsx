'use client'

import * as React from 'react'
import { Suspense } from 'react'
import Link from 'next/link'
import {
  Calculator,
  Building2,
  TrendingUp,
  FileText,
  ArrowLeft,
} from 'lucide-react'
import { Button } from '@propery/ui/web'
import {
  MortgageCalculator,
  ClosingCostsCalculator,
  RentVsBuyCalculator,
  LendersList,
} from '@propery/ui/web'
import { mocks } from '@propery/api-client'

const { mockLenders } = mocks

type TabId = 'mortgage' | 'closing' | 'rentvsbuy' | 'lenders'

const TABS: Array<{ id: TabId; label: string; icon: React.ElementType; description: string }> = [
  {
    id: 'mortgage',
    label: 'Crédito Hipotecario',
    icon: Calculator,
    description: 'Calculá tu cuota mensual',
  },
  {
    id: 'closing',
    label: 'Gastos de Escrituración',
    icon: FileText,
    description: 'Estimá los costos de cierre',
  },
  {
    id: 'rentvsbuy',
    label: '¿Alquilar o Comprar?',
    icon: TrendingUp,
    description: 'Analizá qué te conviene',
  },
  {
    id: 'lenders',
    label: 'Financiadoras',
    icon: Building2,
    description: 'Compará opciones de crédito',
  },
]

function FinanceContent(): JSX.Element {
  const [activeTab, setActiveTab] = React.useState<TabId>('mortgage')

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4">
          <Link href="/search">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">Calculadoras Financieras</h1>
            <p className="text-sm text-muted-foreground">
              Herramientas para planificar tu compra
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Tabs */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${
                  isActive
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className={`text-sm font-medium ${isActive ? 'text-primary' : ''}`}>
                    {tab.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{tab.description}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          {activeTab === 'mortgage' && (
            <>
              <MortgageCalculator />
              <div className="space-y-6">
                <div className="rounded-xl border border-border bg-card p-6">
                  <h3 className="mb-4 font-semibold">Tips para tu crédito</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>
                        <strong className="text-foreground">Sistema francés:</strong> Cuotas fijas
                        durante todo el préstamo. Ideal si preferís previsibilidad.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>
                        <strong className="text-foreground">Sistema alemán:</strong> Cuotas
                        decrecientes. Pagás más intereses al principio pero menos en total.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>
                        <strong className="text-foreground">Relación cuota/ingreso:</strong> Los
                        bancos suelen aceptar hasta 30-35% de tus ingresos.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>
                        <strong className="text-foreground">Créditos UVA:</strong> Ajustan por
                        inflación. Tasa más baja pero cuota variable.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {activeTab === 'closing' && (
            <>
              <ClosingCostsCalculator />
              <div className="space-y-6">
                <div className="rounded-xl border border-border bg-card p-6">
                  <h3 className="mb-4 font-semibold">Sobre los gastos</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>
                        <strong className="text-foreground">Escribanía:</strong> Honorarios del
                        escribano por la escritura traslativa de dominio.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>
                        <strong className="text-foreground">Impuesto de sellos:</strong> Varía por
                        provincia. En CABA es 3.6%. Propiedades a estrenar pueden estar exentas.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>
                        <strong className="text-foreground">Comisión inmobiliaria:</strong>{' '}
                        Generalmente 3% + IVA para el comprador.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>
                        <strong className="text-foreground">Gastos bancarios:</strong> Si tomás
                        crédito, incluyen tasación, seguros e informes.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {activeTab === 'rentvsbuy' && (
            <>
              <RentVsBuyCalculator />
              <div className="space-y-6">
                <div className="rounded-xl border border-border bg-card p-6">
                  <h3 className="mb-4 font-semibold">Factores a considerar</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>
                        <strong className="text-foreground">Horizonte temporal:</strong> Comprar
                        suele convenir si vas a quedarte más de 5-7 años.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>
                        <strong className="text-foreground">Costo de oportunidad:</strong> El
                        anticipo podría invertirse y generar retornos.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>
                        <strong className="text-foreground">Flexibilidad:</strong> Alquilar permite
                        mudarte más fácilmente si cambian tus circunstancias.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>
                        <strong className="text-foreground">Patrimonio:</strong> Comprar construye
                        equity que podés usar en el futuro.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {activeTab === 'lenders' && (
            <div className="lg:col-span-2">
              <div className="mb-6 rounded-xl border border-border bg-card p-6">
                <h3 className="mb-2 font-semibold">Comparador de Créditos Hipotecarios</h3>
                <p className="text-sm text-muted-foreground">
                  Explorá las opciones de crédito disponibles en Argentina. Las tasas y condiciones
                  son de referencia y pueden variar. Consultá directamente con cada entidad para
                  información actualizada.
                </p>
              </div>
              <LendersList
                lenders={mockLenders || []}
                onSelectProduct={(lender, product) => {
                  console.log('Selected:', lender.name, product.name)
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function FinancePage(): JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <FinanceContent />
    </Suspense>
  )
}
