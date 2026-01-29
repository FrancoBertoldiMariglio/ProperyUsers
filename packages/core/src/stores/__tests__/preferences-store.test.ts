import { describe, it, expect, beforeEach } from 'vitest'
import { usePreferencesStore } from '../preferences-store'

describe('Preferences Store', () => {
  beforeEach(() => {
    // Reset to initial state
    usePreferencesStore.setState({
      preferences: {
        searchType: null,
        budget: { min: null, max: null, currency: 'USD' },
        preferredNeighborhoods: [],
        minBedrooms: null,
        minBathrooms: null,
        requiredAmenities: [],
        notificationSettings: {
          newProperties: true,
          priceDrops: true,
          opportunities: true,
          frequency: 'daily',
          channels: { push: true, email: false },
        },
        completedOnboarding: false,
      },
      favorites: [],
      savedSearches: [],
      recentSearches: [],
      viewHistory: [],
    })
  })

  describe('preferences', () => {
    it('should have default preferences', () => {
      const { preferences } = usePreferencesStore.getState()
      expect(preferences.searchType).toBeNull()
      expect(preferences.budget.currency).toBe('USD')
      expect(preferences.completedOnboarding).toBe(false)
    })

    it('should update preferences partially', () => {
      usePreferencesStore.getState().setPreferences({
        searchType: 'buy',
        minBedrooms: 2,
      })

      const { preferences } = usePreferencesStore.getState()
      expect(preferences.searchType).toBe('buy')
      expect(preferences.minBedrooms).toBe(2)
      expect(preferences.budget.currency).toBe('USD') // unchanged
    })

    it('should complete onboarding', () => {
      expect(usePreferencesStore.getState().preferences.completedOnboarding).toBe(false)
      usePreferencesStore.getState().completeOnboarding()
      expect(usePreferencesStore.getState().preferences.completedOnboarding).toBe(true)
    })

    it('should reset preferences', () => {
      usePreferencesStore.getState().setPreferences({
        searchType: 'rent',
        minBedrooms: 3,
      })
      usePreferencesStore.getState().resetPreferences()

      const { preferences } = usePreferencesStore.getState()
      expect(preferences.searchType).toBeNull()
      expect(preferences.minBedrooms).toBeNull()
    })
  })

  describe('favorites', () => {
    it('should add favorite', () => {
      usePreferencesStore.getState().addFavorite('prop-1')

      const { favorites } = usePreferencesStore.getState()
      expect(favorites).toHaveLength(1)
      expect(favorites[0].propertyId).toBe('prop-1')
      expect(favorites[0].notes).toBe('')
    })

    it('should not duplicate favorites', () => {
      usePreferencesStore.getState().addFavorite('prop-1')
      usePreferencesStore.getState().addFavorite('prop-1')

      expect(usePreferencesStore.getState().favorites).toHaveLength(1)
    })

    it('should remove favorite', () => {
      usePreferencesStore.getState().addFavorite('prop-1')
      usePreferencesStore.getState().addFavorite('prop-2')
      usePreferencesStore.getState().removeFavorite('prop-1')

      const { favorites } = usePreferencesStore.getState()
      expect(favorites).toHaveLength(1)
      expect(favorites[0].propertyId).toBe('prop-2')
    })

    it('should check if property is favorite', () => {
      usePreferencesStore.getState().addFavorite('prop-1')

      expect(usePreferencesStore.getState().isFavorite('prop-1')).toBe(true)
      expect(usePreferencesStore.getState().isFavorite('prop-2')).toBe(false)
    })

    it('should update favorite notes', () => {
      usePreferencesStore.getState().addFavorite('prop-1')
      usePreferencesStore.getState().updateFavoriteNotes('prop-1', 'Great location!')

      const { favorites } = usePreferencesStore.getState()
      expect(favorites[0].notes).toBe('Great location!')
    })

    it('should get favorite count', () => {
      expect(usePreferencesStore.getState().getFavoriteCount()).toBe(0)
      usePreferencesStore.getState().addFavorite('prop-1')
      usePreferencesStore.getState().addFavorite('prop-2')
      expect(usePreferencesStore.getState().getFavoriteCount()).toBe(2)
    })
  })

  describe('saved searches', () => {
    it('should add saved search', () => {
      usePreferencesStore.getState().addSavedSearch({
        name: 'Palermo 3 amb',
        filters: {
          neighborhoods: ['Palermo'],
          bedrooms: 3,
        },
        alertEnabled: true,
      })

      const { savedSearches } = usePreferencesStore.getState()
      expect(savedSearches).toHaveLength(1)
      expect(savedSearches[0].name).toBe('Palermo 3 amb')
      expect(savedSearches[0].alertEnabled).toBe(true)
      expect(savedSearches[0].id).toBeTruthy()
    })

    it('should remove saved search', () => {
      usePreferencesStore.getState().addSavedSearch({
        name: 'Search 1',
        filters: {},
        alertEnabled: false,
      })
      const searchId = usePreferencesStore.getState().savedSearches[0].id

      usePreferencesStore.getState().removeSavedSearch(searchId)
      expect(usePreferencesStore.getState().savedSearches).toHaveLength(0)
    })

    it('should toggle search alert', () => {
      usePreferencesStore.getState().addSavedSearch({
        name: 'Test Search',
        filters: {},
        alertEnabled: false,
      })
      const searchId = usePreferencesStore.getState().savedSearches[0].id

      expect(usePreferencesStore.getState().savedSearches[0].alertEnabled).toBe(false)
      usePreferencesStore.getState().toggleSearchAlert(searchId)
      expect(usePreferencesStore.getState().savedSearches[0].alertEnabled).toBe(true)
    })

    it('should limit saved searches to 20', () => {
      for (let i = 0; i < 25; i++) {
        usePreferencesStore.getState().addSavedSearch({
          name: `Search ${i}`,
          filters: {},
          alertEnabled: false,
        })
      }

      expect(usePreferencesStore.getState().savedSearches).toHaveLength(20)
    })
  })

  describe('recent searches', () => {
    it('should add recent search', () => {
      usePreferencesStore.getState().addRecentSearch('departamento palermo')

      const { recentSearches } = usePreferencesStore.getState()
      expect(recentSearches).toHaveLength(1)
      expect(recentSearches[0].query).toBe('departamento palermo')
    })

    it('should not duplicate and move to top', () => {
      usePreferencesStore.getState().addRecentSearch('search 1')
      usePreferencesStore.getState().addRecentSearch('search 2')
      usePreferencesStore.getState().addRecentSearch('search 1')

      const { recentSearches } = usePreferencesStore.getState()
      expect(recentSearches).toHaveLength(2)
      expect(recentSearches[0].query).toBe('search 1') // Most recent
    })

    it('should limit to 10 recent searches', () => {
      for (let i = 0; i < 15; i++) {
        usePreferencesStore.getState().addRecentSearch(`search ${i}`)
      }

      expect(usePreferencesStore.getState().recentSearches).toHaveLength(10)
    })

    it('should clear recent searches', () => {
      usePreferencesStore.getState().addRecentSearch('search 1')
      usePreferencesStore.getState().addRecentSearch('search 2')
      usePreferencesStore.getState().clearRecentSearches()

      expect(usePreferencesStore.getState().recentSearches).toHaveLength(0)
    })
  })

  describe('view history', () => {
    it('should track property view', () => {
      usePreferencesStore.getState().trackView('prop-1', 30)

      const { viewHistory } = usePreferencesStore.getState()
      expect(viewHistory).toHaveLength(1)
      expect(viewHistory[0].propertyId).toBe('prop-1')
      expect(viewHistory[0].duration).toBe(30)
    })

    it('should get most viewed property IDs', () => {
      usePreferencesStore.getState().trackView('prop-1', 10)
      usePreferencesStore.getState().trackView('prop-2', 20)
      usePreferencesStore.getState().trackView('prop-1', 15)
      usePreferencesStore.getState().trackView('prop-1', 5)
      usePreferencesStore.getState().trackView('prop-2', 30)

      const mostViewed = usePreferencesStore.getState().getMostViewedPropertyIds(2)
      // prop-1 viewed 3 times, prop-2 viewed 2 times
      expect(mostViewed).toEqual(['prop-1', 'prop-2'])
    })

    it('should limit view history to 100 entries', () => {
      for (let i = 0; i < 110; i++) {
        usePreferencesStore.getState().trackView(`prop-${i}`, 10)
      }

      expect(usePreferencesStore.getState().viewHistory).toHaveLength(100)
    })
  })
})
