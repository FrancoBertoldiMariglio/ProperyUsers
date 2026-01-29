'use client'

import * as React from 'react'
import { Suspense } from 'react'
import Link from 'next/link'
import {
  User,
  Heart,
  Search,
  Bell,
  Settings,
  History,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react'
import { Button } from '@propery/ui/web'
import {
  FavoritesList,
  SavedSearchesList,
  NotificationsList,
  NotificationSettings,
} from '@propery/ui/web'
import { usePreferencesStore } from '@propery/core'
import { mocks } from '@propery/api-client'

const { mockProperties } = mocks

type TabId = 'favorites' | 'searches' | 'notifications' | 'settings' | 'history'

const TABS: Array<{ id: TabId; label: string; icon: React.ElementType }> = [
  { id: 'favorites', label: 'Favoritos', icon: Heart },
  { id: 'searches', label: 'Búsquedas guardadas', icon: Search },
  { id: 'notifications', label: 'Notificaciones', icon: Bell },
  { id: 'settings', label: 'Configuración', icon: Settings },
  { id: 'history', label: 'Historial', icon: History },
]

// Mock notifications
const mockNotifications = [
  {
    id: '1',
    type: 'opportunity' as const,
    title: 'Nueva oportunidad en Palermo',
    message: 'Encontramos un departamento 15% por debajo del precio de mercado',
    propertyId: '1',
    imageUrl: 'https://picsum.photos/seed/notif1/200/150',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
  },
  {
    id: '2',
    type: 'price_drop' as const,
    title: 'Bajó el precio de una propiedad favorita',
    message: 'El departamento en Belgrano bajó de USD 320k a USD 295k',
    propertyId: '2',
    imageUrl: 'https://picsum.photos/seed/notif2/200/150',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: false,
  },
  {
    id: '3',
    type: 'new_property' as const,
    title: 'Nueva propiedad en tu zona',
    message: 'Se publicó un PH de 3 ambientes en Villa Crespo',
    propertyId: '3',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
  },
]

function ProfileContent(): JSX.Element {
  const [activeTab, setActiveTab] = React.useState<TabId>('favorites')
  const [notifications, setNotifications] = React.useState(mockNotifications)

  const {
    preferences,
    favorites,
    savedSearches,
    viewHistory,
    setPreferences,
    removeFavorite,
    updateFavoriteNotes,
    removeSavedSearch,
    toggleSearchAlert,
  } = usePreferencesStore()

  // Enrich favorites with property data
  const enrichedFavorites = favorites.map((fav) => {
    const property = mockProperties.find((p) => p.id === fav.propertyId)
    return {
      ...fav,
      property: property
        ? {
            title: property.title,
            price: property.price,
            neighborhood: property.location.neighborhood,
            imageUrl: property.images[0],
          }
        : undefined,
    }
  })

  // Get viewed properties
  const viewedPropertyIds = [...new Set(viewHistory.map((v) => v.propertyId))]
  const viewedProperties = viewedPropertyIds
    .map((id) => mockProperties.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 12)

  const handleDismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const handleDismissAllNotifications = () => {
    setNotifications([])
  }

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleExecuteSearch = (search: (typeof savedSearches)[0]) => {
    // In a real app, this would navigate to search with these filters
    console.log('Execute search:', search)
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4">
          <Link href="/search">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Mi perfil</h1>
              <p className="text-sm text-muted-foreground">
                {favorites.length} favoritos · {savedSearches.length} búsquedas guardadas
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar */}
          <aside className="lg:w-64">
            <nav className="space-y-1">
              {TABS.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                const count =
                  tab.id === 'favorites'
                    ? favorites.length
                    : tab.id === 'searches'
                      ? savedSearches.length
                      : tab.id === 'notifications'
                        ? notifications.filter((n) => !n.read).length
                        : null

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {count !== null && count > 0 && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            isActive
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {count}
                        </span>
                      )}
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </button>
                )
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 rounded-xl border border-border bg-background p-6">
            {activeTab === 'favorites' && (
              <div>
                <h2 className="mb-6 text-lg font-semibold">Mis favoritos</h2>
                <FavoritesList
                  favorites={enrichedFavorites}
                  onRemove={removeFavorite}
                  onUpdateNotes={updateFavoriteNotes}
                  onViewProperty={(id) => {
                    // Navigate to property detail
                    console.log('View property:', id)
                  }}
                />
              </div>
            )}

            {activeTab === 'searches' && (
              <div>
                <h2 className="mb-6 text-lg font-semibold">Búsquedas guardadas</h2>
                <SavedSearchesList
                  searches={savedSearches}
                  onDelete={removeSavedSearch}
                  onToggleAlert={toggleSearchAlert}
                  onExecuteSearch={handleExecuteSearch}
                />
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 className="mb-6 text-lg font-semibold">Notificaciones</h2>
                <NotificationsList
                  notifications={notifications}
                  onDismiss={handleDismissNotification}
                  onDismissAll={handleDismissAllNotifications}
                  onMarkAllRead={handleMarkAllRead}
                />
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="mb-6 text-lg font-semibold">Configuración de notificaciones</h2>
                <NotificationSettings
                  settings={preferences.notificationSettings}
                  onChange={(notificationSettings) =>
                    setPreferences({ notificationSettings })
                  }
                />
              </div>
            )}

            {activeTab === 'history' && (
              <div>
                <h2 className="mb-6 text-lg font-semibold">Historial de visitas</h2>
                {viewedProperties.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <History className="mb-4 h-16 w-16 text-muted-foreground/30" />
                    <p className="text-lg font-medium text-muted-foreground">
                      No hay historial
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Las propiedades que visites aparecerán aquí
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {viewedProperties.map((property) => (
                      <div
                        key={property!.id}
                        className="overflow-hidden rounded-xl border border-border"
                      >
                        <div className="aspect-[16/10] bg-muted">
                          {property!.images[0] && (
                            <img
                              src={property!.images[0]}
                              alt={property!.title}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="p-3">
                          <h3 className="line-clamp-1 font-medium">{property!.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {property!.location.neighborhood}
                          </p>
                          <p className="mt-1 font-bold text-primary">
                            US$ {property!.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage(): JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  )
}
