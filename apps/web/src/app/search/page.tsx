'use client'

import { useState, useMemo } from 'react'
import { useFilterStore, useComparisonStore, usePreferencesStore, useMapStore } from '@propery/core'
import {
  PropertyList,
  SortSelect,
  ResultsCount,
  Button,
  AISearchBar,
  FilterChips,
  type FilterChip,
} from '@propery/ui/web'
import type { Property, PropertyType } from '@propery/api-client'
import { getProperties, getNeighborhoods, mocks } from '@propery/api-client'
const { mockPOIs, mockNeighborhoodStats } = mocks
import { semanticSearch, type AIConfig } from '@propery/ai'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { Map, List, SlidersHorizontal } from 'lucide-react'
import { PropertyMap, MapToolbar, type MapLayerType, type DrawPolygon } from './map'
import { FilterPanel } from './filter-panel'
import { ComparisonBar } from './comparison-bar'

type ViewMode = 'list' | 'map' | 'split'

const aiConfig: AIConfig = { provider: 'mock' }

export default function SearchPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('split')
  const [showFilters, setShowFilters] = useState(false)
  const [isAISearching, setIsAISearching] = useState(false)

  // Filter store
  const {
    filters,
    searchQuery,
    setFilters,
    setSearchQuery,
    resetFilters,
    recentSearches,
    savedSearches,
    addRecentSearch,
    removeRecentSearch,
    saveSearch,
    getActiveFiltersCount,
  } = useFilterStore()

  // Comparison store
  const { properties: comparingProperties, addProperty, removeProperty, isInComparison } =
    useComparisonStore()

  // Preferences store
  const { isFavorite, addFavorite, removeFavorite } = usePreferencesStore()

  // Map store
  const {
    activeLayers,
    showHeatmap,
    showNeighborhoodPolygons,
    toggleLayer,
    toggleHeatmap,
    toggleNeighborhoodPolygons,
    setDrawnPolygon,
    selectedPropertyId,
    setSelectedPropertyId,
  } = useMapStore()

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

  // Fetch neighborhoods
  const { data: neighborhoods = [] } = useQuery({
    queryKey: ['neighborhoods'],
    queryFn: getNeighborhoods,
  })

  // Flatten pages into a single array
  const properties = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  )

  const total = data?.pages[0]?.total ?? 0

  // Build filter chips from active filters
  const filterChips = useMemo<FilterChip[]>(() => {
    const chips: FilterChip[] = []

    if (filters.operationType) {
      chips.push({
        id: 'operation',
        label: 'Operacion',
        value: filters.operationType === 'sale' ? 'Venta' : 'Alquiler',
        category: 'Operacion',
      })
    }

    filters.propertyTypes.forEach((type) => {
      chips.push({
        id: `type-${type}`,
        label: type,
        value:
          type === 'apartment'
            ? 'Depto'
            : type === 'house'
              ? 'Casa'
              : type === 'ph'
                ? 'PH'
                : type,
        category: 'Tipo',
      })
    })

    if (filters.priceMin || filters.priceMax) {
      const min = filters.priceMin
        ? `$${(filters.priceMin / 1000).toFixed(0)}k`
        : '$0'
      const max = filters.priceMax
        ? `$${(filters.priceMax / 1000).toFixed(0)}k`
        : 'Max'
      chips.push({
        id: 'price',
        label: 'Precio',
        value: `${min} - ${max}`,
        category: 'Precio',
      })
    }

    if (filters.bedrooms) {
      chips.push({
        id: 'bedrooms',
        label: 'Habitaciones',
        value: `${filters.bedrooms}+`,
        category: 'Hab',
      })
    }

    if (filters.bathrooms) {
      chips.push({
        id: 'bathrooms',
        label: 'Banos',
        value: `${filters.bathrooms}+`,
        category: 'Banos',
      })
    }

    filters.neighborhoods.forEach((n) => {
      chips.push({
        id: `neighborhood-${n}`,
        label: n,
        value: n,
        category: 'Barrio',
      })
    })

    if (filters.onlyOpportunities) {
      chips.push({
        id: 'opportunities',
        label: 'Solo oportunidades',
        value: 'Si',
        category: 'Filtro',
      })
    }

    return chips
  }, [filters])

  // Handlers
  const handleSortChange = (sortBy: typeof filters.sortBy, sortOrder: typeof filters.sortOrder) => {
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
    setSelectedPropertyId(property.id)
    window.location.href = `/property/${property.id}`
  }

  const handlePropertyHover = (_property: Property | null) => {
    // Reserved for highlighting in list (future feature)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query) {
      addRecentSearch(query)
    }
  }

  const handleAISearch = async (query: string) => {
    setIsAISearching(true)
    try {
      const parsedFilters = await semanticSearch(aiConfig, query)
      // Apply parsed filters
      if (parsedFilters.operationType) {
        setFilters({ operationType: parsedFilters.operationType as 'sale' | 'rent' })
      }
      if (parsedFilters.propertyTypes) {
        setFilters({ propertyTypes: parsedFilters.propertyTypes as PropertyType[] })
      }
      if (parsedFilters.priceMin) {
        setFilters({ priceMin: parsedFilters.priceMin as number })
      }
      if (parsedFilters.priceMax) {
        setFilters({ priceMax: parsedFilters.priceMax as number })
      }
      if (parsedFilters.bedrooms) {
        setFilters({ bedrooms: parsedFilters.bedrooms as number })
      }
      if (parsedFilters.neighborhoods) {
        setFilters({ neighborhoods: parsedFilters.neighborhoods as string[] })
      }
      setSearchQuery(query)
      addRecentSearch(query)
    } catch (error) {
      // AI search failed - handled silently, user can retry
    } finally {
      setIsAISearching(false)
    }
  }

  const handleRemoveChip = (chip: FilterChip) => {
    if (chip.id === 'operation') {
      setFilters({ operationType: undefined })
    } else if (chip.id.startsWith('type-')) {
      const type = chip.id.replace('type-', '')
      setFilters({
        propertyTypes: filters.propertyTypes.filter((t) => t !== type),
      })
    } else if (chip.id === 'price') {
      setFilters({ priceMin: undefined, priceMax: undefined })
    } else if (chip.id === 'bedrooms') {
      setFilters({ bedrooms: undefined })
    } else if (chip.id === 'bathrooms') {
      setFilters({ bathrooms: undefined })
    } else if (chip.id.startsWith('neighborhood-')) {
      const neighborhood = chip.id.replace('neighborhood-', '')
      setFilters({
        neighborhoods: filters.neighborhoods.filter((n) => n !== neighborhood),
      })
    } else if (chip.id === 'opportunities') {
      setFilters({ onlyOpportunities: false })
    }
  }

  const handleSaveSearch = (query: string) => {
    const name = query || `Busqueda ${savedSearches.length + 1}`
    saveSearch(name)
  }

  const handleDrawComplete = (polygon: DrawPolygon) => {
    setDrawnPolygon(polygon)
    // In a real implementation, we would filter properties by the drawn polygon
    // For now, we'll just store it in the map store
  }

  const handleToggleLayer = (layer: MapLayerType) => {
    toggleLayer(layer)
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

          {/* AI Search Bar */}
          <AISearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            onAISearch={handleAISearch}
            recentSearches={recentSearches.map((s) => ({
              id: s.id,
              query: s.query,
              type: 'recent' as const,
            }))}
            savedSearches={savedSearches.map((s) => ({
              id: s.id,
              query: s.name,
              type: 'saved' as const,
            }))}
            onSaveSearch={handleSaveSearch}
            onRemoveRecent={removeRecentSearch}
            isLoading={isAISearching}
            placeholder="Buscar propiedades o describir lo que buscas..."
            className="flex-1 max-w-2xl"
          />

          {/* View Toggle */}
          <div className="flex rounded-lg border p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`rounded p-2 ${viewMode === 'list' ? 'bg-accent' : ''}`}
              title="Vista lista"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`rounded p-2 ${viewMode === 'split' ? 'bg-accent' : ''}`}
              title="Vista dividida"
            >
              <div className="flex h-4 w-4 gap-0.5">
                <div className="w-1/2 rounded-sm bg-current" />
                <div className="w-1/2 rounded-sm bg-current" />
              </div>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`rounded p-2 ${viewMode === 'map' ? 'bg-accent' : ''}`}
              title="Vista mapa"
            >
              <Map className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="border-b bg-background px-4 py-2">
        <div className="mx-auto flex max-w-7xl flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant={showFilters ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filtros
                {getActiveFiltersCount() > 0 && (
                  <span className="ml-2 rounded-full bg-primary-foreground/20 px-1.5 text-xs">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </Button>
              <ResultsCount total={total} />

              {/* Map Toolbar - only show when map is visible */}
              {(viewMode === 'map' || viewMode === 'split') && (
                <MapToolbar
                  activeLayers={activeLayers}
                  showHeatmap={showHeatmap}
                  showNeighborhoodPolygons={showNeighborhoodPolygons}
                  onToggleLayer={handleToggleLayer}
                  onToggleHeatmap={toggleHeatmap}
                  onToggleNeighborhoodPolygons={toggleNeighborhoodPolygons}
                  className="ml-4"
                />
              )}
            </div>

            <SortSelect
              value={filters.sortBy}
              order={filters.sortOrder}
              onChange={handleSortChange}
              className="w-40"
            />
          </div>

          {/* Filter Chips */}
          {filterChips.length > 0 && (
            <FilterChips
              chips={filterChips}
              onRemove={handleRemoveChip}
              onClearAll={resetFilters}
            />
          )}
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
            <PropertyMap
              properties={properties}
              neighborhoods={neighborhoods}
              neighborhoodStats={mockNeighborhoodStats}
              pois={mockPOIs}
              comparingIds={comparingIds}
              favoriteIds={favoriteIds}
              selectedId={selectedPropertyId ?? undefined}
              activeLayers={activeLayers}
              showHeatmap={showHeatmap}
              showNeighborhoodPolygons={showNeighborhoodPolygons}
              onPropertyClick={handlePropertyClick}
              onPropertyHover={handlePropertyHover}
              onDrawComplete={handleDrawComplete}
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
