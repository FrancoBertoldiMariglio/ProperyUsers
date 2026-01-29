'use client'

import * as React from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '../shared/utils'
import { Button } from './button'

export type SortOption = 'price' | 'date' | 'relevance' | 'opportunity'
export type SortOrder = 'asc' | 'desc'

interface SortSelectProps {
  value: SortOption
  order: SortOrder
  onChange: (sort: SortOption, order: SortOrder) => void
  className?: string
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'price', label: 'Precio' },
  { value: 'date', label: 'Fecha' },
  { value: 'opportunity', label: 'Oportunidad' },
]

export function SortSelect({ value, order, onChange, className }: SortSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentLabel = sortOptions.find((o) => o.value === value)?.label || 'Ordenar'

  const handleSelect = (newValue: SortOption) => {
    if (newValue === value) {
      // Toggle order if same sort is selected
      onChange(value, order === 'asc' ? 'desc' : 'asc')
    } else {
      // Default to desc for new sort
      onChange(newValue, 'desc')
    }
    setIsOpen(false)
  }

  const toggleOrder = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(value, order === 'asc' ? 'desc' : 'asc')
  }

  return (
    <div ref={ref} className={cn('relative', className)}>
      <Button
        variant="outline"
        className="w-full justify-between gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4" />
          {currentLabel}
        </span>
        <button
          onClick={toggleOrder}
          className="rounded p-1 hover:bg-accent"
        >
          {order === 'asc' ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )}
        </button>
      </Button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-md border bg-popover p-1 shadow-md">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={cn(
                'flex w-full items-center justify-between rounded-sm px-3 py-2 text-sm',
                value === option.value
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              )}
            >
              {option.label}
              {value === option.value && (
                order === 'asc' ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
