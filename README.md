# Propery Users

Aplicacion para usuarios finales de busqueda de propiedades en Buenos Aires con inteligencia artificial.

## Stack Tecnologico

- **Monorepo**: Turborepo + pnpm
- **Web**: Next.js 15 (App Router) + Tailwind CSS v4
- **Mobile**: Expo SDK 52 + Expo Router + NativeWind
- **Estado**: Zustand + TanStack Query
- **AI**: Provider agnóstico (OpenAI/Anthropic)
- **TypeScript**: Estricto en todo el proyecto

## Estructura del Proyecto

```
propery-users/
├── apps/
│   ├── web/          # Next.js 15 web app
│   └── mobile/       # Expo mobile app
├── packages/
│   ├── ui/           # Componentes compartidos (web + native)
│   ├── core/         # Hooks, stores, utils
│   ├── api-client/   # Types y mock data
│   ├── ai/           # Integracion AI
│   └── config/       # ESLint, TS configs
└── turbo.json
```

## Requisitos

- Node.js >= 20
- pnpm >= 9

## Instalacion

```bash
# Clonar el repositorio
git clone https://github.com/your-org/propery-users.git
cd propery-users

# Instalar dependencias
pnpm install

# Setup de husky (hooks de git)
pnpm prepare
```

## Desarrollo

```bash
# Iniciar todos los proyectos en desarrollo
pnpm dev

# Solo web
pnpm dev:web

# Solo mobile
pnpm dev:mobile

# Abrir en Expo Go (mobile)
cd apps/mobile && npx expo start
```

## Scripts Disponibles

| Script | Descripcion |
|--------|-------------|
| `pnpm dev` | Inicia todos los proyectos en modo desarrollo |
| `pnpm dev:web` | Inicia solo la app web |
| `pnpm dev:mobile` | Inicia solo la app mobile |
| `pnpm build` | Construye todos los proyectos |
| `pnpm lint` | Ejecuta ESLint en todos los proyectos |
| `pnpm typecheck` | Verifica tipos en todos los proyectos |
| `pnpm format` | Formatea el codigo con Prettier |
| `pnpm clean` | Limpia node_modules y cache |

## Packages

### @propery/ui

Componentes de UI compartidos entre web y mobile.

```tsx
// Web
import { Button, Card, Badge } from '@propery/ui/web'

// Mobile
import { Button, Card, Badge } from '@propery/ui/native'

// Utilities
import { cn } from '@propery/ui'
```

### @propery/core

Hooks, stores y utilidades.

```tsx
import { useProperties, useFilterStore, formatPrice } from '@propery/core'
```

### @propery/api-client

Types y funciones de API (con mock data).

```tsx
import { getProperties, type Property, type PropertyFilters } from '@propery/api-client'
```

### @propery/ai

Integracion con AI providers.

```tsx
import { describeProperty, compareProperties, type AIConfig } from '@propery/ai'
```

## Variables de Entorno

Crear archivo `.env.local` en cada app:

### apps/web/.env.local

```env
# AI Provider (opcional, usa mock por defecto)
OPENAI_API_KEY=sk-...
# o
ANTHROPIC_API_KEY=sk-ant-...
```

### apps/mobile/.env.local

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

## Contribucion

1. Crear branch desde `develop`
2. Hacer cambios y asegurar que pasan lint y typecheck
3. Crear PR hacia `develop`

## Licencia

Privado - Todos los derechos reservados
