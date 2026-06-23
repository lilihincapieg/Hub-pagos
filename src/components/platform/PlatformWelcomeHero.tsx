import { Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import PlatformQuickAction from './PlatformQuickAction'

const quickActions = [
  {
    label: 'Soluciones financieras',
    iconBg: 'primary.50',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M8 4h8l2 2v14H6V4h2zM9 10h6M9 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Hub de Pagos',
    iconBg: 'info.ultraLight',
    route: '/payments-hub',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="6" width="20" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 6V5a2 2 0 012-2h8a2 2 0 012 2v1" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    label: 'Asegurar mi mercancía',
    iconBg: 'quaternary.lighter',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3l8 4v6c0 4-3.5 7-8 8-4.5-1-8-4-8-8V7l8-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Analizar datos de la industria',
    iconBg: 'warning.light',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 19V9M12 19V5M19 19v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Verificar proveedores',
    iconBg: 'success.ultraLight',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M9 12l2 2 4-4M12 3l8 4v6c0 4-3.5 7-8 8-4.5-1-8-4-8-8V7l8-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export default function PlatformWelcomeHero() {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        bgcolor: 'info.ultraLight',
        borderRadius: 3,
        p: { xs: 2.5, md: 3.5 },
        mb: 3,
        border: 1,
        borderColor: 'info.light',
      }}
    >
      <Typography variant="h3" color="primary.dark" sx={{ mb: 0.5, fontWeight: 700 }}>
        ¡Bienvenido a tu plataforma de gestión del comercio exterior!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        ¿Qué estás buscando?
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
        {quickActions.map((action) => (
          <PlatformQuickAction
            key={action.label}
            icon={action.icon}
            label={action.label}
            iconBg={action.iconBg}
            onClick={'route' in action ? () => navigate(action.route!) : undefined}
          />
        ))}
      </Box>

      <Typography
        variant="body2"
        color="secondary.main"
        sx={{ mt: 2.5, cursor: 'pointer', display: 'inline-block' }}
      >
        Quiero que Finkargo administre mi comercio exterior de principio a fin →
      </Typography>
    </Box>
  )
}
