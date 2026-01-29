'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingWizard } from '@propery/ui/web'
import { usePreferencesStore } from '@propery/core'
import { mocks } from '@propery/api-client'

const { mockNeighborhoods } = mocks

const AVAILABLE_AMENITIES = [
  'Pileta',
  'Gimnasio',
  'SUM',
  'Parrilla',
  'Cochera',
  'Balcón',
  'Terraza',
  'Laundry',
  'Seguridad 24hs',
  'Solarium',
  'Sauna',
  'Quincho',
]

export default function OnboardingPage(): JSX.Element {
  const router = useRouter()
  const { preferences, setPreferences, completeOnboarding } = usePreferencesStore()

  // Redirect if already completed onboarding
  React.useEffect(() => {
    if (preferences.completedOnboarding) {
      router.replace('/search')
    }
  }, [preferences.completedOnboarding, router])

  const neighborhoodNames = (mockNeighborhoods || []).map((n) => n.name)

  const handleComplete = (data: {
    searchType: 'buy' | 'rent' | null
    budget: { min: number | null; max: number | null; currency: 'USD' | 'ARS' }
    neighborhoods: string[]
    minBedrooms: number | null
    minBathrooms: number | null
    amenities: string[]
  }) => {
    setPreferences({
      searchType: data.searchType,
      budget: data.budget,
      preferredNeighborhoods: data.neighborhoods,
      minBedrooms: data.minBedrooms,
      minBathrooms: data.minBathrooms,
      requiredAmenities: data.amenities,
    })
    completeOnboarding()
    router.push('/search')
  }

  const handleSkip = () => {
    completeOnboarding()
    router.push('/search')
  }

  // Don't render if already completed (prevents flash)
  if (preferences.completedOnboarding) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/50 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Bienvenido a Propery</h1>
        <p className="mt-2 text-muted-foreground">
          Personalizá tu experiencia en unos simples pasos
        </p>
      </div>

      <OnboardingWizard
        initialData={{
          searchType: preferences.searchType,
          budget: preferences.budget,
          neighborhoods: preferences.preferredNeighborhoods,
          minBedrooms: preferences.minBedrooms,
          minBathrooms: preferences.minBathrooms,
          amenities: preferences.requiredAmenities,
        }}
        availableNeighborhoods={neighborhoodNames}
        availableAmenities={AVAILABLE_AMENITIES}
        onComplete={handleComplete}
        onSkip={handleSkip}
      />
    </div>
  )
}
