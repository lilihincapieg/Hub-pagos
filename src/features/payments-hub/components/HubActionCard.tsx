import { Box, Button as MuiButton, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'

export interface HubActionCardProps {
  title: string
  description: string
  stats: { label: string; value: string }[]
  ctaLabel: string
  onClick: () => void
  accent?: 'navy' | 'blue' | 'teal' | 'orange'
  icon: ReactNode
}

const accentMap = {
  navy: {
    iconBg: 'info.ultraLight',
    iconColor: 'info.main',
    buttonBg: 'primary.dark',
    buttonHover: 'primary.main',
  },
  blue: {
    iconBg: 'info.ultraLight',
    iconColor: 'info.main',
    buttonBg: 'info.main',
    buttonHover: 'info.dark',
  },
  teal: {
    iconBg: 'quaternary.lighter',
    iconColor: 'secondary.main',
    buttonBg: 'secondary.main',
    buttonHover: 'primary.light',
  },
  orange: {
    iconBg: 'warning.light',
    iconColor: 'orange.dark',
    buttonBg: 'orange.dark',
    buttonHover: 'warning.main',
  },
} as const

export default function HubActionCard({
  title,
  description,
  stats,
  ctaLabel,
  onClick,
  accent = 'navy',
  icon,
}: HubActionCardProps) {
  const palette = accentMap[accent]

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 3,
        border: 1,
        borderColor: 'grey.200',
        p: 2.5,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 16px rgba(6, 7, 53, 0.05)',
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          bgcolor: palette.iconBg,
          color: palette.iconColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 2,
        }}
      >
        {icon}
      </Box>

      <Typography variant="h4" color="primary.dark" sx={{ textAlign: 'center', mb: 1, fontWeight: 700 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 2, flex: 1, lineHeight: 1.5 }}>
        {description}
      </Typography>

      <Box
        sx={{
          bgcolor: 'info.ultraLight',
          borderRadius: 2,
          p: 1.5,
          mb: 2,
        }}
      >
        {stats.map((stat) => (
          <Stack key={stat.label} direction="row" sx={{ py: 0.5, justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary">
              {stat.label}
            </Typography>
            <Typography variant="caption" color="primary.dark" sx={{ fontWeight: 700 }}>
              {stat.value}
            </Typography>
          </Stack>
        ))}
      </Box>

      <MuiButton
        fullWidth
        variant="contained"
        onClick={onClick}
        sx={{
          bgcolor: palette.buttonBg,
          color: 'common.white',
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 2,
          py: 1.25,
          boxShadow: 'none',
          '&:hover': {
            bgcolor: palette.buttonHover,
            boxShadow: 'none',
          },
        }}
      >
        {ctaLabel}
      </MuiButton>
    </Box>
  )
}
