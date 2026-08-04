export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'in_progress'

export type CurrencyCode = 'USD' | 'COP' | 'MXN' | 'EUR' | 'GBP' | 'JPY'

export type PaymentMethod = 'bank_transfer' | 'pse' | 'wire' | 'local_account'

export type TrackingStatus =
  | 'in_transit'
  | 'customs_clearance'
  | 'arriving_soon'
  | 'delivered'
  | null

export type RecipientLocation = 'local' | 'exterior'

export type RecipientType = 'customs_agent' | 'freight_forwarder' | 'supplier'

/** Riel de pago: Paga Local vs PayOps (transferencia internacional). */
export type PaymentRail = 'local' | 'payops'

/** Obligación distinta al saldo de la factura (agente aduanal / freight forwarder). */
export interface CustomsPayment {
  amount: number
  currency: CurrencyCode
  recipientName: string
  recipientLocation: RecipientLocation
  recipientType: 'customs_agent' | 'freight_forwarder'
  dueDate: string
}

export interface Financing {
  id: string
  reference: string
  provider: string
  dueDate: string
  amount: number
  currency: CurrencyCode
  status: PaymentStatus
  description: string
  priority: 'alta' | 'normal'
  antiquityDays: number
  /** Agrupa financiaciones y facturas de la misma importación. */
  importOperationId?: string
  linkedInvoiceIds?: string[]
}

export interface Invoice {
  id: string
  number: string
  counterparty: string
  issueDate: string
  dueDate: string
  amount: number
  currency: CurrencyCode
  status: PaymentStatus
  description: string
  /** Agrupa financiaciones y facturas de la misma importación. */
  importOperationId?: string
  financingId?: string
  financedPercent?: number
  remainingBalance?: number
  trackingStatus?: TrackingStatus
  recipientLocation?: RecipientLocation
  recipientType?: RecipientType
  /**
   * Pago distinto al saldo de la factura (aduana / forwarder).
   * // TODO: reemplazar por integración real (tarifas / fees logísticos por importación)
   */
  customsPayment?: CustomsPayment
  /**
   * Factura sin financiación asociada donde falta monto cargado por el cliente.
   * // TODO: reemplazar por integración real (dato incompleto desde IMC / Comex)
   */
  requiresAmountEntry?: boolean
}

export interface FxQuote {
  id: string
  sourceCurrency: CurrencyCode
  targetCurrency: CurrencyCode
  sourceAmount: number
  targetAmount: number
  rate: number
  spreadPercent: number
  feePercent: number
  country: string
  generatedAt: string
  expiresAt: string
  itemIds: string[]
  itemType: 'financing' | 'invoice'
  itemsCount: number
}

export interface CheckoutSession {
  id: string
  quoteId: string
  method: PaymentMethod
  totalAmount: number
  currency: CurrencyCode
  reference: string
  createdAt: string
  fxRateAccepted: number
  sourceAmount: number
  sourceCurrency: CurrencyCode
  collectionCountry: string
  itemsCount: number
  itemReferences: string[]
}

export interface PaymentConfirmation {
  operationId: string
  status: 'success' | 'processing'
  amount: number
  currency: CurrencyCode
  method: PaymentMethod
  confirmedAt: string
  reference: string
  estimatedApplicationDate: string
  country: string
  fxRateAccepted: number
  sourceAmount: number
  sourceCurrency: CurrencyCode
  itemReferences: string[]
}

export interface PaymentOperation {
  id: string
  type: 'financing' | 'invoice'
  reference: string
  counterparty: string
  amount: number
  currency: CurrencyCode
  status: PaymentStatus
  paymentDate: string
  method: PaymentMethod
  counterValue?: number
  counterCurrency?: CurrencyCode
  fxRate?: number
  financingCodes?: string
  importOperationId?: string
}

export interface CreateFxQuoteInput {
  itemIds: string[]
  itemType: 'financing' | 'invoice'
  targetCurrency?: CurrencyCode
  /** Monto fuente override (ej. solo saldo no financiado). */
  amountOverride?: number
}

export interface CreateCheckoutInput {
  quoteId: string
  method: PaymentMethod
}

export interface ConfirmPaymentInput {
  checkoutId: string
}

export interface HubHomeMetrics {
  pendingFinancings: number
  pendingInvoices: number
  totalOperations: number
  nextFinancingDueDate: string
  totalInvoicesAmount: number
  totalInvoicesCurrency: CurrencyCode
  lastPaymentDate: string
}

/** Vista de reconciliación: pagos hechos vs pendientes por importación. */
export interface ImportReconciliationParty {
  name: string
  role: string
  amount: number
  currency: CurrencyCode
  status: PaymentStatus
  reference: string
}

export interface ImportReconciliationGroup {
  importOperationId: string
  label: string
  paid: ImportReconciliationParty[]
  pending: ImportReconciliationParty[]
}

/** Flujo cotizar-primero (factura propia sin dato previo). */
export type GiroDateOption = 'today' | 'tomorrow' | 'indicative'

export type QuoteRegion = 'asia' | 'north_america' | 'europe'

export type DirectTransferStatus = 'scheduled' | 'in_progress' | 'submitted'

export interface DirectInvoiceQuoteRequest {
  amount: number
  currency: CurrencyCode
  giroDate: GiroDateOption
  region: QuoteRegion
}

export interface DirectInvoiceQuote {
  id: string
  request: DirectInvoiceQuoteRequest
  sourceAmount: number
  sourceCurrency: CurrencyCode
  targetAmount: number
  targetCurrency: CurrencyCode
  rate: number
  spreadPercent: number
  regionLabel: string
  giroDateLabel: string
  estimatedGiroDate: string
  generatedAt: string
  expiresAt: string
}

export interface DirectInvoiceUploadMeta {
  fileName: string
  fileSize: number
  uploadedAt: string
}

export interface DirectInvoiceTransferConfirmation {
  transferId: string
  reference: string
  status: DirectTransferStatus
  statusLabel: string
  amount: number
  currency: CurrencyCode
  localAmount: number
  localCurrency: CurrencyCode
  rate: number
  giroDate: string
  regionLabel: string
  invoiceFileName: string
  confirmedAt: string
}

