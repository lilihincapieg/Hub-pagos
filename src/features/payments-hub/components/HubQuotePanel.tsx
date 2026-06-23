import { Box, LinearProgress, Stack, Typography } from '@mui/material'
import type { FxQuote } from '../types'
import { formatCurrency } from '../utils/currency'
import { HubPanel } from './HubPageShell'

function formatRate(quote: FxQuote): string {
  return `${quote.rate.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${quote.targetCurrency} por 1 ${quote.sourceCurrency}`
}

export default function HubQuotePanel({
  quote,
  secondsRemaining,
}: {
  quote: FxQuote
  secondsRemaining: number
}) {
  const progress = Math.max(0, Math.min(100, (secondsRemaining / 60) * 100))

  return (
    <HubPanel sx={{ p: { xs: 2, md: 3 } }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3, justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary">
          Cotización generada {new Date(quote.generatedAt).toLocaleString('es-CO')}
        </Typography>
        <Typography variant="body2" color="warning.main" sx={{ fontWeight: 700 }}>
          Tiempo restante {secondsRemaining}s
        </Typography>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2,
          mb: 3,
        }}
      >
        <Box sx={{ bgcolor: 'primary.50', borderRadius: 2, p: 2.5 }}>
          <Typography variant="caption" color="text.secondary">
            Total a pagar
          </Typography>
          <Typography variant="h3" color="primary.dark" sx={{ mt: 0.5 }}>
            {formatCurrency(quote.sourceAmount, quote.sourceCurrency)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {quote.itemsCount} {quote.itemType === 'financing' ? 'financiaciones' : 'facturas'} seleccionadas
          </Typography>
        </Box>
        <Box sx={{ bgcolor: 'primary.50', borderRadius: 2, p: 2.5 }}>
          <Typography variant="caption" color="text.secondary">
            Monto estimado en {quote.targetCurrency}
          </Typography>
          <Typography variant="h3" color="primary.dark" sx={{ mt: 0.5 }}>
            {formatCurrency(quote.targetAmount, quote.targetCurrency)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Basado en tasa y comisión aplicadas
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="caption" color="text.secondary">
            Tasa FX
          </Typography>
          <Typography variant="h4" color="primary.dark">
            {formatRate(quote)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Spread / Comisión
          </Typography>
          <Typography variant="h4" color="primary.dark">
            {quote.spreadPercent}%
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Incluido en la tasa
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Vigencia
          </Typography>
          <Typography variant="h4" color="primary.dark">
            1 minuto
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Desde generación
          </Typography>
        </Box>
      </Box>

      <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 999, mb: 1 }} />
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
        La cotización expira en {secondsRemaining} segundos — acepte antes de que se agote el tiempo
      </Typography>
    </HubPanel>
  )
}
