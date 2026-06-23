import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import HubPlatformTopBar from '../components/HubPlatformTopBar'

export default function PaymentsHubLayout() {
  return (
    <Box sx={{ minHeight: '100svh', bgcolor: 'background.paper', display: 'flex', flexDirection: 'column' }}>
      <HubPlatformTopBar />
      <Box component="main" sx={{ flex: 1, px: { xs: 2, md: 4 }, py: { xs: 3, md: 4 }, bgcolor: 'grey.100' }}>
        <Outlet />
      </Box>
    </Box>
  )
}
