'use client'

import { useState } from 'react'
import { Layers, Thermometer, MapIcon, ChevronDown } from 'lucide-react'
import { Button } from '@propery/ui/web'
import { type MapLayerType, MAP_LAYERS } from './types'

interface MapToolbarProps {
  activeLayers: MapLayerType[]
  showHeatmap: boolean
  showNeighborhoodPolygons: boolean
  onToggleLayer: (layer: MapLayerType) => void
  onToggleHeatmap: () => void
  onToggleNeighborhoodPolygons: () => void
  className?: string
}

export function MapToolbar({
  activeLayers,
  showHeatmap,
  showNeighborhoodPolygons,
  onToggleLayer,
  onToggleHeatmap,
  onToggleNeighborhoodPolygons,
  className,
}: MapToolbarProps) {
  const [showLayerMenu, setShowLayerMenu] = useState(false)

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Layer toggle dropdown */}
      <div className="relative">
        <Button
          variant={activeLayers.length > 0 ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowLayerMenu(!showLayerMenu)}
          className="gap-2"
        >
          <Layers className="h-4 w-4" />
          Capas
          {activeLayers.length > 0 && (
            <span className="ml-1 rounded-full bg-primary-foreground/20 px-1.5 text-xs">
              {activeLayers.length}
            </span>
          )}
          <ChevronDown className="h-3 w-3" />
        </Button>

        {showLayerMenu && (
          <div className="absolute left-0 top-full z-50 mt-1 w-48 rounded-lg border bg-background p-2 shadow-lg">
            {MAP_LAYERS.map((layer) => (
              <button
                key={layer.id}
                onClick={() => onToggleLayer(layer.id)}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                  activeLayers.includes(layer.id)
                    ? 'bg-accent'
                    : 'hover:bg-muted'
                }`}
              >
                <span>{layer.icon}</span>
                <span>{layer.name}</span>
                {activeLayers.includes(layer.id) && (
                  <span className="ml-auto text-primary">✓</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Heatmap toggle */}
      <Button
        variant={showHeatmap ? 'default' : 'outline'}
        size="sm"
        onClick={onToggleHeatmap}
        className="gap-2"
        title="Mapa de calor de precios"
      >
        <Thermometer className="h-4 w-4" />
        Heatmap
      </Button>

      {/* Neighborhood polygons toggle */}
      <Button
        variant={showNeighborhoodPolygons ? 'default' : 'outline'}
        size="sm"
        onClick={onToggleNeighborhoodPolygons}
        className="gap-2"
        title="Mostrar barrios"
      >
        <MapIcon className="h-4 w-4" />
        Barrios
      </Button>
    </div>
  )
}
