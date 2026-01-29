import { View, Text, ScrollView, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { usePreferencesStore } from '@propery/core'
import { useState } from 'react'

type Step = 'type' | 'budget' | 'location' | 'features'

const STEPS: Step[] = ['type', 'budget', 'location', 'features']

const NEIGHBORHOODS = [
  'Palermo',
  'Belgrano',
  'Recoleta',
  'Caballito',
  'Villa Crespo',
  'Nuñez',
  'Colegiales',
  'Almagro',
  'Villa Urquiza',
  'San Telmo',
]

const AMENITIES = [
  'Pileta',
  'Gimnasio',
  'SUM',
  'Parrilla',
  'Cochera',
  'Balcón',
  'Terraza',
  'Seguridad 24hs',
]

const BUDGET_PRESETS = [
  { label: 'Hasta $100k', min: null, max: 100000 },
  { label: '$100k - $200k', min: 100000, max: 200000 },
  { label: '$200k - $350k', min: 200000, max: 350000 },
  { label: '$350k - $500k', min: 350000, max: 500000 },
  { label: 'Más de $500k', min: 500000, max: null },
]

export default function OnboardingScreen() {
  const router = useRouter()
  const { preferences, setPreferences, completeOnboarding } = usePreferencesStore()

  const [currentStep, setCurrentStep] = useState<Step>('type')
  const [data, setData] = useState({
    searchType: preferences.searchType,
    budget: preferences.budget,
    neighborhoods: preferences.preferredNeighborhoods,
    minBedrooms: preferences.minBedrooms,
    minBathrooms: preferences.minBathrooms,
    amenities: preferences.requiredAmenities,
  })

  const currentIndex = STEPS.indexOf(currentStep)

  const canProceed = () => {
    switch (currentStep) {
      case 'type':
        return data.searchType !== null
      case 'budget':
        return data.budget.min !== null || data.budget.max !== null
      case 'location':
        return data.neighborhoods.length > 0
      case 'features':
        return true
    }
  }

  const handleNext = () => {
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1])
    } else {
      // Complete onboarding
      setPreferences({
        searchType: data.searchType,
        budget: data.budget,
        preferredNeighborhoods: data.neighborhoods,
        minBedrooms: data.minBedrooms,
        minBathrooms: data.minBathrooms,
        requiredAmenities: data.amenities,
      })
      completeOnboarding()
      router.replace('/')
    }
  }

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1])
    }
  }

  const toggleNeighborhood = (n: string) => {
    setData((prev) => ({
      ...prev,
      neighborhoods: prev.neighborhoods.includes(n)
        ? prev.neighborhoods.filter((x) => x !== n)
        : [...prev.neighborhoods, n],
    }))
  }

  const toggleAmenity = (a: string) => {
    setData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter((x) => x !== a)
        : [...prev.amenities, a],
    }))
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Progress */}
      <View className="flex-row gap-2 px-4 py-4">
        {STEPS.map((step, idx) => (
          <View
            key={step}
            className={`h-1 flex-1 rounded-full ${
              idx <= currentIndex ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Step: Search Type */}
        {currentStep === 'type' && (
          <View className="py-6">
            <Text className="mb-2 text-center text-2xl font-bold text-foreground">
              ¿Qué estás buscando?
            </Text>
            <Text className="mb-8 text-center text-muted-foreground">
              Elegí el tipo de operación
            </Text>

            <View className="gap-4">
              <Pressable
                onPress={() => setData((prev) => ({ ...prev, searchType: 'buy' }))}
                className={`items-center rounded-xl border-2 p-6 ${
                  data.searchType === 'buy'
                    ? 'border-primary bg-primary/5'
                    : 'border-border'
                }`}
              >
                <Text className="text-4xl">🏠</Text>
                <Text className="mt-3 text-lg font-semibold text-foreground">Comprar</Text>
                <Text className="text-sm text-muted-foreground">
                  Busco mi próxima propiedad
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setData((prev) => ({ ...prev, searchType: 'rent' }))}
                className={`items-center rounded-xl border-2 p-6 ${
                  data.searchType === 'rent'
                    ? 'border-primary bg-primary/5'
                    : 'border-border'
                }`}
              >
                <Text className="text-4xl">🔑</Text>
                <Text className="mt-3 text-lg font-semibold text-foreground">Alquilar</Text>
                <Text className="text-sm text-muted-foreground">Busco para alquilar</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Step: Budget */}
        {currentStep === 'budget' && (
          <View className="py-6">
            <Text className="mb-2 text-center text-2xl font-bold text-foreground">
              ¿Cuál es tu presupuesto?
            </Text>
            <Text className="mb-8 text-center text-muted-foreground">
              Seleccioná un rango aproximado (USD)
            </Text>

            <View className="gap-3">
              {BUDGET_PRESETS.map((preset) => {
                const isSelected =
                  data.budget.min === preset.min && data.budget.max === preset.max
                return (
                  <Pressable
                    key={preset.label}
                    onPress={() =>
                      setData((prev) => ({
                        ...prev,
                        budget: { ...prev.budget, min: preset.min, max: preset.max },
                      }))
                    }
                    className={`rounded-xl border-2 px-4 py-4 ${
                      isSelected ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                  >
                    <Text
                      className={`text-center text-lg font-medium ${
                        isSelected ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {preset.label}
                    </Text>
                  </Pressable>
                )
              })}
            </View>
          </View>
        )}

        {/* Step: Location */}
        {currentStep === 'location' && (
          <View className="py-6">
            <Text className="mb-2 text-center text-2xl font-bold text-foreground">
              ¿Dónde te gustaría vivir?
            </Text>
            <Text className="mb-8 text-center text-muted-foreground">
              Seleccioná uno o más barrios
            </Text>

            <View className="flex-row flex-wrap gap-2">
              {NEIGHBORHOODS.map((n) => {
                const isSelected = data.neighborhoods.includes(n)
                return (
                  <Pressable
                    key={n}
                    onPress={() => toggleNeighborhood(n)}
                    className={`rounded-full px-4 py-2 ${
                      isSelected ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <Text
                      className={`font-medium ${
                        isSelected ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {n}
                    </Text>
                  </Pressable>
                )
              })}
            </View>

            {data.neighborhoods.length > 0 && (
              <Text className="mt-4 text-center text-sm text-muted-foreground">
                {data.neighborhoods.length} barrio{data.neighborhoods.length !== 1 && 's'}{' '}
                seleccionado{data.neighborhoods.length !== 1 && 's'}
              </Text>
            )}
          </View>
        )}

        {/* Step: Features */}
        {currentStep === 'features' && (
          <View className="py-6">
            <Text className="mb-2 text-center text-2xl font-bold text-foreground">
              Características preferidas
            </Text>
            <Text className="mb-8 text-center text-muted-foreground">
              Opcional - indicá tus preferencias
            </Text>

            {/* Bedrooms */}
            <View className="mb-6">
              <Text className="mb-3 font-medium text-foreground">Habitaciones mínimas</Text>
              <View className="flex-row gap-2">
                {[null, 1, 2, 3, 4].map((num) => (
                  <Pressable
                    key={num ?? 'any'}
                    onPress={() => setData((prev) => ({ ...prev, minBedrooms: num }))}
                    className={`flex-1 items-center justify-center rounded-lg border-2 py-3 ${
                      data.minBedrooms === num
                        ? 'border-primary bg-primary'
                        : 'border-border'
                    }`}
                  >
                    <Text
                      className={`font-medium ${
                        data.minBedrooms === num
                          ? 'text-primary-foreground'
                          : 'text-foreground'
                      }`}
                    >
                      {num ?? '-'}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Bathrooms */}
            <View className="mb-6">
              <Text className="mb-3 font-medium text-foreground">Baños mínimos</Text>
              <View className="flex-row gap-2">
                {[null, 1, 2, 3].map((num) => (
                  <Pressable
                    key={num ?? 'any'}
                    onPress={() => setData((prev) => ({ ...prev, minBathrooms: num }))}
                    className={`flex-1 items-center justify-center rounded-lg border-2 py-3 ${
                      data.minBathrooms === num
                        ? 'border-primary bg-primary'
                        : 'border-border'
                    }`}
                  >
                    <Text
                      className={`font-medium ${
                        data.minBathrooms === num
                          ? 'text-primary-foreground'
                          : 'text-foreground'
                      }`}
                    >
                      {num ?? '-'}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Amenities */}
            <View>
              <Text className="mb-3 font-medium text-foreground">Amenities deseados</Text>
              <View className="flex-row flex-wrap gap-2">
                {AMENITIES.map((a) => {
                  const isSelected = data.amenities.includes(a)
                  return (
                    <Pressable
                      key={a}
                      onPress={() => toggleAmenity(a)}
                      className={`rounded-full px-3 py-1.5 ${
                        isSelected ? 'bg-primary' : 'bg-muted'
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          isSelected
                            ? 'text-primary-foreground'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {a}
                      </Text>
                    </Pressable>
                  )
                })}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Navigation */}
      <View className="flex-row gap-4 border-t border-border px-4 py-4">
        {currentIndex > 0 ? (
          <Pressable onPress={handleBack} className="flex-1 rounded-lg bg-muted py-3">
            <Text className="text-center font-medium text-muted-foreground">Anterior</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => {
              completeOnboarding()
              router.replace('/')
            }}
            className="flex-1 rounded-lg bg-muted py-3"
          >
            <Text className="text-center font-medium text-muted-foreground">Omitir</Text>
          </Pressable>
        )}
        <Pressable
          onPress={handleNext}
          disabled={!canProceed()}
          className={`flex-1 rounded-lg py-3 ${
            canProceed() ? 'bg-primary' : 'bg-primary/50'
          }`}
        >
          <Text className="text-center font-medium text-primary-foreground">
            {currentIndex === STEPS.length - 1 ? 'Finalizar' : 'Siguiente'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}
