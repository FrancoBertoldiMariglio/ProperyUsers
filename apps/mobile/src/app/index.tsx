import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-4xl font-bold text-foreground">Propery</Text>
        <Text className="mt-4 text-center text-lg text-muted-foreground">
          Encuentra tu propiedad ideal en Buenos Aires con inteligencia artificial
        </Text>
        <View className="mt-10 gap-4">
          <Link href="/search" asChild>
            <Pressable className="rounded-lg bg-primary px-6 py-3">
              <Text className="text-center font-semibold text-primary-foreground">
                Comenzar a buscar
              </Text>
            </Pressable>
          </Link>
          <Link href="/about" asChild>
            <Pressable className="rounded-lg bg-secondary px-6 py-3">
              <Text className="text-center font-semibold text-secondary-foreground">
                Conocer mas
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  )
}
