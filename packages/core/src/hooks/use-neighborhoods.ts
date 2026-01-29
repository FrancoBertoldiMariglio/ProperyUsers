import { useQuery } from '@tanstack/react-query'
import { getNeighborhoods, getNeighborhoodStats } from '@propery/api-client'

export function useNeighborhoods() {
  return useQuery({
    queryKey: ['neighborhoods'],
    queryFn: getNeighborhoods,
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

export function useNeighborhoodStats(neighborhoodId: string) {
  return useQuery({
    queryKey: ['neighborhood-stats', neighborhoodId],
    queryFn: () => getNeighborhoodStats(neighborhoodId),
    enabled: !!neighborhoodId,
  })
}
