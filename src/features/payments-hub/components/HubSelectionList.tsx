import { Box, Stack, Typography } from '@mui/material'
import { Checkbox } from '../../../design-system'
import type { CurrencyCode } from '../types'
import { formatCurrency } from '../utils/currency'
import HubStatusBadge from './HubStatusBadge'

export interface SelectableItem {
  id: string
  reference: string
  title: string
  subtitle: string
  dueDate: string
  amount: number
  currency: CurrencyCode
  status: import('../types').PaymentStatus
}

export default function HubSelectionList({
  items,
  selectedIds,
  onToggle,
}: {
  items: SelectableItem[]
  selectedIds: string[]
  onToggle: (id: string, checked: boolean) => void
}) {
  return (
    <Stack spacing={1.5}>
      {items.map((item) => (
        <Box
          key={item.id}
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: selectedIds.includes(item.id) ? 'primary.light' : 'grey.200',
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
            }}
          >
            <Checkbox
              label={item.reference}
              checked={selectedIds.includes(item.id)}
              onChange={(checked) => onToggle(item.id, checked)}
            />
            <Stack
              direction="row"
              spacing={2}
              useFlexGap
              sx={{ alignItems: 'center', flexWrap: 'wrap' }}
            >
              <HubStatusBadge status={item.status} />
              <Typography variant="body2" color="text.secondary">
                Vence: {item.dueDate}
              </Typography>
              <Typography variant="body1" color="text.primary">
                {formatCurrency(item.amount, item.currency)}
              </Typography>
            </Stack>
          </Stack>
          <Box sx={{ mt: 1, pl: 4 }}>
            <Typography variant="body2" color="text.primary">
              {item.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {item.subtitle}
            </Typography>
          </Box>
        </Box>
      ))}
    </Stack>
  )
}

export function HubCurrencyGroups({
  groups,
}: {
  groups: Record<string, SelectableItem[]>
}) {
  return (
    <Stack spacing={3} sx={{ mt: 3 }}>
      {Object.entries(groups).map(([currency, items]) => (
        <Box key={currency}>
          <Typography variant="h4" color="text.primary" sx={{ mb: 1 }}>
            Moneda {currency}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {items.length} factura(s) · Total{' '}
            {formatCurrency(
              items.reduce((sum, item) => sum + item.amount, 0),
              currency as CurrencyCode,
            )}
          </Typography>
        </Box>
      ))}
    </Stack>
  )
}
