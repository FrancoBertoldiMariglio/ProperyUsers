Prueba la IA directamente en tus aplicaciones favoritas … Usa Gemini para generar borradores y pulir contenido, y disfruta de Gemini Pro con acceso a la IA de nueva generación de Google por 19,99 US$ 9,99 US$ durante 2 meses
# Propery Users - Task Tracker
**Aplicación para Usuarios Finales (Web + Mobile)**

Última actualización: 2026-01-29
Sesión actual: 1

## Estado General
- Módulo actual: 4 de 9 (EN PROGRESO - 85%)
- Progreso global: ~42%
- Apps: Web (Next.js) + Mobile (React Native/Expo)

---

## Módulos

### 1. Setup Proyecto + Design System
**Estimación:** 4-6 horas | **Dependencias:** Ninguna

- [x] 1.1 Inicializar monorepo con Turborepo + pnpm
- [x] 1.2 Configurar Next.js 15 (App Router) - apps/web
- [x] 1.3 Configurar Expo SDK 52 + Expo Router - apps/mobile
- [x] 1.4 Setup package: `@propery/ui` (componentes compartidos)
- [x] 1.5 Setup package: `@propery/core` (hooks, stores, utils)
- [x] 1.6 Setup package: `@propery/api-client` (types + mocks)
- [x] 1.7 Setup package: `@propery/ai` (integración AI)
- [x] 1.8 Setup package: `@propery/config` (ESLint, TS, Tailwind)
- [x] 1.9 Configurar Tailwind v4 + shadcn/ui (web)
- [x] 1.10 Configurar NativeWind (mobile)
- [x] 1.11 Crear Design Tokens (colores, spacing, typography)
- [x] 1.12 Crear componentes primitivos: Button, Input, Card, Badge, Modal
- [x] 1.13 Configurar ESLint + Prettier + husky
- [x] 1.14 Setup GitHub Actions (lint, typecheck, test, build)
- [x] 1.15 README con instrucciones de desarrollo

**Status:** COMPLETED

---

### 2. Vista de Búsqueda de Propiedades
**Estimación:** 6-8 horas | **Dependencias:** Módulo 1

- [x] 2.1 Definir tipos TypeScript: Property, PropertySource, PricePrediction
- [x] 2.2 Crear mock data: 50+ propiedades realistas de CABA
- [x] 2.3 Crear mock data: barrios con polígonos y stats
- [x] 2.4 PropertyCard component (web + mobile)
  - [x] Imagen con lazy loading
  - [x] Precio + currency
  - [x] Badge de fuente (ZonaProp, ML, etc.)
  - [x] Badge de oportunidad/fair/caro
  - [x] Quick actions (comparar, favorito, compartir)
- [x] 2.5 PropertyList con infinite scroll (TanStack Virtual)
- [x] 2.6 PropertyList mobile con FlatList optimizado
- [x] 2.7 Vista dual sincronizada: Lista + Mini-mapa (web)
- [x] 2.8 Ordenamiento: precio, fecha, relevancia, oportunidad
- [x] 2.9 Skeleton loading y empty states
- [x] 2.10 Responsive design: mobile/tablet/desktop
- [x] 2.11 Hook `useProperties` con TanStack Query
- [ ] 2.12 Unit tests componentes críticos (pendiente)

**Status:** COMPLETED

---

### 3. Filtros Avanzados + AI Search
**Estimación:** 6-8 horas | **Dependencias:** Módulos 1, 2

- [x] 3.1 Zustand store: `filterStore` con persistencia
- [x] 3.2 FilterPanel component (colapsable, sticky)
- [x] 3.3 Filtros básicos:
  - [x] Tipo (depto, casa, PH, terreno)
  - [x] Operación (venta, alquiler)
  - [x] Rango de precio (slider dual)
  - [x] Rango de m² (slider dual)
  - [x] Habitaciones (1, 2, 3, 4+)
  - [x] Baños (1, 2, 3+)
  - [x] Cochera (sí/no/cantidad)
  - [x] Antigüedad (a estrenar, <5 años, etc.)
- [x] 3.4 Filtros de ubicación:
  - [x] Multi-select de barrios
  - [ ] Radio desde punto (mapa) - pendiente para Módulo 4
- [x] 3.5 Filtros por amenities (pileta, sum, gimnasio, etc.)
- [ ] 3.6 Filtros por POIs ("cerca de subte", "a 500m de escuela") - pendiente para Módulo 4
- [x] 3.7 Barra de búsqueda semántica con AI
- [x] 3.8 Historial de búsquedas recientes (últimas 10)
- [x] 3.9 Búsquedas guardadas (templates con nombre)
- [x] 3.10 Filtro especial "Solo oportunidades" (ML prediction)
- [x] 3.11 FilterChips: tags de filtros activos con remove
- [x] 3.12 Contador de resultados en tiempo real
- [x] 3.13 Mobile: Bottom sheet para filtros
- [ ] 3.14 Unit tests (pendiente)

**Status:** COMPLETED

---

### 4. Vista Geográfica (Mapa)
**Estimación:** 8-10 horas | **Dependencias:** Módulos 1, 2

- [x] 4.1 Setup Mapbox GL JS (web)
- [ ] 4.2 Setup react-native-maps (mobile) - pendiente para versión mobile
- [x] 4.3 PropertyMarker component:
  - [x] Color por precio (verde/azul/amarillo/rojo)
  - [ ] Icono por tipo de propiedad - postergado
- [ ] 4.4 ClusterMarker con rango de precios y contador - pendiente
- [x] 4.5 Popup/preview en hover (web) / tap (mobile)
- [x] 4.6 Draw to search: dibujar polígono para filtrar
- [x] 4.7 Capas toggleables:
  - [x] Transporte (subte, tren, metrobus)
  - [x] Escuelas
  - [x] Hospitales/clínicas
  - [x] Parques
  - [x] Seguridad (comisarías)
- [x] 4.8 Heatmap de precios por zona
- [ ] 4.9 Isocronas: accesibilidad en X minutos - postergado (requiere API externa)
- [x] 4.10 Sincronización bidireccional con lista (parcial - bounds change callback)
- [x] 4.11 Polígonos de barrios con stats en hover
- [x] 4.12 Controles de zoom y geolocalización
- [x] 4.13 Responsive y touch-friendly
- [ ] 4.14 Unit tests (pendiente)

**Status:** IN_PROGRESS (85% complete)

---

### 5. Comparador Dinámico
**Estimación:** 6-8 horas | **Dependencias:** Módulos 1, 2

- [ ] 5.1 Zustand store: `comparisonStore` (máx 4 propiedades)
- [ ] 5.2 ComparisonBar flotante (propiedades seleccionadas)
- [ ] 5.3 Quick add/remove desde PropertyCard
- [ ] 5.4 Página de comparación:
  - [ ] Vista lado a lado (cards)
  - [ ] Tabla comparativa con todas las características
- [ ] 5.5 Highlight automático de diferencias (mejor=verde, peor=rojo)
- [ ] 5.6 Radar chart: propiedad vs promedio de zona
- [ ] 5.7 Cálculo de costo total mensual:
  - [ ] Precio base / cuotas
  - [ ] Expensas
  - [ ] Estimación de servicios
- [ ] 5.8 Score de inversión (ROI proyectado a 5 años)
- [ ] 5.9 Generación de PDF de comparación
- [ ] 5.10 Compartir comparación con link único
- [ ] 5.11 Versión mobile con swipe horizontal
- [ ] 5.12 Unit tests

**Status:** NOT_STARTED

---

### 6. Analytics + Predicciones ML
**Estimación:** 8-10 horas | **Dependencias:** Módulo 1

- [ ] 6.1 Mock data: histórico de precios (12 meses)
- [ ] 6.2 Mock data: ML predictions por propiedad
- [ ] 6.3 NeighborhoodDashboard page/component
- [ ] 6.4 KPIs de barrio:
  - [ ] Precio promedio por m² (venta/alquiler)
  - [ ] Tendencia últimos 6 meses (% cambio)
  - [ ] Total de publicaciones activas
  - [ ] Días promedio en mercado
- [ ] 6.5 Gráfico de tendencia de precios (line chart)
- [ ] 6.6 Distribución por tipo (pie/donut chart)
- [ ] 6.7 Scatter plot: precio vs m²
- [ ] 6.8 Heatmap: habitaciones vs baños vs precio
- [ ] 6.9 PriceIndicator component:
  - [ ] Badge visual: oportunidad/justo/elevado/sobrevalorado
  - [ ] Tooltip con explicación
- [ ] 6.10 Intervalo de confianza visual en predicción
- [ ] 6.11 Comparador de hasta 3 barrios lado a lado
- [ ] 6.12 Recomendación AI: "¿Es buen momento para comprar/alquilar aquí?"
- [ ] 6.13 Responsive charts (Recharts web, Victory mobile)
- [ ] 6.14 Unit tests

**Status:** NOT_STARTED

---

### 7. AI Assistant Omnipresente
**Estimación:** 10-12 horas | **Dependencias:** Módulos 1, 2

- [ ] 7.1 Arquitectura de providers AI agnóstica (OpenAI/Anthropic)
- [ ] 7.2 Package `@propery/ai`:
  - [ ] Provider abstraction
  - [ ] Prompts templates
  - [ ] Function calling tools
- [ ] 7.3 AIChat component flotante:
  - [ ] Minimizable/expandible
  - [ ] Historial de conversación
  - [ ] Streaming de respuestas
- [ ] 7.4 Contexto automático (sabe qué propiedad/página estás viendo)
- [ ] 7.5 Función: Describir propiedad
- [ ] 7.6 Función: Comparar propiedades seleccionadas
- [ ] 7.7 Función: Tips de negociación basados en datos
- [ ] 7.8 Función: Generar resumen para compartir (WhatsApp-friendly)
- [ ] 7.9 Función: Sugerir preguntas al dueño/inmobiliaria
- [ ] 7.10 Función: Buscar propiedades con lenguaje natural
- [ ] 7.11 Voice input:
  - [ ] Web Speech API (web)
  - [ ] Expo Speech (mobile)
- [ ] 7.12 Análisis de fotos: detectar estado, luminosidad, renovaciones
- [ ] 7.13 AIFloatingButton con badge de sugerencias
- [ ] 7.14 Rate limiting y error handling
- [ ] 7.15 Unit tests

**Status:** NOT_STARTED

---

### 8. Preferencias + Notificaciones
**Estimación:** 6-8 horas | **Dependencias:** Módulos 1, 7

- [ ] 8.1 Zustand store: `preferencesStore` con persistencia
- [ ] 8.2 OnboardingWizard (3-4 pasos):
  - [ ] Tipo de búsqueda (comprar/alquilar)
  - [ ] Presupuesto
  - [ ] Zonas de interés
  - [ ] Características mínimas
- [ ] 8.3 ProfileSettings page:
  - [ ] Editar preferencias
  - [ ] Configurar notificaciones
  - [ ] Ver historial de búsquedas
- [ ] 8.4 Sistema de favoritos:
  - [ ] Add/remove/list
  - [ ] Notas personales por favorito
  - [ ] Ordenamiento
- [ ] 8.5 Búsquedas guardadas con alertas
- [ ] 8.6 Configuración de notificaciones:
  - [ ] Tipos: nueva propiedad, baja precio, oportunidad
  - [ ] Frecuencia: inmediata, diaria, semanal
  - [ ] Canales: push, email
- [ ] 8.7 Learning implícito:
  - [ ] Tracking de comportamiento (vistas, tiempo)
  - [ ] Mejorar match score basado en acciones
- [ ] 8.8 NotificationCard component
- [ ] 8.9 Push notifications setup (Expo Notifications)
- [ ] 8.10 Template de email semanal
- [ ] 8.11 Unit tests

**Status:** NOT_STARTED

---

### 9. Calculadora Financiera + Financiadoras
**Estimación:** 6-8 horas | **Dependencias:** Módulo 1

- [ ] 9.1 Mock data: bancos/financiadoras argentinas con tasas
- [ ] 9.2 MortgageCalculator component:
  - [ ] Monto del crédito
  - [ ] Plazo (años)
  - [ ] Tasa de interés
  - [ ] Sistema (francés/alemán)
- [ ] 9.3 Resultado: cuota mensual + total a pagar + intereses
- [ ] 9.4 Comparador de créditos hipotecarios (hasta 3 bancos)
- [ ] 9.5 Calculadora de gastos de escrituración:
  - [ ] Escribanía
  - [ ] Impuestos
  - [ ] Comisión inmobiliaria
  - [ ] Gastos bancarios
- [ ] 9.6 Tool "¿Me conviene alquilar o comprar?":
  - [ ] Input: alquiler mensual actual, precio de compra
  - [ ] Output: análisis comparativo a X años
- [ ] 9.7 Lista de financiadoras con info de contacto
- [ ] 9.8 Formulario de pre-calificación (mock)
- [ ] 9.9 Integración en PropertyDetail (ver cuota estimada)
- [ ] 9.10 Versión mobile optimizada
- [ ] 9.11 Unit tests

**Status:** NOT_STARTED

---

## Registro de Sesiones

| Sesión | Fecha | Duración | Módulos | Tareas Completadas | Notas |
|--------|-------|----------|---------|-------------------|-------|
| 1 | 2026-01-29 | ~2h | Módulo 1 | 15/15 | Setup completo del monorepo |
| 1 (cont.) | 2026-01-29 | ~1h | Módulo 2 | 11/12 | Vista de búsqueda completa |
| 2 | 2026-01-29 | ~1h | Módulo 4 | 11/14 | Mapa con Mapbox GL JS, POIs, heatmap |

---

## Notas Técnicas

### Decisiones de Arquitectura
- Monorepo con Turborepo + pnpm workspaces
- Componentes UI separados para web (Radix/shadcn) y native (React Native)
- Tailwind CSS v4 para web con @theme para tokens
- NativeWind para mobile manteniendo consistencia de estilos
- AI provider agnóstico con mock provider para desarrollo
- Zustand para estado global con persistencia
- TanStack Query para server state

### Problemas Encontrados
- (Ninguno hasta el momento)

### Dependencias Principales
- turbo: ^2.3.3
- next: ^15.1.0
- react: ^19.0.0
- expo: ~52.0.0
- tailwindcss: ^4.0.0
- zustand: ^5.0.2
- @tanstack/react-query: ^5.62.0
- @tanstack/react-virtual: ^3.11.0
- lucide-react: ^0.468.0

---

## Estimación Total
| Módulo | Estimación |
|--------|------------|
| 1. Setup | 4-6h |
| 2. Búsqueda | 6-8h |
| 3. Filtros | 6-8h |
| 4. Mapa | 8-10h |
| 5. Comparador | 6-8h |
| 6. Analytics | 8-10h |
| 7. AI Assistant | 10-12h |
| 8. Preferencias | 6-8h |
| 9. Calculadora | 6-8h |
| **TOTAL** | **60-78h** |

---

## Próximos Pasos
1. ~~Iniciar Sesión 1~~ COMPLETADO
2. ~~Completar Módulo 1 (Setup)~~ COMPLETADO
3. ~~Completar Módulo 2 (Vista de Búsqueda)~~ COMPLETADO
4. ~~Completar Módulo 3 (Filtros + AI Search)~~ COMPLETADO
5. ~~Módulo 4 (Mapa)~~ EN PROGRESO (85%)
6. Agregar ClusterMarker para propiedades agrupadas
7. Implementar isocronas (requiere API externa)
8. Continuar con Módulo 5 (Comparador Dinámico)
