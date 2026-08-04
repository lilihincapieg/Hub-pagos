import { Box, Stack, Typography } from '@mui/material'
import { Badge, Checkbox } from '../../../design-system'
import type { Invoice } from '../types'
import { formatCurrency } from '../utils/currency'
import { paymentStatusLabels } from '../utils/status'
import {
  buildPaymentAgendaEvents,
  formatDaysLabel,
  trackingHintLabel,
} from '../utils/paymentAgenda'
import { HubPanel } from './HubPageShell'

function OriginBadge({ invoice }: { invoice: Invoice }) {
  if (invoice.financingId || invoice.customsPayment) {
    return <Badge label="Dato Finkargo" variant="info" size="small" />
  }
  return <Badge label="Pago directo" variant="neutral" size="small" />
}

function AlertColumn({ invoice }: { invoice: Invoice }) {
  if (invoice.requiresAmountEntry) {
    return (
      <Typography variant="caption" color="warning.dark">
        Agrega el monto
      </Typography>
    )
  }

  const events = buildPaymentAgendaEvents([invoice])
  if (events.length === 0) {
    return (
      <Typography variant="caption" color="text.secondary">
        —
      </Typography>
    )
  }

  const primary = events[0]!
  const tracking = trackingHintLabel(invoice.trackingStatus)
  const suffix =
    primary.kind === 'balance' && tracking
      ? ` · ${tracking}`
      : primary.kind === 'customs' && primary.recipientName
        ? ` · ${primary.recipientName}`
        : ''

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
      <Box
        sx={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          bgcolor:
            primary.daysUntil < 0
              ? 'error.main'
              : primary.kind === 'balance'
                ? 'info.main'
                : 'warning.main',
          flexShrink: 0,
        }}
      />
      <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.3 }}>
        {formatDaysLabel(primary.daysUntil, primary.kind)}
        {suffix}
      </Typography>
    </Box>
  )
}

function AmountCell({ invoice }: { invoice: Invoice }) {
  if (invoice.requiresAmountEntry) {
    return (
      <>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          Monto
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Pendiente de capturar
        </Typography>
      </>
    )
  }

  if (invoice.financingId && invoice.remainingBalance != null) {
    return (
      <>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          Saldo por pagar
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {formatCurrency(invoice.remainingBalance, invoice.currency)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Total factura {formatCurrency(invoice.amount, invoice.currency)}
        </Typography>
      </>
    )
  }

  return (
    <>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
        Monto a pagar
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 700 }}>
        {formatCurrency(invoice.amount, invoice.currency)}
      </Typography>
    </>
  )
}

export default function HubInvoiceTable({
  items,
  selectedIds,
  onToggle,
}: {
  items: Invoice[]
  selectedIds: string[]
  onToggle: (id: string, checked: boolean) => void
}) {
  return (
    <HubPanel sx={{ overflow: 'hidden' }}>
      <Box sx={{ overflowX: 'auto' }}>
        <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', minWidth: 960 }}>
          <Box component="thead">
            <Box component="tr" sx={{ bgcolor: 'grey.100' }}>
              {['', 'Factura', 'Proveedor', 'Vencimiento', 'Estado', 'Alerta', 'Origen dato', 'Monto'].map(
                (header) => (
                  <Box
                    component="th"
                    key={header || 'select'}
                    sx={{
                      px: 1.5,
                      py: 1.25,
                      textAlign: 'left',
                      typography: 'caption',
                      color: 'text.secondary',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {header}
                  </Box>
                ),
              )}
            </Box>
          </Box>
          <Box component="tbody">
            {items.map((item) => {
              const selected = selectedIds.includes(item.id)
              return (
                <Box
                  component="tr"
                  key={item.id}
                  sx={{
                    borderTop: 1,
                    borderColor: 'grey.200',
                    bgcolor: selected ? 'primary.50' : 'background.paper',
                  }}
                >
                  <Box component="td" sx={{ px: 1.5, py: 1.5, verticalAlign: 'top' }}>
                    <Checkbox
                      checked={selected}
                      disabled={Boolean(item.requiresAmountEntry)}
                      onChange={(checked) => onToggle(item.id, checked)}
                    />
                  </Box>
                  <Box component="td" sx={{ px: 1.5, py: 1.5, verticalAlign: 'top' }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {item.number}
                    </Typography>
                  </Box>
                  <Box component="td" sx={{ px: 1.5, py: 1.5, verticalAlign: 'top' }}>
                    <Typography variant="body2">{item.counterparty}</Typography>
                  </Box>
                  <Box component="td" sx={{ px: 1.5, py: 1.5, verticalAlign: 'top' }}>
                    <Typography
                      variant="body2"
                      color={item.status === 'overdue' ? 'error.main' : 'text.primary'}
                    >
                      {item.dueDate}
                    </Typography>
                  </Box>
                  <Box component="td" sx={{ px: 1.5, py: 1.5, verticalAlign: 'top' }}>
                    <Typography variant="body2">{paymentStatusLabels[item.status]}</Typography>
                  </Box>
                  <Box component="td" sx={{ px: 1.5, py: 1.5, verticalAlign: 'top', minWidth: 160 }}>
                    <AlertColumn invoice={item} />
                  </Box>
                  <Box component="td" sx={{ px: 1.5, py: 1.5, verticalAlign: 'top' }}>
                    <OriginBadge invoice={item} />
                  </Box>
                  <Box component="td" sx={{ px: 1.5, py: 1.5, verticalAlign: 'top', minWidth: 140 }}>
                    <AmountCell invoice={item} />
                  </Box>
                </Box>
              )
            })}
          </Box>
        </Box>
      </Box>
    </HubPanel>
  )
}

export function HubCurrencySummaryCards({
  groups,
}: {
  groups: Record<string, { count: number; total: number; currency: string }>
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        gap: 2,
        mt: 3,
      }}
    >
      {Object.entries(groups).map(([currency, group]) => (
        <HubPanel key={currency} sx={{ p: 2 }}>
          <Typography variant="h4" color="primary.dark">
            {currency}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {group.count} factura(s)
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 700 }}>
            Total: {formatCurrency(group.total, currency as never)}
          </Typography>
        </HubPanel>
      ))}
    </Box>
  )
}

export function HubDashboardSelector({
  onFinancings,
  onInvoices,
  onReconciliation,
  onBack,
}: {
  onFinancings: () => void
  onInvoices: () => void
  onReconciliation: () => void
  onBack: () => void
}) {
  return (
    <Box sx={{ maxWidth: 560, mx: 'auto' }}>
      <HubPanel sx={{ p: 3 }}>
        <Typography variant="h3" color="primary.dark" sx={{ textAlign: 'center', mb: 3 }}>
          Seleccione su Dashboard
        </Typography>
        <Stack spacing={2}>
          <Box
            onClick={onReconciliation}
            sx={{
              p: 2.5,
              borderRadius: 2,
              border: 2,
              borderColor: 'secondary.lighter',
              bgcolor: 'primary.50',
              cursor: 'pointer',
              '&:hover': { bgcolor: 'info.ultraLight' },
            }}
          >
            <Typography variant="h4" color="primary.dark">
              Reconciliación por importación
            </Typography>
            <Typography variant="body2" color="text.secondary">
              A quién le has pagado vs. quién falta por pagar, agrupado por operación
            </Typography>
          </Box>
          <Box
            onClick={onFinancings}
            sx={{
              p: 2.5,
              borderRadius: 2,
              border: 2,
              borderColor: 'primary.ultraLight',
              cursor: 'pointer',
              '&:hover': { bgcolor: 'primary.50' },
            }}
          >
            <Typography variant="h4" color="primary.dark">
              Dashboard Financiaciones
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ver historial de pagos de financiaciones
            </Typography>
          </Box>
          <Box
            onClick={onInvoices}
            sx={{
              p: 2.5,
              borderRadius: 2,
              border: 2,
              borderColor: 'primary.ultraLight',
              cursor: 'pointer',
              '&:hover': { bgcolor: 'primary.50' },
            }}
          >
            <Typography variant="h4" color="primary.dark">
              Dashboard Facturas Propias
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ver transacciones de facturas propias
            </Typography>
          </Box>
        </Stack>
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography
            component="button"
            onClick={onBack}
            sx={{
              border: 'none',
              background: 'transparent',
              color: 'secondary.main',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 14,
            }}
          >
            Volver al Hub
          </Typography>
        </Box>
      </HubPanel>
    </Box>
  )
}
