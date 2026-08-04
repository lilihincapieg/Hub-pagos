import type { Invoice, PaymentRail, TrackingStatus } from '../types'

export type AgendaEventKind = 'balance' | 'customs'

export interface PaymentAgendaEvent {
  id: string
  invoice: Invoice
  kind: AgendaEventKind
  /** ISO date YYYY-MM-DD */
  date: string
  daysUntil: number
  title: string
  /** Contexto de urgencia (tracking), nunca un segundo monto. */
  urgencyContext?: string
  amount: number
  currency: Invoice['currency']
  ctaLabel: string
  rail: PaymentRail
  recipientName?: string
}

function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y!, m! - 1, d!, 12, 0, 0)
}

function toIsoDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function daysBetween(from: Date, to: Date): number {
  const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())
  const b = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate())
  return Math.round((b - a) / 86_400_000)
}

export function trackingUrgencyCopy(
  tracking: TrackingStatus | undefined,
  daysUntilDue: number,
): string | undefined {
  if (!tracking || tracking === 'delivered' || tracking === null) return undefined
  if (tracking === 'arriving_soon') {
    return daysUntilDue <= 1
      ? 'Tu mercancía llega mañana — paga el saldo antes de la liberación'
      : 'Tu mercancía está llegando — paga el saldo antes de la liberación'
  }
  if (tracking === 'in_transit') {
    return 'Carga en tránsito — anticipa el pago del saldo'
  }
  if (tracking === 'customs_clearance') {
    return 'Carga en despacho — el saldo pendiente puede bloquear la liberación'
  }
  return undefined
}

export function trackingHintLabel(tracking: TrackingStatus | undefined): string | undefined {
  if (tracking === 'arriving_soon') return 'mercancía llegando'
  if (tracking === 'in_transit') return 'en tránsito'
  if (tracking === 'customs_clearance') return 'en despacho'
  return undefined
}

/**
 * Agenda:
 * - 1 tarjeta de saldo por factura (remainingBalance), con tracking como contexto
 * - 1 tarjeta de customsPayment solo si existe (monto propio, nunca derived del saldo)
 * - requiresAmountEntry → no genera eventos
 */
export function buildPaymentAgendaEvents(
  invoices: Invoice[],
  today: Date = new Date(),
): PaymentAgendaEvent[] {
  const events: PaymentAgendaEvent[] = []

  invoices.forEach((invoice) => {
    if (invoice.requiresAmountEntry) return

    const hasBalance =
      Boolean(invoice.financingId) &&
      typeof invoice.remainingBalance === 'number' &&
      invoice.remainingBalance > 0

    if (hasBalance) {
      const daysUntil = daysBetween(today, parseDate(invoice.dueDate))
      events.push({
        id: `${invoice.id}-balance`,
        invoice,
        kind: 'balance',
        date: invoice.dueDate,
        daysUntil,
        title: `Saldo no financiado · ${invoice.number}`,
        urgencyContext: trackingUrgencyCopy(invoice.trackingStatus, daysUntil),
        amount: invoice.remainingBalance!,
        currency: invoice.currency,
        ctaLabel: 'Cotizar y pagar saldo',
        rail: 'local',
      })
    }

    const customs = invoice.customsPayment
    if (customs) {
      const daysUntil = daysBetween(today, parseDate(customs.dueDate))
      const rail: PaymentRail = customs.recipientLocation === 'exterior' ? 'payops' : 'local'
      const role =
        customs.recipientType === 'customs_agent' ? 'Agente aduanal' : 'Freight forwarder'
      events.push({
        id: `${invoice.id}-customs`,
        invoice,
        kind: 'customs',
        date: customs.dueDate,
        daysUntil,
        title: `${role} · ${invoice.number}`,
        urgencyContext:
          invoice.trackingStatus === 'customs_clearance'
            ? 'Tu carga está en despacho — paga esta obligación distinta del saldo de la factura'
            : undefined,
        amount: customs.amount,
        currency: customs.currency,
        ctaLabel: rail === 'payops' ? 'Pagar vía PayOps' : 'Pagar local',
        rail,
        recipientName: customs.recipientName,
      })
    }
  })

  return events.sort((a, b) => {
    // Vencidos primero, luego por fecha, customs locales/exteriores mezclados por fecha
    if (a.daysUntil < 0 && b.daysUntil >= 0) return -1
    if (b.daysUntil < 0 && a.daysUntil >= 0) return 1
    if (a.date !== b.date) return a.date.localeCompare(b.date)
    if (a.kind !== b.kind) return a.kind === 'balance' ? -1 : 1
    return a.id.localeCompare(b.id)
  })
}

/** Primeras 3 por urgencia visibles; el resto para "Ver N más". */
export function splitAgendaVisible(events: PaymentAgendaEvent[], maxVisible = 3) {
  return {
    visible: events.slice(0, maxVisible),
    more: events.slice(maxVisible),
  }
}

export function formatAgendaDate(iso: string): string {
  const date = parseDate(iso)
  return date.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function formatDaysLabel(daysUntil: number, _kind?: AgendaEventKind): string {
  if (daysUntil < 0) {
    const overdue = Math.abs(daysUntil)
    return overdue === 1 ? 'Venció ayer' : `Venció hace ${overdue} días`
  }
  if (daysUntil === 0) return 'Vence hoy'
  if (daysUntil === 1) return 'Vence mañana'
  return `Vence en ${daysUntil} días`
}

export { toIsoDate, parseDate }
