import { Badge } from '../../../design-system'
import type { PaymentStatus } from '../types'
import { paymentStatusBadgeVariant, paymentStatusLabels } from '../utils/status'

export default function HubStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <Badge
      label={paymentStatusLabels[status]}
      variant={paymentStatusBadgeVariant[status]}
      size="small"
    />
  )
}
