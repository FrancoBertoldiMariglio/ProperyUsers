'use client'

import { Plus, Minus, Crosshair, Maximize2, PenTool } from 'lucide-react'
import { Button } from '@propery/ui/web'

interface MapControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onGeolocate: () => void
  onFitBounds: () => void
  onStartDrawing: () => void
  isDrawing: boolean
  className?: string
}

export function MapControls({
  onZoomIn,
  onZoomOut,
  onGeolocate,
  onFitBounds,
  onStartDrawing,
  isDrawing,
  className,
}: MapControlsProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Zoom controls */}
      <div className="flex flex-col rounded-lg border bg-background shadow-md">
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomIn}
          className="rounded-b-none border-b px-3 py-2"
          title="Acercar"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomOut}
          className="rounded-t-none px-3 py-2"
          title="Alejar"
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>

      {/* Geolocation */}
      <Button
        variant="outline"
        size="sm"
        onClick={onGeolocate}
        className="rounded-lg bg-background shadow-md"
        title="Mi ubicacion"
      >
        <Crosshair className="h-4 w-4" />
      </Button>

      {/* Fit to bounds */}
      <Button
        variant="outline"
        size="sm"
        onClick={onFitBounds}
        className="rounded-lg bg-background shadow-md"
        title="Ver todas las propiedades"
      >
        <Maximize2 className="h-4 w-4" />
      </Button>

      {/* Draw to search */}
      <Button
        variant={isDrawing ? 'default' : 'outline'}
        size="sm"
        onClick={onStartDrawing}
        className="rounded-lg bg-background shadow-md"
        title="Dibujar area de busqueda"
      >
        <PenTool className="h-4 w-4" />
      </Button>
    </div>
  )
}
