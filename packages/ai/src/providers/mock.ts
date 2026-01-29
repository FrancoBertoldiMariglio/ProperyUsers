import type { ChatMessage, AIResponse, AIContext } from '../types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function mockChat(
  messages: ChatMessage[],
  _context?: AIContext
): Promise<AIResponse> {
  await delay(500 + Math.random() * 500)

  const lastMessage = messages[messages.length - 1]
  const query = lastMessage.content.toLowerCase()

  // Simple mock responses based on keywords
  let content: string

  if (query.includes('descripcion') || query.includes('describir')) {
    content = `Esta propiedad destaca por su excelente ubicacion y luminosidad natural. Los ambientes son amplios y bien distribuidos, ideales para una familia o pareja que busca comodidad.

El edificio cuenta con amenities modernos y seguridad 24hs. La zona es tranquila pero con facil acceso a transporte publico y comercios.

Es una opcion solida tanto para vivir como para invertir, considerando la revalorizacion constante del barrio.`
  } else if (query.includes('comparar') || query.includes('comparacion')) {
    content = `Analizando las propiedades seleccionadas:

**Mejor relacion precio-calidad:** La primera opcion ofrece mas metros cuadrados por dolar.

**Mejor ubicacion:** Depende de tus prioridades - cercania al trabajo vs zona residencial tranquila.

**Recomendacion:** Si tu presupuesto lo permite, la segunda opcion tiene mejor potencial de revalorizacion a largo plazo.`
  } else if (query.includes('negociar') || query.includes('negociacion')) {
    content = `Consejos para negociar esta propiedad:

1. **Tiempo en el mercado:** Lleva mas de 45 dias publicada, lo que te da margen para negociar un 5-8%.

2. **Precio vs mercado:** Esta levemente por encima del promedio de la zona. Usa esto como argumento.

3. **Forma de pago:** Ofrece pago rapido y en efectivo para obtener mejor precio.

4. **Detalles a revisar:** Consulta sobre mantenimiento reciente y usa cualquier reparacion pendiente como palanca.`
  } else if (query.includes('whatsapp') || query.includes('compartir')) {
    content = `🏠 ¡Increible depto en Palermo! 3 amb, 75m², luminoso. USD 185k. Muy buena ubicacion, cerca de todo. ¿Te interesa? 📲`
  } else if (query.includes('pregunt')) {
    content = `Preguntas importantes para hacer:

1. ¿Cual es el estado de las instalaciones electricas y de gas?
2. ¿Las expensas incluyen todos los servicios? ¿Hay extraordinarias pendientes?
3. ¿Tienen la documentacion al dia para escriturar?
4. ¿Hay flexibilidad en el precio si cierro rapido?
5. ¿Como es la convivencia en el edificio? ¿Hay reglamento de copropiedad?`
  } else {
    content = `Entiendo tu consulta. Basandome en los datos del mercado inmobiliario de Buenos Aires, puedo ayudarte a analizar opciones y tomar decisiones informadas.

¿Te gustaria que profundice en algun aspecto especifico como precios, ubicaciones, o caracteristicas de las propiedades?`
  }

  return {
    content,
    usage: {
      promptTokens: 100,
      completionTokens: 150,
      totalTokens: 250,
    },
  }
}

export async function mockStream(
  messages: ChatMessage[],
  context?: AIContext,
  onChunk: (chunk: string) => void = () => {}
): Promise<AIResponse> {
  const response = await mockChat(messages, context)

  // Simulate streaming by yielding chunks
  const words = response.content.split(' ')
  for (const word of words) {
    await delay(30 + Math.random() * 20)
    onChunk(word + ' ')
  }

  return response
}
