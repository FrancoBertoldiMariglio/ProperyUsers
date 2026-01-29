import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchIsochrone } from '../isochrone-control'

describe('Isochrone API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchIsochrone', () => {
    it('should construct correct URL for walking mode', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          features: [{
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: [[[-58.4, -34.6]]] }
          }]
        })
      })
      global.fetch = mockFetch

      await fetchIsochrone([-58.437, -34.6037], 15, 'walking', 'test-token')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('mapbox/walking')
      )
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('contours_minutes=15')
      )
    })

    it('should construct correct URL for driving mode', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ features: [] })
      })
      global.fetch = mockFetch

      await fetchIsochrone([-58.437, -34.6037], 10, 'driving', 'test-token')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('mapbox/driving')
      )
    })

    it('should return null on fetch error', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      const result = await fetchIsochrone([-58.437, -34.6037], 15, 'walking', 'test-token')

      expect(result).toBeNull()
    })

    it('should return null on non-ok response', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401
      })

      const result = await fetchIsochrone([-58.437, -34.6037], 15, 'walking', 'test-token')

      expect(result).toBeNull()
    })

    it('should return polygon feature on success', async () => {
      const mockPolygon = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[[-58.45, -34.58], [-58.42, -34.58], [-58.42, -34.62]]]
        }
      }
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ features: [mockPolygon] })
      })

      const result = await fetchIsochrone([-58.437, -34.6037], 15, 'walking', 'test-token')

      expect(result).toEqual(mockPolygon)
    })
  })
})
