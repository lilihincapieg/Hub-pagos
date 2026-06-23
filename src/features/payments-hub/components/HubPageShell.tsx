import { Box, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { Button } from '../../../design-system'

export function HubBreadcrumbs({
  backLabel,
  onBack,
  homeLabel = 'Ir al inicio',
  onHome,
}: {
  backLabel?: string
  onBack?: () => void
  homeLabel?: string
  onHome?: () => void
}) {
  return (
    <Stack direction="row" sx={{ mb: 2, justifyContent: 'space-between', alignItems: 'center' }}>
      {onBack && backLabel ? (
        <Button variant="tertiary" onClick={onBack}>
          ← {backLabel}
        </Button>
      ) : (
        <Box />
      )}
      {onHome && (
        <Button variant="tertiary" onClick={onHome}>
          {homeLabel}
        </Button>
      )}
    </Stack>
  )
}

export function HubPageTitle({
  title,
  subtitle,
  centered = false,
}: {
  title: string
  subtitle?: string
  centered?: boolean
}) {
  return (
    <Box sx={{ mb: 3, textAlign: centered ? 'center' : 'left' }}>
      <Typography variant="h3" color="primary.dark" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  )
}

export function HubContextBar({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        mb: 3,
        px: 2,
        py: 1,
        borderRadius: 1,
        bgcolor: 'grey.100',
        border: 1,
        borderColor: 'grey.200',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {children}
      </Typography>
    </Box>
  )
}

export function HubPanel({
  children,
  sx,
}: {
  children: ReactNode
  sx?: object
}) {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: 1,
        borderColor: 'grey.200',
        boxShadow: '0 8px 24px rgba(6, 7, 53, 0.06)',
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}

export function HubTrustFooter() {
  const items = [
    { label: 'Transacciones seguras' },
    { label: 'Eficiente' },
    { label: 'Sencillo' },
  ]

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={3}
      sx={{ mt: 5, color: 'secondary.main', justifyContent: 'center' }}
    >
      {items.map((item) => (
        <Typography key={item.label} variant="body2">
          {item.label}
        </Typography>
      ))}
    </Stack>
  )
}

export function HubKeyValueRow({
  label,
  value,
  highlight,
}: {
  label: string
  value: ReactNode
  highlight?: boolean
}) {
  return (
    <Stack direction="row" spacing={2} sx={{ py: 1.25, borderBottom: 1, borderColor: 'grey.100', justifyContent: 'space-between' }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" color={highlight ? 'secondary.main' : 'text.primary'} sx={{ fontWeight: 600, textAlign: 'right' }}>
        {value}
      </Typography>
    </Stack>
  )
}
