import { Box, Stack, Typography } from '@mui/material'
import { Button } from '../../../design-system'

export interface HubModuleCardProps {
  title: string
  description: string
  metric: string
  ctaLabel: string
  onClick: () => void
}

export default function HubModuleCard({
  title,
  description,
  metric,
  ctaLabel,
  onClick,
}: HubModuleCardProps) {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'grey.200',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Typography variant="overline" color="primary.main" sx={{ mb: 1 }}>
        {metric}
      </Typography>
      <Typography variant="h4" color="text.primary" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flex: 1 }}>
        {description}
      </Typography>
      <Stack direction="row">
        <Button variant="primary" onClick={onClick}>
          {ctaLabel}
        </Button>
      </Stack>
    </Box>
  )
}
