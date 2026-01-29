'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '../shared/utils'

export interface FilterChip {
  id: string
  label: string
  value: string
  category: string
}

interface FilterChipsProps {
  chips: FilterChip[]
  onRemove: (chip: FilterChip) => void
  onClearAll?: () => void
  className?: string
}

export function FilterChips({
  chips,
  onRemove,
  onClearAll,
  className,
}: FilterChipsProps) {
  if (chips.length === 0) return null

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {chips.map((chip) => (
        <div
          key={chip.id}
          className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
        >
          <span className="text-xs text-muted-foreground">{chip.category}:</span>
          <span className="font-medium">{chip.value}</span>
          <button
            onClick={() => onRemove(chip)}
            className="ml-1 rounded-full p-0.5 hover:bg-primary/20"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}

      {chips.length > 1 && onClearAll && (
        <button
          onClick={onClearAll}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Limpiar todos
        </button>
      )}
    </div>
  )
}
