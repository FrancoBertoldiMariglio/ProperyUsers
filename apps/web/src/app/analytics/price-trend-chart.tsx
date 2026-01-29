'use client'

import type { JSX } from 'react'
import type { PriceHistoryPoint } from '@propery/api-client'
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

interface PriceTrendChartProps {
  data: PriceHistoryPoint[]
}

export function PriceTrendChart({ data }: PriceTrendChartProps): JSX.Element {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        No hay datos disponibles
      </div>
    )
  }

  const formattedData = data.map((point) => ({
    ...point,
    date: formatMonth(point.date),
  }))

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const data = payload[0].payload
              return (
                <div className="rounded-lg border bg-background p-3 shadow-lg">
                  <p className="font-medium">{data.date}</p>
                  <p className="text-sm text-primary">
                    Promedio: ${data.avgPrice.toLocaleString()}/m²
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Mediana: ${data.medianPrice.toLocaleString()}/m²
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Publicaciones: {data.listings}
                  </p>
                </div>
              )
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="avgPrice"
            name="Precio promedio"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="medianPrice"
            name="Mediana"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function formatMonth(dateStr: string): string {
  const [year, month] = dateStr.split('-')
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  return `${months[parseInt(month) - 1]} ${year.slice(2)}`
}
