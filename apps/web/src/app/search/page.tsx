'use client'

import { useState, useMemo } from 'react'
import { useFilterStore, useComparisonStore, usePreferencesStore } from '@propery/core'
import { PropertyList, SortSelect, ResultsCount, Button, Input } from '@propery/ui/web'
import type { Property, SortOption, SortOrder } from '@propery/api-client'
import { getProperties } from '@propery/api-client'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Search, Map, List, SlidersHorizontal, X } from 'lucide-react'
import { MiniMap } from './mini-map'
import { FilterPanel } from './filter-panel'
import { ComparisonBar } from './comparison-bar'

type ViewMode = 'list' | 'map' | 'split'

export default function SearchPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('split')
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { filters, setFilters, resetFilters } = useFilterStore()
  const { properties: comparingProperties, addProperty, removeProperty, isInComparison } =
    useComparisonStore()
  const { isFavorite, addFavorite, removeFavorite } = usePreferencesStore()

  // Fetch properties with infinite query
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['properties', filters, searchQuery],
    queryFn: ({ pageParam = 1 }) =>
      getProperties({
        ...filters,
        query: searchQuery || undefined,
        page: pageParam,
        limit: 20,
      }),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    initialPageParam: 1,
  })

  // Flatten pages into a single array
  const properties = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  )

  const total = data?.pages[0]?.total ?? 0

  // Handlers
  const handleSortChange = (sortBy: SortOption, sortOrder: SortOrder) => {
    setFilters({ sortBy, sortOrder })
  }

  const handleCompare = (property: Property) => {
    if (isInComparison(property.id)) {
      removeProperty(property.id)
    } else {
      addProperty(property)
    }
  }

  const handleFavorite = (property: Property) => {
    if (isFavorite(property.id)) {
      removeFavorite(property.id)
    } else {
      addFavorite(property.id)
    }
  }

  const handleShare = async (property: Property) => {
    try {
      await navigator.share({
        title: property.title,
        text: `${property.title} - USD ${property.price.toLocaleString()}`,
        url: `/property/${property.id}`,
      })
    } catch {
      // Share API not supported or cancelled
    }
  }

  const handlePropertyClick = (property: Property) => {
    window.location.href = `/property/${property.id}`
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Query is already reactive via useInfiniteQuery
  }

  const comparingIds = comparingProperties.map((p) => p.id)
  const favoriteIds = usePreferencesStore.getState().favorites.map((f) => f.propertyId)

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-background px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          {/* Logo */}
          <a href="/" className="text-xl font-bold">
            Propery
          </a>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por barrio, direccion o caracteristicas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>

          {/* View Toggle */}
          <div className="flex rounded-lg border p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`rounded p-2 ${viewMode === 'list' ? 'bg-accent' : ''}`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`rounded p-2 ${viewMode === 'split' ? 'bg-accent' : ''}`}
            >
              <div className="flex h-4 w-4 gap-0.5">
                <div className="w-1/2 rounded-sm bg-current" />
                <div className="w-1/2 rounded-sm bg-current" />
              </div>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`rounded p-2 ${viewMode === 'map' ? 'bg-accent' : ''}`}
            >
              <Map className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="border-b bg-background px-4 py-2">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filtros
            </Button>
            <ResultsCount total={total} />
          </div>

          <SortSelect
            value={filters.sortBy}
            order={filters.sortOrder}
            onChange={handleSortChange}
            className="w-40"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Filter Panel */}
        {showFilters && (
          <FilterPanel
            onClose={() => setShowFilters(false)}
            className="w-72 shrink-0 border-r"
          />
        )}

        {/* List View */}
        {(viewMode === 'list' || viewMode === 'split') && (
          <div
            className={`flex-1 overflow-hidden ${viewMode === 'split' ? 'max-w-[50%]' : ''}`}
          >
            <PropertyList
              properties={properties}
              isLoading={isLoading || isFetchingNextPage}
              isError={isError}
              hasMore={hasNextPage}
              comparingIds={comparingIds}
              favoriteIds={favoriteIds}
              onLoadMore={() => fetchNextPage()}
              onCompare={handleCompare}
              onFavorite={handleFavorite}
              onShare={handleShare}
              onPropertyClick={handlePropertyClick}
              onReset={resetFilters}
              onRetry={() => refetch()}
              className="h-full p-4"
            />
          </div>
        )}

        {/* Map View */}
        {(viewMode === 'map' || viewMode === 'split') && (
          <div className={`flex-1 ${viewMode === 'split' ? 'border-l' : ''}`}>
            <MiniMap
              properties={properties}
              comparingIds={comparingIds}
              favoriteIds={favoriteIds}
              onPropertyClick={handlePropertyClick}
            />
          </div>
        )}
      </div>

      {/* Comparison Bar */}
      {comparingProperties.length > 0 && (
        <ComparisonBar
          properties={comparingProperties}
          onRemove={(id) => removeProperty(id)}
        />
      )}
    </div>
  )
}
