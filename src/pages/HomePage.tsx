import { Box, Typography } from '@mui/material'
import PlatformNavPanel from '../components/platform/PlatformNavPanel'
import PlatformWelcomeHero from '../components/platform/PlatformWelcomeHero'

export default function HomePage() {
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', pb: 8 }}>
      <PlatformWelcomeHero />
      <PlatformNavPanel />

      <Typography variant="h4" color="primary.dark" sx={{ mt: 4, mb: 2, fontWeight: 700 }}>
        Estado de cuenta
      </Typography>
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 3,
          p: 3,
          border: 1,
          borderColor: 'grey.200',
          minHeight: 120,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Resumen financiero disponible próximamente.
        </Typography>
      </Box>
    </Box>
  )
}
