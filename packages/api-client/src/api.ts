import type {
  Property,
  PropertyFilters,
  PropertiesResponse,
  Neighborhood,
  NeighborhoodStats,
  PriceHistoryPoint,
  PricePrediction,
} from './types'
import { mockProperties } from './mocks/properties'
import { mockNeighborhoods, mockNeighborhoodStats } from './mocks/neighborhoods'

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getProperties(filters: PropertyFilters): Promise<PropertiesResponse> {
  await delay(300 + Math.random() * 200)

  let filtered = [...mockProperties]

  // Apply filters
  if (filters.operationType) {
    filtered = filtered.filter((p) => p.operationType === filters.operationType)
  }

  if (filters.propertyTypes.length > 0) {
    filtered = filtered.filter((p) => filters.propertyTypes.includes(p.propertyType))
  }

  if (filters.priceMin !== undefined) {
    filtered = filtered.filter((p) => p.price >= filters.priceMin!)
  }

  if (filters.priceMax !== undefined) {
    filtered = filtered.filter((p) => p.price <= filters.priceMax!)
  }

  if (filters.areaMin !== undefined) {
    filtered = filtered.filter((p) => p.features.totalArea >= filters.areaMin!)
  }

  if (filters.areaMax !== undefined) {
    filtered = filtered.filter((p) => p.features.totalArea <= filters.areaMax!)
  }

  if (filters.bedrooms !== undefined) {
    filtered = filtered.filter((p) => p.features.bedrooms >= filters.bedrooms!)
  }

  if (filters.bathrooms !== undefined) {
    filtered = filtered.filter((p) => p.features.bathrooms >= filters.bathrooms!)
  }

  if (filters.neighborhoods.length > 0) {
    filtered = filtered.filter((p) =>
      filters.neighborhoods.some(
        (n) => p.location.neighborhood.toLowerCase() === n.toLowerCase()
      )
    )
  }

  if (filters.onlyOpportunities) {
    filtered = filtered.filter((p) => p.prediction?.priceCategory === 'opportunity')
  }

  if (filters.query) {
    const query = filters.query.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.location.neighborhood.toLowerCase().includes(query)
    )
  }

  // Sort
  const sortMultiplier = filters.sortOrder === 'asc' ? 1 : -1
  filtered.sort((a, b) => {
    switch (filters.sortBy) {
      case 'price':
        return (a.price - b.price) * sortMultiplier
      case 'date':
        return (
          (new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()) * sortMultiplier
        )
      case 'opportunity':
        return ((a.prediction?.percentageDiff ?? 0) - (b.prediction?.percentageDiff ?? 0)) * sortMultiplier
      default:
        return 0
    }
  })

  // Paginate
  const page = filters.page || 1
  const limit = filters.limit || 20
  const start = (page - 1) * limit
  const end = start + limit
  const data = filtered.slice(start, end)

  return {
    data,
    total: filtered.length,
    page,
    limit,
    hasMore: end < filtered.length,
  }
}

export async function getProperty(id: string): Promise<Property | null> {
  await delay(200 + Math.random() * 100)
  return mockProperties.find((p) => p.id === id) || null
}

export async function getPropertiesByIds(ids: string[]): Promise<Property[]> {
  await delay(200 + Math.random() * 100)
  return mockProperties.filter((p) => ids.includes(p.id))
}

export async function getNeighborhoods(): Promise<Neighborhood[]> {
  await delay(200)
  return mockNeighborhoods
}

export async function getNeighborhoodStats(neighborhoodId: string): Promise<NeighborhoodStats | null> {
  await delay(200)
  return mockNeighborhoodStats[neighborhoodId] || null
}

export async function getPriceHistory(
  neighborhoodId: string,
  months: number = 12
): Promise<PriceHistoryPoint[]> {
  await delay(300)

  const stats = mockNeighborhoodStats[neighborhoodId]
  if (!stats) return []

  const basePrice = stats.avgPricePerM2Sale
  const points: PriceHistoryPoint[] = []

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)

    const variation = 1 + (stats.priceTrend6m / 100 / 12) * (months - i) + (Math.random() - 0.5) * 0.02
    const avgPrice = Math.round(basePrice * variation)

    points.push({
      date: date.toISOString().slice(0, 7),
      avgPrice,
      medianPrice: Math.round(avgPrice * (0.9 + Math.random() * 0.2)),
      listings: Math.round(stats.totalListings * (0.8 + Math.random() * 0.4)),
    })
  }

  return points
}

export async function getPricePrediction(propertyId: string): Promise<PricePrediction | null> {
  await delay(200)
  const property = mockProperties.find((p) => p.id === propertyId)
  return property?.prediction || null
}
