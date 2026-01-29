'use client'

import { useState } from 'react'
import { Clock, X, Footprints, Car } from 'lucide-react'
import { Button } from '@propery/ui/web'

export type TravelMode = 'walking' | 'driving' | 'cycling'

interface IsochroneControlProps {
  isActive: boolean
  onActivate: (center: [number, number], minutes: number, mode: TravelMode) => void
  onDeactivate: () => void
  selectedPoint: [number, number] | null
  className?: string
}

const TRAVEL_MODES: { id: TravelMode; label: string; icon: typeof Footprints }[] = [
  { id: 'walking', label: 'Caminando', icon: Footprints },
  { id: 'driving', label: 'En auto', icon: Car },
]

const TIME_OPTIONS = [5, 10, 15, 20, 30]

export function IsochroneControl({
  isActive,
  onActivate,
  onDeactivate,
  selectedPoint,
  className,
}: IsochroneControlProps) {
  const [mode, setMode] = useState<TravelMode>('walking')
  const [minutes, setMinutes] = useState(15)
  const [isSelecting, setIsSelecting] = useState(false)

  const handleActivate = () => {
    if (selectedPoint) {
      onActivate(selectedPoint, minutes, mode)
    } else {
      setIsSelecting(true)
    }
  }

  if (isActive) {
    return (
      <div className={`rounded-lg border bg-background p-3 shadow-lg ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {minutes} min {mode === 'walking' ? 'caminando' : 'en auto'}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={onDeactivate}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  if (isSelecting) {
    return (
      <div className={`rounded-lg border bg-background p-4 shadow-lg ${className}`}>
        <p className="mb-3 text-sm font-medium">Configurar isocrona</p>

        {/* Travel mode */}
        <div className="mb-3">
          <p className="mb-2 text-xs text-muted-foreground">Modo de viaje</p>
          <div className="flex gap-2">
            {TRAVEL_MODES.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={mode === id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMode(id)}
                className="flex-1"
              >
                <Icon className="mr-1 h-3 w-3" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Time selection */}
        <div className="mb-3">
          <p className="mb-2 text-xs text-muted-foreground">Tiempo (minutos)</p>
          <div className="flex flex-wrap gap-1">
            {TIME_OPTIONS.map((t) => (
              <Button
                key={t}
                variant={minutes === t ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMinutes(t)}
                className="h-8 w-12"
              >
                {t}
              </Button>
            ))}
          </div>
        </div>

        <p className="mb-3 text-xs text-muted-foreground">
          {selectedPoint
            ? 'Punto seleccionado. Haz clic en "Mostrar" para ver el area.'
            : 'Haz clic en el mapa para seleccionar un punto central.'}
        </p>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSelecting(false)}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={handleActivate}
            disabled={!selectedPoint}
            className="flex-1"
          >
            Mostrar area
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setIsSelecting(true)}
      className={className}
      title="Mostrar area accesible en X minutos"
    >
      <Clock className="mr-2 h-4 w-4" />
      Isocrona
    </Button>
  )
}

// API helper to fetch isochrone from Mapbox
export async function fetchIsochrone(
  center: [number, number],
  minutes: number,
  mode: TravelMode,
  accessToken: string
): Promise<GeoJSON.Feature<GeoJSON.Polygon> | null> {
  const profile = mode === 'driving' ? 'driving' : mode === 'cycling' ? 'cycling' : 'walking'
  const url = `https://api.mapbox.com/isochrone/v1/mapbox/${profile}/${center[0]},${center[1]}?contours_minutes=${minutes}&polygons=true&access_token=${accessToken}`

  try {
    const response = await fetch(url)
    if (!response.ok) return null

    const data = await response.json()
    return data.features?.[0] || null
  } catch {
    return null
  }
}
