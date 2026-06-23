import type { PaymentStatus } from '../types'
import type { BadgeVariant } from '../../../design-system'

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  paid: 'Pagado',
  pending: 'Pendiente',
  overdue: 'Vencido',
  in_progress: 'En proceso',
}

export const paymentStatusBadgeVariant: Record<PaymentStatus, BadgeVariant> = {
  paid: 'success',
  pending: 'info',
  overdue: 'error',
  in_progress: 'warning',
}

export const paymentMethodLabels: Record<string, string> = {
  bank_transfer: 'Transferencia bancaria',
  pse: 'PSE',
  wire: 'Wire internacional',
  local_account: 'Cuenta local',
}
