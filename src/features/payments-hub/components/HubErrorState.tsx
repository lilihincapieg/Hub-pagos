import { Box } from '@mui/material'
import { Alert, Button } from '../../../design-system'

export default function HubErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <Box sx={{ maxWidth: 560 }}>
      <Alert variant="error" title="Error" description={message} />
      {onRetry && (
        <Box sx={{ mt: 2 }}>
          <Button variant="secondary" onClick={onRetry}>
            Reintentar
          </Button>
        </Box>
      )}
    </Box>
  )
}
