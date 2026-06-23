import type { CheckoutSession, FxQuote, PaymentConfirmation } from '../types'

const STORAGE_KEY = 'payments-hub-flow'

export interface FlowSession {
  financingIds?: string[]
  invoiceIds?: string[]
  fxQuote?: FxQuote
  checkout?: CheckoutSession
  confirmation?: PaymentConfirmation
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
