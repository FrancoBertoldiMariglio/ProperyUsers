'use client'

import type { JSX } from 'react'
import type { Property } from '@propery/api-client'
import { Check, X, Minus } from 'lucide-react'
import { cn } from '@propery/ui/shared'

interface ComparisonTableProps {
  properties: Property[]
}

type HighlightType = 'best' | 'worst' | 'neutral'

interface ComparisonRow {
  label: string
  category: string
  getValue: (p: Property) => string | number | boolean | null | undefined
  format?: (value: string | number | boolean | null | undefined) => string
  highlight?: 'higher-better' | 'lower-better' | 'none'
}

const comparisonRows: ComparisonRow[] = [
  // Básico
  {
    label: 'Precio',
    category: 'Básico',
    getValue: (p) => p.price,
    format: (v) =>
      v != null
        ? new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
          }).format(v as number)
        : '-',
    highlight: 'lower-better',
  },
  {
    label: 'Precio/m²',
    category: 'Básico',
    getValue: (p) =>
      p.features.coveredArea > 0
        ? Math.round(p.price / p.features.coveredArea)
        : null,
    format: (v) =>
      v != null
        ? new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
          }).format(v as number) + '/m²'
        : '-',
    highlight: 'lower-better',
  },
  {
    label: 'Expensas',
    category: 'Básico',
    getValue: (p) => p.expenses,
    format: (v) =>
      v != null
        ? new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
          }).format(v as number)
        : 'Sin expensas',
    highlight: 'lower-better',
  },
  {
    label: 'Tipo',
    category: 'Básico',
    getValue: (p) => p.propertyType,
    format: (v) => {
      const types: Record<string, string> = {
        apartment: 'Departamento',
        house: 'Casa',
        ph: 'PH',
        land: 'Terreno',
        office: 'Oficina',
        local: 'Local',
      }
      return types[v as string] || String(v)
    },
    highlight: 'none',
  },
  // Características
  {
    label: 'Superficie total',
    category: 'Características',
    getValue: (p) => p.features.totalArea,
    format: (v) => (v != null ? `${v} m²` : '-'),
    highlight: 'higher-better',
  },
  {
    label: 'Superficie cubierta',
    category: 'Características',
    getValue: (p) => p.features.coveredArea,
    format: (v) => (v != null ? `${v} m²` : '-'),
    highlight: 'higher-better',
  },
  {
    label: 'Ambientes',
    category: 'Características',
    getValue: (p) => p.features.bedrooms + 1,
    format: (v) => (v != null ? String(v) : '-'),
    highlight: 'higher-better',
  },
  {
    label: 'Dormitorios',
    category: 'Características',
    getValue: (p) => p.features.bedrooms,
    format: (v) => (v != null ? String(v) : '-'),
    highlight: 'higher-better',
  },
  {
    label: 'Baños',
    category: 'Características',
    getValue: (p) => p.features.bathrooms,
    format: (v) => (v != null ? String(v) : '-'),
    highlight: 'higher-better',
  },
  {
    label: 'Cocheras',
    category: 'Características',
    getValue: (p) => p.features.parking,
    format: (v) => (v != null ? String(v) : 'Sin cochera'),
    highlight: 'higher-better',
  },
  {
    label: 'Antigüedad',
    category: 'Características',
    getValue: (p) => p.features.age,
    format: (v) =>
      v === null || v === undefined ? 'N/D' : v === 0 ? 'A estrenar' : `${v} años`,
    highlight: 'lower-better',
  },
  {
    label: 'Piso',
    category: 'Características',
    getValue: (p) => p.features.floor,
    format: (v) => (v != null ? `Piso ${v}` : '-'),
    highlight: 'none',
  },
  {
    label: 'Orientación',
    category: 'Características',
    getValue: (p) => p.features.orientation,
    format: (v) => (v ? String(v) : '-'),
    highlight: 'none',
  },
  // Amenities
  {
    label: 'Pileta',
    category: 'Amenities',
    getValue: (p) => p.amenities.pool,
    highlight: 'higher-better',
  },
  {
    label: 'Gimnasio',
    category: 'Amenities',
    getValue: (p) => p.amenities.gym,
    highlight: 'higher-better',
  },
  {
    label: 'Lavadero',
    category: 'Amenities',
    getValue: (p) => p.amenities.laundry,
    highlight: 'higher-better',
  },
  {
    label: 'Rooftop',
    category: 'Amenities',
    getValue: (p) => p.amenities.rooftop,
    highlight: 'higher-better',
  },
  {
    label: 'Seguridad 24hs',
    category: 'Amenities',
    getValue: (p) => p.amenities.security,
    highlight: 'higher-better',
  },
  {
    label: 'Balcón',
    category: 'Amenities',
    getValue: (p) => p.amenities.balcony,
    highlight: 'higher-better',
  },
  {
    label: 'Terraza',
    category: 'Amenities',
    getValue: (p) => p.amenities.terrace,
    highlight: 'higher-better',
  },
  {
    label: 'Jardín',
    category: 'Amenities',
    getValue: (p) => p.amenities.garden,
    highlight: 'higher-better',
  },
  {
    label: 'Baulera',
    category: 'Amenities',
    getValue: (p) => p.amenities.storage,
    highlight: 'higher-better',
  },
  {
    label: 'Acepta mascotas',
    category: 'Amenities',
    getValue: (p) => p.amenities.petFriendly,
    highlight: 'higher-better',
  },
  // Ubicación
  {
    label: 'Barrio',
    category: 'Ubicación',
    getValue: (p) => p.location.neighborhood,
    highlight: 'none',
  },
  {
    label: 'Dirección',
    category: 'Ubicación',
    getValue: (p) => p.location.address,
    highlight: 'none',
  },
  // Predicción
  {
    label: 'Categoría de precio',
    category: 'Análisis ML',
    getValue: (p) => p.prediction?.priceCategory,
    format: (v) => {
      const labels: Record<string, string> = {
        opportunity: '🟢 Oportunidad',
        fair: '🔵 Precio justo',
        expensive: '🟡 Elevado',
        overpriced: '🔴 Sobrevalorado',
      }
      return v ? labels[v as string] || String(v) : '-'
    },
    highlight: 'none',
  },
  {
    label: 'Diferencia vs estimado',
    category: 'Análisis ML',
    getValue: (p) => p.prediction?.percentageDiff,
    format: (v) => (v != null ? `${(v as number) > 0 ? '+' : ''}${v}%` : '-'),
    highlight: 'lower-better',
  },
  {
    label: 'Confianza predicción',
    category: 'Análisis ML',
    getValue: (p) => p.prediction?.confidence,
    format: (v) => (v != null ? `${Math.round((v as number) * 100)}%` : '-'),
    highlight: 'higher-better',
  },
]

function getHighlight(
  values: (string | number | boolean | null | undefined)[],
  index: number,
  highlight?: 'higher-better' | 'lower-better' | 'none'
): HighlightType {
  if (highlight === 'none') return 'neutral'

  const numericValues = values
    .map((v, i) => ({ value: typeof v === 'number' ? v : null, index: i }))
    .filter((item) => item.value !== null)

  if (numericValues.length < 2) return 'neutral'

  const currentValue = values[index]
  if (typeof currentValue !== 'number') return 'neutral'

  const max = Math.max(...numericValues.map((v) => v.value as number))
  const min = Math.min(...numericValues.map((v) => v.value as number))

  if (max === min) return 'neutral'

  if (highlight === 'higher-better') {
    if (currentValue === max) return 'best'
    if (currentValue === min) return 'worst'
  } else if (highlight === 'lower-better') {
    if (currentValue === min) return 'best'
    if (currentValue === max) return 'worst'
  }

  return 'neutral'
}

function BooleanValue({ value }: { value: boolean }): JSX.Element {
  if (value) {
    return <Check className="mx-auto h-5 w-5 text-green-600" />
  }
  return <X className="mx-auto h-5 w-5 text-muted-foreground" />
}

export function ComparisonTable({ properties }: ComparisonTableProps): JSX.Element {
  const categories = [...new Set(comparisonRows.map((r) => r.category))]

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="p-3 text-left font-medium">Característica</th>
            {properties.map((p) => (
              <th key={p.id} className="p-3 text-center font-medium">
                {p.location.neighborhood}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <>
              {/* Category header */}
              <tr key={`cat-${category}`} className="bg-muted/30">
                <td
                  colSpan={properties.length + 1}
                  className="p-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  {category}
                </td>
              </tr>
              {/* Category rows */}
              {comparisonRows
                .filter((r) => r.category === category)
                .map((row) => {
                  const values = properties.map((p) => row.getValue(p))
                  return (
                    <tr key={row.label} className="border-b last:border-0">
                      <td className="p-3 font-medium">{row.label}</td>
                      {properties.map((p, index) => {
                        const value = values[index]
                        const highlight = getHighlight(values, index, row.highlight)

                        return (
                          <td
                            key={p.id}
                            className={cn(
                              'p-3 text-center',
                              highlight === 'best' && 'bg-green-50 text-green-700',
                              highlight === 'worst' && 'bg-red-50 text-red-700'
                            )}
                          >
                            {typeof value === 'boolean' ? (
                              <BooleanValue value={value} />
                            ) : row.format ? (
                              row.format(value)
                            ) : value != null ? (
                              String(value)
                            ) : (
                              <Minus className="mx-auto h-4 w-4 text-muted-foreground" />
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
            </>
          ))}
        </tbody>
      </table>
    </div>
  )
}
