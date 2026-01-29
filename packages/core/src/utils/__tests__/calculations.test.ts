import { describe, it, expect } from 'vitest'
import {
  calculateMortgage,
  calculateClosingCosts,
  calculateInvestmentScore,
  calculateMonthlyCost,
  analyzeRentVsBuy,
} from '../calculations'

describe('Calculations', () => {
  describe('calculateMortgage', () => {
    describe('French system', () => {
      it('should calculate fixed monthly payment', () => {
        const result = calculateMortgage({
          principal: 100000,
          annualRate: 8.5,
          years: 20,
          system: 'french',
        })

        // Monthly payment should be consistent
        expect(result.monthlyPayment).toBeCloseTo(868, 0)
        expect(result.schedule.every((s) => Math.abs(s.payment - result.monthlyPayment) < 0.01)).toBe(true)
      })

      it('should calculate total payment correctly', () => {
        const result = calculateMortgage({
          principal: 100000,
          annualRate: 8.5,
          years: 20,
          system: 'french',
        })

        expect(result.totalPayment).toBeCloseTo(result.monthlyPayment * 240, 0)
      })

      it('should end with zero balance', () => {
        const result = calculateMortgage({
          principal: 100000,
          annualRate: 8.5,
          years: 20,
          system: 'french',
        })

        const lastMonth = result.schedule[result.schedule.length - 1]
        expect(lastMonth.balance).toBeLessThan(1) // Allow for floating point
      })
    })

    describe('German system', () => {
      it('should have fixed principal payments', () => {
        const result = calculateMortgage({
          principal: 100000,
          annualRate: 8.5,
          years: 20,
          system: 'german',
        })

        const expectedPrincipal = 100000 / 240
        expect(
          result.schedule.every((s) => Math.abs(s.principal - expectedPrincipal) < 0.01)
        ).toBe(true)
      })

      it('should have decreasing total payments', () => {
        const result = calculateMortgage({
          principal: 100000,
          annualRate: 8.5,
          years: 20,
          system: 'german',
        })

        const firstPayment = result.schedule[0].payment
        const lastPayment = result.schedule[result.schedule.length - 1].payment
        expect(firstPayment).toBeGreaterThan(lastPayment)
      })
    })

    it('should calculate total interest correctly', () => {
      const result = calculateMortgage({
        principal: 100000,
        annualRate: 8.5,
        years: 20,
        system: 'french',
      })

      expect(result.totalInterest).toBe(result.totalPayment - 100000)
    })
  })

  describe('calculateClosingCosts', () => {
    it('should calculate closing costs for used property', () => {
      const result = calculateClosingCosts({
        propertyPrice: 100000,
        isNewConstruction: false,
      })

      expect(result.notaryFees).toBe(2000) // 2%
      expect(result.stampTax).toBe(2500) // 2.5%
      expect(result.registrationFees).toBe(500) // 0.5%
      expect(result.agencyCommission).toBe(3000) // 3%
      expect(result.bankFees).toBe(1000) // 1%
      expect(result.total).toBe(9000)
    })

    it('should calculate closing costs for new construction', () => {
      const result = calculateClosingCosts({
        propertyPrice: 100000,
        isNewConstruction: true,
      })

      expect(result.stampTax).toBe(0) // No stamp tax for new
      expect(result.total).toBe(6500) // Without stamp tax
    })
  })

  describe('calculateInvestmentScore', () => {
    it('should calculate high score for opportunity property in premium location', () => {
      const result = calculateInvestmentScore({
        predictedPriceDiff: -15,
        neighborhood: 'Palermo Soho',
        amenitiesCount: 8,
        pricePerM2: 1999, // Just under 2000 threshold
        predictionConfidence: 0.9,
      })

      expect(result.priceFairness).toBe(95) // -15% diff
      expect(result.locationPremium).toBe(85) // Premium neighborhood
      expect(result.amenitiesValue).toBe(86) // 30 + 8*7 = 86
      expect(result.roiProjection).toBe(90) // Low price/m² (< 2000)
      expect(result.confidence).toBe(90)
      expect(result.total).toBeGreaterThan(85)
    })

    it('should calculate low score for overpriced property', () => {
      const result = calculateInvestmentScore({
        predictedPriceDiff: 15,
        neighborhood: 'Unknown Area',
        amenitiesCount: 1,
        pricePerM2: 5000,
        predictionConfidence: 0.5,
      })

      expect(result.priceFairness).toBe(25) // >10% overpriced
      expect(result.locationPremium).toBe(50) // Unknown area
      expect(result.amenitiesValue).toBe(37) // 30 + 1*7
      expect(result.roiProjection).toBe(30) // High price/m²
      expect(result.total).toBeLessThan(40)
    })

    it('should handle missing prediction data', () => {
      const result = calculateInvestmentScore({
        predictedPriceDiff: undefined,
        neighborhood: 'Villa Crespo',
        amenitiesCount: 4,
        pricePerM2: 3000,
        predictionConfidence: undefined,
      })

      expect(result.priceFairness).toBe(50) // Default
      expect(result.confidence).toBe(50) // Default
      expect(result.locationPremium).toBe(70) // Mid-tier
    })

    it('should cap amenities value at 95', () => {
      const result = calculateInvestmentScore({
        predictedPriceDiff: 0,
        neighborhood: 'Test',
        amenitiesCount: 15, // More than would naturally cap
        pricePerM2: 3000,
        predictionConfidence: 0.8,
      })

      expect(result.amenitiesValue).toBe(95)
    })
  })

  describe('calculateMonthlyCost', () => {
    describe('for rent', () => {
      it('should use price directly for ARS rent', () => {
        const result = calculateMonthlyCost({
          isRent: true,
          price: 500000,
          currency: 'ARS',
          expenses: 50000,
          coveredArea: 50,
          amenitiesCount: 3,
        })

        expect(result.basePayment).toBe(500000)
        expect(result.expenses).toBe(50000)
        expect(result.utilities).toBe(35000 + 6000) // base + amenities
        expect(result.total).toBe(500000 + 50000 + 41000)
      })

      it('should convert USD rent to ARS', () => {
        const result = calculateMonthlyCost({
          isRent: true,
          price: 500,
          currency: 'USD',
          expenses: 50000,
          coveredArea: 50,
          amenitiesCount: 0,
        })

        expect(result.basePayment).toBe(500 * 1100)
      })
    })

    describe('for sale', () => {
      it('should calculate mortgage payment', () => {
        const result = calculateMonthlyCost({
          isRent: false,
          price: 150000,
          currency: 'USD',
          expenses: 30000,
          coveredArea: 60,
          amenitiesCount: 5,
          loanTermYears: 20,
          downPaymentPercent: 30,
        })

        // Should calculate mortgage on 70% of price in ARS
        // loanAmount = 150000 * 1100 * 0.7 = $115.5M ARS
        expect(result.basePayment).toBeGreaterThan(0)
        expect(result.total).toBeGreaterThan(result.basePayment)
      })

      it('should handle different down payments', () => {
        const result30 = calculateMonthlyCost({
          isRent: false,
          price: 100000,
          currency: 'USD',
          expenses: null,
          coveredArea: 50,
          amenitiesCount: 0,
          downPaymentPercent: 30,
        })

        const result50 = calculateMonthlyCost({
          isRent: false,
          price: 100000,
          currency: 'USD',
          expenses: null,
          coveredArea: 50,
          amenitiesCount: 0,
          downPaymentPercent: 50,
        })

        expect(result30.basePayment).toBeGreaterThan(result50.basePayment)
      })
    })

    it('should estimate utilities based on area', () => {
      const small = calculateMonthlyCost({
        isRent: true,
        price: 100000,
        currency: 'ARS',
        expenses: 0,
        coveredArea: 30,
        amenitiesCount: 0,
      })

      const large = calculateMonthlyCost({
        isRent: true,
        price: 100000,
        currency: 'ARS',
        expenses: 0,
        coveredArea: 100,
        amenitiesCount: 0,
      })

      expect(large.utilities).toBeGreaterThan(small.utilities)
    })

    it('should handle null expenses', () => {
      const result = calculateMonthlyCost({
        isRent: true,
        price: 100000,
        currency: 'ARS',
        expenses: null,
        coveredArea: 50,
        amenitiesCount: 0,
      })

      expect(result.expenses).toBe(0)
    })
  })

  describe('analyzeRentVsBuy', () => {
    it('should recommend buy when appreciation is high', () => {
      const result = analyzeRentVsBuy({
        monthlyRent: 500000,
        propertyPrice: 150000 * 1100, // ~165M ARS
        downPaymentPercent: 30,
        mortgageRate: 8.5,
        mortgageYears: 20,
        annualAppreciation: 10, // 10% annual
        analysisYears: 10,
      })

      expect(result.recommendation).toBe('buy')
    })

    it('should calculate break-even point', () => {
      const result = analyzeRentVsBuy({
        monthlyRent: 500000,
        propertyPrice: 100000000, // 100M ARS
        downPaymentPercent: 30,
        mortgageRate: 8.5,
        mortgageYears: 20,
        annualAppreciation: 5,
        analysisYears: 15,
      })

      expect(result.breakEvenYears).toBeGreaterThan(0)
      expect(result.breakEvenYears).toBeLessThanOrEqual(15)
    })

    it('should include all costs', () => {
      const result = analyzeRentVsBuy({
        monthlyRent: 500000,
        propertyPrice: 100000000,
        downPaymentPercent: 30,
        mortgageRate: 8.5,
        mortgageYears: 20,
        annualAppreciation: 5,
        analysisYears: 10,
      })

      expect(result.buyTotalCost).toBeGreaterThan(0)
      expect(result.rentTotalCost).toBeGreaterThan(0)
      expect(result.buyNetCost).toBeDefined()
    })
  })
})
