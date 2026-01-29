'use client'

import * as React from 'react'
import { Search, Sparkles, X, Clock, Star } from 'lucide-react'
import { cn } from '../shared/utils'
import { Button } from './button'

interface SearchSuggestion {
  id: string
  query: string
  type: 'recent' | 'saved' | 'suggestion'
}

interface AISearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch: (query: string) => void
  onAISearch?: (query: string) => void
  recentSearches?: SearchSuggestion[]
  savedSearches?: SearchSuggestion[]
  suggestions?: SearchSuggestion[]
  onSaveSearch?: (query: string) => void
  onRemoveRecent?: (id: string) => void
  isLoading?: boolean
  placeholder?: string
  className?: string
}

export function AISearchBar({
  value,
  onChange,
  onSearch,
  onAISearch,
  recentSearches = [],
  savedSearches = [],
  suggestions = [],
  onSaveSearch,
  onRemoveRecent,
  isLoading = false,
  placeholder = 'Buscar propiedades...',
  className,
}: AISearchBarProps) {
  const [isFocused, setIsFocused] = React.useState(false)
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Close suggestions when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      onSearch(value.trim())
      setShowSuggestions(false)
    }
  }

  const handleAISearch = () => {
    if (value.trim() && onAISearch) {
      onAISearch(value.trim())
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onChange(suggestion.query)
    onSearch(suggestion.query)
    setShowSuggestions(false)
  }

  const allSuggestions = [
    ...savedSearches.map((s) => ({ ...s, type: 'saved' as const })),
    ...recentSearches.map((s) => ({ ...s, type: 'recent' as const })),
    ...suggestions.map((s) => ({ ...s, type: 'suggestion' as const })),
  ]

  const filteredSuggestions = value
    ? allSuggestions.filter((s) =>
        s.query.toLowerCase().includes(value.toLowerCase())
      )
    : allSuggestions

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={cn(
            'flex items-center rounded-lg border bg-background transition-shadow',
            isFocused && 'ring-2 ring-primary ring-offset-2'
          )}
        >
          <Search className="ml-3 h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => {
              setIsFocused(true)
              setShowSuggestions(true)
            }}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="mr-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {onAISearch && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleAISearch}
              disabled={!value.trim() || isLoading}
              className="mr-1 gap-1"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">AI</span>
            </Button>
          )}
          <Button type="submit" size="sm" className="mr-1" disabled={isLoading}>
            {isLoading ? 'Buscando...' : 'Buscar'}
          </Button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-80 overflow-auto rounded-lg border bg-popover p-2 shadow-lg">
          {savedSearches.length > 0 && (
            <div className="mb-2">
              <p className="mb-1 px-2 text-xs font-medium text-muted-foreground">
                Busquedas guardadas
              </p>
              {filteredSuggestions
                .filter((s) => s.type === 'saved')
                .map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                  >
                    <Star className="h-3.5 w-3.5 text-yellow-500" />
                    <span>{suggestion.query}</span>
                  </button>
                ))}
            </div>
          )}

          {recentSearches.length > 0 && (
            <div className="mb-2">
              <p className="mb-1 px-2 text-xs font-medium text-muted-foreground">
                Busquedas recientes
              </p>
              {filteredSuggestions
                .filter((s) => s.type === 'recent')
                .slice(0, 5)
                .map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-accent"
                  >
                    <button
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="flex flex-1 items-center gap-2 text-sm"
                    >
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{suggestion.query}</span>
                    </button>
                    {onRemoveRecent && (
                      <button
                        onClick={() => onRemoveRecent(suggestion.id)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
            </div>
          )}

          {suggestions.length > 0 && (
            <div>
              <p className="mb-1 px-2 text-xs font-medium text-muted-foreground">
                Sugerencias
              </p>
              {filteredSuggestions
                .filter((s) => s.type === 'suggestion')
                .map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                  >
                    <Search className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{suggestion.query}</span>
                  </button>
                ))}
            </div>
          )}

          {value && onSaveSearch && (
            <div className="mt-2 border-t pt-2">
              <button
                onClick={() => onSaveSearch(value)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-primary hover:bg-accent"
              >
                <Star className="h-3.5 w-3.5" />
                <span>Guardar "{value}" como busqueda</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
