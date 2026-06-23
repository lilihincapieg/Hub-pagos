import { Box, Stack, Typography } from '@mui/material'
import { Checkbox } from '../../../design-system'
import type { Invoice } from '../types'
import { formatCurrency } from '../utils/currency'
import { paymentStatusLabels } from '../utils/status'
import { HubPanel } from './HubPageShell'

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
        <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', minWidth: 880 }}>
          <Box component="thead">
            <Box component="tr" sx={{ bgcolor: 'grey.100' }}>
              {['', 'Factura', 'Proveedor', 'Vencimiento', 'Estado', 'Monto'].map((header) => (
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
                  }}
                >
                  {header}
                </Box>
              ))}
            </Box>
          </Box>
          <Box component="tbody">
            {items.map((item) => (
              <Box
                component="tr"
                key={item.id}
                sx={{
                  borderTop: 1,
                  borderColor: 'grey.200',
                  bgcolor: selectedIds.includes(item.id) ? 'primary.50' : 'background.paper',
                }}
              >
                <Box component="td" sx={{ px: 1.5, py: 1.25 }}>
                  <Checkbox
                    checked={selectedIds.includes(item.id)}
                    onChange={(checked) => onToggle(item.id, checked)}
                  />
                </Box>
                <Box component="td" sx={{ px: 1.5, py: 1.25 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {item.number}
                  </Typography>
                </Box>
                <Box component="td" sx={{ px: 1.5, py: 1.25 }}>
                  <Typography variant="body2">{item.counterparty}</Typography>
                </Box>
                <Box component="td" sx={{ px: 1.5, py: 1.25 }}>
                  <Typography variant="body2" color={item.status === 'overdue' ? 'error.main' : 'text.primary'}>
                    {item.dueDate}
                  </Typography>
                </Box>
                <Box component="td" sx={{ px: 1.5, py: 1.25 }}>
                  <Typography variant="body2">{paymentStatusLabels[item.status]}</Typography>
                </Box>
                <Box component="td" sx={{ px: 1.5, py: 1.25 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {formatCurrency(item.amount, item.currency)}
                  </Typography>
                </Box>
              </Box>
            ))}
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
  onBack,
}: {
  onFinancings: () => void
  onInvoices: () => void
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
