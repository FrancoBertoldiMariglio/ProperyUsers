import { View, Text, Pressable } from 'react-native'
import { Link, Redirect } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { usePreferencesStore } from '@propery/core'

export default function HomeScreen() {
  const { preferences } = usePreferencesStore()

  // Redirect to onboarding if not completed
  if (!preferences.completedOnboarding) {
    return <Redirect href="/onboarding" />
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-4xl font-bold text-foreground">Propery</Text>
        <Text className="mt-4 text-center text-lg text-muted-foreground">
          Encuentra tu propiedad ideal en Buenos Aires con inteligencia artificial
        </Text>
        <View className="mt-10 w-full gap-3">
          <Link href="/search" asChild>
            <Pressable className="rounded-lg bg-primary px-6 py-4">
              <Text className="text-center font-semibold text-primary-foreground">
                🔍 Buscar propiedades
              </Text>
            </Pressable>
          </Link>
          <Link href="/compare" asChild>
            <Pressable className="rounded-lg bg-secondary px-6 py-4">
              <Text className="text-center font-semibold text-secondary-foreground">
                ⚖️ Comparar propiedades
              </Text>
            </Pressable>
          </Link>
          <Link href="/finance" asChild>
            <Pressable className="rounded-lg border border-border bg-card px-6 py-4">
              <Text className="text-center font-semibold text-foreground">
                💰 Calculadoras financieras
              </Text>
            </Pressable>
          </Link>
          <Link href="/profile" asChild>
            <Pressable className="rounded-lg border border-border bg-card px-6 py-4">
              <Text className="text-center font-semibold text-foreground">
                👤 Mi perfil
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  )
}
