'use client'

import type { JSX } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useComparisonStore } from '@propery/core'
import { getPropertiesByIds, type Property } from '@propery/api-client'
import { Button, Badge } from '@propery/ui/web'
import { ArrowLeft, FileDown, X, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { Suspense } from 'react'
import { ComparisonTable } from './comparison-table'
import { CostCalculator } from './cost-calculator'
import { InvestmentScore } from './investment-score'
import { ShareModal } from './share-modal'

function ComparePageContent(): JSX.Element {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { removeProperty } = useComparisonStore()

  const ids = searchParams.get('ids')?.split(',').filter(Boolean) ?? []

  const {
    data: properties = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['compare-properties', ids],
    queryFn: () => getPropertiesByIds(ids),
    enabled: ids.length > 0,
  })

  const formatPrice = (price: number, currency: string) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(price)

  const handleRemove = (id: string) => {
    removeProperty(id)
    const newIds = ids.filter((i) => i !== id)
    if (newIds.length < 2) {
      router.push('/search')
    } else {
      router.push(`/compare?ids=${newIds.join(',')}` as '/compare')
    }
  }

  if (ids.length < 2) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Selecciona al menos 2 propiedades</h1>
        <p className="text-muted-foreground">
          Vuelve a la búsqueda y agrega propiedades para comparar.
        </p>
        <Button onClick={() => router.push('/search')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a búsqueda
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isError || properties.length < 2) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Error al cargar propiedades</h1>
        <Button onClick={() => router.push('/search')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a búsqueda
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/search')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
            <h1 className="text-lg font-semibold">
              Comparando {properties.length} propiedades
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ShareModal
              url={typeof window !== 'undefined' ? window.location.href : ''}
              propertyCount={properties.length}
            />
            <Button variant="outline" size="sm" disabled>
              <FileDown className="mr-2 h-4 w-4" />
              Exportar PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Property Cards Grid */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${properties.length}, minmax(0, 1fr))`,
            }}
          >
            {properties.map((property) => (
              <PropertyComparisonCard
                key={property.id}
                property={property}
                onRemove={() => handleRemove(property.id)}
                formatPrice={formatPrice}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <h2 className="mb-4 text-lg font-semibold">Características comparadas</h2>
          <ComparisonTable properties={properties} />
        </div>
      </section>

      {/* Cost Calculator */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <h2 className="mb-4 text-lg font-semibold">Costo mensual estimado</h2>
          <CostCalculator properties={properties} />
        </div>
      </section>

      {/* Investment Score */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-6">
          <h2 className="mb-4 text-lg font-semibold">Score de inversión</h2>
          <InvestmentScore properties={properties} />
        </div>
      </section>
    </div>
  )
}

interface PropertyComparisonCardProps {
  property: Property
  onRemove: () => void
  formatPrice: (price: number, currency: string) => string
}

function PropertyComparisonCard({
  property,
  onRemove,
  formatPrice,
}: PropertyComparisonCardProps): JSX.Element {
  const priceCategoryLabels: Record<string, string> = {
    opportunity: 'Oportunidad',
    fair: 'Precio justo',
    expensive: 'Elevado',
    overpriced: 'Sobrevalorado',
  }

  return (
    <div className="group relative rounded-lg border bg-card shadow-sm">
      {/* Remove button */}
      <button
        onClick={onRemove}
        className="absolute -right-2 -top-2 z-10 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-lg">
        <Image
          src={property.images[0] || '/placeholder.jpg'}
          alt={property.title}
          fill
          className="object-cover"
        />
        {property.prediction && (
          <Badge
            variant={property.prediction.priceCategory}
            className="absolute bottom-2 left-2"
          >
            {priceCategoryLabels[property.prediction.priceCategory]}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="line-clamp-2 font-semibold">{property.title}</h3>
        <p className="text-sm text-muted-foreground">{property.location.neighborhood}</p>
        <p className="mt-2 text-xl font-bold text-primary">
          {formatPrice(property.price, property.currency)}
        </p>
        {property.expenses && (
          <p className="text-sm text-muted-foreground">
            + {formatPrice(property.expenses, 'ARS')} expensas
          </p>
        )}
      </div>
    </div>
  )
}

export default function ComparePage(): JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <ComparePageContent />
    </Suspense>
  )
}
