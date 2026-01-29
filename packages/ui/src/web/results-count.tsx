'use client'

import * as React from 'react'
import { cn } from '../shared/utils'

interface ResultsCountProps {
  total: number
  filtered?: number
  className?: string
}

export function ResultsCount({ total, filtered, className }: ResultsCountProps) {
  const showFiltered = filtered !== undefined && filtered !== total

  return (
    <p className={cn('text-sm text-muted-foreground', className)}>
      {showFiltered ? (
        <>
          Mostrando <span className="font-medium text-foreground">{filtered.toLocaleString('es-AR')}</span> de{' '}
          <span className="font-medium text-foreground">{total.toLocaleString('es-AR')}</span> propiedades
        </>
      ) : (
        <>
          <span className="font-medium text-foreground">{total.toLocaleString('es-AR')}</span> propiedades encontradas
        </>
      )}
    </p>
  )
}
