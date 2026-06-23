import { Box, Typography } from '@mui/material'
import { Checkbox } from '../../../design-system'
import type { Financing } from '../types'
import { formatCurrency } from '../utils/currency'
import { paymentStatusLabels } from '../utils/status'

function statusColor(status: Financing['status']): string {
  if (status === 'overdue') return 'error.main'
  if (status === 'pending') return 'success.main'
  return 'text.secondary'
}

export default function HubFinancingTable({
  items,
  selectedIds,
  onToggle,
}: {
  items: Financing[]
  selectedIds: string[]
  onToggle: (id: string, checked: boolean) => void
}) {
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', minWidth: 920 }}>
        <Box component="thead">
          <Box component="tr" sx={{ bgcolor: 'grey.100' }}>
            {['', 'Prioridad', 'Nº Financiación', 'Fecha vencimiento', 'Antigüedad', 'Estado', 'Saldo pendiente', 'Acción'].map((header) => (
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
                  letterSpacing: 0.4,
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
                  aria-label={`Seleccionar ${item.reference}`}
                />
              </Box>
              <Box component="td" sx={{ px: 1.5, py: 1.25 }}>
                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                  {item.priority}
                </Typography>
              </Box>
              <Box component="td" sx={{ px: 1.5, py: 1.25 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {item.reference}
                </Typography>
              </Box>
              <Box component="td" sx={{ px: 1.5, py: 1.25 }}>
                <Typography variant="body2" color={item.status === 'overdue' ? 'error.main' : 'text.primary'}>
                  {item.dueDate}
                </Typography>
              </Box>
              <Box component="td" sx={{ px: 1.5, py: 1.25 }}>
                <Typography variant="body2">{item.antiquityDays} días</Typography>
              </Box>
              <Box component="td" sx={{ px: 1.5, py: 1.25 }}>
                <Typography variant="body2" sx={{ color: statusColor(item.status), fontWeight: 600 }}>
                  {paymentStatusLabels[item.status]}
                </Typography>
              </Box>
              <Box component="td" sx={{ px: 1.5, py: 1.25 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {formatCurrency(item.amount, item.currency)}
                </Typography>
              </Box>
              <Box component="td" sx={{ px: 1.5, py: 1.25 }}>
                <Typography variant="body2" color="secondary.main" sx={{ cursor: 'default' }}>
                  Ver
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
