import type { Property } from '@propery/api-client'

export const SYSTEM_PROMPT = `Eres un asistente experto en bienes raices de Argentina, especializado en el mercado inmobiliario de Buenos Aires (CABA y GBA).

Tu rol es ayudar a los usuarios a:
- Entender y comparar propiedades
- Analizar precios y oportunidades de mercado
- Dar consejos de negociacion basados en datos
- Responder preguntas sobre barrios y zonas
- Generar resumenes y descripciones

Siempre responde en espanol argentino. Se conciso pero informativo.
Basa tus respuestas en los datos proporcionados cuando esten disponibles.
Si no tienes informacion suficiente, indicalo claramente.`

export function buildPropertyDescriptionPrompt(property: Property): string {
  return `Genera una descripcion atractiva y profesional para esta propiedad:

Tipo: ${property.propertyType === 'apartment' ? 'Departamento' : property.propertyType === 'house' ? 'Casa' : 'PH'}
Ubicacion: ${property.location.address}, ${property.location.neighborhood}
Precio: USD ${property.price.toLocaleString()}
Superficie: ${property.features.totalArea}m² totales, ${property.features.coveredArea}m² cubiertos
Ambientes: ${property.features.bedrooms} habitaciones, ${property.features.bathrooms} banos
Amenities: ${Object.entries(property.amenities).filter(([, v]) => v).map(([k]) => k).join(', ')}

La descripcion debe ser de 2-3 parrafos, destacando los puntos fuertes y siendo honesta sobre las caracteristicas.`
}

export function buildComparisonPrompt(properties: Property[]): string {
  const propertiesText = properties
    .map(
      (p, i) => `
Propiedad ${i + 1}:
- ${p.title}
- Precio: USD ${p.price.toLocaleString()}
- Ubicacion: ${p.location.neighborhood}
- Superficie: ${p.features.totalArea}m²
- Habitaciones: ${p.features.bedrooms}
- Prediction: ${p.prediction?.priceCategory} (${p.prediction?.percentageDiff}% vs mercado)`
    )
    .join('\n')

  return `Compara estas ${properties.length} propiedades y da una recomendacion:

${propertiesText}

Analiza:
1. Relacion precio-calidad de cada una
2. Ventajas y desventajas principales
3. Cual ofrece mejor valor segun el perfil de un comprador promedio
4. Puntos a negociar en cada caso`
}

export function buildNegotiationTipsPrompt(property: Property): string {
  return `Genera consejos de negociacion para esta propiedad:

Propiedad: ${property.title}
Precio publicado: USD ${property.price.toLocaleString()}
Precio estimado de mercado: USD ${property.prediction?.predictedPrice?.toLocaleString() || 'No disponible'}
Diferencia: ${property.prediction?.percentageDiff}%
Categoria: ${property.prediction?.priceCategory}
Dias publicado: ${Math.floor((Date.now() - new Date(property.publishedAt).getTime()) / (1000 * 60 * 60 * 24))}
Fuente: ${property.source}

Da 3-5 consejos especificos y accionables para negociar el precio, considerando:
- El tiempo que lleva publicada
- La diferencia con el precio de mercado
- Estrategias de comunicacion efectivas
- Puntos debiles a explorar`
}

export function buildWhatsAppSummaryPrompt(property: Property): string {
  return `Genera un resumen corto y atractivo de esta propiedad para compartir por WhatsApp:

${property.title}
Precio: USD ${property.price.toLocaleString()}
Ubicacion: ${property.location.address}, ${property.location.neighborhood}
${property.features.bedrooms} amb, ${property.features.totalArea}m²
${property.prediction?.priceCategory === 'opportunity' ? '¡OPORTUNIDAD!' : ''}

El mensaje debe:
- Ser de maximo 280 caracteres
- Incluir emojis relevantes
- Destacar lo mas atractivo
- Generar interes`
}

export function buildQuestionsPrompt(property: Property): string {
  return `Genera 5 preguntas importantes que un interesado deberia hacer al dueno o inmobiliaria sobre esta propiedad:

Tipo: ${property.propertyType}
Ubicacion: ${property.location.neighborhood}
Antiguedad: ${property.features.age !== null ? `${property.features.age} anos` : 'No especificada'}
Expensas: ${property.expenses ? `ARS ${property.expenses.toLocaleString()}` : 'No especificadas'}

Las preguntas deben cubrir:
- Estado de la propiedad y mantenimiento
- Costos ocultos o adicionales
- Situacion legal y documentacion
- Flexibilidad en precio/condiciones
- Informacion del edificio/zona`
}

export function buildSemanticSearchPrompt(query: string): string {
  return `Analiza esta busqueda en lenguaje natural y extrae los filtros:

Busqueda: "${query}"

Devuelve un JSON con los filtros identificados:
{
  "operationType": "sale" | "rent" | null,
  "propertyTypes": string[],
  "priceMin": number | null,
  "priceMax": number | null,
  "bedrooms": number | null,
  "neighborhoods": string[],
  "amenities": string[],
  "otherRequirements": string[]
}

Solo incluye campos que se mencionen explicita o implicitamente en la busqueda.`
}
