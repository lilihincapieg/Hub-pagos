export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'in_progress'

export type CurrencyCode = 'USD' | 'COP' | 'MXN' | 'EUR' | 'GBP' | 'JPY'

export type PaymentMethod = 'bank_transfer' | 'pse' | 'wire' | 'local_account'

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
}

export interface CreateFxQuoteInput {
  itemIds: string[]
  itemType: 'financing' | 'invoice'
  targetCurrency?: CurrencyCode
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
  foreignCurrencyInvoices: number
  totalOperations: number
  nextFinancingDueDate: string
  totalInvoicesAmount: number
  totalInvoicesCurrency: CurrencyCode
  availableCurrencies: string
  lastPaymentDate: string
}
