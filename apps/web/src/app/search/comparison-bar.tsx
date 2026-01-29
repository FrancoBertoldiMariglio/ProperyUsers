'use client'

import type { Property } from '@propery/api-client'
import { Button } from '@propery/ui/web'
import { X, GitCompare } from 'lucide-react'
import Image from 'next/image'

interface ComparisonBarProps {
  properties: Property[]
  onRemove: (id: string) => void
  maxProperties?: number
}

export function ComparisonBar({
  properties,
  onRemove,
  maxProperties = 4,
}: ComparisonBarProps) {
  const canCompare = properties.length >= 2

  return (
    <div className="border-t bg-background px-4 py-3 shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center gap-4">
        {/* Selected Properties */}
        <div className="flex flex-1 items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">
            Comparar ({properties.length}/{maxProperties}):
          </span>

          <div className="flex gap-2">
            {properties.map((property) => (
              <div
                key={property.id}
                className="group relative flex items-center gap-2 rounded-lg border bg-muted/50 px-2 py-1"
              >
                <div className="relative h-8 w-8 overflow-hidden rounded">
                  <Image
                    src={property.images[0] || '/placeholder.jpg'}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="max-w-32">
                  <p className="truncate text-xs font-medium">{property.location.neighborhood}</p>
                  <p className="text-xs text-muted-foreground">
                    USD {(property.price / 1000).toFixed(0)}k
                  </p>
                </div>
                <button
                  onClick={() => onRemove(property.id)}
                  className="absolute -right-1 -top-1 hidden rounded-full bg-destructive p-0.5 text-destructive-foreground group-hover:block"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: maxProperties - properties.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex h-12 w-24 items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground"
              >
                Agregar
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => properties.forEach((p) => onRemove(p.id))}
          >
            Limpiar
          </Button>
          <Button size="sm" disabled={!canCompare} asChild>
            <a href={`/compare?ids=${properties.map((p) => p.id).join(',')}`}>
              <GitCompare className="mr-2 h-4 w-4" />
              Comparar
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
