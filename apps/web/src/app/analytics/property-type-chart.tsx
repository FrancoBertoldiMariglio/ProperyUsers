'use client'

import type { JSX } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface PropertyTypeChartProps {
  distribution: {
    apartments: number
    houses: number
    phs: number
    other: number
  }
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))']
const FALLBACK_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6']

const LABELS: Record<string, string> = {
  apartments: 'Departamentos',
  houses: 'Casas',
  phs: 'PH',
  other: 'Otros',
}

export function PropertyTypeChart({ distribution }: PropertyTypeChartProps): JSX.Element {
  const data = Object.entries(distribution).map(([key, value]) => ({
    name: LABELS[key] || key,
    value,
  }))

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const data = payload[0].payload
              const percentage = ((data.value / total) * 100).toFixed(1)
              return (
                <div className="rounded-lg border bg-background p-3 shadow-lg">
                  <p className="font-medium">{data.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {data.value}% ({percentage}% del total)
                  </p>
                </div>
              )
            }}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            formatter={(value, entry) => {
              const item = data.find((d) => d.name === value)
              return (
                <span className="text-sm">
                  {value} ({item?.value}%)
                </span>
              )
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
