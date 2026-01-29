export interface MarketAnalytics {
  totalListings: number
  newListingsLast7Days: number
  avgPrice: number
  medianPrice: number
  priceChange30Days: number
  topNeighborhoods: Array<{
    name: string
    listings: number
    avgPrice: number
  }>
}

export interface PropertyAnalytics {
  propertyId: string
  viewsLast30Days: number
  savesLast30Days: number
  similarProperties: number
  pricePosition: 'below_market' | 'at_market' | 'above_market'
  marketComparison: {
    priceVsAvg: number
    areaVsAvg: number
    pricePerM2VsAvg: number
  }
}

export interface InvestmentAnalysis {
  propertyId: string
  purchasePrice: number
  estimatedRent: number
  grossYield: number
  netYield: number
  appreciationForecast5y: number
  roi5Years: number
  recommendation: 'strong_buy' | 'buy' | 'hold' | 'avoid'
  riskLevel: 'low' | 'medium' | 'high'
}
