import { describe, it, expect } from 'vitest'
import {
  calculateFrenchPayment,
  calculateGermanPayment,
  calculateMortgageBreakdown,
  calculateClosingCosts,
  analyzeRentVsBuy,
} from '@propery/api-client/mocks'

describe('Finance Calculations', () => {
  describe('calculateFrenchPayment', () => {
    it('should calculate correct monthly payment for typical mortgage', () => {
      // $100,000 loan at 5% for 30 years
      const payment = calculateFrenchPayment(100000, 5, 360)

      // Expected monthly payment: ~$536.82
      expect(payment).toBeCloseTo(536.82, 0)
    })

    it('should handle 0% interest rate', () => {
      const payment = calculateFrenchPayment(120000, 0, 120)

      // Simple division: 120000 / 120 = 1000
      expect(payment).toBe(1000)
    })

    it('should calculate higher payment for shorter term', () => {
      const payment15yr = calculateFrenchPayment(100000, 5, 180)
      const payment30yr = calculateFrenchPayment(100000, 5, 360)

      expect(payment15yr).toBeGreaterThan(payment30yr)
    })

    it('should calculate higher payment for higher rate', () => {
      const paymentLow = calculateFrenchPayment(100000, 4, 360)
      const paymentHigh = calculateFrenchPayment(100000, 8, 360)

      expect(paymentHigh).toBeGreaterThan(paymentLow)
    })
  })

  describe('calculateGermanPayment', () => {
    it('should calculate first month payment', () => {
      // $100,000 loan at 6% for 10 years (120 months)
      const firstPayment = calculateGermanPayment(100000, 6, 120, 1)

      // Principal: 100000/120 = 833.33
      // Interest: 100000 * 0.06/12 = 500
      // Total: 1333.33
      expect(firstPayment).toBeCloseTo(1333.33, 0)
    })

    it('should have decreasing payments over time', () => {
      const firstPayment = calculateGermanPayment(100000, 6, 120, 1)
      const lastPayment = calculateGermanPayment(100000, 6, 120, 120)

      expect(firstPayment).toBeGreaterThan(lastPayment)
    })

    it('should have constant principal component', () => {
      const principal = 100000
      const termMonths = 120
      const expectedPrincipal = principal / termMonths

      // For German system, principal payment is fixed
      const payment1 = calculateGermanPayment(principal, 6, termMonths, 1)
      const payment60 = calculateGermanPayment(principal, 6, termMonths, 60)

      // Both payments include same principal + different interest
      // We can verify the difference is only in interest component
      const interestMonth1 = payment1 - expectedPrincipal
      const interestMonth60 = payment60 - expectedPrincipal

      expect(interestMonth1).toBeGreaterThan(interestMonth60)
    })
  })

  describe('calculateMortgageBreakdown', () => {
    it('should return correct breakdown for French system', () => {
      const breakdown = calculateMortgageBreakdown(100000, 5, 120, 'french')

      expect(breakdown.monthlyPayment).toBeCloseTo(1060.66, 0)
      expect(breakdown.firstPayment).toBe(breakdown.lastPayment) // French has equal payments
      expect(breakdown.totalInterest).toBeGreaterThan(0)
      expect(breakdown.totalPayment).toBeGreaterThan(100000)
      expect(breakdown.schedule).toHaveLength(120)
    })

    it('should return correct breakdown for German system', () => {
      const breakdown = calculateMortgageBreakdown(100000, 5, 120, 'german')

      expect(breakdown.firstPayment).toBeGreaterThan(breakdown.lastPayment)
      expect(breakdown.totalInterest).toBeGreaterThan(0)
      expect(breakdown.schedule).toHaveLength(120)
    })

    it('should have zero balance at end of schedule', () => {
      const breakdown = calculateMortgageBreakdown(100000, 5, 120, 'french')
      const lastEntry = breakdown.schedule[breakdown.schedule.length - 1]

      expect(lastEntry.balance).toBeCloseTo(0, 0)
    })

    it('should have total payment equal to sum of schedule', () => {
      const breakdown = calculateMortgageBreakdown(100000, 5, 60, 'french')
      const sumOfPayments = breakdown.schedule.reduce((sum, entry) => sum + entry.payment, 0)

      expect(breakdown.totalPayment).toBeCloseTo(sumOfPayments, 0)
    })
  })

  describe('calculateClosingCosts', () => {
    it('should calculate closing costs for standard purchase', () => {
      const costs = calculateClosingCosts(50000000, false, true)

      expect(costs.notaryFee).toBe(50000000 * 0.02) // 2%
      expect(costs.registrationTax).toBe(50000000 * 0.025) // 2.5%
      expect(costs.stampTax).toBe(50000000 * 0.036) // 3.6%
      expect(costs.realEstateCommission).toBe(50000000 * 0.03) // 3%
      expect(costs.total).toBeGreaterThan(0)
    })

    it('should have no stamp tax for new construction', () => {
      const costs = calculateClosingCosts(50000000, true, true)

      expect(costs.stampTax).toBe(0)
    })

    it('should exclude commission when specified', () => {
      const withCommission = calculateClosingCosts(50000000, false, true)
      const withoutCommission = calculateClosingCosts(50000000, false, false)

      expect(withoutCommission.realEstateCommission).toBe(0)
      expect(withoutCommission.total).toBeLessThan(withCommission.total)
    })

    it('should have fixed bank and appraisal fees', () => {
      const costsLow = calculateClosingCosts(10000000, false, true)
      const costsHigh = calculateClosingCosts(100000000, false, true)

      expect(costsLow.bankFees).toBe(costsHigh.bankFees)
      expect(costsLow.appraisalFee).toBe(costsHigh.appraisalFee)
    })
  })

  describe('analyzeRentVsBuy', () => {
    it('should return analysis with recommendation', () => {
      const analysis = analyzeRentVsBuy(
        500000, // monthly rent
        50000000, // property price
        20, // down payment %
        5.5, // mortgage rate
        20, // mortgage term years
        10 // analysis years
      )

      expect(analysis.years).toBe(10)
      expect(['rent', 'buy', 'neutral']).toContain(analysis.recommendation)
      expect(analysis.rentScenario.totalRentPaid).toBeGreaterThan(0)
      expect(analysis.buyScenario.totalMortgagePayments).toBeGreaterThan(0)
    })

    it('should calculate rent growth over time', () => {
      const analysis = analyzeRentVsBuy(500000, 50000000, 20, 5.5, 20, 10)

      // With 5% annual increase, 10 years of rent should be more than 10 * 12 * 500000
      const baseRent = 500000 * 12 * 10
      expect(analysis.rentScenario.totalRentPaid).toBeGreaterThan(baseRent)
    })

    it('should calculate property appreciation', () => {
      const analysis = analyzeRentVsBuy(500000, 50000000, 20, 5.5, 20, 10)

      // With 3% annual appreciation, property should appreciate
      expect(analysis.buyScenario.propertyAppreciation).toBeGreaterThan(0)
    })

    it('should calculate equity correctly', () => {
      const analysis = analyzeRentVsBuy(500000, 50000000, 20, 5.5, 20, 10)

      // Equity = down payment + principal paid + appreciation
      expect(analysis.buyScenario.equity).toBeGreaterThan(
        50000000 * 0.2 // At minimum, more than down payment
      )
    })

    it('should find break-even point when applicable', () => {
      const analysis = analyzeRentVsBuy(
        300000, // Lower rent
        100000000, // High property price
        20,
        8, // High rate
        20,
        5 // Short period
      )

      // With expensive property and short period, might not break even
      // Just verify it returns a number or null
      expect(
        analysis.breakEvenYears === null || typeof analysis.breakEvenYears === 'number'
      ).toBe(true)
    })
  })
})
