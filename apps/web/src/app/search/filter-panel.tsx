'use client'

import { useFilterStore } from '@propery/core'
import { Button, Badge, RangeSlider } from '@propery/ui/web'
import { X, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react'
import type { PropertyType, OperationType } from '@propery/api-client'
import { useState } from 'react'

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

const amenitiesList = [
  { id: 'pool', label: 'Pileta' },
  { id: 'gym', label: 'Gimnasio' },
  { id: 'laundry', label: 'Lavadero' },
  { id: 'rooftop', label: 'Rooftop' },
  { id: 'security', label: 'Seguridad 24hs' },
  { id: 'balcony', label: 'Balcon' },
  { id: 'terrace', label: 'Terraza' },
  { id: 'garden', label: 'Jardin' },
  { id: 'storage', label: 'Baulera' },
  { id: 'petFriendly', label: 'Acepta mascotas' },
]

const ageOptions = [
  { value: 'new', label: 'A estrenar' },
  { value: 'under5', label: 'Hasta 5 anos' },
  { value: 'under10', label: 'Hasta 10 anos' },
  { value: 'under20', label: 'Hasta 20 anos' },
  { value: 'over20', label: 'Mas de 20 anos' },
]

const bedroomOptions = [1, 2, 3, 4]
const bathroomOptions = [1, 2, 3]
const parkingOptions = [0, 1, 2]

export function FilterPanel({ onClose, className }: FilterPanelProps) {
  const { filters, setFilters, resetFilters, getActiveFiltersCount } = useFilterStore()
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    operation: true,
    type: true,
    price: true,
    area: false,
    rooms: true,
    location: true,
    amenities: false,
    age: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

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

  const toggleAmenity = (amenity: string) => {
    const current = filters.amenities
    const newAmenities = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity]
    setFilters({ amenities: newAmenities })
  }

  const activeFiltersCount = getActiveFiltersCount()

  const formatPrice = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`
    return `$${value}`
  }

  const formatArea = (value: number) => `${value} m²`

  const SectionHeader = ({
    title,
    section,
    count,
  }: {
    title: string
    section: string
    count?: number
  }) => (
    <button
      onClick={() => toggleSection(section)}
      className="flex w-full items-center justify-between py-2"
    >
      <span className="flex items-center gap-2 text-sm font-medium">
        {title}
        {count !== undefined && count > 0 && (
          <Badge variant="secondary" className="h-5 min-w-5 px-1.5">
            {count}
          </Badge>
        )}
      </span>
      {expandedSections[section] ? (
        <ChevronUp className="h-4 w-4 text-muted-foreground" />
      ) : (
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      )}
    </button>
  )

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
      <div className="flex-1 overflow-auto p-4 space-y-1">
        {/* Operation Type */}
        <div className="border-b pb-4">
          <SectionHeader title="Operacion" section="operation" />
          {expandedSections.operation && (
            <div className="flex gap-2 pt-2">
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
          )}
        </div>

        {/* Property Type */}
        <div className="border-b pb-4">
          <SectionHeader
            title="Tipo de propiedad"
            section="type"
            count={filters.propertyTypes.length}
          />
          {expandedSections.type && (
            <div className="flex flex-wrap gap-2 pt-2">
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
          )}
        </div>

        {/* Price Range */}
        <div className="border-b pb-4">
          <SectionHeader
            title="Precio (USD)"
            section="price"
            count={filters.priceMin || filters.priceMax ? 1 : 0}
          />
          {expandedSections.price && (
            <div className="pt-2">
              <RangeSlider
                min={0}
                max={1000000}
                step={10000}
                value={[filters.priceMin || 0, filters.priceMax || 1000000]}
                onChange={([min, max]) =>
                  setFilters({
                    priceMin: min > 0 ? min : undefined,
                    priceMax: max < 1000000 ? max : undefined,
                  })
                }
                formatValue={formatPrice}
              />
            </div>
          )}
        </div>

        {/* Area Range */}
        <div className="border-b pb-4">
          <SectionHeader
            title="Superficie"
            section="area"
            count={filters.areaMin || filters.areaMax ? 1 : 0}
          />
          {expandedSections.area && (
            <div className="pt-2">
              <RangeSlider
                min={0}
                max={500}
                step={10}
                value={[filters.areaMin || 0, filters.areaMax || 500]}
                onChange={([min, max]) =>
                  setFilters({
                    areaMin: min > 0 ? min : undefined,
                    areaMax: max < 500 ? max : undefined,
                  })
                }
                formatValue={formatArea}
              />
            </div>
          )}
        </div>

        {/* Rooms */}
        <div className="border-b pb-4">
          <SectionHeader
            title="Habitaciones y banos"
            section="rooms"
            count={(filters.bedrooms ? 1 : 0) + (filters.bathrooms ? 1 : 0) + (filters.parking !== undefined ? 1 : 0)}
          />
          {expandedSections.rooms && (
            <div className="space-y-4 pt-2">
              {/* Bedrooms */}
              <div>
                <label className="mb-2 block text-xs text-muted-foreground">Habitaciones</label>
                <div className="flex gap-2">
                  {bedroomOptions.map((num) => (
                    <button
                      key={num}
                      onClick={() =>
                        setFilters({ bedrooms: filters.bedrooms === num ? undefined : num })
                      }
                      className={`h-9 w-9 rounded-lg border text-sm transition-colors ${
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
                <label className="mb-2 block text-xs text-muted-foreground">Banos</label>
                <div className="flex gap-2">
                  {bathroomOptions.map((num) => (
                    <button
                      key={num}
                      onClick={() =>
                        setFilters({ bathrooms: filters.bathrooms === num ? undefined : num })
                      }
                      className={`h-9 w-9 rounded-lg border text-sm transition-colors ${
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

              {/* Parking */}
              <div>
                <label className="mb-2 block text-xs text-muted-foreground">Cochera</label>
                <div className="flex gap-2">
                  {parkingOptions.map((num) => (
                    <button
                      key={num}
                      onClick={() =>
                        setFilters({ parking: filters.parking === num ? undefined : num })
                      }
                      className={`h-9 rounded-lg border px-3 text-sm transition-colors ${
                        filters.parking === num
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'hover:border-primary'
                      }`}
                    >
                      {num === 0 ? 'Sin' : `${num}+`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Age */}
        <div className="border-b pb-4">
          <SectionHeader title="Antiguedad" section="age" count={filters.age ? 1 : 0} />
          {expandedSections.age && (
            <div className="flex flex-wrap gap-2 pt-2">
              {ageOptions.map((age) => (
                <button
                  key={age.value}
                  onClick={() =>
                    setFilters({
                      age: filters.age === age.value ? undefined : (age.value as PropertyFilters['age']),
                    })
                  }
                  className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                    filters.age === age.value
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'hover:border-primary'
                  }`}
                >
                  {age.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Neighborhoods */}
        <div className="border-b pb-4">
          <SectionHeader
            title="Barrios"
            section="location"
            count={filters.neighborhoods.length}
          />
          {expandedSections.location && (
            <div className="flex flex-wrap gap-2 pt-2">
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
          )}
        </div>

        {/* Amenities */}
        <div className="border-b pb-4">
          <SectionHeader
            title="Amenities"
            section="amenities"
            count={filters.amenities.length}
          />
          {expandedSections.amenities && (
            <div className="flex flex-wrap gap-2 pt-2">
              {amenitiesList.map((amenity) => (
                <button
                  key={amenity.id}
                  onClick={() => toggleAmenity(amenity.id)}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                    filters.amenities.includes(amenity.id)
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'hover:border-primary'
                  }`}
                >
                  {amenity.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Only Opportunities */}
        <div className="pt-2">
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

type PropertyFilters = {
  age?: 'new' | 'under5' | 'under10' | 'under20' | 'over20'
}
