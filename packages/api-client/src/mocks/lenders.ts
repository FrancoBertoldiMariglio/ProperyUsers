export interface Lender {
  id: string
  name: string
  logo: string
  type: 'bank' | 'fintech' | 'government'
  products: LenderProduct[]
  contact: {
    phone: string
    website: string
    email?: string
  }
  requirements: string[]
}

export interface LenderProduct {
  id: string
  name: string
  type: 'mortgage' | 'personal' | 'uva'
  currency: 'USD' | 'ARS' | 'UVA'
  minAmount: number
  maxAmount: number
  minTermMonths: number
  maxTermMonths: number
  annualRate: number // TNA
  system: 'french' | 'german'
  downPaymentMin: number // Percentage
  maxLTV: number // Loan to Value ratio
  features: string[]
}

export const mockLenders: Lender[] = [
  {
    id: 'banco-nacion',
    name: 'Banco Nación',
    logo: 'https://www.bna.com.ar/Images/logo.png',
    type: 'bank',
    products: [
      {
        id: 'nacion-uva',
        name: 'Crédito Hipotecario UVA',
        type: 'uva',
        currency: 'UVA',
        minAmount: 500000,
        maxAmount: 50000000,
        minTermMonths: 60,
        maxTermMonths: 360,
        annualRate: 5.5,
        system: 'french',
        downPaymentMin: 20,
        maxLTV: 80,
        features: [
          'Tasa fija en UVA',
          'Plazo hasta 30 años',
          'Sin comisión de otorgamiento',
          'Seguro de vida incluido',
        ],
      },
      {
        id: 'nacion-tradicional',
        name: 'Crédito Hipotecario Tradicional',
        type: 'mortgage',
        currency: 'ARS',
        minAmount: 1000000,
        maxAmount: 100000000,
        minTermMonths: 60,
        maxTermMonths: 240,
        annualRate: 45,
        system: 'french',
        downPaymentMin: 25,
        maxLTV: 75,
        features: [
          'Tasa fija primeros 3 años',
          'Plazo hasta 20 años',
          'Apto monoambientes',
        ],
      },
    ],
    contact: {
      phone: '0810-666-4444',
      website: 'https://www.bna.com.ar',
      email: 'consultas@bna.com.ar',
    },
    requirements: [
      'DNI argentino',
      'Antigüedad laboral mínima 1 año',
      'Relación cuota/ingreso máxima 30%',
      'Sin deudas en BCRA',
    ],
  },
  {
    id: 'banco-hipotecario',
    name: 'Banco Hipotecario',
    logo: 'https://www.hipotecario.com.ar/images/logo.svg',
    type: 'bank',
    products: [
      {
        id: 'hipotecario-primera',
        name: 'Mi Primera Casa',
        type: 'uva',
        currency: 'UVA',
        minAmount: 1000000,
        maxAmount: 80000000,
        minTermMonths: 120,
        maxTermMonths: 360,
        annualRate: 4.9,
        system: 'french',
        downPaymentMin: 15,
        maxLTV: 85,
        features: [
          'Especial primera vivienda',
          'Menor anticipo',
          'Tasa preferencial',
          'Subsidio estatal disponible',
        ],
      },
      {
        id: 'hipotecario-standard',
        name: 'Crédito Hipotecario Standard',
        type: 'uva',
        currency: 'UVA',
        minAmount: 2000000,
        maxAmount: 150000000,
        minTermMonths: 60,
        maxTermMonths: 300,
        annualRate: 6.0,
        system: 'french',
        downPaymentMin: 20,
        maxLTV: 80,
        features: [
          'Segunda vivienda permitida',
          'Refacción incluida',
          'Pre-aprobación online',
        ],
      },
    ],
    contact: {
      phone: '0800-222-4798',
      website: 'https://www.hipotecario.com.ar',
    },
    requirements: [
      'DNI argentino o residencia permanente',
      'Antigüedad laboral 6 meses',
      'Ingresos demostrables',
      'Edad máxima 65 años al finalizar',
    ],
  },
  {
    id: 'banco-ciudad',
    name: 'Banco Ciudad',
    logo: 'https://www.bancociudad.com.ar/images/logo.png',
    type: 'bank',
    products: [
      {
        id: 'ciudad-uva',
        name: 'Crédito UVA Ciudad',
        type: 'uva',
        currency: 'UVA',
        minAmount: 800000,
        maxAmount: 60000000,
        minTermMonths: 60,
        maxTermMonths: 360,
        annualRate: 5.25,
        system: 'french',
        downPaymentMin: 20,
        maxLTV: 80,
        features: [
          'Exclusivo CABA',
          'Tasa competitiva',
          'Bonificación empleados públicos',
        ],
      },
    ],
    contact: {
      phone: '0800-222-2438',
      website: 'https://www.bancociudad.com.ar',
    },
    requirements: [
      'DNI argentino',
      'Propiedad en CABA',
      'Antigüedad laboral 1 año',
      'Sin embargos ni inhibiciones',
    ],
  },
  {
    id: 'banco-galicia',
    name: 'Banco Galicia',
    logo: 'https://www.galicia.ar/images/logo.svg',
    type: 'bank',
    products: [
      {
        id: 'galicia-hipotecario',
        name: 'Crédito Hipotecario Galicia',
        type: 'mortgage',
        currency: 'USD',
        minAmount: 30000,
        maxAmount: 500000,
        minTermMonths: 60,
        maxTermMonths: 240,
        annualRate: 8.5,
        system: 'french',
        downPaymentMin: 30,
        maxLTV: 70,
        features: [
          'Crédito en dólares',
          'Tasa fija',
          'Plazo hasta 20 años',
          'Pack de beneficios',
        ],
      },
    ],
    contact: {
      phone: '0810-444-6500',
      website: 'https://www.galicia.ar',
    },
    requirements: [
      'Cliente Galicia',
      'Ingresos en USD o equivalente',
      'Antigüedad laboral 2 años',
      'Garantía hipotecaria',
    ],
  },
  {
    id: 'procrear',
    name: 'PROCREAR',
    logo: 'https://www.argentina.gob.ar/sites/default/files/procrear-logo.png',
    type: 'government',
    products: [
      {
        id: 'procrear-casa-propia',
        name: 'Casa Propia',
        type: 'uva',
        currency: 'UVA',
        minAmount: 2000000,
        maxAmount: 40000000,
        minTermMonths: 120,
        maxTermMonths: 360,
        annualRate: 3.5,
        system: 'french',
        downPaymentMin: 10,
        maxLTV: 90,
        features: [
          'Subsidio estatal',
          'Menor tasa del mercado',
          'Sorteo por inscripción',
          'Primera vivienda únicamente',
        ],
      },
    ],
    contact: {
      phone: '0800-222-7376',
      website: 'https://www.argentina.gob.ar/habitat/procrear',
    },
    requirements: [
      'Inscripción en sorteo',
      'No poseer propiedad',
      'Ingresos familiares entre 2 y 8 SMVM',
      'Grupo familiar constituido',
    ],
  },
]

// Calculate monthly payment using French amortization system
export function calculateFrenchPayment(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  const monthlyRate = annualRate / 100 / 12
  if (monthlyRate === 0) return principal / termMonths

  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1)

  return payment
}

// Calculate monthly payment using German amortization system
export function calculateGermanPayment(
  principal: number,
  annualRate: number,
  termMonths: number,
  currentMonth: number = 1
): number {
  const monthlyRate = annualRate / 100 / 12
  const fixedPrincipal = principal / termMonths
  const remainingBalance = principal - fixedPrincipal * (currentMonth - 1)
  const interest = remainingBalance * monthlyRate

  return fixedPrincipal + interest
}

// Calculate total cost breakdown
export function calculateMortgageBreakdown(
  principal: number,
  annualRate: number,
  termMonths: number,
  system: 'french' | 'german' = 'french'
): {
  monthlyPayment: number
  firstPayment: number
  lastPayment: number
  totalPayment: number
  totalInterest: number
  schedule: Array<{
    month: number
    payment: number
    principal: number
    interest: number
    balance: number
  }>
} {
  const schedule: Array<{
    month: number
    payment: number
    principal: number
    interest: number
    balance: number
  }> = []

  let balance = principal
  let totalPayment = 0
  const monthlyRate = annualRate / 100 / 12

  if (system === 'french') {
    const payment = calculateFrenchPayment(principal, annualRate, termMonths)

    for (let month = 1; month <= termMonths; month++) {
      const interest = balance * monthlyRate
      const principalPart = payment - interest
      balance -= principalPart
      totalPayment += payment

      schedule.push({
        month,
        payment,
        principal: principalPart,
        interest,
        balance: Math.max(0, balance),
      })
    }

    return {
      monthlyPayment: payment,
      firstPayment: payment,
      lastPayment: payment,
      totalPayment,
      totalInterest: totalPayment - principal,
      schedule,
    }
  } else {
    // German system
    const fixedPrincipal = principal / termMonths
    let firstPayment = 0
    let lastPayment = 0

    for (let month = 1; month <= termMonths; month++) {
      const interest = balance * monthlyRate
      const payment = fixedPrincipal + interest
      balance -= fixedPrincipal
      totalPayment += payment

      if (month === 1) firstPayment = payment
      if (month === termMonths) lastPayment = payment

      schedule.push({
        month,
        payment,
        principal: fixedPrincipal,
        interest,
        balance: Math.max(0, balance),
      })
    }

    return {
      monthlyPayment: (firstPayment + lastPayment) / 2, // Average
      firstPayment,
      lastPayment,
      totalPayment,
      totalInterest: totalPayment - principal,
      schedule,
    }
  }
}

// Closing costs calculation for Argentina
export interface ClosingCosts {
  notaryFee: number
  registrationTax: number
  stampTax: number
  realEstateCommission: number
  bankFees: number
  appraisalFee: number
  titleInsurance: number
  total: number
}

export function calculateClosingCosts(
  propertyPrice: number,
  isNewConstruction: boolean = false,
  includeCommission: boolean = true
): ClosingCosts {
  // Argentine rates (approximate)
  const notaryFee = propertyPrice * 0.02 // 2% escribanía
  const registrationTax = propertyPrice * 0.025 // 2.5% inscripción
  const stampTax = propertyPrice * (isNewConstruction ? 0 : 0.036) // 3.6% sellos (0 for new)
  const realEstateCommission = includeCommission ? propertyPrice * 0.03 : 0 // 3% inmobiliaria
  const bankFees = 50000 // Fixed bank fees
  const appraisalFee = 30000 // Tasación
  const titleInsurance = propertyPrice * 0.003 // 0.3% seguro de título

  const total =
    notaryFee +
    registrationTax +
    stampTax +
    realEstateCommission +
    bankFees +
    appraisalFee +
    titleInsurance

  return {
    notaryFee,
    registrationTax,
    stampTax,
    realEstateCommission,
    bankFees,
    appraisalFee,
    titleInsurance,
    total,
  }
}

// Rent vs Buy analysis
export interface RentVsBuyAnalysis {
  years: number
  rentScenario: {
    totalRentPaid: number
    opportunityCost: number // Investment returns on down payment
    totalCost: number
  }
  buyScenario: {
    downPayment: number
    totalMortgagePayments: number
    closingCosts: number
    maintenanceCosts: number
    propertyAppreciation: number
    totalCost: number
    equity: number
  }
  recommendation: 'rent' | 'buy' | 'neutral'
  breakEvenYears: number | null
}

export function analyzeRentVsBuy(
  monthlyRent: number,
  propertyPrice: number,
  downPaymentPercent: number,
  mortgageRate: number,
  mortgageTermYears: number,
  years: number,
  annualRentIncrease: number = 0.05, // 5% annual rent increase
  annualAppreciation: number = 0.03, // 3% property appreciation
  investmentReturn: number = 0.07 // 7% opportunity cost of capital
): RentVsBuyAnalysis {
  const downPayment = propertyPrice * (downPaymentPercent / 100)
  const loanAmount = propertyPrice - downPayment
  const mortgageTermMonths = mortgageTermYears * 12

  // Rent scenario
  let totalRentPaid = 0
  let currentRent = monthlyRent
  for (let year = 1; year <= years; year++) {
    totalRentPaid += currentRent * 12
    currentRent *= 1 + annualRentIncrease
  }

  // Opportunity cost: if you invested the down payment instead
  const opportunityCost = downPayment * Math.pow(1 + investmentReturn, years) - downPayment

  // Buy scenario
  const mortgage = calculateMortgageBreakdown(loanAmount, mortgageRate, mortgageTermMonths)
  const yearsOfPayments = Math.min(years, mortgageTermYears)
  const totalMortgagePayments = mortgage.monthlyPayment * yearsOfPayments * 12

  const closingCosts = calculateClosingCosts(propertyPrice).total
  const maintenanceCosts = propertyPrice * 0.01 * years // 1% per year

  const futurePropertyValue = propertyPrice * Math.pow(1 + annualAppreciation, years)
  const propertyAppreciation = futurePropertyValue - propertyPrice

  // Calculate equity after years
  const monthsElapsed = years * 12
  let equity = downPayment
  if (monthsElapsed <= mortgageTermMonths) {
    const paidPrincipal = mortgage.schedule
      .slice(0, monthsElapsed)
      .reduce((sum, m) => sum + m.principal, 0)
    equity += paidPrincipal
  } else {
    equity += loanAmount // Fully paid
  }
  equity += propertyAppreciation

  const rentTotalCost = totalRentPaid - opportunityCost
  const buyTotalCost =
    downPayment + totalMortgagePayments + closingCosts + maintenanceCosts - propertyAppreciation

  // Find break-even point
  let breakEvenYears: number | null = null
  for (let y = 1; y <= 30; y++) {
    const analysis = analyzeRentVsBuySimple(
      monthlyRent,
      propertyPrice,
      downPaymentPercent,
      mortgageRate,
      mortgageTermYears,
      y
    )
    if (analysis.buyIsCheaper && !breakEvenYears) {
      breakEvenYears = y
      break
    }
  }

  const recommendation: 'rent' | 'buy' | 'neutral' =
    rentTotalCost < buyTotalCost * 0.95
      ? 'rent'
      : buyTotalCost < rentTotalCost * 0.95
        ? 'buy'
        : 'neutral'

  return {
    years,
    rentScenario: {
      totalRentPaid,
      opportunityCost,
      totalCost: rentTotalCost,
    },
    buyScenario: {
      downPayment,
      totalMortgagePayments,
      closingCosts,
      maintenanceCosts,
      propertyAppreciation,
      totalCost: buyTotalCost,
      equity,
    },
    recommendation,
    breakEvenYears,
  }
}

function analyzeRentVsBuySimple(
  monthlyRent: number,
  propertyPrice: number,
  downPaymentPercent: number,
  mortgageRate: number,
  mortgageTermYears: number,
  years: number
): { buyIsCheaper: boolean } {
  // Simplified calculation without recursion
  const downPayment = propertyPrice * (downPaymentPercent / 100)
  const loanAmount = propertyPrice - downPayment
  const termMonths = mortgageTermYears * 12

  // Rent cost
  let totalRentPaid = 0
  let currentRent = monthlyRent
  for (let year = 1; year <= years; year++) {
    totalRentPaid += currentRent * 12
    currentRent *= 1.05 // 5% annual increase
  }
  const opportunityCost = downPayment * (Math.pow(1.07, years) - 1)
  const rentTotalCost = totalRentPaid - opportunityCost

  // Buy cost
  const monthlyRate = mortgageRate / 100 / 12
  const mortgagePayment =
    monthlyRate === 0
      ? loanAmount / termMonths
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
        (Math.pow(1 + monthlyRate, termMonths) - 1)

  const yearsOfPayments = Math.min(years, mortgageTermYears)
  const totalMortgagePayments = mortgagePayment * yearsOfPayments * 12
  const closingCosts = propertyPrice * 0.1
  const maintenanceCosts = propertyPrice * 0.01 * years
  const appreciation = propertyPrice * (Math.pow(1.03, years) - 1)

  const buyTotalCost =
    downPayment + totalMortgagePayments + closingCosts + maintenanceCosts - appreciation

  return { buyIsCheaper: buyTotalCost < rentTotalCost }
}
