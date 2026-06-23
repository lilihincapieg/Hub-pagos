import { Box, Stack, Typography } from '@mui/material'
import { Button } from '../../../design-system'

export default function HubPageHeader({
  title,
  subtitle,
  backLabel,
  onBack,
}: {
  title: string
  subtitle?: string
  backLabel?: string
  onBack?: () => void
}) {
  return (
    <Box sx={{ mb: 3 }}>
      {onBack && backLabel && (
        <Box sx={{ mb: 2 }}>
          <Button variant="tertiary" onClick={onBack}>
            {backLabel}
          </Button>
        </Box>
      )}
      <Typography variant="h3" color="text.primary">
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  )
}

export function HubMetricsRow({
  metrics,
}: {
  metrics: { label: string; value: string }[]
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr 1fr', md: `repeat(${metrics.length}, 1fr)` },
        gap: 2,
        mb: 3,
      }}
    >
      {metrics.map((metric) => (
        <Box
          key={metric.label}
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'grey.200',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {metric.label}
          </Typography>
          <Typography variant="h4" color="text.primary">
            {metric.value}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

export function HubSummaryBar({
  label,
  totals,
  actionLabel,
  onAction,
  disabled,
}: {
  label: string
  totals: string[]
  actionLabel: string
  onAction: () => void
  disabled?: boolean
}) {
  return (
    <Box
      sx={{
        mt: 3,
        p: 2,
        borderRadius: 2,
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'grey.200',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' },
        justifyContent: 'space-between',
        gap: 2,
      }}
    >
      <Box>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Stack spacing={0.5} sx={{ mt: 0.5 }}>
          {totals.map((total) => (
            <Typography key={total} variant="h4" color="text.primary">
              {total}
            </Typography>
          ))}
        </Stack>
      </Box>
      <Button variant="primary" onClick={onAction} disabled={disabled}>
        {actionLabel}
      </Button>
    </Box>
  )
}
