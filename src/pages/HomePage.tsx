import { Box } from '@mui/material'
import PlatformFxRateCards from '../components/platform/PlatformFxRateCards'
import PlatformNavPanel from '../components/platform/PlatformNavPanel'
import PlatformWelcomeHero from '../components/platform/PlatformWelcomeHero'

export default function HomePage() {
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', pb: 8 }}>
      <PlatformWelcomeHero />
      <PlatformFxRateCards />
      <PlatformNavPanel />
    </Box>
  )
}
