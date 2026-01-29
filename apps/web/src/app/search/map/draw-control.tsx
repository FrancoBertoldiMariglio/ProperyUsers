'use client'

import { Check, X } from 'lucide-react'
import { Button } from '@propery/ui/web'

interface DrawControlProps {
  points: [number, number][]
  onFinish: () => void
  onCancel: () => void
  className?: string
}

export function DrawControl({
  points,
  onFinish,
  onCancel,
  className,
}: DrawControlProps) {
  return (
    <div
      className={`rounded-lg border bg-background px-4 py-2 shadow-lg ${className}`}
    >
      <div className="flex items-center gap-4">
        <span className="text-sm">
          {points.length === 0 ? (
            'Haz clic para comenzar a dibujar'
          ) : points.length < 3 ? (
            `${points.length} puntos - necesitas al menos 3`
          ) : (
            `${points.length} puntos seleccionados`
          )}
        </span>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onCancel}
            className="h-8"
          >
            <X className="mr-1 h-4 w-4" />
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={onFinish}
            disabled={points.length < 3}
            className="h-8"
          >
            <Check className="mr-1 h-4 w-4" />
            Buscar en area
          </Button>
        </div>
      </div>
    </div>
  )
}
