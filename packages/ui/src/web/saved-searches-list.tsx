'use client'

import * as React from 'react'
import { Search, Bell, BellOff, Trash2, Play, MapPin, Home, DollarSign } from 'lucide-react'
import { cn } from '../shared/utils'
import { Button } from './button'
import { Badge } from './badge'

interface SavedSearch {
  id: string
  name: string
  filters: {
    operationType?: 'sale' | 'rent'
    propertyTypes?: string[]
    priceMin?: number
    priceMax?: number
    neighborhoods?: string[]
    bedrooms?: number
    bathrooms?: number
    amenities?: string[]
  }
  alertEnabled: boolean
  createdAt: string
  lastNotifiedAt: string | null
}

interface SavedSearchesListProps {
  searches: SavedSearch[]
  onDelete: (id: string) => void
  onToggleAlert: (id: string) => void
  onExecuteSearch: (search: SavedSearch) => void
  emptyMessage?: string
  className?: string
}

function formatFilters(filters: SavedSearch['filters']): string[] {
  const parts: string[] = []

  if (filters.operationType) {
    parts.push(filters.operationType === 'sale' ? 'Venta' : 'Alquiler')
  }

  if (filters.propertyTypes?.length) {
    parts.push(filters.propertyTypes.join(', '))
  }

  if (filters.priceMin || filters.priceMax) {
    if (filters.priceMin && filters.priceMax) {
      parts.push(`$${filters.priceMin.toLocaleString()} - $${filters.priceMax.toLocaleString()}`)
    } else if (filters.priceMin) {
      parts.push(`Desde $${filters.priceMin.toLocaleString()}`)
    } else if (filters.priceMax) {
      parts.push(`Hasta $${filters.priceMax.toLocaleString()}`)
    }
  }

  if (filters.bedrooms) {
    parts.push(`${filters.bedrooms}+ hab`)
  }

  return parts
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
  })
}

function SavedSearchCard({
  search,
  onDelete,
  onToggleAlert,
  onExecuteSearch,
}: {
  search: SavedSearch
  onDelete: () => void
  onToggleAlert: () => void
  onExecuteSearch: () => void
}): JSX.Element {
  const filterParts = formatFilters(search.filters)

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold">{search.name}</h3>
          <p className="text-xs text-muted-foreground">
            Creada el {formatDate(search.createdAt)}
          </p>
        </div>

        {/* Alert toggle */}
        <button
          onClick={onToggleAlert}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
            search.alertEnabled
              ? 'bg-primary/10 text-primary'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
          aria-label={search.alertEnabled ? 'Desactivar alertas' : 'Activar alertas'}
        >
          {search.alertEnabled ? (
            <Bell className="h-4 w-4" />
          ) : (
            <BellOff className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Filters */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {search.filters.neighborhoods?.slice(0, 3).map((n) => (
          <Badge key={n} variant="secondary" className="text-xs">
            <MapPin className="mr-1 h-3 w-3" />
            {n}
          </Badge>
        ))}
        {search.filters.neighborhoods && search.filters.neighborhoods.length > 3 && (
          <Badge variant="secondary" className="text-xs">
            +{search.filters.neighborhoods.length - 3} más
          </Badge>
        )}
      </div>

      {/* Filter summary */}
      {filterParts.length > 0 && (
        <p className="mb-3 text-sm text-muted-foreground">
          {filterParts.join(' · ')}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="default"
          size="sm"
          className="flex-1"
          onClick={onExecuteSearch}
        >
          <Play className="mr-1 h-3 w-3" />
          Buscar
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Alert status */}
      {search.alertEnabled && (
        <div className="mt-3 flex items-center gap-1 rounded-lg bg-primary/5 px-2 py-1 text-xs text-primary">
          <Bell className="h-3 w-3" />
          Alertas activas
          {search.lastNotifiedAt && (
            <span className="text-muted-foreground">
              · Última: {formatDate(search.lastNotifiedAt)}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export function SavedSearchesList({
  searches,
  onDelete,
  onToggleAlert,
  onExecuteSearch,
  emptyMessage = 'No tenés búsquedas guardadas',
  className,
}: SavedSearchesListProps): JSX.Element {
  if (searches.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
        <Search className="mb-4 h-16 w-16 text-muted-foreground/30" />
        <p className="text-lg font-medium text-muted-foreground">{emptyMessage}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Guardá tus búsquedas para recibir alertas de nuevas propiedades
        </p>
      </div>
    )
  }

  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {searches.map((search) => (
        <SavedSearchCard
          key={search.id}
          search={search}
          onDelete={() => onDelete(search.id)}
          onToggleAlert={() => onToggleAlert(search.id)}
          onExecuteSearch={() => onExecuteSearch(search)}
        />
      ))}
    </div>
  )
}
