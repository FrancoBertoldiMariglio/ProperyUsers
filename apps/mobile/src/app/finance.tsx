import { View, Text, ScrollView, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useState, useMemo } from 'react'
import Slider from '@react-native-community/slider'

type TabId = 'mortgage' | 'closing' | 'rentvsbuy'

function formatCurrency(amount: number, currency: string = 'USD'): string {
  if (currency === 'USD') {
    return `US$ ${amount.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`
  }
  return `$ ${amount.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`
}

function calculateFrenchPayment(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  const monthlyRate = annualRate / 100 / 12
  if (monthlyRate === 0) return principal / termMonths
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1)
  )
}

export default function FinanceScreen() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabId>('mortgage')

  // Mortgage calculator state
  const [propertyPrice, setPropertyPrice] = useState(150000)
  const [downPaymentPercent, setDownPaymentPercent] = useState(20)
  const [annualRate, setAnnualRate] = useState(5.5)
  const [termYears, setTermYears] = useState(20)

  // Closing costs state
  const [closingPrice, setClosingPrice] = useState(50000000)
  const [isNewConstruction, setIsNewConstruction] = useState(false)

  // Rent vs buy state
  const [monthlyRent, setMonthlyRent] = useState(500000)
  const [buyPrice, setBuyPrice] = useState(50000000)

  // Calculations
  const loanAmount = propertyPrice * (1 - downPaymentPercent / 100)
  const termMonths = termYears * 12
  const monthlyPayment = useMemo(
    () => calculateFrenchPayment(loanAmount, annualRate, termMonths),
    [loanAmount, annualRate, termMonths]
  )
  const totalPayment = monthlyPayment * termMonths
  const totalInterest = totalPayment - loanAmount

  // Closing costs
  const closingCosts = useMemo(() => {
    const notaryFee = closingPrice * 0.02
    const registrationTax = closingPrice * 0.025
    const stampTax = isNewConstruction ? 0 : closingPrice * 0.036
    const commission = closingPrice * 0.03
    const bankFees = 50000
    const appraisal = 30000
    return {
      notaryFee,
      registrationTax,
      stampTax,
      commission,
      bankFees,
      appraisal,
      total: notaryFee + registrationTax + stampTax + commission + bankFees + appraisal,
    }
  }, [closingPrice, isNewConstruction])

  // Rent vs buy analysis (simplified)
  const rentVsBuy = useMemo(() => {
    const years = 10
    const rentGrowth = 1.05
    let totalRent = 0
    let rent = monthlyRent
    for (let y = 1; y <= years; y++) {
      totalRent += rent * 12
      rent *= rentGrowth
    }

    const downPayment = buyPrice * 0.2
    const mortgage = calculateFrenchPayment(buyPrice * 0.8, 5.5, 240)
    const totalMortgage = mortgage * Math.min(years * 12, 240)
    const closing = buyPrice * 0.1
    const maintenance = buyPrice * 0.01 * years
    const appreciation = buyPrice * (Math.pow(1.03, years) - 1)

    const rentCost = totalRent
    const buyCost = downPayment + totalMortgage + closing + maintenance - appreciation

    return {
      rentCost,
      buyCost,
      recommendation: buyCost < rentCost * 0.95 ? 'buy' : rentCost < buyCost * 0.95 ? 'rent' : 'neutral',
    }
  }, [monthlyRent, buyPrice])

  const tabs: Array<{ id: TabId; label: string }> = [
    { id: 'mortgage', label: 'Hipoteca' },
    { id: 'closing', label: 'Escrituración' },
    { id: 'rentvsbuy', label: 'Alquilar vs Comprar' },
  ]

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="border-b border-border px-4 py-4">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => router.back()}>
            <Text className="text-primary">← Volver</Text>
          </Pressable>
          <Text className="text-xl font-bold text-foreground">Calculadoras</Text>
          <View className="w-16" />
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row border-b border-border">
        {tabs.map((tab) => (
          <Pressable
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 ${activeTab === tab.id ? 'border-b-2 border-primary' : ''}`}
          >
            <Text
              className={`text-center text-xs font-medium ${
                activeTab === tab.id ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* Mortgage Calculator */}
        {activeTab === 'mortgage' && (
          <View className="space-y-6">
            {/* Property Price */}
            <View>
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-sm font-medium text-foreground">Precio (USD)</Text>
                <Text className="font-semibold text-primary">
                  {formatCurrency(propertyPrice)}
                </Text>
              </View>
              <Slider
                minimumValue={50000}
                maximumValue={1000000}
                step={10000}
                value={propertyPrice}
                onValueChange={setPropertyPrice}
                minimumTrackTintColor="#3b82f6"
                maximumTrackTintColor="#e5e7eb"
              />
            </View>

            {/* Down Payment */}
            <View>
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-sm font-medium text-foreground">Anticipo</Text>
                <Text className="font-semibold text-primary">{downPaymentPercent}%</Text>
              </View>
              <Slider
                minimumValue={10}
                maximumValue={50}
                step={5}
                value={downPaymentPercent}
                onValueChange={setDownPaymentPercent}
                minimumTrackTintColor="#3b82f6"
                maximumTrackTintColor="#e5e7eb"
              />
            </View>

            {/* Rate */}
            <View>
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-sm font-medium text-foreground">Tasa anual</Text>
                <Text className="font-semibold text-primary">{annualRate.toFixed(1)}%</Text>
              </View>
              <Slider
                minimumValue={3}
                maximumValue={15}
                step={0.5}
                value={annualRate}
                onValueChange={setAnnualRate}
                minimumTrackTintColor="#3b82f6"
                maximumTrackTintColor="#e5e7eb"
              />
            </View>

            {/* Term */}
            <View>
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-sm font-medium text-foreground">Plazo</Text>
                <Text className="font-semibold text-primary">{termYears} años</Text>
              </View>
              <Slider
                minimumValue={5}
                maximumValue={30}
                step={5}
                value={termYears}
                onValueChange={setTermYears}
                minimumTrackTintColor="#3b82f6"
                maximumTrackTintColor="#e5e7eb"
              />
            </View>

            {/* Result */}
            <View className="rounded-xl bg-primary/10 p-4">
              <Text className="mb-2 text-center text-sm text-muted-foreground">
                Cuota mensual estimada
              </Text>
              <Text className="text-center text-3xl font-bold text-primary">
                {formatCurrency(monthlyPayment)}
              </Text>
              <View className="mt-4 flex-row justify-between">
                <View className="items-center">
                  <Text className="text-xs text-muted-foreground">Total a pagar</Text>
                  <Text className="font-semibold text-foreground">
                    {formatCurrency(totalPayment)}
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-xs text-muted-foreground">Intereses</Text>
                  <Text className="font-semibold text-amber-600">
                    {formatCurrency(totalInterest)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Closing Costs */}
        {activeTab === 'closing' && (
          <View className="space-y-6">
            <View>
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-sm font-medium text-foreground">Precio (ARS)</Text>
                <Text className="font-semibold text-primary">
                  {formatCurrency(closingPrice, 'ARS')}
                </Text>
              </View>
              <Slider
                minimumValue={10000000}
                maximumValue={200000000}
                step={5000000}
                value={closingPrice}
                onValueChange={setClosingPrice}
                minimumTrackTintColor="#3b82f6"
                maximumTrackTintColor="#e5e7eb"
              />
            </View>

            <Pressable
              onPress={() => setIsNewConstruction(!isNewConstruction)}
              className="flex-row items-center"
            >
              <View
                className={`mr-3 h-5 w-5 rounded border-2 ${
                  isNewConstruction ? 'border-primary bg-primary' : 'border-border'
                }`}
              >
                {isNewConstruction && (
                  <Text className="text-center text-xs text-white">✓</Text>
                )}
              </View>
              <Text className="text-foreground">Propiedad a estrenar</Text>
            </Pressable>

            {/* Breakdown */}
            <View className="space-y-2">
              {[
                { label: 'Escribanía (2%)', value: closingCosts.notaryFee },
                { label: 'Inscripción (2.5%)', value: closingCosts.registrationTax },
                { label: 'Sellos (3.6%)', value: closingCosts.stampTax },
                { label: 'Comisión (3%)', value: closingCosts.commission },
                { label: 'Gastos bancarios', value: closingCosts.bankFees },
                { label: 'Tasación', value: closingCosts.appraisal },
              ].map((item) => (
                <View
                  key={item.label}
                  className="flex-row items-center justify-between rounded-lg bg-muted/30 px-3 py-2"
                >
                  <Text className="text-sm text-foreground">{item.label}</Text>
                  <Text className={`font-medium ${item.value === 0 ? 'text-muted-foreground' : 'text-foreground'}`}>
                    {item.value === 0 ? '-' : formatCurrency(item.value, 'ARS')}
                  </Text>
                </View>
              ))}
            </View>

            {/* Total */}
            <View className="rounded-xl bg-primary/10 p-4">
              <Text className="mb-1 text-center text-sm text-muted-foreground">
                Total gastos estimados
              </Text>
              <Text className="text-center text-2xl font-bold text-primary">
                {formatCurrency(closingCosts.total, 'ARS')}
              </Text>
              <Text className="mt-1 text-center text-xs text-muted-foreground">
                {((closingCosts.total / closingPrice) * 100).toFixed(1)}% del precio
              </Text>
            </View>
          </View>
        )}

        {/* Rent vs Buy */}
        {activeTab === 'rentvsbuy' && (
          <View className="space-y-6">
            <View>
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-sm font-medium text-foreground">Alquiler mensual</Text>
                <Text className="font-semibold text-primary">
                  {formatCurrency(monthlyRent, 'ARS')}
                </Text>
              </View>
              <Slider
                minimumValue={100000}
                maximumValue={2000000}
                step={50000}
                value={monthlyRent}
                onValueChange={setMonthlyRent}
                minimumTrackTintColor="#3b82f6"
                maximumTrackTintColor="#e5e7eb"
              />
            </View>

            <View>
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-sm font-medium text-foreground">Precio de compra</Text>
                <Text className="font-semibold text-primary">
                  {formatCurrency(buyPrice, 'ARS')}
                </Text>
              </View>
              <Slider
                minimumValue={10000000}
                maximumValue={200000000}
                step={5000000}
                value={buyPrice}
                onValueChange={setBuyPrice}
                minimumTrackTintColor="#3b82f6"
                maximumTrackTintColor="#e5e7eb"
              />
            </View>

            {/* Recommendation */}
            <View
              className={`items-center rounded-xl p-6 ${
                rentVsBuy.recommendation === 'buy'
                  ? 'bg-green-500/10'
                  : rentVsBuy.recommendation === 'rent'
                    ? 'bg-blue-500/10'
                    : 'bg-amber-500/10'
              }`}
            >
              <Text className="text-4xl">
                {rentVsBuy.recommendation === 'buy'
                  ? '🏠'
                  : rentVsBuy.recommendation === 'rent'
                    ? '🔑'
                    : '⚖️'}
              </Text>
              <Text className="mt-2 text-lg font-bold text-foreground">
                {rentVsBuy.recommendation === 'buy'
                  ? 'Te conviene COMPRAR'
                  : rentVsBuy.recommendation === 'rent'
                    ? 'Te conviene ALQUILAR'
                    : 'Están muy parejos'}
              </Text>
              <Text className="mt-1 text-sm text-muted-foreground">
                Análisis a 10 años
              </Text>
            </View>

            {/* Comparison */}
            <View className="flex-row gap-4">
              <View className="flex-1 items-center rounded-xl bg-blue-500/10 p-4">
                <Text className="text-2xl">🔑</Text>
                <Text className="mt-1 text-xs text-muted-foreground">Costo alquilar</Text>
                <Text className="font-bold text-blue-600">
                  {formatCurrency(rentVsBuy.rentCost, 'ARS')}
                </Text>
              </View>
              <View className="flex-1 items-center rounded-xl bg-green-500/10 p-4">
                <Text className="text-2xl">🏠</Text>
                <Text className="mt-1 text-xs text-muted-foreground">Costo comprar</Text>
                <Text className="font-bold text-green-600">
                  {formatCurrency(rentVsBuy.buyCost, 'ARS')}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
