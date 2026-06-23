import { Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function HubPlatformTopBar() {
  const navigate = useNavigate()

  return (
    <Box
      component="header"
      sx={{
        bgcolor: 'primary.50',
        borderBottom: 1,
        borderColor: 'primary.ultraLight',
        px: { xs: 2, md: 3 },
        py: 1.25,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box
        component="button"
        type="button"
        onClick={() => navigate('/')}
        aria-label="Volver a la plataforma"
        sx={{
          border: 'none',
          cursor: 'pointer',
          bgcolor: 'background.paper',
          width: 36,
          height: 36,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'primary.light',
          boxShadow: '0 2px 8px rgba(6, 7, 53, 0.08)',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            bgcolor: 'background.paper',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.dark',
            boxShadow: '0 2px 8px rgba(6, 7, 53, 0.08)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M15 17h5l-1.4-1.4A8 8 0 1017 19l1.4-1.4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Box>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            bgcolor: 'primary.dark',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body2" sx={{ color: 'common.white', fontWeight: 700 }}>
            M
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
