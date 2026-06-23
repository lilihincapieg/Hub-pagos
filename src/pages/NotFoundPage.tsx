import { Box } from '@mui/material'
import { Alert, Button } from '../design-system'
import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <Box sx={{ maxWidth: 560 }}>
      <Alert
        variant="warning"
        title="Página no encontrada"
        description="La ruta solicitada no existe en esta aplicación."
        actionLabel="Volver al inicio"
        onAction={() => navigate('/')}
      />
      <Box sx={{ mt: 3 }}>
        <Button variant="primary" onClick={() => navigate('/')}>
          Ir al inicio
        </Button>
      </Box>
    </Box>
  )
}
