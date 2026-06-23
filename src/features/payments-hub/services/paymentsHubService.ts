import type {
  ConfirmPaymentInput,
  CreateCheckoutInput,
  CreateFxQuoteInput,
  CheckoutSession,
  Financing,
  FxQuote,
  HubHomeMetrics,
  Invoice,
  PaymentConfirmation,
  PaymentOperation,
} from '../types'
import { mockFinancings, mockInvoices, mockOperations } from '../mocks/data'
import { delay } from '../utils/delay'
import { isForeignCurrency } from '../utils/currency'

const FX_RATES_TO_COP: Record<string, number> = {
  USD: 4150,
  EUR: 4520,
  GBP: 5280,
  MXN: 245,
  JPY: 28,
  COP: 1,
}

let quoteCounter = 1000
let checkoutCounter = 2000
let operationCounter = 9000

function sumByCurrency<T extends { amount: number; currency: string }>(
  items: T[],
  currency: string,
): number {
  return items
    .filter((item) => item.currency === currency)
    .reduce((total, item) => total + item.amount, 0)
}

export async function getPendingFinancings(): Promise<Financing[]> {
  await delay(700)
  return mockFinancings.filter((item) => item.status !== 'paid')
}

export async function getPendingInvoices(): Promise<Invoice[]> {
  await delay(700)
  return mockInvoices.filter((item) => item.status !== 'paid')
}

export async function getHubHomeMetrics(): Promise<HubHomeMetrics> {
  await delay(400)
  const pendingFinancings = mockFinancings.filter((f) => f.status === 'pending' || f.status === 'overdue').length
  const pendingInvoices = mockInvoices.filter((i) => i.status === 'pending' || i.status === 'overdue').length
  const foreignCurrencyInvoices = mockInvoices.filter(
    (i) => isForeignCurrency(i.currency) && i.status !== 'paid',
  ).length

  return {
    pendingFinancings,
    pendingInvoices,
    foreignCurrencyInvoices,
    totalOperations: mockOperations.length,
    nextFinancingDueDate: '15 Feb 2025',
    totalInvoicesAmount: 24_350,
    totalInvoicesCurrency: 'USD',
    availableCurrencies: 'EUR, GBP, JPY',
    lastPaymentDate: '10 Ene 2025',
  }
}

export async function createFxQuote(input: CreateFxQuoteInput): Promise<FxQuote> {
  await delay(900)

  const sourceItems =
    input.itemType === 'financing'
      ? mockFinancings.filter((f) => input.itemIds.includes(f.id))
      : mockInvoices.filter((i) => input.itemIds.includes(i.id))

  if (sourceItems.length === 0) {
    throw new Error('No se encontraron ítems para cotizar.')
  }

  const sourceCurrency = sourceItems[0]!.currency
  const hasMixedCurrencies = sourceItems.some((item) => item.currency !== sourceCurrency)

  if (hasMixedCurrencies) {
    throw new Error('Selecciona ítems en una sola moneda para continuar con la cotización FX.')
  }

  const targetCurrency = input.targetCurrency ?? 'COP'
  const sourceAmount = sourceItems.reduce((total, item) => total + item.amount, 0)
  const rate = FX_RATES_TO_COP[sourceCurrency]! / FX_RATES_TO_COP[targetCurrency]!
  const targetAmount = Math.round(sourceAmount * rate * 100) / 100

  quoteCounter += 1
  const generatedAt = new Date().toISOString()

  return {
    id: `quote-${quoteCounter}`,
    sourceCurrency,
    targetCurrency,
    sourceAmount,
    targetAmount,
    rate,
    spreadPercent: 0.35,
    feePercent: 0.35,
    country: 'Colombia',
    generatedAt,
    expiresAt: new Date(Date.now() + 60 * 1000).toISOString(),
    itemIds: input.itemIds,
    itemType: input.itemType,
    itemsCount: sourceItems.length,
  }
}

export async function createCheckout(input: CreateCheckoutInput): Promise<CheckoutSession> {
  await delay(800)
  checkoutCounter += 1

  return {
    id: `checkout-${checkoutCounter}`,
    quoteId: input.quoteId,
    method: input.method,
    totalAmount: 0,
    currency: 'COP',
    reference: `CHK-${checkoutCounter}`,
    createdAt: new Date().toISOString(),
    fxRateAccepted: 1,
    sourceAmount: 0,
    sourceCurrency: 'COP',
    collectionCountry: 'Colombia',
    itemsCount: 0,
    itemReferences: [],
  }
}

export async function createCheckoutFromItems(
  itemIds: string[],
  itemType: 'financing' | 'invoice',
  method: CreateCheckoutInput['method'],
  quote?: FxQuote,
): Promise<CheckoutSession> {
  await delay(800)
  checkoutCounter += 1

  const items =
    itemType === 'financing'
      ? mockFinancings.filter((f) => itemIds.includes(f.id))
      : mockInvoices.filter((i) => itemIds.includes(i.id))

  const totalAmount = quote?.targetAmount ?? items.reduce((sum, item) => sum + item.amount, 0)
  const currency = quote?.targetCurrency ?? items[0]?.currency ?? 'COP'

  const itemReferences =
    itemType === 'financing'
      ? items.map((f) => (f as Financing).reference)
      : items.map((i) => (i as Invoice).number)

  return {
    id: `checkout-${checkoutCounter}`,
    quoteId: quote?.id ?? `local-${checkoutCounter}`,
    method,
    totalAmount,
    currency,
    reference: `FK-2025-${String(checkoutCounter).slice(-5)}`,
    createdAt: new Date().toISOString(),
    fxRateAccepted: quote?.rate ?? 1,
    sourceAmount: quote?.sourceAmount ?? items.reduce((sum, item) => sum + item.amount, 0),
    sourceCurrency: quote?.sourceCurrency ?? items[0]?.currency ?? 'COP',
    collectionCountry: quote?.country ?? 'Colombia',
    itemsCount: items.length,
    itemReferences,
  }
}

export async function confirmPayment(input: ConfirmPaymentInput): Promise<PaymentConfirmation> {
  await delay(1000)
  operationCounter += 1

  return {
    operationId: `OP-${operationCounter}`,
    status: 'success',
    amount: 0,
    currency: 'COP',
    method: 'bank_transfer',
    confirmedAt: new Date().toISOString(),
    reference: input.checkoutId,
    estimatedApplicationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    country: 'Colombia',
    fxRateAccepted: 1,
    sourceAmount: 0,
    sourceCurrency: 'COP',
    itemReferences: [],
  }
}

export async function confirmPaymentWithDetails(
  checkout: CheckoutSession,
): Promise<PaymentConfirmation> {
  await delay(1000)
  operationCounter += 1

  return {
    operationId: `OP-2025-${String(operationCounter).slice(-6)}`,
    status: 'success',
    amount: checkout.totalAmount,
    currency: checkout.currency,
    method: checkout.method,
    confirmedAt: new Date().toISOString(),
    reference: checkout.reference,
    estimatedApplicationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    country: checkout.collectionCountry,
    fxRateAccepted: checkout.fxRateAccepted,
    sourceAmount: checkout.sourceAmount,
    sourceCurrency: checkout.sourceCurrency,
    itemReferences: checkout.itemReferences,
  }
}

export async function getPaymentOperations(filters?: {
  type?: 'financing' | 'invoice'
}): Promise<PaymentOperation[]> {
  await delay(600)
  if (!filters?.type) return [...mockOperations]
  return mockOperations.filter((op) => op.type === filters.type)
}

export function getFinancingsByIds(ids: string[]): Financing[] {
  return mockFinancings.filter((f) => ids.includes(f.id))
}

export function getInvoicesByIds(ids: string[]): Invoice[] {
  return mockInvoices.filter((i) => ids.includes(i.id))
}

export function groupInvoicesByCurrency(invoices: Invoice[]): Record<string, Invoice[]> {
  return invoices.reduce<Record<string, Invoice[]>>((groups, invoice) => {
    const key = invoice.currency
    groups[key] = groups[key] ?? []
    groups[key].push(invoice)
    return groups
  }, {})
}

export function calculateSelectionTotal<T extends { amount: number; currency: string }>(
  items: T[],
): { currency: string; amount: number }[] {
  const totals = new Map<string, number>()
  items.forEach((item) => {
    totals.set(item.currency, (totals.get(item.currency) ?? 0) + item.amount)
  })
  return Array.from(totals.entries()).map(([currency, amount]) => ({ currency, amount }))
}

export async function getFinancingOperations(): Promise<PaymentOperation[]> {
  return getPaymentOperations({ type: 'financing' })
}

export async function getInvoiceOperations(): Promise<PaymentOperation[]> {
  return getPaymentOperations({ type: 'invoice' })
}

export { sumByCurrency }
