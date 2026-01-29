export type PropertyType = 'apartment' | 'house' | 'ph' | 'land' | 'office' | 'local'

export type OperationType = 'sale' | 'rent'

export type Currency = 'USD' | 'ARS'

export type PropertySource = 'zonaprop' | 'mercadolibre' | 'argenprop' | 'properati' | 'direct'

export type PriceCategory = 'opportunity' | 'fair' | 'expensive' | 'overpriced'

export interface PropertyLocation {
  address: string
  neighborhood: string
  city: string
  province: string
  lat: number
  lng: number
  postalCode?: string
}

export interface PropertyFeatures {
  bedrooms: number
  bathrooms: number
  totalArea: number
  coveredArea: number
  parking: number
  age: number | null
  floor?: number
  orientation?: string
  disposition?: string
}

export interface PropertyAmenities {
  pool: boolean
  gym: boolean
  laundry: boolean
  rooftop: boolean
  security: boolean
  balcony: boolean
  terrace: boolean
  garden: boolean
  storage: boolean
  petFriendly: boolean
}

export interface PricePrediction {
  predictedPrice: number
  confidence: number
  priceCategory: PriceCategory
  percentageDiff: number
  factors: Array<{
    name: string
    impact: 'positive' | 'negative' | 'neutral'
    description: string
  }>
}

export interface Property {
  id: string
  title: string
  description: string
  operationType: OperationType
  propertyType: PropertyType
  price: number
  currency: Currency
  expenses: number | null
  location: PropertyLocation
  features: PropertyFeatures
  amenities: PropertyAmenities
  images: string[]
  source: PropertySource
  sourceUrl: string
  publishedAt: string
  updatedAt: string
  prediction?: PricePrediction
}

export interface PropertyFilters {
  operationType?: OperationType
  propertyTypes: PropertyType[]
  priceMin?: number
  priceMax?: number
  currency: Currency
  areaMin?: number
  areaMax?: number
  bedrooms?: number
  bathrooms?: number
  parking?: number
  age?: 'new' | 'under5' | 'under10' | 'under20' | 'over20'
  neighborhoods: string[]
  amenities: string[]
  onlyOpportunities: boolean
  sortBy: 'price' | 'date' | 'relevance' | 'opportunity'
  sortOrder: 'asc' | 'desc'
  query?: string
  page?: number
  limit?: number
}

export interface PropertiesResponse {
  data: Property[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
