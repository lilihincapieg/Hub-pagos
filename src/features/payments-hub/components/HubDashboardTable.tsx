import { Box, Stack, Typography } from '@mui/material'
import type { PaymentOperation } from '../types'
import { formatCurrency } from '../utils/currency'
import HubStatusBadge from './HubStatusBadge'
import { HubPanel } from './HubPageShell'

const periods = ['Último mes', '3 meses', '6 meses', '1 año', 'Personalizado']

export function HubFilterBar({
  activePeriod,
  onChange,
}: {
  activePeriod: string
  onChange: (period: string) => void
}) {
  return (
    <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
        Período:
      </Typography>
      {periods.map((period) => (
        <Box
          key={period}
          component="button"
          type="button"
          onClick={() => onChange(period)}
          sx={{
            border: 1,
            borderColor: activePeriod === period ? 'secondary.main' : 'grey.200',
            bgcolor: activePeriod === period ? 'primary.50' : 'background.paper',
            color: 'text.primary',
            borderRadius: 999,
            px: 2,
            py: 0.75,
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: 13,
          }}
        >
          {period}
        </Box>
      ))}
    </Stack>
  )
}

export function HubDashboardMetricCards({
  metrics,
}: {
  metrics: { label: string; value: string; accent?: string }[]
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr 1fr', lg: 'repeat(4, 1fr)' },
        gap: 2,
        mb: 3,
      }}
    >
      {metrics.map((metric) => (
        <HubPanel key={metric.label} sx={{ p: 2 }}>
          <Typography variant="caption" color="text.secondary">
            {metric.label}
          </Typography>
          <Typography variant="h4" color="primary.dark" sx={{ mt: 0.5 }}>
            {metric.value}
          </Typography>
        </HubPanel>
      ))}
    </Box>
  )
}

export function HubFinancingDashboardTable({ operations }: { operations: PaymentOperation[] }) {
  return (
    <HubPanel sx={{ overflow: 'hidden' }}>
      <Box sx={{ overflowX: 'auto' }}>
        <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', minWidth: 960 }}>
          <Box component="thead">
            <Box component="tr" sx={{ bgcolor: 'primary.50' }}>
              {['Fecha', 'Valor USD', 'Contravalor COP', 'Tasa cambio', 'Códigos financiación', 'Estado', 'Ver detalle'].map((header) => (
                <Box
                  component="th"
                  key={header}
                  sx={{
                    px: 1.5,
                    py: 1.25,
                    textAlign: 'left',
                    typography: 'caption',
                    color: 'primary.dark',
                    fontWeight: 700,
                  }}
                >
                  {header}
                </Box>
              ))}
            </Box>
          </Box>
          <Box component="tbody">
            {operations.map((op) => (
              <Box component="tr" key={op.id} sx={{ borderTop: 1, borderColor: 'grey.200' }}>
                <Box component="td" sx={{ px: 1.5, py: 1.25 }}>
                  <Typography variant="body2">{op.paymentDate}</Typography>
                </Box>
                <Box component="td" sx={{ px: 1.5, py: 1.25 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {formatCurrency(op.amount, op.currency)}
                  </Typography>
                </Box>
                <Box component="td" sx={{ px: 1.5, py: 1.25 }}>
                  <Typography variant="body2">
                    {op.counterValue ? formatCurrency(op.counterValue, op.counterCurrency ?? 'COP') : '—'}
                  </Typography>
                </Box>
                <Box component="td" sx={{ px: 1.5, py: 1.25 }}>
                  <Typography variant="body2">{op.fxRate?.toLocaleString('es-CO') ?? '—'}</Typography>
                </Box>
                <Box component="td" sx={{ px: 1.5, py: 1.25 }}>
                  <Typography variant="body2">{op.financingCodes ?? op.reference}</Typography>
                </Box>
                <Box component="td" sx={{ px: 1.5, py: 1.25 }}>
                  <HubStatusBadge status={op.status} />
                </Box>
                <Box component="td" sx={{ px: 1.5, py: 1.25 }}>
                  <Box
                    component="span"
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: 'secondary.main',
                      color: 'common.white',
                      fontSize: 12,
                    }}
                  >
                    Ver
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </HubPanel>
  )
}
