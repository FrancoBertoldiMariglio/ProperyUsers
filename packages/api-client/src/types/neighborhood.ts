export interface NeighborhoodPolygon {
  type: 'Polygon'
  coordinates: number[][][]
}

export interface Neighborhood {
  id: string
  name: string
  city: string
  polygon: NeighborhoodPolygon
  center: {
    lat: number
    lng: number
  }
}

export interface NeighborhoodStats {
  neighborhoodId: string
  name: string
  avgPricePerM2Sale: number
  avgPricePerM2Rent: number
  priceTrend6m: number
  totalListings: number
  avgDaysOnMarket: number
  distribution: {
    apartments: number
    houses: number
    phs: number
    other: number
  }
  priceRanges: {
    min: number
    max: number
    median: number
    q1: number
    q3: number
  }
}

export interface PriceHistoryPoint {
  date: string
  avgPrice: number
  medianPrice: number
  listings: number
}
