'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Car,
  Maximize2,
  Calendar,
  Building2,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Calculator,
  Phone,
  Mail,
  ExternalLink,
} from 'lucide-react'
import { Button, Badge, MortgageCalculator } from '@propery/ui/web'
import { usePreferencesStore } from '@propery/core'
import { mocks, Property } from '@propery/api-client'

const { mockProperties } = mocks

function ImageGallery({ images, title }: { images: string[]; title: string }): JSX.Element {
  const [currentIndex, setCurrentIndex] = React.useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="relative overflow-hidden rounded-xl bg-muted">
      <div className="aspect-[16/9]">
        {images[currentIndex] ? (
          <img
            src={images[currentIndex]}
            alt={`${title} - Imagen ${currentIndex + 1}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Sin imagen
          </div>
        )}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow-lg transition-colors hover:bg-background"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow-lg transition-colors hover:bg-background"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  idx === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
          <div className="absolute bottom-4 right-4 rounded-full bg-background/80 px-3 py-1 text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  )
}

function PriceAnalysis({ property }: { property: Property }): JSX.Element | null {
  const { prediction } = property
  if (!prediction) return null

  const categoryConfig = {
    opportunity: { color: 'text-green-600', bg: 'bg-green-100', label: 'Oportunidad' },
    fair: { color: 'text-blue-600', bg: 'bg-blue-100', label: 'Precio justo' },
    expensive: { color: 'text-amber-600', bg: 'bg-amber-100', label: 'Algo caro' },
    overpriced: { color: 'text-red-600', bg: 'bg-red-100', label: 'Sobreprecio' },
  }

  const config = categoryConfig[prediction.priceCategory]
  const Icon = prediction.percentageDiff < 0 ? TrendingDown : TrendingUp

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 font-semibold">Análisis de precio</h3>

      <div className="mb-4 flex items-center gap-4">
        <div className={`rounded-full px-3 py-1 text-sm font-medium ${config.bg} ${config.color}`}>
          {config.label}
        </div>
        <div className="flex items-center gap-1">
          <Icon className={`h-4 w-4 ${prediction.percentageDiff < 0 ? 'text-green-600' : 'text-red-600'}`} />
          <span className={prediction.percentageDiff < 0 ? 'text-green-600' : 'text-red-600'}>
            {Math.abs(prediction.percentageDiff).toFixed(1)}% vs mercado
          </span>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Precio publicado</p>
          <p className="text-lg font-bold">US$ {property.price.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Precio estimado</p>
          <p className="text-lg font-bold">US$ {prediction.predictedPrice.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Factores clave:</p>
        {prediction.factors.slice(0, 3).map((factor, idx) => (
          <div key={idx} className="flex items-start gap-2 text-sm">
            <span
              className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                factor.impact === 'positive'
                  ? 'bg-green-500'
                  : factor.impact === 'negative'
                    ? 'bg-red-500'
                    : 'bg-gray-400'
              }`}
            />
            <span className="text-muted-foreground">{factor.description}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted/50 p-2 text-xs text-muted-foreground">
        <AlertCircle className="h-4 w-4" />
        Confianza del modelo: {(prediction.confidence * 100).toFixed(0)}%
      </div>
    </div>
  )
}

function AmenitiesList({ amenities }: { amenities: Property['amenities'] }): JSX.Element {
  const amenityLabels: Record<keyof typeof amenities, string> = {
    pool: 'Pileta',
    gym: 'Gimnasio',
    laundry: 'Lavadero',
    rooftop: 'Rooftop',
    security: 'Seguridad 24hs',
    balcony: 'Balcón',
    terrace: 'Terraza',
    garden: 'Jardín',
    storage: 'Baulera',
    petFriendly: 'Acepta mascotas',
  }

  const activeAmenities = Object.entries(amenities)
    .filter(([, value]) => value)
    .map(([key]) => amenityLabels[key as keyof typeof amenities])

  if (activeAmenities.length === 0) {
    return <p className="text-sm text-muted-foreground">Sin amenities reportados</p>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {activeAmenities.map((amenity) => (
        <Badge key={amenity} variant="secondary">
          {amenity}
        </Badge>
      ))}
    </div>
  )
}

export default function PropertyDetailPage(): JSX.Element {
  const params = useParams()
  const router = useRouter()
  const { addFavorite, removeFavorite, isFavorite, trackView } = usePreferencesStore()

  const propertyId = params.id as string
  const property = mockProperties.find((p) => p.id === propertyId)
  const favorite = isFavorite(propertyId)

  // Track view duration
  React.useEffect(() => {
    const startTime = Date.now()
    return () => {
      const duration = Math.floor((Date.now() - startTime) / 1000)
      if (duration > 3) {
        trackView(propertyId, duration)
      }
    }
  }, [propertyId, trackView])

  if (!property) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <AlertCircle className="mb-4 h-16 w-16 text-muted-foreground" />
        <h1 className="text-xl font-bold">Propiedad no encontrada</h1>
        <p className="mt-2 text-muted-foreground">La propiedad que buscás no existe o fue eliminada</p>
        <Button className="mt-6" onClick={() => router.push('/search')}>
          Volver a buscar
        </Button>
      </div>
    )
  }

  const toggleFavorite = () => {
    if (favorite) {
      removeFavorite(propertyId)
    } else {
      addFavorite(propertyId)
    }
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: property.title,
        text: `${property.title} - US$ ${property.price.toLocaleString()}`,
        url: window.location.href,
      })
    } catch {
      await navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-12">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/search">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
            <Button
              variant={favorite ? 'default' : 'ghost'}
              size="icon"
              onClick={toggleFavorite}
            >
              <Heart className={`h-5 w-5 ${favorite ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Gallery */}
            <ImageGallery images={property.images} title={property.title} />

            {/* Title & Price */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Badge variant={property.operationType === 'sale' ? 'default' : 'secondary'}>
                  {property.operationType === 'sale' ? 'Venta' : 'Alquiler'}
                </Badge>
                <Badge variant="outline">{property.propertyType}</Badge>
                {property.prediction?.priceCategory === 'opportunity' && (
                  <Badge className="bg-green-100 text-green-700">Oportunidad</Badge>
                )}
              </div>
              <h1 className="text-2xl font-bold">{property.title}</h1>
              <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>
                  {property.location.address}, {property.location.neighborhood}
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">
                  US$ {property.price.toLocaleString()}
                </span>
                {property.expenses && (
                  <span className="text-muted-foreground">
                    + ${property.expenses.toLocaleString()} expensas
                  </span>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-card p-6 sm:grid-cols-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Bed className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{property.features.bedrooms}</p>
                  <p className="text-xs text-muted-foreground">Habitaciones</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Bath className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{property.features.bathrooms}</p>
                  <p className="text-xs text-muted-foreground">Baños</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Maximize2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{property.features.totalArea}</p>
                  <p className="text-xs text-muted-foreground">m² totales</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Car className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{property.features.parking}</p>
                  <p className="text-xs text-muted-foreground">Cocheras</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 font-semibold">Descripción</h3>
              <p className="whitespace-pre-line text-muted-foreground">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 font-semibold">Amenities</h3>
              <AmenitiesList amenities={property.amenities} />
            </div>

            {/* Additional Info */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 font-semibold">Información adicional</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Antigüedad:</span>
                  <span>{property.features.age ? `${property.features.age} años` : 'A estrenar'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Cubiertos:</span>
                  <span>{property.features.coveredArea} m²</span>
                </div>
                {property.features.floor && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Piso:</span>
                    <span>{property.features.floor}°</span>
                  </div>
                )}
                {property.features.orientation && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Orientación:</span>
                    <span>{property.features.orientation}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Publicado:</span>
                  <span>{new Date(property.publishedAt).toLocaleDateString('es-AR')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Analysis */}
            <PriceAnalysis property={property} />

            {/* Mortgage Calculator */}
            {property.operationType === 'sale' && (
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Calculá tu cuota</h3>
                </div>
                <MortgageCalculator initialPrice={property.price} />
              </div>
            )}

            {/* Contact Card */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 font-semibold">Contactar</h3>
              <div className="space-y-3">
                <Button className="w-full" size="lg">
                  <Phone className="mr-2 h-4 w-4" />
                  Llamar
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  <Mail className="mr-2 h-4 w-4" />
                  Enviar mensaje
                </Button>
                <a
                  href={property.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  Ver en {property.source}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Compare Link */}
            <Link href={`/compare?ids=${property.id}`}>
              <Button variant="outline" className="w-full">
                Agregar a comparador
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
