import type {
  ConfirmPaymentInput,
  CreateCheckoutInput,
  CreateFxQuoteInput,
  CheckoutSession,
  DirectInvoiceQuote,
  DirectInvoiceQuoteRequest,
  DirectInvoiceTransferConfirmation,
  DirectInvoiceUploadMeta,
  Financing,
  FxQuote,
  HubHomeMetrics,
  ImportReconciliationGroup,
  Invoice,
  PaymentConfirmation,
  PaymentOperation,
} from '../types'
import { mockFinancings, mockInvoices, mockOperations } from '../mocks/data'
import { delay } from '../utils/delay'

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

  return {
    pendingFinancings,
    pendingInvoices,
    totalOperations: mockOperations.length,
    nextFinancingDueDate: '15 Feb 2025',
    totalInvoicesAmount: 24_350,
    totalInvoicesCurrency: 'USD',
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
  const sourceAmount =
    input.amountOverride ?? sourceItems.reduce((total, item) => total + item.amount, 0)
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

/**
 * Reconciliación por importación: pagado vs pendiente.
 * // TODO: reemplazar por integración real (ledger + facturas/financiaciones por importOperationId)
 */
export async function getImportReconciliations(): Promise<ImportReconciliationGroup[]> {
  await delay(500)

  const labels: Record<string, string> = {
    'IMP-2026-1001': 'Importación Shenzhen / Contenedor #8821',
    'IMP-2026-1002': 'Importación Flete Miami–Barranquilla',
    'IMP-2026-1003': 'Operación capital trabajo regional',
    'IMP-2026-1004': 'Importación Tokyo Parts',
  }

  const ids = new Set<string>()
  mockOperations.forEach((op) => {
    if (op.importOperationId) ids.add(op.importOperationId)
  })
  mockInvoices.forEach((inv) => {
    if (inv.importOperationId) ids.add(inv.importOperationId)
  })
  mockFinancings.forEach((fin) => {
    if (fin.importOperationId) ids.add(fin.importOperationId)
  })

  return Array.from(ids).map((importOperationId) => {
    const ops = mockOperations.filter((op) => op.importOperationId === importOperationId)
    const paid = ops
      .filter((op) => op.status === 'paid')
      .map((op) => ({
        name: op.counterparty,
        role: op.type === 'financing' ? 'Financiación' : 'Factura',
        amount: op.amount,
        currency: op.currency,
        status: op.status,
        reference: op.reference,
      }))

    const pendingFromOps = ops
      .filter((op) => op.status !== 'paid')
      .map((op) => ({
        name: op.counterparty,
        role: op.type === 'financing' ? 'Financiación' : 'Factura',
        amount: op.amount,
        currency: op.currency,
        status: op.status,
        reference: op.reference,
      }))

    const pendingInvoices = mockInvoices
      .filter(
        (inv) =>
          inv.importOperationId === importOperationId &&
          inv.status !== 'paid' &&
          !ops.some((op) => op.reference === inv.number),
      )
      .map((inv) => ({
        name: inv.counterparty,
        role:
          inv.recipientType === 'customs_agent'
            ? 'Agente aduanal'
            : inv.recipientType === 'freight_forwarder'
              ? 'Freight forwarder'
              : inv.financingId
                ? 'Saldo no financiado'
                : 'Proveedor',
        amount: inv.remainingBalance ?? inv.amount,
        currency: inv.currency,
        status: inv.status,
        reference: inv.number,
      }))

    const pendingFinancings = mockFinancings
      .filter(
        (fin) =>
          fin.importOperationId === importOperationId &&
          fin.status !== 'paid' &&
          !ops.some((op) => op.reference === fin.reference),
      )
      .map((fin) => ({
        name: fin.provider,
        role: 'Financiación',
        amount: fin.amount,
        currency: fin.currency,
        status: fin.status,
        reference: fin.reference,
      }))

    return {
      importOperationId,
      label: labels[importOperationId] ?? importOperationId,
      paid,
      pending: [...pendingFromOps, ...pendingInvoices, ...pendingFinancings],
    }
  })
}

export { sumByCurrency }

const REGION_LABELS: Record<DirectInvoiceQuoteRequest['region'], string> = {
  asia: 'Asia',
  north_america: 'América del Norte',
  europe: 'Europa',
}

const GIRO_LABELS: Record<DirectInvoiceQuoteRequest['giroDate'], string> = {
  today: 'Hoy',
  tomorrow: 'Mañana',
  indicative: 'Fecha indicativa',
}

const REGION_SPREAD: Record<DirectInvoiceQuoteRequest['region'], number> = {
  asia: 0.55,
  north_america: 0.35,
  europe: 0.42,
}

function estimatedGiroDate(option: DirectInvoiceQuoteRequest['giroDate']): string {
  const base = new Date()
  if (option === 'tomorrow') base.setDate(base.getDate() + 1)
  if (option === 'indicative') base.setDate(base.getDate() + 5)
  return base.toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Cotización previa a cargar factura (flujo facturas propias).
 * // TODO: reemplazar por integración real — pricing core / FX por región y fecha de giro
 */
export async function createDirectInvoiceQuote(
  request: DirectInvoiceQuoteRequest,
): Promise<DirectInvoiceQuote> {
  await delay(800)

  if (!request.amount || request.amount <= 0) {
    throw new Error('Indica un valor a cotizar mayor a cero.')
  }

  const targetCurrency = 'COP'
  const baseRate = FX_RATES_TO_COP[request.currency]! / FX_RATES_TO_COP[targetCurrency]!
  const spreadPercent = REGION_SPREAD[request.region]
  const rate = Math.round(baseRate * (1 + spreadPercent / 100) * 100) / 100
  const targetAmount = Math.round(request.amount * rate * 100) / 100

  quoteCounter += 1
  const generatedAt = new Date().toISOString()

  return {
    id: `direct-quote-${quoteCounter}`,
    request,
    sourceAmount: request.amount,
    sourceCurrency: request.currency,
    targetAmount,
    targetCurrency,
    rate,
    spreadPercent,
    regionLabel: REGION_LABELS[request.region],
    giroDateLabel: GIRO_LABELS[request.giroDate],
    estimatedGiroDate: estimatedGiroDate(request.giroDate),
    generatedAt,
    expiresAt: new Date(Date.now() + 60 * 1000).toISOString(),
  }
}

/**
 * Confirma giro tras aprobar tasa y cargar factura.
 * // TODO: reemplazar por integración real — instrucción de pago / estado de giro
 */
export async function confirmDirectInvoiceTransfer(input: {
  quote: DirectInvoiceQuote
  upload: DirectInvoiceUploadMeta
}): Promise<DirectInvoiceTransferConfirmation> {
  await delay(1000)
  operationCounter += 1

  const status =
    input.quote.request.giroDate === 'today'
      ? 'submitted'
      : input.quote.request.giroDate === 'tomorrow'
        ? 'in_progress'
        : 'scheduled'

  const statusLabel =
    status === 'submitted'
      ? 'Giro enviado'
      : status === 'in_progress'
        ? 'Giro en proceso'
        : 'Giro programado'

  return {
    transferId: `TRF-2026-${String(operationCounter).slice(-6)}`,
    reference: `DIR-${String(operationCounter).slice(-5)}`,
    status,
    statusLabel,
    amount: input.quote.sourceAmount,
    currency: input.quote.sourceCurrency,
    localAmount: input.quote.targetAmount,
    localCurrency: input.quote.targetCurrency,
    rate: input.quote.rate,
    giroDate: input.quote.estimatedGiroDate,
    regionLabel: input.quote.regionLabel,
    invoiceFileName: input.upload.fileName,
    confirmedAt: new Date().toISOString(),
  }
}
