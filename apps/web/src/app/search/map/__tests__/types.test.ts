import { describe, it, expect } from 'vitest'
import { PRICE_COLORS, MAP_LAYERS, PROPERTY_TYPE_ICONS } from '../types'

describe('Map Types', () => {
  describe('PRICE_COLORS', () => {
    it('should have colors for all price categories', () => {
      expect(PRICE_COLORS.opportunity).toBe('#10b981')
      expect(PRICE_COLORS.fair).toBe('#3b82f6')
      expect(PRICE_COLORS.expensive).toBe('#f59e0b')
      expect(PRICE_COLORS.overpriced).toBe('#ef4444')
    })

    it('should have valid hex color format', () => {
      const hexPattern = /^#[0-9a-f]{6}$/i
      Object.values(PRICE_COLORS).forEach(color => {
        expect(color).toMatch(hexPattern)
      })
    })
  })

  describe('MAP_LAYERS', () => {
    it('should have all required layer types', () => {
      const layerIds = MAP_LAYERS.map(l => l.id)
      expect(layerIds).toContain('transport')
      expect(layerIds).toContain('schools')
      expect(layerIds).toContain('hospitals')
      expect(layerIds).toContain('parks')
      expect(layerIds).toContain('security')
    })

    it('should have valid layer properties', () => {
      MAP_LAYERS.forEach(layer => {
        expect(layer.id).toBeDefined()
        expect(layer.name).toBeDefined()
        expect(layer.icon).toBeDefined()
        expect(layer.color).toBeDefined()
        expect(typeof layer.visible).toBe('boolean')
      })
    })
  })

  describe('PROPERTY_TYPE_ICONS', () => {
    it('should have icons for all property types', () => {
      expect(PROPERTY_TYPE_ICONS.apartment).toBeDefined()
      expect(PROPERTY_TYPE_ICONS.house).toBeDefined()
      expect(PROPERTY_TYPE_ICONS.ph).toBeDefined()
      expect(PROPERTY_TYPE_ICONS.land).toBeDefined()
      expect(PROPERTY_TYPE_ICONS.office).toBeDefined()
      expect(PROPERTY_TYPE_ICONS.local).toBeDefined()
    })
  })
})
