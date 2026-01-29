import { describe, it, expect, beforeEach } from 'vitest'
import { useComparisonStore } from '../comparison-store'
import type { Property } from '@propery/api-client'

const createMockProperty = (id: string): Property => ({
  id,
  title: `Property ${id}`,
  description: 'Test property description',
  operationType: 'sale',
  propertyType: 'apartment',
  price: 150000,
  currency: 'USD',
  expenses: 30000,
  location: {
    address: 'Test Address 123',
    neighborhood: 'Palermo',
    city: 'Buenos Aires',
    province: 'CABA',
    lat: -34.5875,
    lng: -58.4161,
  },
  features: {
    bedrooms: 2,
    bathrooms: 1,
    totalArea: 60,
    coveredArea: 55,
    parking: 1,
    age: 10,
  },
  amenities: {
    pool: true,
    gym: true,
    laundry: false,
    rooftop: false,
    security: true,
    balcony: true,
    terrace: false,
    garden: false,
    storage: true,
    petFriendly: true,
  },
  images: ['https://example.com/image1.jpg'],
  source: 'zonaprop',
  sourceUrl: 'https://zonaprop.com/property/123',
  publishedAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
  prediction: {
    predictedPrice: 145000,
    confidence: 0.85,
    priceCategory: 'fair',
    percentageDiff: 3.4,
    factors: [],
  },
})

describe('Comparison Store', () => {
  beforeEach(() => {
    useComparisonStore.getState().clearAll()
  })

  describe('initial state', () => {
    it('should have empty properties array', () => {
      expect(useComparisonStore.getState().properties).toEqual([])
    })

    it('should have maxProperties of 4', () => {
      expect(useComparisonStore.getState().maxProperties).toBe(4)
    })
  })

  describe('addProperty', () => {
    it('should add a property to the comparison', () => {
      const property = createMockProperty('1')
      const result = useComparisonStore.getState().addProperty(property)

      expect(result).toBe(true)
      expect(useComparisonStore.getState().properties).toHaveLength(1)
      expect(useComparisonStore.getState().properties[0].id).toBe('1')
    })

    it('should not add duplicate properties', () => {
      const property = createMockProperty('1')
      useComparisonStore.getState().addProperty(property)
      const result = useComparisonStore.getState().addProperty(property)

      expect(result).toBe(false)
      expect(useComparisonStore.getState().properties).toHaveLength(1)
    })

    it('should not exceed maxProperties', () => {
      for (let i = 1; i <= 5; i++) {
        useComparisonStore.getState().addProperty(createMockProperty(String(i)))
      }

      expect(useComparisonStore.getState().properties).toHaveLength(4)
    })

    it('should return false when at max capacity', () => {
      for (let i = 1; i <= 4; i++) {
        useComparisonStore.getState().addProperty(createMockProperty(String(i)))
      }

      const result = useComparisonStore
        .getState()
        .addProperty(createMockProperty('5'))
      expect(result).toBe(false)
    })
  })

  describe('removeProperty', () => {
    it('should remove a property by id', () => {
      const property1 = createMockProperty('1')
      const property2 = createMockProperty('2')

      useComparisonStore.getState().addProperty(property1)
      useComparisonStore.getState().addProperty(property2)
      useComparisonStore.getState().removeProperty('1')

      const properties = useComparisonStore.getState().properties
      expect(properties).toHaveLength(1)
      expect(properties[0].id).toBe('2')
    })

    it('should do nothing if property not found', () => {
      const property = createMockProperty('1')
      useComparisonStore.getState().addProperty(property)
      useComparisonStore.getState().removeProperty('999')

      expect(useComparisonStore.getState().properties).toHaveLength(1)
    })
  })

  describe('clearAll', () => {
    it('should remove all properties', () => {
      useComparisonStore.getState().addProperty(createMockProperty('1'))
      useComparisonStore.getState().addProperty(createMockProperty('2'))
      useComparisonStore.getState().addProperty(createMockProperty('3'))
      useComparisonStore.getState().clearAll()

      expect(useComparisonStore.getState().properties).toEqual([])
    })
  })

  describe('isInComparison', () => {
    it('should return true for added property', () => {
      useComparisonStore.getState().addProperty(createMockProperty('1'))

      expect(useComparisonStore.getState().isInComparison('1')).toBe(true)
    })

    it('should return false for property not added', () => {
      useComparisonStore.getState().addProperty(createMockProperty('1'))

      expect(useComparisonStore.getState().isInComparison('2')).toBe(false)
    })

    it('should return false after property is removed', () => {
      useComparisonStore.getState().addProperty(createMockProperty('1'))
      useComparisonStore.getState().removeProperty('1')

      expect(useComparisonStore.getState().isInComparison('1')).toBe(false)
    })
  })

  describe('canAdd', () => {
    it('should return true when under max capacity', () => {
      useComparisonStore.getState().addProperty(createMockProperty('1'))
      useComparisonStore.getState().addProperty(createMockProperty('2'))

      expect(useComparisonStore.getState().canAdd()).toBe(true)
    })

    it('should return false when at max capacity', () => {
      for (let i = 1; i <= 4; i++) {
        useComparisonStore.getState().addProperty(createMockProperty(String(i)))
      }

      expect(useComparisonStore.getState().canAdd()).toBe(false)
    })

    it('should return true after removing from max capacity', () => {
      for (let i = 1; i <= 4; i++) {
        useComparisonStore.getState().addProperty(createMockProperty(String(i)))
      }
      useComparisonStore.getState().removeProperty('1')

      expect(useComparisonStore.getState().canAdd()).toBe(true)
    })
  })

  describe('immutability', () => {
    it('should not mutate existing properties array when adding', () => {
      const property1 = createMockProperty('1')
      useComparisonStore.getState().addProperty(property1)
      const originalArray = useComparisonStore.getState().properties

      const property2 = createMockProperty('2')
      useComparisonStore.getState().addProperty(property2)
      const newArray = useComparisonStore.getState().properties

      expect(originalArray).not.toBe(newArray)
      expect(originalArray).toHaveLength(1)
      expect(newArray).toHaveLength(2)
    })

    it('should not mutate existing properties array when removing', () => {
      useComparisonStore.getState().addProperty(createMockProperty('1'))
      useComparisonStore.getState().addProperty(createMockProperty('2'))
      const originalArray = useComparisonStore.getState().properties

      useComparisonStore.getState().removeProperty('1')
      const newArray = useComparisonStore.getState().properties

      expect(originalArray).not.toBe(newArray)
      expect(originalArray).toHaveLength(2)
      expect(newArray).toHaveLength(1)
    })
  })
})
