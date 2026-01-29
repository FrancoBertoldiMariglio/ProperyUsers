'use client'

import * as React from 'react'
import { Home, DollarSign, MapPin, Settings, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { cn } from '../shared/utils'
import { Button } from './button'

type SearchType = 'buy' | 'rent' | null
type Currency = 'USD' | 'ARS'

interface OnboardingData {
  searchType: SearchType
  budget: {
    min: number | null
    max: number | null
    currency: Currency
  }
  neighborhoods: string[]
  minBedrooms: number | null
  minBathrooms: number | null
  amenities: string[]
}

interface OnboardingWizardProps {
  initialData?: Partial<OnboardingData>
  availableNeighborhoods: string[]
  availableAmenities: string[]
  onComplete: (data: OnboardingData) => void
  onSkip?: () => void
}

const STEPS = [
  { id: 'type', title: 'Tipo de búsqueda', icon: Home },
  { id: 'budget', title: 'Presupuesto', icon: DollarSign },
  { id: 'location', title: 'Ubicación', icon: MapPin },
  { id: 'features', title: 'Características', icon: Settings },
]

const BUDGET_PRESETS_USD = [
  { label: 'Hasta $100k', min: null, max: 100000 },
  { label: '$100k - $200k', min: 100000, max: 200000 },
  { label: '$200k - $350k', min: 200000, max: 350000 },
  { label: '$350k - $500k', min: 350000, max: 500000 },
  { label: 'Más de $500k', min: 500000, max: null },
]

const BUDGET_PRESETS_ARS = [
  { label: 'Hasta $500k', min: null, max: 500000 },
  { label: '$500k - $800k', min: 500000, max: 800000 },
  { label: '$800k - $1.2M', min: 800000, max: 1200000 },
  { label: '$1.2M - $2M', min: 1200000, max: 2000000 },
  { label: 'Más de $2M', min: 2000000, max: null },
]

export function OnboardingWizard({
  initialData,
  availableNeighborhoods,
  availableAmenities,
  onComplete,
  onSkip,
}: OnboardingWizardProps): JSX.Element {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [data, setData] = React.useState<OnboardingData>({
    searchType: initialData?.searchType ?? null,
    budget: initialData?.budget ?? { min: null, max: null, currency: 'USD' },
    neighborhoods: initialData?.neighborhoods ?? [],
    minBedrooms: initialData?.minBedrooms ?? null,
    minBathrooms: initialData?.minBathrooms ?? null,
    amenities: initialData?.amenities ?? [],
  })

  const canProceed = React.useMemo(() => {
    switch (currentStep) {
      case 0:
        return data.searchType !== null
      case 1:
        return data.budget.min !== null || data.budget.max !== null
      case 2:
        return data.neighborhoods.length > 0
      case 3:
        return true // Features are optional
      default:
        return false
    }
  }, [currentStep, data])

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete(data)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const toggleNeighborhood = (neighborhood: string) => {
    setData((prev) => ({
      ...prev,
      neighborhoods: prev.neighborhoods.includes(neighborhood)
        ? prev.neighborhoods.filter((n) => n !== neighborhood)
        : [...prev.neighborhoods, neighborhood],
    }))
  }

  const toggleAmenity = (amenity: string) => {
    setData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  const selectBudgetPreset = (preset: { min: number | null; max: number | null }) => {
    setData((prev) => ({
      ...prev,
      budget: { ...prev.budget, min: preset.min, max: preset.max },
    }))
  }

  const budgetPresets = data.budget.currency === 'USD' ? BUDGET_PRESETS_USD : BUDGET_PRESETS_ARS

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-background p-6 shadow-xl">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStep
            const isCompleted = index < currentStep

            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
                      isCompleted
                        ? 'bg-primary text-primary-foreground'
                        : isActive
                          ? 'bg-primary/20 text-primary'
                          : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <span
                    className={cn(
                      'mt-2 text-xs font-medium',
                      isActive ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      'h-0.5 flex-1 mx-2',
                      index < currentStep ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[300px]">
        {/* Step 1: Search Type */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">¿Qué estás buscando?</h2>
              <p className="mt-2 text-muted-foreground">
                Elegí el tipo de operación para personalizar tu experiencia
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setData((prev) => ({ ...prev, searchType: 'buy' }))}
                className={cn(
                  'flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all',
                  data.searchType === 'buy'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Home className="h-8 w-8 text-primary" />
                </div>
                <span className="text-lg font-semibold">Comprar</span>
                <span className="text-sm text-muted-foreground">
                  Busco mi próxima propiedad
                </span>
              </button>

              <button
                onClick={() => setData((prev) => ({ ...prev, searchType: 'rent' }))}
                className={cn(
                  'flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all',
                  data.searchType === 'rent'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
                <span className="text-lg font-semibold">Alquilar</span>
                <span className="text-sm text-muted-foreground">
                  Busco para alquilar
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Budget */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">¿Cuál es tu presupuesto?</h2>
              <p className="mt-2 text-muted-foreground">
                Seleccioná un rango aproximado
              </p>
            </div>

            {/* Currency Toggle */}
            <div className="flex justify-center gap-2">
              <button
                onClick={() =>
                  setData((prev) => ({
                    ...prev,
                    budget: { ...prev.budget, currency: 'USD', min: null, max: null },
                  }))
                }
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  data.budget.currency === 'USD'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                USD
              </button>
              <button
                onClick={() =>
                  setData((prev) => ({
                    ...prev,
                    budget: { ...prev.budget, currency: 'ARS', min: null, max: null },
                  }))
                }
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  data.budget.currency === 'ARS'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                ARS
              </button>
            </div>

            {/* Budget Presets */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {budgetPresets.map((preset) => {
                const isSelected =
                  data.budget.min === preset.min && data.budget.max === preset.max
                return (
                  <button
                    key={preset.label}
                    onClick={() => selectBudgetPreset(preset)}
                    className={cn(
                      'rounded-lg border-2 px-4 py-3 text-left transition-all',
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <span className="font-medium">{preset.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 3: Location */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">¿Dónde te gustaría vivir?</h2>
              <p className="mt-2 text-muted-foreground">
                Seleccioná uno o más barrios de interés
              </p>
            </div>

            <div className="max-h-64 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {availableNeighborhoods.map((neighborhood) => {
                  const isSelected = data.neighborhoods.includes(neighborhood)
                  return (
                    <button
                      key={neighborhood}
                      onClick={() => toggleNeighborhood(neighborhood)}
                      className={cn(
                        'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      )}
                    >
                      {neighborhood}
                    </button>
                  )
                })}
              </div>
            </div>

            {data.neighborhoods.length > 0 && (
              <p className="text-center text-sm text-muted-foreground">
                {data.neighborhoods.length} barrio{data.neighborhoods.length !== 1 && 's'}{' '}
                seleccionado{data.neighborhoods.length !== 1 && 's'}
              </p>
            )}
          </div>
        )}

        {/* Step 4: Features */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Características preferidas</h2>
              <p className="mt-2 text-muted-foreground">
                Opcionalmente, indicá tus preferencias mínimas
              </p>
            </div>

            {/* Bedrooms & Bathrooms */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="mb-2 block text-sm font-medium">Habitaciones mínimas</label>
                <div className="flex gap-2">
                  {[null, 1, 2, 3, 4].map((num) => (
                    <button
                      key={num ?? 'any'}
                      onClick={() => setData((prev) => ({ ...prev, minBedrooms: num }))}
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-lg border-2 text-sm font-medium transition-colors',
                        data.minBedrooms === num
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      {num ?? '-'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Baños mínimos</label>
                <div className="flex gap-2">
                  {[null, 1, 2, 3].map((num) => (
                    <button
                      key={num ?? 'any'}
                      onClick={() => setData((prev) => ({ ...prev, minBathrooms: num }))}
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-lg border-2 text-sm font-medium transition-colors',
                        data.minBathrooms === num
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      {num ?? '-'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="mb-2 block text-sm font-medium">Amenities deseados</label>
              <div className="flex flex-wrap gap-2">
                {availableAmenities.map((amenity) => {
                  const isSelected = data.amenities.includes(amenity)
                  return (
                    <button
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className={cn(
                        'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      )}
                    >
                      {amenity}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
        <div>
          {currentStep > 0 ? (
            <Button variant="ghost" onClick={handleBack}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Anterior
            </Button>
          ) : onSkip ? (
            <Button variant="ghost" onClick={onSkip}>
              Omitir
            </Button>
          ) : (
            <div />
          )}
        </div>

        <Button onClick={handleNext} disabled={!canProceed}>
          {currentStep === STEPS.length - 1 ? (
            <>
              Finalizar
              <Check className="ml-1 h-4 w-4" />
            </>
          ) : (
            <>
              Siguiente
              <ChevronRight className="ml-1 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
