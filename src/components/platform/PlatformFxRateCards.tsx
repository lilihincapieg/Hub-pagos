import { Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../design-system'

/**
 * Tasas mock del día — Home.
 * // TODO: reemplazar por integración real — feed FX / pricing core
 */
const rates = [
  {
    pair: 'USD / COP',
    base: 'USD',
    quote: 'COP',
    rate: '4.152,30',
    change: '+0,18%',
    up: true,
  },
  {
    pair: 'USD / MXN',
    base: 'USD',
    quote: 'MXN',
    rate: '18,42',
    change: '-0,07%',
    up: false,
  },
  {
    pair: 'USD / CNY',
    base: 'USD',
    quote: 'CNY',
    rate: '7,24',
    change: '+0,05%',
    up: true,
  },
]

export default function PlatformFxRateCards() {
  const navigate = useNavigate()

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
        Mercado
      </Typography>
      <Typography variant="h4" color="primary.dark" sx={{ mb: 0.5, fontWeight: 700 }}>
        Tasas de hoy
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
        Precio de referencia al cierre de hoy. Aprovecha la tasa desde el Hub de Pagos.
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 2,
        }}
      >
        {rates.map((item) => (
          <Box
            key={item.pair}
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 3,
              border: 1,
              borderColor: 'grey.200',
              p: 2.5,
              boxShadow: '0 4px 16px rgba(6, 7, 53, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              {item.pair}
            </Typography>
            <Typography variant="h3" color="primary.dark" sx={{ fontWeight: 700, mt: 0.5, mb: 0.5 }}>
              {item.rate}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: item.up ? 'success.main' : 'error.main',
                fontWeight: 600,
                mb: 2,
              }}
            >
              {item.change} vs. ayer
            </Typography>
            <Box sx={{ mt: 'auto' }}>
              <Button variant="primary" onClick={() => navigate('/payments-hub')}>
                Aprovecha la tasa aquí
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
