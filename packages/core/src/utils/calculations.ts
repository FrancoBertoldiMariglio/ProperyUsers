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
