'use client'

import * as React from 'react'
import Image from 'next/image'
import { Heart, GitCompare, Share2, MapPin, Bed, Bath, Square, Car } from 'lucide-react'
import type { Property } from '@propery/api-client'
import { cn } from '../shared/utils'
import { Badge } from './badge'
import { Button } from './button'
import { Card, CardContent } from './card'

interface PropertyCardProps {
  property: Property
  isComparing?: boolean
  isFavorite?: boolean
  onCompare?: (property: Property) => void
  onFavorite?: (property: Property) => void
  onShare?: (property: Property) => void
  onClick?: (property: Property) => void
  className?: string
}

const sourceLabels: Record<string, string> = {
  zonaprop: 'ZonaProp',
  mercadolibre: 'MercadoLibre',
  argenprop: 'Argenprop',
  properati: 'Properati',
  direct: 'Directo',
}

const priceCategoryLabels: Record<string, string> = {
  opportunity: 'Oportunidad',
  fair: 'Precio justo',
  expensive: 'Elevado',
  overpriced: 'Sobrevalorado',
}

export function PropertyCard({
  property,
  isComparing = false,
  isFavorite = false,
  onCompare,
  onFavorite,
  onShare,
  onClick,
  className,
}: PropertyCardProps) {
  const priceFormatted = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: property.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(property.price)

  const handleClick = () => {
    onClick?.(property)
  }

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation()
    onCompare?.(property)
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    onFavorite?.(property)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    onShare?.(property)
  }

  return (
    <Card
      className={cn(
        'group cursor-pointer overflow-hidden transition-shadow hover:shadow-lg',
        isComparing && 'ring-2 ring-primary',
        className
      )}
      onClick={handleClick}
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={property.images[0] || '/placeholder.jpg'}
          alt={property.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Source Badge */}
        <div className="absolute left-2 top-2">
          <Badge variant="secondary" className="bg-white/90 text-foreground">
            {sourceLabels[property.source] || property.source}
          </Badge>
        </div>

        {/* Price Category Badge */}
        {property.prediction?.priceCategory && (
          <div className="absolute right-2 top-2">
            <Badge variant={property.prediction.priceCategory}>
              {priceCategoryLabels[property.prediction.priceCategory]}
              {property.prediction.percentageDiff !== 0 && (
                <span className="ml-1">
                  ({property.prediction.percentageDiff > 0 ? '+' : ''}
                  {property.prediction.percentageDiff}%)
                </span>
              )}
            </Badge>
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="secondary"
            size="icon"
            className={cn('h-8 w-8 bg-white/90', isComparing && 'bg-primary text-primary-foreground')}
            onClick={handleCompare}
          >
            <GitCompare className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className={cn('h-8 w-8 bg-white/90', isFavorite && 'bg-red-500 text-white')}
            onClick={handleFavorite}
          >
            <Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-white/90"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Image Count */}
        {property.images.length > 1 && (
          <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
            1/{property.images.length}
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Price */}
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-xl font-bold text-foreground">{priceFormatted}</span>
          {property.expenses && (
            <span className="text-sm text-muted-foreground">
              + ${property.expenses.toLocaleString('es-AR')} exp.
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="mb-2 line-clamp-1 text-sm font-medium text-foreground">{property.title}</h3>

        {/* Location */}
        <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span className="line-clamp-1">
            {property.location.neighborhood}, {property.location.city}
          </span>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>{property.features.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{property.features.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="h-4 w-4" />
            <span>{property.features.totalArea} m²</span>
          </div>
          {property.features.parking > 0 && (
            <div className="flex items-center gap-1">
              <Car className="h-4 w-4" />
              <span>{property.features.parking}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
