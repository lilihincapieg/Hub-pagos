import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'

export default function PlatformQuickAction({
  icon,
  label,
  iconBg,
  onClick,
}: {
  icon: ReactNode
  label: string
  iconBg: string
  onClick?: () => void
}) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        border: 'none',
        cursor: onClick ? 'pointer' : 'default',
        bgcolor: 'background.paper',
        borderRadius: 2,
        p: 1.5,
        minWidth: 120,
        flex: '1 1 120px',
        maxWidth: 160,
        boxShadow: '0 4px 16px rgba(6, 7, 53, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        fontFamily: 'inherit',
        transition: 'transform 150ms ease, box-shadow 150ms ease',
        '&:hover': onClick
          ? {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(6, 7, 53, 0.1)',
            }
          : undefined,
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'primary.dark',
        }}
      >
        {icon}
      </Box>
      <Typography variant="caption" color="text.primary" sx={{ textAlign: 'center', lineHeight: 1.3 }}>
        {label}
      </Typography>
    </Box>
  )
}
