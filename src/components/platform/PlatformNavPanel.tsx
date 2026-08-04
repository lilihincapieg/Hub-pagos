import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../design-system'

function PanelCard({
  title,
  children,
  sx,
}: {
  title: string
  children: ReactNode
  sx?: object
}) {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 3,
        p: 2.5,
        border: 1,
        borderColor: 'grey.200',
        boxShadow: '0 4px 16px rgba(6, 7, 53, 0.05)',
        height: '100%',
        ...sx,
      }}
    >
      {children}
      <Typography variant="h4" color="primary.dark" sx={{ mt: 1.5, fontWeight: 700 }}>
        {title}
      </Typography>
    </Box>
  )
}

export default function PlatformNavPanel() {
  const navigate = useNavigate()

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
        Inicio
      </Typography>
      <Typography variant="h4" color="primary.dark" sx={{ mb: 2.5, fontWeight: 700 }}>
        Panel de navegación
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 2,
        }}
      >
        <PanelCard title="0 Importaciones en curso">
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: 'primary.50',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.light',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 18h18M6 18V9l6-4 6 4v9" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            — aseguradas con FK
          </Typography>
        </PanelCard>

        <PanelCard
          title="Pagos y cobranzas"
          sx={{
            borderColor: 'secondary.main',
            bgcolor: 'primary.50',
            borderWidth: 2,
            boxShadow: '0 8px 24px rgba(60, 71, 211, 0.12)',
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: 'background.paper',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'secondary.main',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="2" y="6" width="20" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="12" cy="12.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
            Vea alertas de cashflow y pague financiaciones o facturas con datos que Finkargo ya tiene.
          </Typography>
          <Button variant="primary" onClick={() => navigate('/payments-hub')}>
            Ir al Hub de Pagos
          </Button>
        </PanelCard>

        <PanelCard title="Herramientas" sx={{ bgcolor: 'quaternary.ultraLight', borderColor: 'quaternary.light' }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: 'background.paper',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.light',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="4" y="5" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </Box>
          {['Cotiza un seguro', 'Cotiza un reporte', 'Cotiza una verificación'].map((item) => (
            <Typography
              key={item}
              variant="body2"
              color="primary.dark"
              sx={{ mt: 1.5, display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}
            >
              {item}
              <span>→</span>
            </Typography>
          ))}
        </PanelCard>
      </Box>
    </Box>
  )
}
