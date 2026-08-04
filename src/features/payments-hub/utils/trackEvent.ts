/**
 * Convención de nombres alineada a DMP / PayHub.
 * Mock local — sin backend de analítica.
 * // TODO: reemplazar por integración real (cliente de analytics)
 */

export type PayHubEventName =
  | 'payhub_view_balance_alert'
  | 'payhub_click_pay_balance'
  | 'payhub_view_searates_alert'
  | 'payhub_click_pay_customs_agent'
  | 'payhub_click_calendar_cta'
  | 'payhub_redirect_imc'
  | 'payhub_view_attention_zone'
  | 'payhub_click_see_more_alerts'
  | 'payhub_view_selection_bar'
  | 'payhub_start_direct_quote'
  | 'payhub_submit_direct_quote_request'
  | 'payhub_accept_direct_quote'
  | 'payhub_upload_direct_invoice'
  | 'payhub_confirm_direct_transfer'

export type TrackPayload = Record<string, string | number | boolean | null | undefined>

const eventLog: { name: PayHubEventName; payload: TrackPayload; at: string }[] = []

export function trackEvent(eventName: PayHubEventName, payload: TrackPayload = {}): void {
  const entry = { name: eventName, payload, at: new Date().toISOString() }
  eventLog.push(entry)
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.info('[trackEvent]', entry)
  }
}

/** Útil para pruebas manuales en consola. */
export function getTrackedEvents() {
  return [...eventLog]
}
