'use client'

import * as React from 'react'
import { Heart, Trash2, StickyNote, X, Calendar } from 'lucide-react'
import { cn } from '../shared/utils'
import { Button } from './button'

interface FavoriteItem {
  propertyId: string
  addedAt: string
  notes: string
  property?: {
    title: string
    price: number
    neighborhood: string
    imageUrl?: string
  }
}

interface FavoritesListProps {
  favorites: FavoriteItem[]
  onRemove: (propertyId: string) => void
  onUpdateNotes: (propertyId: string, notes: string) => void
  onViewProperty?: (propertyId: string) => void
  emptyMessage?: string
  className?: string
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function FavoriteCard({
  favorite,
  onRemove,
  onUpdateNotes,
  onViewProperty,
}: {
  favorite: FavoriteItem
  onRemove: () => void
  onUpdateNotes: (notes: string) => void
  onViewProperty?: () => void
}): JSX.Element {
  const [isEditingNotes, setIsEditingNotes] = React.useState(false)
  const [notesValue, setNotesValue] = React.useState(favorite.notes)

  const handleSaveNotes = () => {
    onUpdateNotes(notesValue)
    setIsEditingNotes(false)
  }

  const handleCancelNotes = () => {
    setNotesValue(favorite.notes)
    setIsEditingNotes(false)
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md">
      {/* Image */}
      <div className="relative aspect-[16/10] bg-muted">
        {favorite.property?.imageUrl ? (
          <img
            src={favorite.property.imageUrl}
            alt={favorite.property.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Heart className="h-8 w-8" />
          </div>
        )}

        {/* Remove button */}
        <button
          onClick={onRemove}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-destructive opacity-0 transition-opacity hover:bg-background group-hover:opacity-100"
          aria-label="Eliminar de favoritos"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <div className="flex-1">
            {favorite.property ? (
              <>
                <h3 className="line-clamp-1 font-semibold">{favorite.property.title}</h3>
                <p className="text-sm text-muted-foreground">{favorite.property.neighborhood}</p>
                <p className="mt-1 font-bold text-primary">
                  US$ {favorite.property.price.toLocaleString()}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">ID: {favorite.propertyId}</p>
            )}
          </div>
        </div>

        {/* Date added */}
        <div className="mb-3 flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          Agregado el {formatDate(favorite.addedAt)}
        </div>

        {/* Notes section */}
        {isEditingNotes ? (
          <div className="space-y-2">
            <textarea
              value={notesValue}
              onChange={(e) => setNotesValue(e.target.value)}
              placeholder="Agregar notas..."
              className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={handleCancelNotes}>
                Cancelar
              </Button>
              <Button size="sm" onClick={handleSaveNotes}>
                Guardar
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {favorite.notes ? (
              <div
                onClick={() => setIsEditingNotes(true)}
                className="cursor-pointer rounded-lg bg-muted/50 p-2 text-sm text-muted-foreground hover:bg-muted"
              >
                <StickyNote className="mb-1 inline h-3 w-3" /> {favorite.notes}
              </div>
            ) : (
              <button
                onClick={() => setIsEditingNotes(true)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <StickyNote className="h-3 w-3" />
                Agregar nota
              </button>
            )}
          </div>
        )}

        {/* View property button */}
        {onViewProperty && (
          <Button
            variant="outline"
            size="sm"
            className="mt-3 w-full"
            onClick={onViewProperty}
          >
            Ver propiedad
          </Button>
        )}
      </div>
    </div>
  )
}

export function FavoritesList({
  favorites,
  onRemove,
  onUpdateNotes,
  onViewProperty,
  emptyMessage = 'No tenés propiedades favoritas',
  className,
}: FavoritesListProps): JSX.Element {
  if (favorites.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
        <Heart className="mb-4 h-16 w-16 text-muted-foreground/30" />
        <p className="text-lg font-medium text-muted-foreground">{emptyMessage}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Marcá propiedades con el corazón para guardarlas aquí
        </p>
      </div>
    )
  }

  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {favorites.map((favorite) => (
        <FavoriteCard
          key={favorite.propertyId}
          favorite={favorite}
          onRemove={() => onRemove(favorite.propertyId)}
          onUpdateNotes={(notes) => onUpdateNotes(favorite.propertyId, notes)}
          onViewProperty={onViewProperty ? () => onViewProperty(favorite.propertyId) : undefined}
        />
      ))}
    </div>
  )
}
