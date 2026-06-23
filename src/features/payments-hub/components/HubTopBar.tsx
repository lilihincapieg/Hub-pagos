import { Box, Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../../../design-system'

const navLinks = [
  { label: 'Hub de Pagos', path: '/payments-hub' },
  { label: 'Financiaciones', path: '/payments-hub/financings' },
  { label: 'Cotización FX', path: '/payments-hub/financings/fx-quote' },
  { label: 'Mis Pagos', path: '/payments-hub/dashboard' },
]

function isActive(path: string, current: string): boolean {
  if (path === '/payments-hub') return current === '/payments-hub'
  return current.startsWith(path)
}

export default function HubTopBar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Box
      component="header"
      sx={{
        bgcolor: 'primary.dark',
        color: 'common.white',
        px: { xs: 2, md: 3 },
        py: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        flexWrap: 'wrap',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1,
            bgcolor: 'secondary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 12,
          }}
        >
          FK
        </Box>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          Flujo FX Pagos
        </Typography>
      </Box>

      <Box
        component="nav"
        sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          gap: 3,
        }}
      >
        {navLinks.map((link) => {
          const active = isActive(link.path, location.pathname)
          return (
            <Box
              key={link.path}
              component="button"
              type="button"
              onClick={() => navigate(link.path)}
              sx={{
                border: 'none',
                background: 'transparent',
                color: 'common.white',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 14,
                fontWeight: active ? 600 : 400,
                opacity: active ? 1 : 0.85,
                borderBottom: active ? '2px solid' : '2px solid transparent',
                borderColor: active ? 'quaternary.main' : 'transparent',
                pb: 0.5,
              }}
            >
              {link.label}
            </Box>
          )
        })}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Button variant="primary" size="small" onClick={() => navigate('/payments-hub/financings')}>
          Pagar Financiaciones
        </Button>
      </Box>
    </Box>
  )
}
