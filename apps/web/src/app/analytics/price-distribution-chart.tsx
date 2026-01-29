'use client'

import type { JSX } from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts'

interface PriceDistributionChartProps {
  priceRanges: {
    min: number
    max: number
    median: number
    q1: number
    q3: number
  }
}

export function PriceDistributionChart({ priceRanges }: PriceDistributionChartProps): JSX.Element {
  const { min, max, median, q1, q3 } = priceRanges

  const data = [
    { name: 'Mínimo', value: min, color: '#94a3b8' },
    { name: 'Q1 (25%)', value: q1, color: '#60a5fa' },
    { name: 'Mediana', value: median, color: '#3b82f6' },
    { name: 'Q3 (75%)', value: q3, color: '#60a5fa' },
    { name: 'Máximo', value: max, color: '#94a3b8' },
  ]

  return (
    <div className="space-y-4">
      {/* Box plot visualization */}
      <div className="relative h-16 rounded-lg bg-muted/50 px-4">
        <div
          className="absolute top-1/2 h-8 -translate-y-1/2 rounded bg-primary/20"
          style={{
            left: `${((q1 - min) / (max - min)) * 100}%`,
            width: `${((q3 - q1) / (max - min)) * 100}%`,
          }}
        />
        <div
          className="absolute top-1/2 h-8 w-0.5 -translate-y-1/2 bg-primary"
          style={{ left: `${((median - min) / (max - min)) * 100}%` }}
        />
        {/* Whiskers */}
        <div
          className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-muted-foreground"
          style={{
            left: '0%',
            width: `${((q1 - min) / (max - min)) * 100}%`,
          }}
        />
        <div
          className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-muted-foreground"
          style={{
            left: `${((q3 - min) / (max - min)) * 100}%`,
            width: `${((max - q3) / (max - min)) * 100}%`,
          }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>${min.toLocaleString()}</span>
        <span>Q1: ${q1.toLocaleString()}</span>
        <span className="font-medium text-primary">Mediana: ${median.toLocaleString()}</span>
        <span>Q3: ${q3.toLocaleString()}</span>
        <span>${max.toLocaleString()}</span>
      </div>

      {/* Bar chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 60, right: 20 }}>
            <XAxis
              type="number"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12 }}
              width={60}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const data = payload[0].payload
                return (
                  <div className="rounded-lg border bg-background p-3 shadow-lg">
                    <p className="font-medium">{data.name}</p>
                    <p className="text-sm text-primary">
                      USD ${data.value.toLocaleString()}
                    </p>
                  </div>
                )
              }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
