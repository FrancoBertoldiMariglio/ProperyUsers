'use client'

import type { Property } from '@propery/api-client'
import { formatPrice, formatArea } from '@propery/core'
import { Bed, Bath, Maximize, Heart, GitCompare } from 'lucide-react'

interface PropertyPopupProps {
  property: Property
  position: { x: number; y: number }
  isComparing?: boolean
  isFavorite?: boolean
}

export function PropertyPopup({
  property,
  position,
  isComparing,
  isFavorite,
}: PropertyPopupProps) {
  return (
    <div
      className="pointer-events-none absolute z-50"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%) translateY(-16px)',
      }}
    >
      <div className="w-64 rounded-lg border bg-background p-3 shadow-xl">
        {/* Image */}
        {property.images[0] && (
          <div className="relative mb-2 aspect-video overflow-hidden rounded-md">
            <img
              src={property.images[0]}
              alt={property.title}
              className="h-full w-full object-cover"
            />
            {/* Status badges */}
            <div className="absolute right-2 top-2 flex gap-1">
              {isComparing && (
                <span className="rounded bg-blue-500 p-1">
                  <GitCompare className="h-3 w-3 text-white" />
                </span>
              )}
              {isFavorite && (
                <span className="rounded bg-red-500 p-1">
                  <Heart className="h-3 w-3 fill-white text-white" />
                </span>
              )}
            </div>
          </div>
        )}

        {/* Price */}
        <p className="text-lg font-bold">
          {formatPrice(property.price, property.currency)}
        </p>

        {/* Expenses */}
        {property.expenses && (
          <p className="text-xs text-muted-foreground">
            Expensas: {formatPrice(property.expenses, 'ARS')}
          </p>
        )}

        {/* Features */}
        <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Bed className="h-3 w-3" />
            {property.features.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-3 w-3" />
            {property.features.bathrooms}
          </span>
          <span className="flex items-center gap-1">
            <Maximize className="h-3 w-3" />
            {formatArea(property.features.totalArea)}
          </span>
        </div>

        {/* Location */}
        <p className="mt-2 truncate text-xs text-muted-foreground">
          {property.location.neighborhood} - {property.location.address}
        </p>

        {/* Price prediction badge */}
        {property.prediction && (
          <div className="mt-2">
            <span
              className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                property.prediction.priceCategory === 'opportunity'
                  ? 'bg-green-100 text-green-700'
                  : property.prediction.priceCategory === 'fair'
                    ? 'bg-blue-100 text-blue-700'
                    : property.prediction.priceCategory === 'expensive'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-red-100 text-red-700'
              }`}
            >
              {property.prediction.priceCategory === 'opportunity'
                ? 'Oportunidad'
                : property.prediction.priceCategory === 'fair'
                  ? 'Precio justo'
                  : property.prediction.priceCategory === 'expensive'
                    ? 'Precio elevado'
                    : 'Sobrevalorado'}
              {' '}
              ({property.prediction.percentageDiff > 0 ? '+' : ''}
              {property.prediction.percentageDiff.toFixed(0)}%)
            </span>
          </div>
        )}

        {/* Arrow */}
        <div className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-background" />
      </div>
    </div>
  )
}
