import { Box, Stack, Typography } from '@mui/material'
import { Alert, Button } from '../../../design-system'
import type { CurrencyCode } from '../types'
import { formatCurrency } from '../utils/currency'
import { HubPanel } from './HubPageShell'

export default function HubSelectionSummary({
  title,
  countLabel,
  totalLabel,
  totalAmount,
  currency,
  breakdown,
  infoMessage,
  primaryLabel,
  onPrimary,
  onSecondary,
  secondaryLabel = 'Volver al Hub',
  disabled,
}: {
  title: string
  countLabel: string
  totalLabel: string
  totalAmount: number
  currency: CurrencyCode
  breakdown: { id: string; amount: number; currency: CurrencyCode }[]
  infoMessage?: string
  primaryLabel: string
  onPrimary: () => void
  onSecondary?: () => void
  secondaryLabel?: string
  disabled?: boolean
}) {
  return (
    <HubPanel sx={{ p: 2.5, position: { md: 'sticky' }, top: 16 }}>
      <Typography variant="h4" color="primary.dark" sx={{ mb: 2 }}>
        {title}
      </Typography>

      <Stack spacing={1} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {countLabel}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {totalLabel}
        </Typography>
        <Typography variant="h3" color="primary.dark">
          {formatCurrency(totalAmount, currency)}
        </Typography>
      </Stack>

      {breakdown.length > 0 && (
        <Box sx={{ bgcolor: 'primary.50', borderRadius: 2, p: 1.5, mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Desglose
          </Typography>
          {breakdown.map((item) => (
            <Stack key={item.id} direction="row" sx={{ py: 0.5, justifyContent: 'space-between' }}>
              <Typography variant="body2">{item.id}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {formatCurrency(item.amount, item.currency)}
              </Typography>
            </Stack>
          ))}
        </Box>
      )}

      {infoMessage && (
        <Box sx={{ mb: 2 }}>
          <Alert variant="warning" title="Información" description={infoMessage} />
        </Box>
      )}

      <Stack spacing={1.5}>
        <Button variant="primary" onClick={onPrimary} disabled={disabled}>
          {primaryLabel}
        </Button>
        {onSecondary && (
          <Button variant="secondary" onClick={onSecondary}>
            {secondaryLabel}
          </Button>
        )}
      </Stack>
    </HubPanel>
  )
}
