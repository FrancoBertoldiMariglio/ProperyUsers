'use client'

import type { JSX } from 'react'
import { useState, Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  getNeighborhoods,
  getNeighborhoodStats,
  getPriceHistory,
  type Neighborhood,
  type NeighborhoodStats,
} from '@propery/api-client'
import { Button } from '@propery/ui/web'
import { cn } from '@propery/ui/shared'
import {
  TrendingUp,
  TrendingDown,
  Building2,
  Clock,
  DollarSign,
  Home,
  BarChart3,
  Loader2,
  ChevronDown,
} from 'lucide-react'
import { PriceTrendChart } from './price-trend-chart'
import { PropertyTypeChart } from './property-type-chart'
import { PriceDistributionChart } from './price-distribution-chart'
import { MarketRecommendation } from './market-recommendation'
import { NeighborhoodCompare } from './neighborhood-compare'

function AnalyticsContent(): JSX.Element {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('palermo')
  const [showCompare, setShowCompare] = useState(false)

  const { data: neighborhoods = [] } = useQuery({
    queryKey: ['neighborhoods'],
    queryFn: getNeighborhoods,
  })

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['neighborhood-stats', selectedNeighborhood],
    queryFn: () => getNeighborhoodStats(selectedNeighborhood),
    enabled: !!selectedNeighborhood,
  })

  const { data: priceHistory = [] } = useQuery({
    queryKey: ['price-history', selectedNeighborhood],
    queryFn: () => getPriceHistory(selectedNeighborhood, 12),
    enabled: !!selectedNeighborhood,
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold">Analytics de Mercado</h1>
            <p className="text-sm text-muted-foreground">
              Análisis de precios y tendencias por barrio
            </p>
          </div>
          <Button
            variant={showCompare ? 'default' : 'outline'}
            onClick={() => setShowCompare(!showCompare)}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Comparar barrios
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {showCompare ? (
          <NeighborhoodCompare
            neighborhoods={neighborhoods}
            onClose={() => setShowCompare(false)}
          />
        ) : (
          <>
            {/* Neighborhood Selector */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium">
                Seleccionar barrio
              </label>
              <div className="relative w-full max-w-xs">
                <select
                  value={selectedNeighborhood}
                  onChange={(e) => setSelectedNeighborhood(e.target.value)}
                  className="w-full appearance-none rounded-lg border bg-background px-4 py-2 pr-10"
                >
                  {neighborhoods.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {statsLoading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : stats ? (
              <>
                {/* KPI Cards */}
                <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <KPICard
                    title="Precio promedio/m²"
                    value={`USD ${stats.avgPricePerM2Sale.toLocaleString()}`}
                    subtitle="Venta"
                    icon={DollarSign}
                    trend={stats.priceTrend6m}
                  />
                  <KPICard
                    title="Alquiler promedio/m²"
                    value={`USD ${stats.avgPricePerM2Rent}`}
                    subtitle="Por mes"
                    icon={Home}
                  />
                  <KPICard
                    title="Publicaciones activas"
                    value={stats.totalListings.toLocaleString()}
                    subtitle="En el barrio"
                    icon={Building2}
                  />
                  <KPICard
                    title="Días en mercado"
                    value={`${stats.avgDaysOnMarket} días`}
                    subtitle="Promedio"
                    icon={Clock}
                  />
                </div>

                {/* AI Recommendation */}
                <div className="mb-8">
                  <MarketRecommendation
                    stats={stats}
                    priceHistory={priceHistory}
                  />
                </div>

                {/* Charts Grid */}
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Price Trend */}
                  <div className="rounded-lg border bg-card p-4">
                    <h3 className="mb-4 font-semibold">Tendencia de precios (12 meses)</h3>
                    <PriceTrendChart data={priceHistory} />
                  </div>

                  {/* Property Type Distribution */}
                  <div className="rounded-lg border bg-card p-4">
                    <h3 className="mb-4 font-semibold">Distribución por tipo</h3>
                    <PropertyTypeChart distribution={stats.distribution} />
                  </div>

                  {/* Price Distribution */}
                  <div className="rounded-lg border bg-card p-4 lg:col-span-2">
                    <h3 className="mb-4 font-semibold">Rango de precios</h3>
                    <PriceDistributionChart priceRanges={stats.priceRanges} />
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-lg border bg-muted/50 p-8 text-center">
                <p className="text-muted-foreground">
                  Selecciona un barrio para ver las estadísticas
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

interface KPICardProps {
  title: string
  value: string
  subtitle: string
  icon: typeof DollarSign
  trend?: number
}

function KPICard({ title, value, subtitle, icon: Icon, trend }: KPICardProps): JSX.Element {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between">
        <div className="rounded-lg bg-primary/10 p-2">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        {trend !== undefined && (
          <div
            className={cn(
              'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
              trend >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            )}
          >
            {trend >= 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {trend >= 0 ? '+' : ''}
            {trend.toFixed(1)}%
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{title}</p>
    </div>
  )
}

export default function AnalyticsPage(): JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <AnalyticsContent />
    </Suspense>
  )
}
