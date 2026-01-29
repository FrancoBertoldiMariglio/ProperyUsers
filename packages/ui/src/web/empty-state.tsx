'use client'

import * as React from 'react'
import { SearchX, Home, Filter, RefreshCw } from 'lucide-react'
import { cn } from '../shared/utils'
import { Button } from './button'

interface EmptyStateProps {
  variant?: 'no-results' | 'no-properties' | 'error'
  title?: string
  description?: string
  onReset?: () => void
  onRetry?: () => void
  className?: string
}

const variants = {
  'no-results': {
    icon: SearchX,
    defaultTitle: 'No encontramos propiedades',
    defaultDescription: 'Intenta ajustar los filtros para ver mas resultados.',
  },
  'no-properties': {
    icon: Home,
    defaultTitle: 'Sin propiedades',
    defaultDescription: 'No hay propiedades disponibles en este momento.',
  },
  error: {
    icon: RefreshCw,
    defaultTitle: 'Error al cargar',
    defaultDescription: 'Hubo un problema al cargar las propiedades. Por favor intenta de nuevo.',
  },
}

export function EmptyState({
  variant = 'no-results',
  title,
  description,
  onReset,
  onRetry,
  className,
}: EmptyStateProps) {
  const config = variants[variant]
  const Icon = config.icon

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center',
        className
      )}
    >
      <div className="mb-4 rounded-full bg-muted p-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>

      <h3 className="mb-2 text-lg font-semibold text-foreground">
        {title || config.defaultTitle}
      </h3>

      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        {description || config.defaultDescription}
      </p>

      <div className="flex gap-3">
        {onReset && (
          <Button variant="outline" onClick={onReset}>
            <Filter className="mr-2 h-4 w-4" />
            Limpiar filtros
          </Button>
        )}
        {onRetry && (
          <Button onClick={onRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reintentar
          </Button>
        )}
      </div>
    </div>
  )
}
