import { describe, it, expect, beforeEach } from 'vitest'
import { useMapStore } from '../map-store'

describe('Map Store', () => {
  beforeEach(() => {
    useMapStore.getState().reset()
  })

  describe('initial state', () => {
    it('should have Buenos Aires as default center', () => {
      const state = useMapStore.getState()
      expect(state.center[0]).toBeCloseTo(-58.437, 2)
      expect(state.center[1]).toBeCloseTo(-34.6037, 2)
    })

    it('should have default zoom of 12', () => {
      expect(useMapStore.getState().zoom).toBe(12)
    })

    it('should have empty active layers', () => {
      expect(useMapStore.getState().activeLayers).toEqual([])
    })

    it('should have heatmap disabled', () => {
      expect(useMapStore.getState().showHeatmap).toBe(false)
    })
  })

  describe('toggleLayer', () => {
    it('should add layer when not present', () => {
      useMapStore.getState().toggleLayer('transport')
      expect(useMapStore.getState().activeLayers).toContain('transport')
    })

    it('should remove layer when already present', () => {
      useMapStore.getState().toggleLayer('transport')
      useMapStore.getState().toggleLayer('transport')
      expect(useMapStore.getState().activeLayers).not.toContain('transport')
    })

    it('should handle multiple layers', () => {
      useMapStore.getState().toggleLayer('transport')
      useMapStore.getState().toggleLayer('schools')
      useMapStore.getState().toggleLayer('hospitals')

      const layers = useMapStore.getState().activeLayers
      expect(layers).toContain('transport')
      expect(layers).toContain('schools')
      expect(layers).toContain('hospitals')
    })
  })

  describe('toggleHeatmap', () => {
    it('should toggle heatmap visibility', () => {
      expect(useMapStore.getState().showHeatmap).toBe(false)
      useMapStore.getState().toggleHeatmap()
      expect(useMapStore.getState().showHeatmap).toBe(true)
      useMapStore.getState().toggleHeatmap()
      expect(useMapStore.getState().showHeatmap).toBe(false)
    })
  })

  describe('toggleNeighborhoodPolygons', () => {
    it('should toggle neighborhood polygons visibility', () => {
      expect(useMapStore.getState().showNeighborhoodPolygons).toBe(false)
      useMapStore.getState().toggleNeighborhoodPolygons()
      expect(useMapStore.getState().showNeighborhoodPolygons).toBe(true)
    })
  })

  describe('setCenter', () => {
    it('should update center coordinates', () => {
      useMapStore.getState().setCenter([-58.5, -34.7])
      const { center } = useMapStore.getState()
      expect(center[0]).toBe(-58.5)
      expect(center[1]).toBe(-34.7)
    })
  })

  describe('setZoom', () => {
    it('should update zoom level', () => {
      useMapStore.getState().setZoom(15)
      expect(useMapStore.getState().zoom).toBe(15)
    })
  })

  describe('setDrawnPolygon', () => {
    it('should set drawn polygon', () => {
      const polygon = { coordinates: [[-58.4, -34.6], [-58.5, -34.6], [-58.5, -34.7]] as [number, number][] }
      useMapStore.getState().setDrawnPolygon(polygon)
      expect(useMapStore.getState().drawnPolygon).toEqual(polygon)
    })

    it('should clear polygon when set to null', () => {
      useMapStore.getState().setDrawnPolygon({ coordinates: [[-58.4, -34.6]] })
      useMapStore.getState().setDrawnPolygon(null)
      expect(useMapStore.getState().drawnPolygon).toBeNull()
    })
  })

  describe('reset', () => {
    it('should reset all state to initial values', () => {
      // Make some changes
      useMapStore.getState().toggleLayer('transport')
      useMapStore.getState().toggleHeatmap()
      useMapStore.getState().setZoom(18)
      useMapStore.getState().setCenter([-59, -35])

      // Reset
      useMapStore.getState().reset()

      // Verify reset
      const state = useMapStore.getState()
      expect(state.activeLayers).toEqual([])
      expect(state.showHeatmap).toBe(false)
      expect(state.zoom).toBe(12)
    })
  })
})
