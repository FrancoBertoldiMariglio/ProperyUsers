'use client'

import * as React from 'react'
import {
  Bell,
  TrendingDown,
  Sparkles,
  Home,
  X,
  ExternalLink,
  Clock,
} from 'lucide-react'
import { cn } from '../shared/utils'

type NotificationType = 'new_property' | 'price_drop' | 'opportunity' | 'general'

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  propertyId?: string
  imageUrl?: string
  createdAt: string
  read: boolean
}

interface NotificationCardProps {
  notification: Notification
  onDismiss: (id: string) => void
  onView?: (propertyId: string) => void
  className?: string
}

const TYPE_CONFIG: Record<
  NotificationType,
  { icon: React.ElementType; color: string; bgColor: string }
> = {
  new_property: {
    icon: Home,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  price_drop: {
    icon: TrendingDown,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  opportunity: {
    icon: Sparkles,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
  general: {
    icon: Bell,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  },
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Ahora'
  if (diffMins < 60) return `Hace ${diffMins} min`
  if (diffHours < 24) return `Hace ${diffHours}h`
  if (diffDays < 7) return `Hace ${diffDays}d`
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
}

export function NotificationCard({
  notification,
  onDismiss,
  onView,
  className,
}: NotificationCardProps): JSX.Element {
  const config = TYPE_CONFIG[notification.type]
  const Icon = config.icon

  return (
    <div
      className={cn(
        'group relative flex gap-3 rounded-xl border p-4 transition-colors',
        notification.read
          ? 'border-border bg-card'
          : 'border-primary/20 bg-primary/5',
        className
      )}
    >
      {/* Icon */}
      <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', config.bgColor)}>
        <Icon className={cn('h-5 w-5', config.color)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h4 className={cn('font-semibold', !notification.read && 'text-primary')}>
            {notification.title}
          </h4>
          <button
            onClick={() => onDismiss(notification.id)}
            className="shrink-0 rounded-full p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100"
            aria-label="Descartar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>

        <div className="mt-2 flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatTimeAgo(notification.createdAt)}
          </span>

          {notification.propertyId && onView && (
            <button
              onClick={() => onView(notification.propertyId!)}
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              Ver propiedad
              <ExternalLink className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Property image */}
      {notification.imageUrl && (
        <div className="hidden h-16 w-20 shrink-0 overflow-hidden rounded-lg sm:block">
          <img
            src={notification.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Unread indicator */}
      {!notification.read && (
        <div className="absolute left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary" />
      )}
    </div>
  )
}

interface NotificationsListProps {
  notifications: Notification[]
  onDismiss: (id: string) => void
  onDismissAll?: () => void
  onMarkAllRead?: () => void
  onView?: (propertyId: string) => void
  className?: string
}

export function NotificationsList({
  notifications,
  onDismiss,
  onDismissAll,
  onMarkAllRead,
  onView,
  className,
}: NotificationsListProps): JSX.Element {
  const unreadCount = notifications.filter((n) => !n.read).length

  if (notifications.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
        <Bell className="mb-4 h-16 w-16 text-muted-foreground/30" />
        <p className="text-lg font-medium text-muted-foreground">No hay notificaciones</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Te avisaremos cuando haya novedades
        </p>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Header */}
      {(onDismissAll || onMarkAllRead) && (
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todas leídas'}
          </span>
          <div className="flex gap-2">
            {unreadCount > 0 && onMarkAllRead && (
              <button
                onClick={onMarkAllRead}
                className="text-sm font-medium text-primary hover:underline"
              >
                Marcar todas como leídas
              </button>
            )}
            {onDismissAll && (
              <button
                onClick={onDismissAll}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Borrar todas
              </button>
            )}
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onDismiss={onDismiss}
            onView={onView}
          />
        ))}
      </div>
    </div>
  )
}
