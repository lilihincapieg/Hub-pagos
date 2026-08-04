import type {
  CheckoutSession,
  DirectInvoiceQuote,
  DirectInvoiceTransferConfirmation,
  DirectInvoiceUploadMeta,
  FxQuote,
  PaymentConfirmation,
  PaymentRail,
} from '../types'

const STORAGE_KEY = 'payments-hub-flow'
const DIRECT_QUOTE_KEY = 'payments-hub-direct-quote'

export interface FlowSession {
  financingIds?: string[]
  invoiceIds?: string[]
  fxQuote?: FxQuote
  checkout?: CheckoutSession
  confirmation?: PaymentConfirmation
  paymentRail?: PaymentRail
  payAmountOverride?: number
}

export interface DirectQuoteSession {
  request?: DirectInvoiceQuote['request']
  quote?: DirectInvoiceQuote
  upload?: DirectInvoiceUploadMeta
  confirmation?: DirectInvoiceTransferConfirmation
  step?: 'form' | 'review' | 'upload' | 'confirmation'
}

export function getFlowSession(): FlowSession {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as FlowSession) : {}
  } catch {
    return {}
  }
}

export function setFlowSession(patch: Partial<FlowSession>): FlowSession {
  const next = { ...getFlowSession(), ...patch }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

export function clearFlowSession(): void {
  sessionStorage.removeItem(STORAGE_KEY)
}

export function getDirectQuoteSession(): DirectQuoteSession {
  try {
    const raw = sessionStorage.getItem(DIRECT_QUOTE_KEY)
    return raw ? (JSON.parse(raw) as DirectQuoteSession) : {}
  } catch {
    return {}
  }
}

export function setDirectQuoteSession(patch: Partial<DirectQuoteSession>): DirectQuoteSession {
  const next = { ...getDirectQuoteSession(), ...patch }
  sessionStorage.setItem(DIRECT_QUOTE_KEY, JSON.stringify(next))
  return next
}

export function clearDirectQuoteSession(): void {
  sessionStorage.removeItem(DIRECT_QUOTE_KEY)
}
