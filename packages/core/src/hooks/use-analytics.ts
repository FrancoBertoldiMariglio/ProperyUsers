import { useQuery } from '@tanstack/react-query'
import { getPriceHistory, getPricePrediction } from '@propery/api-client'

export function usePriceHistory(neighborhoodId: string, months = 12) {
  return useQuery({
    queryKey: ['price-history', neighborhoodId, months],
    queryFn: () => getPriceHistory(neighborhoodId, months),
    enabled: !!neighborhoodId,
  })
}

export function usePricePrediction(propertyId: string) {
  return useQuery({
    queryKey: ['price-prediction', propertyId],
    queryFn: () => getPricePrediction(propertyId),
    enabled: !!propertyId,
  })
}
