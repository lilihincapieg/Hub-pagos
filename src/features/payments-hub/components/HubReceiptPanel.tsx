import { Box, Stack, Typography } from '@mui/material'
import { Alert, Badge, Button, Toast } from '../../../design-system'
import type { PaymentConfirmation } from '../types'
import { formatCurrency } from '../utils/currency'
import { paymentMethodLabels } from '../utils/status'
import { HubKeyValueRow, HubPanel } from './HubPageShell'

export default function HubReceiptPanel({
  confirmation,
  onBackHub,
  onDashboard,
  onDownload,
}: {
  confirmation: PaymentConfirmation
  onBackHub: () => void
  onDashboard?: () => void
  onDownload?: () => void
}) {
  return (
    <Box sx={{ maxWidth: 820, mx: 'auto' }}>
      <Stack spacing={1} sx={{ mb: 3, alignItems: 'center' }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            bgcolor: 'success.ultraLight',
            color: 'success.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
          }}
        >
          ✓
        </Box>
        <Typography variant="h3" color="primary.dark" sx={{ textAlign: 'center' }}>
          ¡Pago Realizado Exitosamente!
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          Su pago ha sido procesado y confirmado por el proveedor local.
        </Typography>
      </Stack>

      <Toast
        variant="success"
        title="Pago confirmado"
        message={`Operación ${confirmation.operationId} registrada correctamente.`}
      />

      <HubPanel sx={{ p: 3, mt: 3 }}>
        <Stack direction="row" sx={{ mb: 2, justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" color="primary.dark">
            Comprobante de Pago
          </Typography>
          <Badge label="Confirmado" variant="success" size="small" />
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 2,
          }}
        >
          <Box>
            <HubKeyValueRow label="Número de operación" value={confirmation.operationId} highlight />
            <HubKeyValueRow label="Financiaciones / facturas" value={confirmation.itemReferences.join(', ')} />
            <HubKeyValueRow
              label={`Equivalente en ${confirmation.sourceCurrency}`}
              value={formatCurrency(confirmation.sourceAmount, confirmation.sourceCurrency)}
            />
            <HubKeyValueRow label="Método de pago" value={paymentMethodLabels[confirmation.method]} />
          </Box>
          <Box>
            <HubKeyValueRow
              label="Fecha y hora"
              value={new Date(confirmation.confirmedAt).toLocaleString('es-CO')}
            />
            <HubKeyValueRow
              label={`Monto pagado (${confirmation.currency})`}
              value={formatCurrency(confirmation.amount, confirmation.currency)}
              highlight
            />
            <HubKeyValueRow label="País" value={confirmation.country} />
            <HubKeyValueRow
              label="Tasa FX aplicada"
              value={`1 ${confirmation.sourceCurrency} = ${confirmation.fxRateAccepted.toLocaleString('es-CO')} ${confirmation.currency}`}
            />
          </Box>
        </Box>
      </HubPanel>

      <Box sx={{ mt: 3 }}>
        <Alert
          variant="info"
          title="Próximos pasos"
          description={`La aplicación del pago se verá reflejada en el Hub de Pagos en un plazo máximo de 24 horas hábiles. Fecha estimada de aplicación: ${new Date(confirmation.estimatedApplicationDate).toLocaleDateString('es-CO')}.`}
        />
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4, justifyContent: 'center' }}>
        <Button variant="primary" onClick={onBackHub}>
          Volver al Hub de Pagos
        </Button>
        {onDownload && (
          <Button variant="secondary" onClick={onDownload}>
            Descargar Comprobante
          </Button>
        )}
        {onDashboard && (
          <Button variant="tertiary" onClick={onDashboard}>
            Ver Dashboard
          </Button>
        )}
      </Stack>
    </Box>
  )
}
