import { Box, Stack, Typography } from '@mui/material'
import { RadioButton } from '../../../design-system'
import type { PaymentMethod } from '../types'
import { paymentMethodLabels } from '../utils/status'
import { HubPanel } from './HubPageShell'

const methods: { id: PaymentMethod; title: string; description: string }[] = [
  { id: 'pse', title: 'PSE - Transferencia bancaria', description: 'Débito directo desde su cuenta bancaria' },
  { id: 'bank_transfer', title: 'Transferencia local (ACH)', description: 'Transferencia desde cuenta empresarial' },
  { id: 'local_account', title: 'Nequi / Daviplata', description: 'Pago desde billetera digital' },
]

export default function HubPaymentMethodList({
  value,
  onChange,
}: {
  value: PaymentMethod
  onChange: (method: PaymentMethod) => void
}) {
  return (
    <HubPanel sx={{ p: 2.5 }}>
      <Typography variant="h4" color="primary.dark" sx={{ mb: 0.5 }}>
        Método de Pago
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Seleccione el método de pago compatible con Colombia.
      </Typography>

      <Stack spacing={1.5}>
        {methods.map((method) => {
          const selected = value === method.id
          return (
            <Box
              key={method.id}
              onClick={() => onChange(method.id)}
              sx={{
                p: 2,
                borderRadius: 2,
                border: 2,
                borderColor: selected ? 'secondary.main' : 'grey.200',
                bgcolor: selected ? 'primary.50' : 'background.paper',
                cursor: 'pointer',
              }}
            >
              <RadioButton
                label={method.title}
                checked={selected}
                onChange={() => onChange(method.id)}
              />
              <Typography variant="body2" color="text.secondary" sx={{ pl: 4 }}>
                {method.description}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ pl: 4 }}>
                {paymentMethodLabels[method.id]}
              </Typography>
            </Box>
          )
        })}
      </Stack>
    </HubPanel>
  )
}

export function HubCheckoutStepper({
  steps,
}: {
  steps: { label: string; state: 'done' | 'active' | 'pending' }[]
}) {
  return (
    <HubPanel sx={{ p: 2.5 }}>
      <Typography variant="h4" color="primary.dark" sx={{ mb: 2 }}>
        Estado del Checkout
      </Typography>
      <Stack spacing={1.5}>
        {steps.map((step, index) => (
          <Stack key={step.label} direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                bgcolor: step.state === 'done' ? 'success.main' : step.state === 'active' ? 'secondary.main' : 'grey.300',
                color: 'common.white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {step.state === 'done' ? '✓' : index + 1}
            </Box>
            <Typography variant="body2" color={step.state === 'pending' ? 'text.secondary' : 'text.primary'}>
              {step.label}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </HubPanel>
  )
}

export function HubTimerBadge({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 1,
        borderRadius: 999,
        bgcolor: 'warning.light',
        border: 1,
        borderColor: 'warning.main',
      }}
    >
      <Typography variant="caption" color="warning.dark">
        {label}
      </Typography>
      <Typography variant="body2" color="warning.dark" sx={{ fontWeight: 700 }}>
        {value}
      </Typography>
    </Box>
  )
}
