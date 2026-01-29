'use client'

import type { Property } from '@propery/api-client'
import { MapPin } from 'lucide-react'

interface MiniMapProps {
  properties: Property[]
  comparingIds?: string[]
  favoriteIds?: string[]
  selectedId?: string
  onPropertyClick?: (property: Property) => void
  className?: string
}

// Placeholder mini-map component - will be replaced with Mapbox in Module 4
export function MiniMap({
  properties,
  comparingIds = [],
  favoriteIds = [],
  selectedId,
  onPropertyClick,
  className,
}: MiniMapProps) {
  // Group properties by neighborhood for the placeholder view
  const byNeighborhood = properties.reduce(
    (acc, property) => {
      const hood = property.location.neighborhood
      if (!acc[hood]) acc[hood] = []
      acc[hood].push(property)
      return acc
    },
    {} as Record<string, Property[]>
  )

  return (
    <div className={`flex h-full flex-col bg-muted/50 ${className}`}>
      {/* Map placeholder header */}
      <div className="border-b bg-background p-3">
        <p className="text-sm text-muted-foreground">
          Vista de mapa (Mapbox se implementara en Modulo 4)
        </p>
      </div>

      {/* Simplified neighborhood view */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid gap-3">
          {Object.entries(byNeighborhood).map(([neighborhood, props]) => (
            <div
              key={neighborhood}
              className="rounded-lg border bg-background p-3"
            >
              <div className="mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-medium">{neighborhood}</span>
                <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                  {props.length} propiedades
                </span>
              </div>

              <div className="flex flex-wrap gap-1">
                {props.slice(0, 5).map((property) => {
                  const isComparing = comparingIds.includes(property.id)
                  const isFavorite = favoriteIds.includes(property.id)
                  const isSelected = selectedId === property.id

                  return (
                    <button
                      key={property.id}
                      onClick={() => onPropertyClick?.(property)}
                      className={`rounded px-2 py-1 text-xs transition-colors ${
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : isComparing
                            ? 'bg-blue-100 text-blue-700'
                            : isFavorite
                              ? 'bg-red-100 text-red-700'
                              : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      USD {(property.price / 1000).toFixed(0)}k
                    </button>
                  )
                })}
                {props.length > 5 && (
                  <span className="px-2 py-1 text-xs text-muted-foreground">
                    +{props.length - 5} mas
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="border-t bg-background p-3">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-opportunity" />
            <span>Oportunidad</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-fair" />
            <span>Justo</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-expensive" />
            <span>Elevado</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-overpriced" />
            <span>Sobrevalorado</span>
          </div>
        </div>
      </div>
    </div>
  )
}
