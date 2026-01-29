Prueba la IA directamente en tus aplicaciones favoritas … Usa Gemini para generar borradores y pulir contenido, y disfruta de Gemini Pro con acceso a la IA de nueva generación de Google por 19,99 US$ 9,99 US$ durante 2 meses
# 🏠 PROPERY USERS - Super Prompt para Claude Code

## Aplicación para Usuarios Finales (Web + Mobile)

---

## ⚠️ INSTRUCCIONES CRÍTICAS DE CONTEXTO

### Sistema de Gestión de Contexto
Antes de comenzar CUALQUIER tarea, Claude DEBE:

1. **Leer el archivo `TASK_TRACKER_USERS.md`** en esta carpeta
2. **Evaluar tokens estimados** para la tarea actual
3. **Si la tarea requiere >50% del contexto disponible**: NO iniciarla, marcarla como `BLOCKED: CONTEXT_LIMIT` y notificar al usuario
4. **Al completar cada subtarea**: Actualizar `TASK_TRACKER_USERS.md` con estado y notas

### Notificación de Límite de Contexto
Cuando detectes que una tarea consumirá demasiado contexto:
```
🚨 ALERTA DE CONTEXTO - PROPERY USERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tarea: [nombre de la tarea]
Estimación: [alto/muy alto consumo de contexto]
Acción: Tarea pausada para continuar en nueva sesión

📋 Para continuar:
1. Abrir nueva conversación
2. Pegar este prompt
3. Claude continuará desde: [ID de subtarea]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🎯 CONTEXTO DEL PROYECTO

### Descripción
Propery Users es la aplicación para usuarios finales que buscan propiedades. Permite buscar, filtrar, comparar y analizar departamentos/casas del mercado argentino con predicciones de precio basadas en ML y un asistente AI integrado.

### Apps a Desarrollar
| App | Framework | Descripción |
|-----|-----------|-------------|
| **Web App** | Next.js 15 | Aplicación web completa con SSR/SSG |
| **Mobile App** | React Native + Expo | Apps iOS y Android nativas |

### Usuarios Target
- Compradores buscando propiedades para comprar
- Inquilinos buscando alquileres
- Parejas/roommates buscando juntos (colaborativo)
- Inversores analizando oportunidades

### Funcionalidades Core
1. Búsqueda unificada de propiedades (múltiples portales)
2. Filtros avanzados + búsqueda semántica con AI
3. Vista de mapa estilo AirBnB
4. Comparador de propiedades (hasta 4)
5. Predicciones de precio ML (oportunidad/justo/caro)
6. Asistente AI omnipresente
7. Favoritos y alertas personalizadas
8. Calculadora financiera + conexión con financiadoras

---

## 🛠️ STACK TECNOLÓGICO

### Core
| Tecnología | Versión | Uso |
|------------|---------|-----|
| Next.js | 15.x | Web App (App Router) |
| React | 19.x | UI Library |
| React Native | 0.76+ | Mobile App |
| Expo | SDK 52+ | Mobile tooling + Router |
| TypeScript | 5.x | Type safety |
| Turborepo | latest | Monorepo management |

### UI/Styling
| Tecnología | Uso |
|------------|-----|
| Tailwind CSS v4 | Utility-first styling |
| shadcn/ui | Componentes accesibles (web) |
| NativeWind | Tailwind para React Native |
| Radix UI | Primitivos headless |
| Lucide Icons | Iconografía |
| Framer Motion | Animaciones (web) |
| Reanimated 3 | Animaciones (mobile) |

### State & Data
| Tecnología | Uso |
|------------|-----|
| Zustand | Global state (compartido) |
| TanStack Query | Server state + cache |
| Zod | Validación de schemas |
| MMKV | Storage persistente (mobile) |

### Maps & Charts
| Tecnología | Uso |
|------------|-----|
| Mapbox GL JS | Mapas web |
| react-native-maps | Mapas mobile |
| Recharts | Gráficos simples |
| Victory Native | Gráficos mobile |

### AI Integration
| Tecnología | Uso |
|------------|-----|
| Vercel AI SDK | Streaming, hooks |
| OpenAI/Anthropic | Providers (agnóstico) |

### Testing
| Tecnología | Uso |
|------------|-----|
| Vitest | Unit tests |
| Testing Library | Component tests |

---

## 📁 ESTRUCTURA DEL PROYECTO

```
propery-users/
├── apps/
│   ├── web/                          # Next.js 15 Web App
│   │   ├── app/                      # App Router
│   │   │   ├── (auth)/               # Auth routes
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── layout.tsx
│   │   │   ├── (main)/               # Main app routes
│   │   │   │   ├── page.tsx          # Home/Landing
│   │   │   │   ├── search/           # Búsqueda con filtros
│   │   │   │   ├── map/              # Vista mapa
│   │   │   │   ├── compare/          # Comparador
│   │   │   │   ├── analytics/        # Analytics de zonas
│   │   │   │   ├── property/[id]/    # Detalle propiedad
│   │   │   │   ├── favorites/        # Favoritos
│   │   │   │   ├── calculator/       # Calculadora financiera
│   │   │   │   └── profile/          # Preferencias usuario
│   │   │   ├── api/                  # API routes (mocks)
│   │   │   │   ├── properties/
│   │   │   │   ├── ai/
│   │   │   │   └── analytics/
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   ├── components/               # Web-specific components
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── MobileNav.tsx
│   │   │   └── features/
│   │   ├── lib/                      # Web utils
│   │   ├── public/
│   │   └── next.config.ts
│   │
│   └── mobile/                       # React Native + Expo
│       ├── app/                      # Expo Router
│       │   ├── (tabs)/               # Tab navigation
│       │   │   ├── index.tsx         # Home/Explore
│       │   │   ├── search.tsx        # Búsqueda
│       │   │   ├── map.tsx           # Mapa
│       │   │   ├── favorites.tsx     # Favoritos
│       │   │   └── profile.tsx       # Perfil
│       │   ├── property/[id].tsx     # Detalle
│       │   ├── compare.tsx           # Comparador
│       │   ├── calculator.tsx        # Calculadora
│       │   ├── analytics/[zone].tsx  # Analytics zona
│       │   └── _layout.tsx
│       ├── components/               # Mobile-specific
│       │   ├── navigation/
│       │   └── features/
│       ├── assets/
│       ├── app.json
│       └── metro.config.js
│
├── packages/
│   ├── ui/                           # Shared UI Components
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── property/
│   │   │   │   │   ├── PropertyCard.tsx
│   │   │   │   │   ├── PropertyDetail.tsx
│   │   │   │   │   ├── PropertyGallery.tsx
│   │   │   │   │   └── PropertyBadge.tsx
│   │   │   │   ├── search/
│   │   │   │   │   ├── SearchBar.tsx
│   │   │   │   │   ├── FilterPanel.tsx
│   │   │   │   │   ├── FilterChips.tsx
│   │   │   │   │   └── SearchSuggestions.tsx
│   │   │   │   ├── map/
│   │   │   │   │   ├── PropertyMarker.tsx
│   │   │   │   │   ├── ClusterMarker.tsx
│   │   │   │   │   ├── MapControls.tsx
│   │   │   │   │   └── DrawTool.tsx
│   │   │   │   ├── comparison/
│   │   │   │   │   ├── ComparisonBar.tsx
│   │   │   │   │   ├── ComparisonTable.tsx
│   │   │   │   │   └── ComparisonChart.tsx
│   │   │   │   ├── analytics/
│   │   │   │   │   ├── PriceIndicator.tsx
│   │   │   │   │   ├── TrendChart.tsx
│   │   │   │   │   └── ZoneStats.tsx
│   │   │   │   ├── ai/
│   │   │   │   │   ├── AIChat.tsx
│   │   │   │   │   ├── AIMessage.tsx
│   │   │   │   │   ├── VoiceInput.tsx
│   │   │   │   │   └── AIFloatingButton.tsx
│   │   │   │   ├── calculator/
│   │   │   │   │   ├── MortgageCalculator.tsx
│   │   │   │   │   ├── CostBreakdown.tsx
│   │   │   │   │   └── RentVsBuy.tsx
│   │   │   │   └── primitives/
│   │   │   │       ├── Button.tsx
│   │   │   │       ├── Input.tsx
│   │   │   │       ├── Card.tsx
│   │   │   │       ├── Modal.tsx
│   │   │   │       ├── Skeleton.tsx
│   │   │   │       └── Badge.tsx
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── core/                         # Business Logic
│   │   ├── src/
│   │   │   ├── hooks/
│   │   │   │   ├── useProperties.ts
│   │   │   │   ├── useProperty.ts
│   │   │   │   ├── useFilters.ts
│   │   │   │   ├── useSearch.ts
│   │   │   │   ├── useComparison.ts
│   │   │   │   ├── useFavorites.ts
│   │   │   │   ├── usePreferences.ts
│   │   │   │   ├── useAnalytics.ts
│   │   │   │   ├── useAI.ts
│   │   │   │   └── useCalculator.ts
│   │   │   ├── stores/
│   │   │   │   ├── filterStore.ts
│   │   │   │   ├── comparisonStore.ts
│   │   │   │   ├── favoritesStore.ts
│   │   │   │   ├── preferencesStore.ts
│   │   │   │   └── uiStore.ts
│   │   │   ├── utils/
│   │   │   │   ├── formatters.ts
│   │   │   │   ├── validators.ts
│   │   │   │   ├── calculations.ts
│   │   │   │   └── geo.ts
│   │   │   └── constants/
│   │   │       ├── neighborhoods.ts
│   │   │       ├── propertyTypes.ts
│   │   │       └── sources.ts
│   │   └── package.json
│   │
│   ├── api-client/                   # API Types + Mocks
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── property.ts
│   │   │   │   ├── filter.ts
│   │   │   │   ├── user.ts
│   │   │   │   ├── analytics.ts
│   │   │   │   └── ai.ts
│   │   │   ├── mocks/
│   │   │   │   ├── properties.json      # 50+ propiedades
│   │   │   │   ├── neighborhoods.json   # Barrios CABA
│   │   │   │   ├── pois.json            # Points of Interest
│   │   │   │   ├── financiers.json      # Bancos/financiadoras
│   │   │   │   └── predictions.json     # Mock ML predictions
│   │   │   └── client.ts
│   │   └── package.json
│   │
│   ├── ai/                           # AI Integration Layer
│   │   ├── src/
│   │   │   ├── providers/
│   │   │   │   ├── openai.ts
│   │   │   │   ├── anthropic.ts
│   │   │   │   └── index.ts
│   │   │   ├── prompts/
│   │   │   │   ├── describe-property.ts
│   │   │   │   ├── compare-properties.ts
│   │   │   │   ├── negotiation-tips.ts
│   │   │   │   ├── search-semantic.ts
│   │   │   │   └── generate-summary.ts
│   │   │   ├── tools/
│   │   │   │   ├── search-properties.ts
│   │   │   │   ├── get-analytics.ts
│   │   │   │   └── calculate-mortgage.ts
│   │   │   └── hooks/
│   │   │       ├── useChat.ts
│   │   │       └── useCompletion.ts
│   │   └── package.json
│   │
│   └── config/                       # Shared Configs
│       ├── eslint/
│       ├── typescript/
│       └── tailwind/
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── TASK_TRACKER_USERS.md             # 👈 CRÍTICO: Tracker de tareas
├── turbo.json
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

---

## 🎨 DESIGN SYSTEM - USUARIOS

### Paleta de Colores
```css
/* Propery Users - Moderno Minimalista */

/* Primary - Azul Profundo (Confianza) */
--primary-50: #eff6ff;
--primary-100: #dbeafe;
--primary-200: #bfdbfe;
--primary-300: #93c5fd;
--primary-400: #60a5fa;
--primary-500: #3b82f6;  /* Principal */
--primary-600: #2563eb;
--primary-700: #1d4ed8;
--primary-800: #1e40af;
--primary-900: #1e3a8a;

/* Secondary - Verde Esmeralda (Oportunidad) */
--secondary-50: #ecfdf5;
--secondary-100: #d1fae5;
--secondary-400: #34d399;
--secondary-500: #10b981;  /* Principal */
--secondary-600: #059669;

/* Accent - Ámbar (Alertas) */
--accent-400: #fbbf24;
--accent-500: #f59e0b;

/* Price Status */
--price-opportunity: #22c55e;  /* Verde - Oportunidad */
--price-fair: #3b82f6;         /* Azul - Precio justo */
--price-high: #eab308;         /* Amarillo - Elevado */
--price-overpriced: #ef4444;   /* Rojo - Sobrevalorado */

/* Neutrals */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
```

### Typography
```css
--font-sans: 'Inter', system-ui, sans-serif;
--font-display: 'Plus Jakarta Sans', sans-serif;

/* Scale */
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;
--text-4xl: 2.25rem;
```

### Componentes Clave
- **PropertyCard**: Card con imagen, precio, badges, quick actions
- **FilterPanel**: Panel colapsable con todos los filtros
- **MapView**: Mapa interactivo con markers y clusters
- **ComparisonTable**: Tabla comparativa lado a lado
- **AIChat**: Chat flotante contextual
- **PriceIndicator**: Badge visual de oportunidad/justo/caro

---

## 📊 MOCK DATA REQUERIDO

### Property Type
```typescript
interface Property {
  id: string;
  title: string;
  description: string;
  type: 'apartment' | 'house' | 'ph' | 'land';
  operation: 'sale' | 'rent';

  price: {
    amount: number;
    currency: 'ARS' | 'USD';
  };
  expenses?: number;

  address: string;
  neighborhood: string;
  city: string;
  province: string;
  coordinates: { lat: number; lng: number };

  surface: { total: number; covered: number };
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  age: number;
  floor?: number;
  orientation?: string;
  amenities: string[];

  images: string[];
  virtualTour?: string;

  source: {
    name: 'zonaprop' | 'mercadolibre' | 'argenprop' | 'remax';
    url: string;
    publishedAt: string;
  };

  prediction?: {
    estimatedPrice: number;
    confidence: number;
    priceStatus: 'opportunity' | 'fair' | 'elevated' | 'overpriced';
    percentageDiff: number;
  };

  daysOnMarket: number;
  views: number;
  saves: number;
  createdAt: string;
  updatedAt: string;
}
```

### Barrios y POIs
```typescript
interface Neighborhood {
  id: string;
  name: string;
  city: string;
  polygon: GeoJSON.Polygon;
  stats: {
    avgPricePerM2Sale: number;
    avgPricePerM2Rent: number;
    priceTrend6m: number;
    totalListings: number;
    avgDaysOnMarket: number;
  };
}

interface POI {
  id: string;
  name: string;
  type: 'transport' | 'education' | 'health' | 'shopping' | 'park';
  subtype: string;
  coordinates: { lat: number; lng: number };
}
```

---

## 🔌 AI INTEGRATION

### Funciones del Asistente
1. **Describir propiedad**: Genera descripción atractiva y honesta
2. **Comparar propiedades**: Análisis comparativo detallado
3. **Tips de negociación**: Argumentos basados en datos
4. **Búsqueda semántica**: "Depto luminoso cerca del subte"
5. **Resumen para compartir**: Genera texto para enviar a otros
6. **Preguntas al dueño**: Sugiere qué preguntar
7. **Análisis de fotos**: Detecta estado, renovaciones

### Prompts Base
```typescript
const SYSTEM_PROMPT = `
Sos un asistente inmobiliario experto del mercado argentino.
Tu objetivo es ayudar a los usuarios a encontrar la propiedad ideal.
Usás un tono profesional pero cercano, como un amigo que sabe de inmuebles.
Basás tus recomendaciones en datos reales de mercado.
`;
```

---

## ⚙️ CI/CD

### GitHub Actions
```yaml
name: CI Users App
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test

  build:
    runs-on: ubuntu-latest
    needs: [lint, typecheck, test]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
```

---

## 📝 CONVENCIONES DE CÓDIGO

### Naming
- **Componentes**: PascalCase (`PropertyCard.tsx`)
- **Hooks**: camelCase con `use` (`useProperties.ts`)
- **Utils**: camelCase (`formatPrice.ts`)
- **Types**: PascalCase (`Property.ts`)
- **Constants**: SCREAMING_SNAKE_CASE
- **Código**: Inglés
- **UI/Textos**: Español argentino

### Commits
```
feat(users): add property comparison feature
fix(users-mobile): resolve map marker clustering
refactor(users): extract filter logic to hook
```

---

## 🚀 ORDEN DE EJECUCIÓN

### Fase 1: Foundation (Módulo 1)
Setup monorepo, apps, design system, CI/CD

### Fase 2: Core Search (Módulos 2, 3, 4)
Búsqueda, filtros, mapa

### Fase 3: Comparison & Analytics (Módulos 5, 6)
Comparador, dashboard analytics

### Fase 4: AI & Personalization (Módulos 7, 8)
Asistente AI, preferencias, notificaciones

### Fase 5: Financial (Módulo 9)
Calculadora, financiadoras

---

## ⚠️ REGLAS IMPORTANTES

1. **SIEMPRE** actualizar `TASK_TRACKER_USERS.md` después de cada subtarea
2. **SIEMPRE** evaluar contexto antes de empezar tarea nueva
3. **NUNCA** empezar tarea que exceda 50% del contexto estimado
4. **SIEMPRE** TypeScript strict mode
5. **SIEMPRE** mobile-responsive desde el inicio
6. **SIEMPRE** accesibilidad (a11y)
7. **NUNCA** duplicar lógica entre web y mobile (usar packages/)

---

## 🔄 PARA CONTINUAR EN NUEVA SESIÓN

```
Continuando desarrollo de Propery Users (Web + Mobile).
Por favor:
1. Lee TASK_TRACKER_USERS.md
2. Identificá la última tarea completada
3. Continuá con la siguiente tarea pendiente
4. Actualizá el tracker al completar
```

---

*Prompt v1.0 - Propery Users - Enero 2026*
