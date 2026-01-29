import { View, Text, ScrollView, Pressable, Switch } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, useRouter } from 'expo-router'
import { usePreferencesStore } from '@propery/core'
import { useState } from 'react'

type TabId = 'favorites' | 'searches' | 'settings'

export default function ProfileScreen() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabId>('favorites')

  const {
    preferences,
    favorites,
    savedSearches,
    setPreferences,
    removeFavorite,
    removeSavedSearch,
    toggleSearchAlert,
  } = usePreferencesStore()

  const { notificationSettings } = preferences

  const updateNotificationSetting = (key: keyof typeof notificationSettings, value: boolean) => {
    setPreferences({
      notificationSettings: { ...notificationSettings, [key]: value },
    })
  }

  const tabs: Array<{ id: TabId; label: string; count?: number }> = [
    { id: 'favorites', label: 'Favoritos', count: favorites.length },
    { id: 'searches', label: 'Búsquedas', count: savedSearches.length },
    { id: 'settings', label: 'Configuración' },
  ]

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="border-b border-border px-4 py-4">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => router.back()}>
            <Text className="text-primary">← Volver</Text>
          </Pressable>
          <Text className="text-xl font-bold text-foreground">Mi Perfil</Text>
          <View className="w-16" />
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row border-b border-border">
        {tabs.map((tab) => (
          <Pressable
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 ${activeTab === tab.id ? 'border-b-2 border-primary' : ''}`}
          >
            <Text
              className={`text-center text-sm font-medium ${
                activeTab === tab.id ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && ` (${tab.count})`}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <View className="space-y-4">
            {favorites.length === 0 ? (
              <View className="items-center py-12">
                <Text className="text-lg font-medium text-muted-foreground">
                  No tenés favoritos
                </Text>
                <Text className="mt-2 text-sm text-muted-foreground">
                  Marcá propiedades con ♥ para guardarlas aquí
                </Text>
              </View>
            ) : (
              favorites.map((fav) => (
                <View
                  key={fav.propertyId}
                  className="flex-row items-center justify-between rounded-xl border border-border bg-card p-4"
                >
                  <View className="flex-1">
                    <Text className="font-medium text-foreground">
                      Propiedad {fav.propertyId}
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                      Agregado: {new Date(fav.addedAt).toLocaleDateString('es-AR')}
                    </Text>
                    {fav.notes && (
                      <Text className="mt-1 text-sm text-muted-foreground">
                        📝 {fav.notes}
                      </Text>
                    )}
                  </View>
                  <Pressable
                    onPress={() => removeFavorite(fav.propertyId)}
                    className="ml-2 rounded-lg bg-destructive/10 px-3 py-2"
                  >
                    <Text className="text-destructive">Eliminar</Text>
                  </Pressable>
                </View>
              ))
            )}
          </View>
        )}

        {/* Saved Searches Tab */}
        {activeTab === 'searches' && (
          <View className="space-y-4">
            {savedSearches.length === 0 ? (
              <View className="items-center py-12">
                <Text className="text-lg font-medium text-muted-foreground">
                  No tenés búsquedas guardadas
                </Text>
                <Text className="mt-2 text-sm text-muted-foreground">
                  Guardá tus búsquedas para recibir alertas
                </Text>
              </View>
            ) : (
              savedSearches.map((search) => (
                <View
                  key={search.id}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1">
                      <Text className="font-medium text-foreground">{search.name}</Text>
                      <Text className="text-xs text-muted-foreground">
                        Creada: {new Date(search.createdAt).toLocaleDateString('es-AR')}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <View className="flex-row items-center">
                        <Text className="mr-2 text-sm text-muted-foreground">Alertas</Text>
                        <Switch
                          value={search.alertEnabled}
                          onValueChange={() => toggleSearchAlert(search.id)}
                        />
                      </View>
                    </View>
                  </View>
                  <View className="mt-3 flex-row gap-2">
                    <Pressable className="flex-1 rounded-lg bg-primary px-3 py-2">
                      <Text className="text-center text-sm font-medium text-primary-foreground">
                        Buscar
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => removeSavedSearch(search.id)}
                      className="rounded-lg bg-muted px-3 py-2"
                    >
                      <Text className="text-sm text-muted-foreground">Eliminar</Text>
                    </Pressable>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <View className="space-y-6">
            {/* Notification Types */}
            <View className="rounded-xl border border-border bg-card p-4">
              <Text className="mb-4 font-semibold text-foreground">
                Tipos de notificaciones
              </Text>

              <View className="space-y-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="font-medium text-foreground">Nuevas propiedades</Text>
                    <Text className="text-xs text-muted-foreground">
                      Cuando haya propiedades que coincidan
                    </Text>
                  </View>
                  <Switch
                    value={notificationSettings.newProperties}
                    onValueChange={(v) => updateNotificationSetting('newProperties', v)}
                  />
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="font-medium text-foreground">Bajadas de precio</Text>
                    <Text className="text-xs text-muted-foreground">
                      Cuando baje el precio de un favorito
                    </Text>
                  </View>
                  <Switch
                    value={notificationSettings.priceDrops}
                    onValueChange={(v) => updateNotificationSetting('priceDrops', v)}
                  />
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="font-medium text-foreground">Oportunidades</Text>
                    <Text className="text-xs text-muted-foreground">
                      Precios por debajo del mercado
                    </Text>
                  </View>
                  <Switch
                    value={notificationSettings.opportunities}
                    onValueChange={(v) => updateNotificationSetting('opportunities', v)}
                  />
                </View>
              </View>
            </View>

            {/* Frequency */}
            <View className="rounded-xl border border-border bg-card p-4">
              <Text className="mb-4 font-semibold text-foreground">Frecuencia</Text>
              <View className="flex-row gap-2">
                {(['immediate', 'daily', 'weekly'] as const).map((freq) => (
                  <Pressable
                    key={freq}
                    onPress={() =>
                      setPreferences({
                        notificationSettings: { ...notificationSettings, frequency: freq },
                      })
                    }
                    className={`flex-1 rounded-lg border-2 px-3 py-2 ${
                      notificationSettings.frequency === freq
                        ? 'border-primary bg-primary/10'
                        : 'border-border'
                    }`}
                  >
                    <Text
                      className={`text-center text-sm font-medium ${
                        notificationSettings.frequency === freq
                          ? 'text-primary'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {freq === 'immediate'
                        ? 'Inmediata'
                        : freq === 'daily'
                          ? 'Diaria'
                          : 'Semanal'}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Edit Preferences Link */}
            <Link href="/onboarding" asChild>
              <Pressable className="rounded-xl border border-border bg-card p-4">
                <Text className="text-center font-medium text-primary">
                  Editar preferencias de búsqueda →
                </Text>
              </Pressable>
            </Link>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
