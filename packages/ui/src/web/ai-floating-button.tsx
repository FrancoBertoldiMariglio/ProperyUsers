'use client'

import * as React from 'react'
import { Bot, X } from 'lucide-react'
import { cn } from '../shared/utils'

interface AIFloatingButtonProps {
  isOpen: boolean
  suggestionCount?: number
  onClick: () => void
  className?: string
}

export function AIFloatingButton({
  isOpen,
  suggestionCount = 0,
  onClick,
  className,
}: AIFloatingButtonProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        isOpen
          ? 'bg-muted text-muted-foreground hover:bg-muted/80'
          : 'bg-primary text-primary-foreground hover:bg-primary/90',
        className
      )}
      aria-label={isOpen ? 'Cerrar asistente AI' : 'Abrir asistente AI'}
    >
      {isOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <>
          <Bot className="h-6 w-6" />
          {suggestionCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
              {suggestionCount}
            </span>
          )}
        </>
      )}
    </button>
  )
}
