interface MortgageParams {
  principal: number
  annualRate: number
  years: number
  system: 'french' | 'german'
}

interface MortgageResult {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  schedule: Array<{
    month: number
    payment: number
    principal: number
    interest: number
    balance: number
  }>
}

export function calculateMortgage({
  principal,
  annualRate,
  years,
  system,
}: MortgageParams): MortgageResult {
  const monthlyRate = annualRate / 100 / 12
  const months = years * 12
  const schedule: MortgageResult['schedule'] = []

  let balance = principal
  let totalPayment = 0
  let monthlyPayment: number

  if (system === 'french') {
    // French system: fixed monthly payment
    monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1)

    for (let month = 1; month <= months; month++) {
      const interest = balance * monthlyRate
      const principalPaid = monthlyPayment - interest
      balance -= principalPaid
      totalPayment += monthlyPayment

      schedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPaid,
        interest,
        balance: Math.max(0, balance),
      })
    }
  } else {
    // German system: fixed principal payment
    const principalPayment = principal / months

    for (let month = 1; month <= months; month++) {
      const interest = balance * monthlyRate
      const payment = principalPayment + interest
      balance -= principalPayment
      totalPayment += payment

      schedule.push({
        month,
        payment,
        principal: principalPayment,
        interest,
        balance: Math.max(0, balance),
      })
    }

    monthlyPayment = schedule[0].payment
  }

  return {
    monthlyPayment,
    totalPayment,
    totalInterest: totalPayment - principal,
    schedule,
  }
}

interface ClosingCostsParams {
  propertyPrice: number
  isNewConstruction: boolean
}

interface ClosingCostsResult {
  notaryFees: number
  stampTax: number
  registrationFees: number
  agencyCommission: number
  bankFees: number
  total: number
}

export function calculateClosingCosts({
  propertyPrice,
  isNewConstruction,
}: ClosingCostsParams): ClosingCostsResult {
  // Argentine typical costs
  const notaryFees = propertyPrice * 0.02 // 2%
  const stampTax = isNewConstruction ? 0 : propertyPrice * 0.025 // 2.5% for used
  const registrationFees = propertyPrice * 0.005 // 0.5%
  const agencyCommission = propertyPrice * 0.03 // 3% buyer side
  const bankFees = propertyPrice * 0.01 // 1% if financing

  return {
    notaryFees,
    stampTax,
    registrationFees,
    agencyCommission,
    bankFees,
    total: notaryFees + stampTax + registrationFees + agencyCommission + bankFees,
  }
}

interface RentVsBuyParams {
  monthlyRent: number
  propertyPrice: number
  downPaymentPercent: number
  mortgageRate: number
  mortgageYears: number
  annualAppreciation: number
  analysisYears: number
}

interface RentVsBuyResult {
  buyTotalCost: number
  rentTotalCost: number
  buyNetCost: number
  breakEvenYears: number
  recommendation: 'buy' | 'rent' | 'neutral'
}

// Investment Score Calculation
interface InvestmentScoreParams {
  predictedPriceDiff: number | undefined
  neighborhood: string
  amenitiesCount: number
  pricePerM2: number
  predictionConfidence: number | undefined
}

interface InvestmentScoreResult {
  total: number
  priceFairness: number
  locationPremium: number
  amenitiesValue: number
  roiProjection: number
  confidence: number
}

const PREMIUM_NEIGHBORHOODS = [
  'Palermo',
  'Recoleta',
  'Belgrano',
  'Puerto Madero',
  'Núñez',
  'Las Cañitas',
]

const MID_TIER_NEIGHBORHOODS = [
  'Caballito',
  'Villa Urquiza',
  'Colegiales',
  'Villa Crespo',
  'Almagro',
  'San Telmo',
]

export function calculateInvestmentScore(params: InvestmentScoreParams): InvestmentScoreResult {
  const { predictedPriceDiff, neighborhood, amenitiesCount, pricePerM2, predictionConfidence } = params

  // Price fairness score (based on ML prediction)
  let priceFairness = 50
  if (predictedPriceDiff !== undefined) {
    const diff = predictedPriceDiff
    if (diff <= -15) priceFairness = 95
    else if (diff <= -10) priceFairness = 85
    else if (diff <= -5) priceFairness = 75
    else if (diff <= 0) priceFairness = 65
    else if (diff <= 5) priceFairness = 55
    else if (diff <= 10) priceFairness = 40
    else priceFairness = 25
  }

  // Location premium score
  let locationPremium = 50
  if (PREMIUM_NEIGHBORHOODS.some((n) => neighborhood.includes(n))) {
    locationPremium = 85
  } else if (MID_TIER_NEIGHBORHOODS.some((n) => neighborhood.includes(n))) {
    locationPremium = 70
  }

  // Amenities value score
  const amenitiesValue = Math.min(30 + amenitiesCount * 7, 95)

  // ROI projection (based on price/m²)
  let roiProjection = 50
  if (pricePerM2 > 0) {
    if (pricePerM2 < 2000) roiProjection = 90
    else if (pricePerM2 < 2500) roiProjection = 80
    else if (pricePerM2 < 3000) roiProjection = 70
    else if (pricePerM2 < 3500) roiProjection = 60
    else if (pricePerM2 < 4000) roiProjection = 45
    else roiProjection = 30
  }

  // Confidence
  const confidence = predictionConfidence !== undefined
    ? Math.round(predictionConfidence * 100)
    : 50

  // Total score (weighted average)
  const total = Math.round(
    priceFairness * 0.35 +
    locationPremium * 0.25 +
    amenitiesValue * 0.15 +
    roiProjection * 0.25
  )

  return {
    total,
    priceFairness,
    locationPremium,
    amenitiesValue,
    roiProjection,
    confidence,
  }
}

// Monthly Cost Estimation
interface MonthlyCostParams {
  isRent: boolean
  price: number
  currency: 'USD' | 'ARS'
  expenses: number | null
  coveredArea: number
  amenitiesCount: number
  loanTermYears?: number
  downPaymentPercent?: number
}

interface MonthlyCostResult {
  basePayment: number
  expenses: number
  utilities: number
  total: number
}

const USD_TO_ARS = 1100

export function calculateMonthlyCost(params: MonthlyCostParams): MonthlyCostResult {
  const {
    isRent,
    price,
    currency,
    expenses,
    coveredArea,
    amenitiesCount,
    loanTermYears = 20,
    downPaymentPercent = 30,
  } = params

  let basePayment: number
  if (isRent) {
    basePayment = currency === 'USD' ? price * USD_TO_ARS : price
  } else {
    const priceARS = currency === 'USD' ? price * USD_TO_ARS : price
    const loanAmount = priceARS * (1 - downPaymentPercent / 100)
    const annualRate = 0.085
    const monthlyRate = annualRate / 12
    const numPayments = loanTermYears * 12

    basePayment = Math.round(
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1)
    )
  }

  const expensesValue = expenses || 0

  // Estimate utilities
  const baseUtilities = 35000
  const areaFactor = coveredArea / 50
  const amenitiesCost = amenitiesCount * 2000
  const utilities = Math.round(baseUtilities * areaFactor + amenitiesCost)

  return {
    basePayment,
    expenses: expensesValue,
    utilities,
    total: basePayment + expensesValue + utilities,
  }
}

export function analyzeRentVsBuy(params: RentVsBuyParams): RentVsBuyResult {
  const {
    monthlyRent,
    propertyPrice,
    downPaymentPercent,
    mortgageRate,
    mortgageYears,
    annualAppreciation,
    analysisYears,
  } = params

  const downPayment = propertyPrice * (downPaymentPercent / 100)
  const loanAmount = propertyPrice - downPayment

  const mortgage = calculateMortgage({
    principal: loanAmount,
    annualRate: mortgageRate,
    years: mortgageYears,
    system: 'french',
  })

  const monthsToAnalyze = analysisYears * 12
  let buyTotalCost = downPayment
  let rentTotalCost = 0

  for (let month = 0; month < monthsToAnalyze; month++) {
    if (month < mortgageYears * 12) {
      buyTotalCost += mortgage.monthlyPayment
    }
    rentTotalCost += monthlyRent * Math.pow(1 + 0.03 / 12, month) // 3% annual rent increase
  }

  const futurePropertyValue = propertyPrice * Math.pow(1 + annualAppreciation / 100, analysisYears)
  const buyNetCost = buyTotalCost - futurePropertyValue

  // Find break-even point
  let breakEvenYears = analysisYears
  for (let year = 1; year <= analysisYears; year++) {
    const rentCostAtYear = monthlyRent * 12 * ((Math.pow(1.03, year) - 1) / 0.03)
    const buyNetAtYear = downPayment + mortgage.monthlyPayment * Math.min(year * 12, mortgageYears * 12) -
      propertyPrice * Math.pow(1 + annualAppreciation / 100, year)

    if (buyNetAtYear < rentCostAtYear) {
      breakEvenYears = year
      break
    }
  }

  let recommendation: 'buy' | 'rent' | 'neutral' = 'neutral'
  if (buyNetCost < rentTotalCost * 0.9) {
    recommendation = 'buy'
  } else if (rentTotalCost < buyNetCost * 0.9) {
    recommendation = 'rent'
  }

  return {
    buyTotalCost,
    rentTotalCost,
    buyNetCost,
    breakEvenYears,
    recommendation,
  }
}
