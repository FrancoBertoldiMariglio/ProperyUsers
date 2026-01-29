import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface UserPreferences {
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
  }
  completedOnboarding: boolean
}

interface PreferencesState {
  preferences: UserPreferences
  favorites: Array<{
    propertyId: string
    addedAt: string
    notes: string
  }>
  recentSearches: Array<{
    query: string
    timestamp: string
  }>
  viewHistory: Array<{
    propertyId: string
    timestamp: string
    duration: number
  }>
  setPreferences: (prefs: Partial<UserPreferences>) => void
  addFavorite: (propertyId: string) => void
  removeFavorite: (propertyId: string) => void
  updateFavoriteNotes: (propertyId: string, notes: string) => void
  isFavorite: (propertyId: string) => boolean
  addRecentSearch: (query: string) => void
  trackView: (propertyId: string, duration: number) => void
  completeOnboarding: () => void
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
  },
  completedOnboarding: false,
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      preferences: defaultPreferences,
      favorites: [],
      recentSearches: [],
      viewHistory: [],
      setPreferences: (prefs) =>
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        })),
      addFavorite: (propertyId) =>
        set((state) => ({
          favorites: [
            ...state.favorites,
            { propertyId, addedAt: new Date().toISOString(), notes: '' },
          ],
        })),
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
      isFavorite: (propertyId) => get().favorites.some((f) => f.propertyId === propertyId),
      addRecentSearch: (query) =>
        set((state) => ({
          recentSearches: [
            { query, timestamp: new Date().toISOString() },
            ...state.recentSearches.slice(0, 9),
          ],
        })),
      trackView: (propertyId, duration) =>
        set((state) => ({
          viewHistory: [
            { propertyId, timestamp: new Date().toISOString(), duration },
            ...state.viewHistory.slice(0, 99),
          ],
        })),
      completeOnboarding: () =>
        set((state) => ({
          preferences: { ...state.preferences, completedOnboarding: true },
        })),
    }),
    {
      name: 'propery-preferences',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
