'use client'

import { PRICE_COLORS } from './types'

interface MapLegendProps {
  className?: string
}

export function MapLegend({ className }: MapLegendProps) {
  const legendItems = [
    { label: 'Oportunidad', color: PRICE_COLORS.opportunity },
    { label: 'Justo', color: PRICE_COLORS.fair },
    { label: 'Elevado', color: PRICE_COLORS.expensive },
    { label: 'Sobrevalorado', color: PRICE_COLORS.overpriced },
  ]

  return (
    <div className={`rounded-lg border bg-background p-3 shadow-md ${className}`}>
      <p className="mb-2 text-xs font-medium text-muted-foreground">Precio</p>
      <div className="flex flex-col gap-1.5">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
