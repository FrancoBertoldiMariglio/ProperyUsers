import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { PropertyFilters } from '@propery/api-client'

interface RecentSearch {
  id: string
  query: string
  timestamp: string
}

interface SavedSearch {
  id: string
  name: string
  filters: PropertyFilters
  query?: string
}

interface FilterState {
  filters: PropertyFilters
  searchQuery: string
  setFilters: (filters: Partial<PropertyFilters>) => void
  setSearchQuery: (query: string) => void
  resetFilters: () => void
  // Saved searches
  savedSearches: SavedSearch[]
  saveSearch: (name: string) => void
  deleteSavedSearch: (id: string) => void
  loadSavedSearch: (id: string) => void
  // Recent searches
  recentSearches: RecentSearch[]
  addRecentSearch: (query: string) => void
  removeRecentSearch: (id: string) => void
  clearRecentSearches: () => void
  // Active filters count
  getActiveFiltersCount: () => number
}

const defaultFilters: PropertyFilters = {
  operationType: undefined,
  propertyTypes: [],
  priceMin: undefined,
  priceMax: undefined,
  currency: 'USD',
  areaMin: undefined,
  areaMax: undefined,
  bedrooms: undefined,
  bathrooms: undefined,
  parking: undefined,
  age: undefined,
  neighborhoods: [],
  amenities: [],
  onlyOpportunities: false,
  sortBy: 'relevance',
  sortOrder: 'desc',
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set, get) => ({
      filters: defaultFilters,
      searchQuery: '',
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),
      setSearchQuery: (query) => set({ searchQuery: query }),
      resetFilters: () => set({ filters: defaultFilters, searchQuery: '' }),

      // Saved searches
      savedSearches: [],
      saveSearch: (name) => {
        const id = Date.now().toString()
        const { filters, searchQuery } = get()
        set((state) => ({
          savedSearches: [
            ...state.savedSearches,
            { id, name, filters: { ...filters }, query: searchQuery },
          ],
        }))
      },
      deleteSavedSearch: (id) =>
        set((state) => ({
          savedSearches: state.savedSearches.filter((s) => s.id !== id),
        })),
      loadSavedSearch: (id) => {
        const saved = get().savedSearches.find((s) => s.id === id)
        if (saved) {
          set({
            filters: { ...saved.filters },
            searchQuery: saved.query || '',
          })
        }
      },

      // Recent searches
      recentSearches: [],
      addRecentSearch: (query) => {
        if (!query.trim()) return
        const id = Date.now().toString()
        set((state) => ({
          recentSearches: [
            { id, query: query.trim(), timestamp: new Date().toISOString() },
            ...state.recentSearches.filter((s) => s.query !== query.trim()).slice(0, 9),
          ],
        }))
      },
      removeRecentSearch: (id) =>
        set((state) => ({
          recentSearches: state.recentSearches.filter((s) => s.id !== id),
        })),
      clearRecentSearches: () => set({ recentSearches: [] }),

      // Active filters count
      getActiveFiltersCount: () => {
        const { filters } = get()
        let count = 0
        if (filters.operationType) count++
        if (filters.propertyTypes.length > 0) count++
        if (filters.priceMin !== undefined || filters.priceMax !== undefined) count++
        if (filters.areaMin !== undefined || filters.areaMax !== undefined) count++
        if (filters.bedrooms !== undefined) count++
        if (filters.bathrooms !== undefined) count++
        if (filters.parking !== undefined) count++
        if (filters.age !== undefined) count++
        if (filters.neighborhoods.length > 0) count++
        if (filters.amenities.length > 0) count++
        if (filters.onlyOpportunities) count++
        return count
      },
    }),
    {
      name: 'propery-filters',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        savedSearches: state.savedSearches,
        recentSearches: state.recentSearches,
      }),
    }
  )
)
