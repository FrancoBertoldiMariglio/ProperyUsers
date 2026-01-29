'use client'

import { useFilterStore } from '@propery/core'
import { Button, Input, Badge } from '@propery/ui/web'
import { X, RotateCcw } from 'lucide-react'
import type { PropertyType, OperationType } from '@propery/api-client'

interface FilterPanelProps {
  onClose: () => void
  className?: string
}

const propertyTypes: { value: PropertyType; label: string }[] = [
  { value: 'apartment', label: 'Departamento' },
  { value: 'house', label: 'Casa' },
  { value: 'ph', label: 'PH' },
  { value: 'land', label: 'Terreno' },
]

const operationTypes: { value: OperationType; label: string }[] = [
  { value: 'sale', label: 'Venta' },
  { value: 'rent', label: 'Alquiler' },
]

const neighborhoods = [
  'Palermo',
  'Recoleta',
  'Belgrano',
  'Nunez',
  'Caballito',
  'Villa Urquiza',
  'San Telmo',
  'Puerto Madero',
  'Almagro',
  'Colegiales',
]

const bedroomOptions = [1, 2, 3, 4]
const bathroomOptions = [1, 2, 3]

export function FilterPanel({ onClose, className }: FilterPanelProps) {
  const { filters, setFilters, resetFilters } = useFilterStore()

  const togglePropertyType = (type: PropertyType) => {
    const current = filters.propertyTypes
    const newTypes = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type]
    setFilters({ propertyTypes: newTypes })
  }

  const toggleNeighborhood = (neighborhood: string) => {
    const current = filters.neighborhoods
    const newNeighborhoods = current.includes(neighborhood)
      ? current.filter((n) => n !== neighborhood)
      : [...current, neighborhood]
    setFilters({ neighborhoods: newNeighborhoods })
  }

  const activeFiltersCount =
    (filters.operationType ? 1 : 0) +
    filters.propertyTypes.length +
    (filters.priceMin || filters.priceMax ? 1 : 0) +
    (filters.areaMin || filters.areaMax ? 1 : 0) +
    (filters.bedrooms ? 1 : 0) +
    (filters.bathrooms ? 1 : 0) +
    filters.neighborhoods.length +
    (filters.onlyOpportunities ? 1 : 0)

  return (
    <div className={`flex flex-col bg-background ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold">Filtros</h2>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">{activeFiltersCount}</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <RotateCcw className="mr-1 h-3 w-3" />
            Limpiar
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Operation Type */}
        <div>
          <label className="mb-2 block text-sm font-medium">Operacion</label>
          <div className="flex gap-2">
            {operationTypes.map((op) => (
              <button
                key={op.value}
                onClick={() =>
                  setFilters({
                    operationType:
                      filters.operationType === op.value ? undefined : op.value,
                  })
                }
                className={`flex-1 rounded-lg border px-3 py-2 text-sm transition-colors ${
                  filters.operationType === op.value
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'hover:border-primary'
                }`}
              >
                {op.label}
              </button>
            ))}
          </div>
        </div>

        {/* Property Type */}
        <div>
          <label className="mb-2 block text-sm font-medium">Tipo de propiedad</label>
          <div className="flex flex-wrap gap-2">
            {propertyTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => togglePropertyType(type.value)}
                className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                  filters.propertyTypes.includes(type.value)
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'hover:border-primary'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="mb-2 block text-sm font-medium">Precio (USD)</label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.priceMin || ''}
              onChange={(e) =>
                setFilters({ priceMin: e.target.value ? Number(e.target.value) : undefined })
              }
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.priceMax || ''}
              onChange={(e) =>
                setFilters({ priceMax: e.target.value ? Number(e.target.value) : undefined })
              }
            />
          </div>
        </div>

        {/* Area Range */}
        <div>
          <label className="mb-2 block text-sm font-medium">Superficie (m²)</label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.areaMin || ''}
              onChange={(e) =>
                setFilters({ areaMin: e.target.value ? Number(e.target.value) : undefined })
              }
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.areaMax || ''}
              onChange={(e) =>
                setFilters({ areaMax: e.target.value ? Number(e.target.value) : undefined })
              }
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="mb-2 block text-sm font-medium">Habitaciones</label>
          <div className="flex gap-2">
            {bedroomOptions.map((num) => (
              <button
                key={num}
                onClick={() =>
                  setFilters({ bedrooms: filters.bedrooms === num ? undefined : num })
                }
                className={`h-10 w-10 rounded-lg border text-sm transition-colors ${
                  filters.bedrooms === num
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'hover:border-primary'
                }`}
              >
                {num}+
              </button>
            ))}
          </div>
        </div>

        {/* Bathrooms */}
        <div>
          <label className="mb-2 block text-sm font-medium">Banos</label>
          <div className="flex gap-2">
            {bathroomOptions.map((num) => (
              <button
                key={num}
                onClick={() =>
                  setFilters({ bathrooms: filters.bathrooms === num ? undefined : num })
                }
                className={`h-10 w-10 rounded-lg border text-sm transition-colors ${
                  filters.bathrooms === num
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'hover:border-primary'
                }`}
              >
                {num}+
              </button>
            ))}
          </div>
        </div>

        {/* Neighborhoods */}
        <div>
          <label className="mb-2 block text-sm font-medium">Barrios</label>
          <div className="flex flex-wrap gap-2">
            {neighborhoods.map((neighborhood) => (
              <button
                key={neighborhood}
                onClick={() => toggleNeighborhood(neighborhood)}
                className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                  filters.neighborhoods.includes(neighborhood)
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'hover:border-primary'
                }`}
              >
                {neighborhood}
              </button>
            ))}
          </div>
        </div>

        {/* Only Opportunities */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.onlyOpportunities}
              onChange={(e) => setFilters({ onlyOpportunities: e.target.checked })}
              className="h-4 w-4 rounded border-input"
            />
            <span className="text-sm font-medium">Solo oportunidades</span>
          </label>
          <p className="mt-1 text-xs text-muted-foreground">
            Mostrar solo propiedades con precio por debajo del mercado
          </p>
        </div>
      </div>
    </div>
  )
}
