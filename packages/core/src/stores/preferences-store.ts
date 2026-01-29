import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface UserPreferences {
  searchType: 'buy' | 'rent' | null
  budget: {
    min: number | null
    max: number | null
    currency: 'USD' | 'ARS'
  }
  preferredNeighborhoods: string[]
  minBedrooms: number | null
  minBathrooms: number | null
  requiredAmenities: string[]
  notificationSettings: {
    newProperties: boolean
    priceDrops: boolean
    opportunities: boolean
    frequency: 'immediate' | 'daily' | 'weekly'
    channels: {
      push: boolean
      email: boolean
    }
  }
  completedOnboarding: boolean
}

export interface SavedSearch {
  id: string
  name: string
  filters: {
    operationType?: 'sale' | 'rent'
    propertyTypes?: string[]
    priceMin?: number
    priceMax?: number
    neighborhoods?: string[]
    bedrooms?: number
    bathrooms?: number
    amenities?: string[]
  }
  alertEnabled: boolean
  createdAt: string
  lastNotifiedAt: string | null
}

export interface Favorite {
  propertyId: string
  addedAt: string
  notes: string
}

export interface ViewHistoryEntry {
  propertyId: string
  timestamp: string
  duration: number
}

interface PreferencesState {
  preferences: UserPreferences
  favorites: Favorite[]
  savedSearches: SavedSearch[]
  recentSearches: Array<{
    query: string
    timestamp: string
  }>
  viewHistory: ViewHistoryEntry[]

  // Preferences actions
  setPreferences: (prefs: Partial<UserPreferences>) => void
  resetPreferences: () => void
  completeOnboarding: () => void

  // Favorites actions
  addFavorite: (propertyId: string) => void
  removeFavorite: (propertyId: string) => void
  updateFavoriteNotes: (propertyId: string, notes: string) => void
  isFavorite: (propertyId: string) => boolean
  getFavoriteCount: () => number

  // Saved searches actions
  addSavedSearch: (search: Omit<SavedSearch, 'id' | 'createdAt' | 'lastNotifiedAt'>) => void
  removeSavedSearch: (id: string) => void
  updateSavedSearch: (id: string, updates: Partial<SavedSearch>) => void
  toggleSearchAlert: (id: string) => void

  // Search history actions
  addRecentSearch: (query: string) => void
  clearRecentSearches: () => void

  // View tracking actions
  trackView: (propertyId: string, duration: number) => void
  getMostViewedPropertyIds: (limit?: number) => string[]
}

const defaultPreferences: UserPreferences = {
  searchType: null,
  budget: {
    min: null,
    max: null,
    currency: 'USD',
  },
  preferredNeighborhoods: [],
  minBedrooms: null,
  minBathrooms: null,
  requiredAmenities: [],
  notificationSettings: {
    newProperties: true,
    priceDrops: true,
    opportunities: true,
    frequency: 'daily',
    channels: {
      push: true,
      email: false,
    },
  },
  completedOnboarding: false,
}

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      preferences: defaultPreferences,
      favorites: [],
      savedSearches: [],
      recentSearches: [],
      viewHistory: [],

      // Preferences actions
      setPreferences: (prefs) =>
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        })),

      resetPreferences: () =>
        set({ preferences: defaultPreferences }),

      completeOnboarding: () =>
        set((state) => ({
          preferences: { ...state.preferences, completedOnboarding: true },
        })),

      // Favorites actions
      addFavorite: (propertyId) =>
        set((state) => {
          if (state.favorites.some((f) => f.propertyId === propertyId)) {
            return state // Already favorited
          }
          return {
            favorites: [
              { propertyId, addedAt: new Date().toISOString(), notes: '' },
              ...state.favorites,
            ],
          }
        }),

      removeFavorite: (propertyId) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.propertyId !== propertyId),
        })),

      updateFavoriteNotes: (propertyId, notes) =>
        set((state) => ({
          favorites: state.favorites.map((f) =>
            f.propertyId === propertyId ? { ...f, notes } : f
          ),
        })),

      isFavorite: (propertyId) =>
        get().favorites.some((f) => f.propertyId === propertyId),

      getFavoriteCount: () => get().favorites.length,

      // Saved searches actions
      addSavedSearch: (search) =>
        set((state) => ({
          savedSearches: [
            {
              ...search,
              id: generateId(),
              createdAt: new Date().toISOString(),
              lastNotifiedAt: null,
            },
            ...state.savedSearches,
          ].slice(0, 20), // Max 20 saved searches
        })),

      removeSavedSearch: (id) =>
        set((state) => ({
          savedSearches: state.savedSearches.filter((s) => s.id !== id),
        })),

      updateSavedSearch: (id, updates) =>
        set((state) => ({
          savedSearches: state.savedSearches.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),

      toggleSearchAlert: (id) =>
        set((state) => ({
          savedSearches: state.savedSearches.map((s) =>
            s.id === id ? { ...s, alertEnabled: !s.alertEnabled } : s
          ),
        })),

      // Search history actions
      addRecentSearch: (query) =>
        set((state) => ({
          recentSearches: [
            { query, timestamp: new Date().toISOString() },
            ...state.recentSearches.filter((s) => s.query !== query).slice(0, 9),
          ],
        })),

      clearRecentSearches: () =>
        set({ recentSearches: [] }),

      // View tracking actions
      trackView: (propertyId, duration) =>
        set((state) => ({
          viewHistory: [
            { propertyId, timestamp: new Date().toISOString(), duration },
            ...state.viewHistory.slice(0, 99),
          ],
        })),

      getMostViewedPropertyIds: (limit = 10) => {
        const counts = new Map<string, number>()
        for (const entry of get().viewHistory) {
          counts.set(entry.propertyId, (counts.get(entry.propertyId) || 0) + 1)
        }
        return Array.from(counts.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, limit)
          .map(([id]) => id)
      },
    }),
    {
      name: 'propery-preferences',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
