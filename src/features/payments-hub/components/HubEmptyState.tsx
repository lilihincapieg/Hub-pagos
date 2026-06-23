import { Box } from '@mui/material'
import { Alert } from '../../../design-system'

export default function HubEmptyState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <Box sx={{ maxWidth: 560 }}>
      <Alert variant="info" title={title} description={description} />
    </Box>
  )
}
