import type { Property, PriceCategory } from '../types'

const neighborhoods = [
  { id: 'palermo', name: 'Palermo', lat: -34.5789, lng: -58.4299 },
  { id: 'recoleta', name: 'Recoleta', lat: -34.5875, lng: -58.3934 },
  { id: 'belgrano', name: 'Belgrano', lat: -34.5614, lng: -58.4562 },
  { id: 'nunez', name: 'Nunez', lat: -34.5432, lng: -58.4567 },
  { id: 'caballito', name: 'Caballito', lat: -34.6189, lng: -58.4437 },
  { id: 'villa-urquiza', name: 'Villa Urquiza', lat: -34.5723, lng: -58.4912 },
  { id: 'san-telmo', name: 'San Telmo', lat: -34.6212, lng: -58.3734 },
  { id: 'puerto-madero', name: 'Puerto Madero', lat: -34.6118, lng: -58.3628 },
  { id: 'almagro', name: 'Almagro', lat: -34.6089, lng: -58.4201 },
  { id: 'colegiales', name: 'Colegiales', lat: -34.5744, lng: -58.4489 },
]

const sources = ['zonaprop', 'mercadolibre', 'argenprop', 'properati'] as const
const propertyTypes = ['apartment', 'house', 'ph'] as const
const priceCategories: PriceCategory[] = ['opportunity', 'fair', 'expensive', 'overpriced']

function randomFromArray<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateProperty(index: number): Property {
  const neighborhood = randomFromArray(neighborhoods)
  const propertyType = randomFromArray(propertyTypes)
  const operationType = Math.random() > 0.3 ? 'sale' : 'rent'
  const bedrooms = randomBetween(1, 4)
  const bathrooms = randomBetween(1, Math.min(bedrooms, 3))
  const totalArea = randomBetween(35, 200)
  const coveredArea = Math.floor(totalArea * (0.85 + Math.random() * 0.15))

  const basePricePerM2 = operationType === 'sale' ? randomBetween(2000, 4000) : randomBetween(10, 25)
  const price = Math.round((totalArea * basePricePerM2) / 1000) * 1000

  const priceCategory = randomFromArray(priceCategories)
  const percentageDiff =
    priceCategory === 'opportunity'
      ? randomBetween(-25, -10)
      : priceCategory === 'fair'
        ? randomBetween(-5, 5)
        : priceCategory === 'expensive'
          ? randomBetween(5, 15)
          : randomBetween(15, 30)

  const daysAgo = randomBetween(1, 90)
  const publishedAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString()

  const streetNames = [
    'Av. Santa Fe',
    'Av. Cabildo',
    'Av. Corrientes',
    'Av. Rivadavia',
    'Av. Callao',
    'Thames',
    'Honduras',
    'Gurruchaga',
    'Serrano',
    'Arce',
    'Juramento',
    'Libertador',
    'Olleros',
    'Congreso',
    'Bulnes',
  ]

  return {
    id: `prop-${index.toString().padStart(4, '0')}`,
    title: `${propertyType === 'apartment' ? 'Departamento' : propertyType === 'house' ? 'Casa' : 'PH'} ${bedrooms} amb en ${neighborhood.name}`,
    description: `Excelente ${propertyType === 'apartment' ? 'departamento' : propertyType === 'house' ? 'casa' : 'PH'} de ${bedrooms} ambientes en ${neighborhood.name}. ${totalArea}m² totales, ${coveredArea}m² cubiertos. ${bathrooms} bano${bathrooms > 1 ? 's' : ''}. Muy luminoso, excelente estado.`,
    operationType,
    propertyType,
    price,
    currency: 'USD',
    expenses: operationType === 'rent' ? null : randomBetween(15000, 80000),
    location: {
      address: `${randomFromArray(streetNames)} ${randomBetween(100, 5000)}`,
      neighborhood: neighborhood.name,
      city: 'Buenos Aires',
      province: 'CABA',
      lat: neighborhood.lat + (Math.random() - 0.5) * 0.02,
      lng: neighborhood.lng + (Math.random() - 0.5) * 0.02,
    },
    features: {
      bedrooms,
      bathrooms,
      totalArea,
      coveredArea,
      parking: Math.random() > 0.5 ? randomBetween(0, 2) : 0,
      age: Math.random() > 0.2 ? randomBetween(0, 50) : null,
      floor: propertyType === 'apartment' ? randomBetween(1, 20) : undefined,
      orientation: randomFromArray(['Norte', 'Sur', 'Este', 'Oeste', 'Noreste', 'Noroeste']),
    },
    amenities: {
      pool: Math.random() > 0.7,
      gym: Math.random() > 0.6,
      laundry: Math.random() > 0.5,
      rooftop: Math.random() > 0.7,
      security: Math.random() > 0.4,
      balcony: Math.random() > 0.5,
      terrace: Math.random() > 0.8,
      garden: propertyType !== 'apartment' && Math.random() > 0.5,
      storage: Math.random() > 0.7,
      petFriendly: Math.random() > 0.6,
    },
    images: Array.from(
      { length: randomBetween(3, 8) },
      (_, i) => `https://picsum.photos/seed/${index}-${i}/800/600`
    ),
    source: randomFromArray(sources),
    sourceUrl: `https://example.com/property/${index}`,
    publishedAt,
    updatedAt: publishedAt,
    prediction: {
      predictedPrice: Math.round(price * (1 - percentageDiff / 100)),
      confidence: randomBetween(75, 95) / 100,
      priceCategory,
      percentageDiff,
      factors: [
        {
          name: 'Ubicacion',
          impact: Math.random() > 0.5 ? 'positive' : 'neutral',
          description: `Zona ${Math.random() > 0.5 ? 'muy valorizada' : 'en crecimiento'}`,
        },
        {
          name: 'Tamano',
          impact: totalArea > 80 ? 'positive' : 'neutral',
          description: `${totalArea}m² ${totalArea > 80 ? 'por encima' : 'cerca'} del promedio`,
        },
        {
          name: 'Antiguedad',
          impact: randomFromArray(['positive', 'negative', 'neutral']),
          description: 'Construccion en buen estado',
        },
      ],
    },
  }
}

export const mockProperties: Property[] = Array.from({ length: 60 }, (_, i) => generateProperty(i + 1))
