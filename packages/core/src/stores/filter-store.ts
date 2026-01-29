import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { PropertyFilters } from '@propery/api-client'

interface FilterState {
  filters: PropertyFilters
  setFilters: (filters: Partial<PropertyFilters>) => void
  resetFilters: () => void
  savedSearches: Array<{ id: string; name: string; filters: PropertyFilters }>
  saveSearch: (name: string) => void
  deleteSavedSearch: (id: string) => void
  loadSavedSearch: (id: string) => void
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
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),
      resetFilters: () => set({ filters: defaultFilters }),
      savedSearches: [],
      saveSearch: (name) => {
        const id = Date.now().toString()
        set((state) => ({
          savedSearches: [
            ...state.savedSearches,
            { id, name, filters: { ...state.filters } },
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
          set({ filters: { ...saved.filters } })
        }
      },
    }),
    {
      name: 'propery-filters',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        savedSearches: state.savedSearches,
      }),
    }
  )
)
