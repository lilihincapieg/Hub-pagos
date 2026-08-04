import { useEffect, useMemo, useState } from 'react'
import { Box, Collapse, Stack, Typography } from '@mui/material'
import { Button } from '../../../design-system'
import type { Invoice, PaymentRail } from '../types'
import { formatCurrency } from '../utils/currency'
import {
  buildPaymentAgendaEvents,
  formatDaysLabel,
  splitAgendaVisible,
  type PaymentAgendaEvent,
} from '../utils/paymentAgenda'
import { trackEvent } from '../utils/trackEvent'
import { HubPanel } from './HubPageShell'

function AgendaCard({
  event,
  onPay,
}: {
  event: PaymentAgendaEvent
  onPay: (event: PaymentAgendaEvent) => void
}) {
  const overdue = event.daysUntil < 0

  return (
    <HubPanel
      sx={{
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderColor: overdue ? 'error.light' : 'warning.main',
        bgcolor: overdue ? 'error.ultraLight' : 'background.paper',
        boxShadow: '0 4px 16px rgba(6, 7, 53, 0.05)',
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: overdue ? 'error.main' : event.kind === 'balance' ? 'info.main' : 'warning.main',
            flexShrink: 0,
          }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          {formatDaysLabel(event.daysUntil, event.kind)}
        </Typography>
      </Stack>

      <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5, lineHeight: 1.35 }}>
        {event.title}
      </Typography>

      {event.recipientName && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
          A: {event.recipientName}
        </Typography>
      )}

      {event.urgencyContext && (
        <Typography
          variant="caption"
          color={overdue ? 'error.dark' : 'warning.dark'}
          sx={{ display: 'block', mb: 1, lineHeight: 1.35 }}
        >
          {event.urgencyContext}
        </Typography>
      )}

      <Typography variant="h4" color="primary.dark" sx={{ fontWeight: 700, mt: 'auto', mb: 1.5 }}>
        {formatCurrency(event.amount, event.currency)}
      </Typography>

      <Button variant="primary" size="small" onClick={() => onPay(event)}>
        {event.ctaLabel}
      </Button>
    </HubPanel>
  )
}

export default function HubPaymentAgenda({
  invoices,
  onPayBalance,
  onPayCustoms,
}: {
  invoices: Invoice[]
  onPayBalance: (invoice: Invoice) => void
  onPayCustoms: (invoice: Invoice, rail: PaymentRail) => void
}) {
  const events = useMemo(() => buildPaymentAgendaEvents(invoices), [invoices])
  const { visible, more } = useMemo(() => splitAgendaVisible(events, 3), [events])
  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
    if (events.length === 0) return
    trackEvent('payhub_view_attention_zone', { count: events.length })

    const seenBalance = new Set<string>()
    const seenCustoms = new Set<string>()
    events.forEach((event) => {
      if (event.kind === 'balance' && !seenBalance.has(event.invoice.id)) {
        seenBalance.add(event.invoice.id)
        trackEvent('payhub_view_balance_alert', {
          invoiceId: event.invoice.id,
          source: 'attention_zone',
          remainingBalance: event.amount,
        })
        if (event.urgencyContext) {
          trackEvent('payhub_view_searates_alert', {
            invoiceId: event.invoice.id,
            source: 'attention_context',
            trackingStatus: event.invoice.trackingStatus,
          })
        }
      }
      if (event.kind === 'customs' && !seenCustoms.has(event.invoice.id)) {
        seenCustoms.add(event.invoice.id)
        trackEvent('payhub_view_searates_alert', {
          invoiceId: event.invoice.id,
          source: 'attention_customs',
          trackingStatus: event.invoice.trackingStatus,
        })
      }
    })
  }, [events])

  const handlePay = (event: PaymentAgendaEvent) => {
    if (event.kind === 'balance') {
      trackEvent('payhub_click_pay_balance', {
        invoiceId: event.invoice.id,
        amount: event.amount,
        source: 'attention_zone',
      })
      onPayBalance(event.invoice)
      return
    }
    trackEvent('payhub_click_pay_customs_agent', {
      invoiceId: event.invoice.id,
      rail: event.rail,
      recipientType: event.invoice.customsPayment?.recipientType,
      source: 'attention_zone',
    })
    onPayCustoms(event.invoice, event.rail)
  }

  if (events.length === 0) return null

  return (
    <Box sx={{ mb: 3 }}>
      <Stack
        direction="row"
        sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}
      >
        <Typography variant="h4" color="primary.dark" sx={{ fontWeight: 700 }}>
          Requiere tu atención
        </Typography>
        {more.length > 0 && (
          <Box
            component="button"
            type="button"
            onClick={() => {
              const next = !showMore
              setShowMore(next)
              if (next) {
                trackEvent('payhub_click_see_more_alerts', { count: more.length })
              }
            }}
            sx={{
              border: 'none',
              background: 'transparent',
              color: 'secondary.main',
              cursor: 'pointer',
              fontFamily: 'inherit',
              typography: 'body2',
              fontWeight: 600,
              p: 0,
            }}
          >
            {showMore ? 'Ver menos' : `Ver ${more.length} más`}
          </Box>
        )}
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 2,
        }}
      >
        {visible.map((event) => (
          <AgendaCard key={event.id} event={event} onPay={handlePay} />
        ))}
      </Box>

      <Collapse in={showMore && more.length > 0}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 2,
            mt: 2,
          }}
        >
          {more.map((event) => (
            <AgendaCard key={event.id} event={event} onPay={handlePay} />
          ))}
        </Box>
      </Collapse>
    </Box>
  )
}

/** Banda horizontal IMC — Zona B */
export function HubImcInviteBand({ onClick }: { onClick: () => void }) {
  return (
    <Box
      sx={{
        mb: 3,
        px: 2.5,
        py: 2,
        borderRadius: 2,
        bgcolor: 'primary.50',
        border: 1,
        borderColor: 'primary.ultraLight',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          bgcolor: 'background.paper',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'primary.light',
          flexShrink: 0,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="4" y="5" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </Box>
      <Typography variant="body2" color="primary.dark" sx={{ flex: 1, lineHeight: 1.45 }}>
        ¿Quieres recibir más alertas como esta? Agrega el resto de tus facturas y te diseñamos tu
        calendario completo de pagos.
      </Typography>
      <Button
        variant="secondary"
        onClick={() => {
          trackEvent('payhub_click_calendar_cta', { source: 'imc_band' })
          onClick()
        }}
      >
        Agregar facturas
      </Button>
    </Box>
  )
}
