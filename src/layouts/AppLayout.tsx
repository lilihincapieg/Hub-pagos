import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { Sidebar } from '../design-system'
import { appNavItems, getActiveNavId } from '../app/navigation.config'
import { FKLogo } from '../app/navigation.icons'

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const activeId = getActiveNavId(location.pathname)

  const sidebarItems = appNavItems.map(({ path, Icon, ...item }) => ({
    ...item,
    icon: <Icon />,
    onClick: () => navigate(path),
  }))

  return (
    <Box sx={{ display: 'flex', minHeight: '100svh', bgcolor: 'grey.100' }}>
      <Sidebar items={sidebarItems} activeId={activeId} logo={<FKLogo />} />

      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        <Box
          component="header"
          sx={{
            px: { xs: 2, md: 4 },
            py: 1.5,
            bgcolor: 'background.paper',
            borderBottom: 1,
            borderColor: 'grey.200',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <Box
            component="button"
            type="button"
            sx={{
              border: 'none',
              bgcolor: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              fontFamily: 'inherit',
              color: 'text.primary',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Camilo Rivera
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ▾
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            p: { xs: 2, md: 4 },
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Box>

        <Box
          component="button"
          type="button"
          sx={{
            position: 'fixed',
            right: 24,
            bottom: 24,
            border: 'none',
            bgcolor: 'primary.dark',
            color: 'common.white',
            borderRadius: 999,
            px: 2.5,
            py: 1.25,
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: 14,
            fontWeight: 600,
            boxShadow: '0 8px 24px rgba(6, 7, 53, 0.2)',
          }}
        >
          Soporte
        </Box>
      </Box>
    </Box>
  )
}
