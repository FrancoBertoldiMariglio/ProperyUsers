'use client'

import * as React from 'react'
import { Bell, Mail, Smartphone, Home, TrendingDown, Sparkles } from 'lucide-react'
import { cn } from '../shared/utils'

interface NotificationSettingsData {
  newProperties: boolean
  priceDrops: boolean
  opportunities: boolean
  frequency: 'immediate' | 'daily' | 'weekly'
  channels: {
    push: boolean
    email: boolean
  }
}

interface NotificationSettingsProps {
  settings: NotificationSettingsData
  onChange: (settings: NotificationSettingsData) => void
  className?: string
}

function Toggle({
  enabled,
  onChange,
  disabled,
}: {
  enabled: boolean
  onChange: (enabled: boolean) => void
  disabled?: boolean
}): JSX.Element {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      onClick={() => onChange(!enabled)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        enabled ? 'bg-primary' : 'bg-muted',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform',
          enabled ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  )
}

export function NotificationSettings({
  settings,
  onChange,
  className,
}: NotificationSettingsProps): JSX.Element {
  const updateSetting = <K extends keyof NotificationSettingsData>(
    key: K,
    value: NotificationSettingsData[K]
  ) => {
    onChange({ ...settings, [key]: value })
  }

  const updateChannel = (channel: keyof NotificationSettingsData['channels'], value: boolean) => {
    onChange({
      ...settings,
      channels: { ...settings.channels, [channel]: value },
    })
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Notification Types */}
      <div>
        <h3 className="mb-4 font-semibold">Tipos de notificaciones</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <Home className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Nuevas propiedades</p>
                <p className="text-sm text-muted-foreground">
                  Cuando se publiquen propiedades que coincidan con tus búsquedas
                </p>
              </div>
            </div>
            <Toggle
              enabled={settings.newProperties}
              onChange={(v) => updateSetting('newProperties', v)}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <TrendingDown className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Bajadas de precio</p>
                <p className="text-sm text-muted-foreground">
                  Cuando una propiedad de tus favoritos baje de precio
                </p>
              </div>
            </div>
            <Toggle
              enabled={settings.priceDrops}
              onChange={(v) => updateSetting('priceDrops', v)}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <Sparkles className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium">Oportunidades</p>
                <p className="text-sm text-muted-foreground">
                  Propiedades con precios por debajo del mercado
                </p>
              </div>
            </div>
            <Toggle
              enabled={settings.opportunities}
              onChange={(v) => updateSetting('opportunities', v)}
            />
          </div>
        </div>
      </div>

      {/* Frequency */}
      <div>
        <h3 className="mb-4 font-semibold">Frecuencia</h3>
        <div className="flex gap-2">
          {[
            { value: 'immediate' as const, label: 'Inmediata' },
            { value: 'daily' as const, label: 'Diaria' },
            { value: 'weekly' as const, label: 'Semanal' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => updateSetting('frequency', option.value)}
              className={cn(
                'flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors',
                settings.frequency === option.value
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border hover:border-primary/50'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {settings.frequency === 'immediate' &&
            'Recibirás notificaciones al instante cuando haya novedades'}
          {settings.frequency === 'daily' &&
            'Recibirás un resumen diario a las 9:00 AM'}
          {settings.frequency === 'weekly' &&
            'Recibirás un resumen semanal los lunes a las 9:00 AM'}
        </p>
      </div>

      {/* Channels */}
      <div>
        <h3 className="mb-4 font-semibold">Canales</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Notificaciones push</p>
                <p className="text-sm text-muted-foreground">
                  Recibí alertas en tu dispositivo
                </p>
              </div>
            </div>
            <Toggle
              enabled={settings.channels.push}
              onChange={(v) => updateChannel('push', v)}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">
                  Recibí notificaciones por correo electrónico
                </p>
              </div>
            </div>
            <Toggle
              enabled={settings.channels.email}
              onChange={(v) => updateChannel('email', v)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
