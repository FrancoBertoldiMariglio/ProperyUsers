'use client'

import type { JSX } from 'react'
import { useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import {
  getNeighborhoodStats,
  getPriceHistory,
  type Neighborhood,
  type NeighborhoodStats,
  type PriceHistoryPoint,
} from '@propery/api-client'
import { Button } from '@propery/ui/web'
import { cn } from '@propery/ui/shared'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { X, Plus, TrendingUp, TrendingDown } from 'lucide-react'

interface NeighborhoodCompareProps {
  neighborhoods: Neighborhood[]
  onClose: () => void
}

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b']

export function NeighborhoodCompare({
  neighborhoods,
  onClose,
}: NeighborhoodCompareProps): JSX.Element {
  const [selectedIds, setSelectedIds] = useState<string[]>(['palermo', 'recoleta'])

  const statsQueries = useQueries({
    queries: selectedIds.map((id) => ({
      queryKey: ['neighborhood-stats', id],
      queryFn: () => getNeighborhoodStats(id),
    })),
  })

  const historyQueries = useQueries({
    queries: selectedIds.map((id) => ({
      queryKey: ['price-history', id],
      queryFn: () => getPriceHistory(id, 12),
    })),
  })

  const stats = statsQueries
    .map((q) => q.data)
    .filter((s): s is NeighborhoodStats => s !== null && s !== undefined)

  const histories = historyQueries
    .map((q) => q.data)
    .filter((h): h is PriceHistoryPoint[] => h !== undefined)

  const addNeighborhood = (id: string) => {
    if (selectedIds.length < 3 && !selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id])
    }
  }

  const removeNeighborhood = (id: string) => {
    if (selectedIds.length > 1) {
      setSelectedIds(selectedIds.filter((i) => i !== id))
    }
  }

  // Merge history data for comparison chart
  const mergedHistory = histories[0]?.map((point, index) => {
    const merged: Record<string, string | number> = { date: formatMonth(point.date) }
    histories.forEach((history, i) => {
      if (history[index]) {
        merged[selectedIds[i]] = history[index].avgPrice
      }
    })
    return merged
  }) ?? []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Comparar barrios</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Neighborhood selector */}
      <div className="flex flex-wrap gap-2">
        {selectedIds.map((id, index) => {
          const neighborhood = neighborhoods.find((n) => n.id === id)
          return (
            <div
              key={id}
              className="flex items-center gap-2 rounded-full border px-3 py-1.5"
              style={{ borderColor: COLORS[index] }}
            >
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[index] }}
              />
              <span className="text-sm font-medium">{neighborhood?.name}</span>
              {selectedIds.length > 1 && (
                <button
                  onClick={() => removeNeighborhood(id)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          )
        })}
        {selectedIds.length < 3 && (
          <select
            onChange={(e) => {
              if (e.target.value) addNeighborhood(e.target.value)
              e.target.value = ''
            }}
            className="rounded-full border bg-background px-3 py-1.5 text-sm"
            defaultValue=""
          >
            <option value="" disabled>
              + Agregar barrio
            </option>
            {neighborhoods
              .filter((n) => !selectedIds.includes(n.id))
              .map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name}
                </option>
              ))}
          </select>
        )}
      </div>

      {/* KPI Comparison Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-3 text-left text-sm font-medium">Indicador</th>
              {stats.map((s, index) => (
                <th
                  key={s.neighborhoodId}
                  className="p-3 text-center text-sm font-medium"
                  style={{ color: COLORS[index] }}
                >
                  {s.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <CompareRow
              label="Precio/m² (venta)"
              values={stats.map((s) => `USD ${s.avgPricePerM2Sale.toLocaleString()}`)}
              highlight="lower"
              numericValues={stats.map((s) => s.avgPricePerM2Sale)}
            />
            <CompareRow
              label="Precio/m² (alquiler)"
              values={stats.map((s) => `USD ${s.avgPricePerM2Rent}`)}
              highlight="lower"
              numericValues={stats.map((s) => s.avgPricePerM2Rent)}
            />
            <CompareRow
              label="Tendencia 6 meses"
              values={stats.map((s) => (
                <span className="flex items-center justify-center gap-1">
                  {s.priceTrend6m >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  {s.priceTrend6m > 0 ? '+' : ''}{s.priceTrend6m.toFixed(1)}%
                </span>
              ))}
            />
            <CompareRow
              label="Publicaciones"
              values={stats.map((s) => s.totalListings.toLocaleString())}
              highlight="higher"
              numericValues={stats.map((s) => s.totalListings)}
            />
            <CompareRow
              label="Días en mercado"
              values={stats.map((s) => `${s.avgDaysOnMarket} días`)}
              highlight="lower"
              numericValues={stats.map((s) => s.avgDaysOnMarket)}
            />
            <CompareRow
              label="Precio mediano"
              values={stats.map((s) => `USD ${s.priceRanges.median.toLocaleString()}`)}
            />
          </tbody>
        </table>
      </div>

      {/* Price Trend Comparison Chart */}
      <div className="rounded-lg border bg-card p-4">
        <h3 className="mb-4 font-semibold">Tendencia de precios comparada</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mergedHistory} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-lg">
                      <p className="font-medium">{label}</p>
                      {payload.map((p, i) => {
                        const neighborhood = neighborhoods.find((n) => n.id === p.dataKey)
                        return (
                          <p
                            key={i}
                            className="text-sm"
                            style={{ color: p.color }}
                          >
                            {neighborhood?.name}: ${Number(p.value).toLocaleString()}/m²
                          </p>
                        )
                      })}
                    </div>
                  )
                }}
              />
              <Legend
                formatter={(value) => {
                  const neighborhood = neighborhoods.find((n) => n.id === value)
                  return neighborhood?.name || value
                }}
              />
              {selectedIds.map((id, index) => (
                <Line
                  key={id}
                  type="monotone"
                  dataKey={id}
                  stroke={COLORS[index]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

interface CompareRowProps {
  label: string
  values: (string | JSX.Element)[]
  highlight?: 'higher' | 'lower'
  numericValues?: number[]
}

function CompareRow({ label, values, highlight, numericValues }: CompareRowProps): JSX.Element {
  let bestIndex = -1
  if (highlight && numericValues && numericValues.length > 1) {
    if (highlight === 'higher') {
      bestIndex = numericValues.indexOf(Math.max(...numericValues))
    } else {
      bestIndex = numericValues.indexOf(Math.min(...numericValues))
    }
  }

  return (
    <tr className="border-b last:border-0">
      <td className="p-3 text-sm font-medium">{label}</td>
      {values.map((value, index) => (
        <td
          key={index}
          className={cn(
            'p-3 text-center text-sm',
            index === bestIndex && 'bg-green-50 font-semibold text-green-700'
          )}
        >
          {value}
        </td>
      ))}
    </tr>
  )
}

function formatMonth(dateStr: string): string {
  const [year, month] = dateStr.split('-')
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  return `${months[parseInt(month) - 1]} ${year.slice(2)}`
}
