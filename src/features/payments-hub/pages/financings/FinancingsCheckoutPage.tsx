import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Alert, Button } from '../../../../design-system'
import HubLoadingState from '../../components/HubLoadingState'
import HubPaymentMethodList, { HubCheckoutStepper, HubTimerBadge } from '../../components/HubPaymentMethodList'
import { HubBreadcrumbs, HubKeyValueRow, HubPageTitle, HubPanel } from '../../components/HubPageShell'
import type { PaymentMethod } from '../../types'
import { confirmPaymentWithDetails, createCheckoutFromItems, getFinancingsByIds } from '../../services/paymentsHubService'
import { formatCurrency } from '../../utils/currency'
import { getFlowSession, setFlowSession } from '../../utils/flowSession'

export default function FinancingsCheckoutPage() {
  const navigate = useNavigate()
  const session = getFlowSession()
  const [method, setMethod] = useState<PaymentMethod>('pse')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const quote = session.fxQuote
  const ids = session.financingIds ?? []

  if (!quote || ids.length === 0) {
    navigate('/payments-hub/financings', { replace: true })
    return null
  }

  const financings = getFinancingsByIds(ids)

  const handlePay = async () => {
    setLoading(true)
    setError(null)
    try {
      const checkout = await createCheckoutFromItems(ids, 'financing', method, quote)
      checkout.totalAmount = quote.targetAmount
      checkout.currency = quote.targetCurrency
      const confirmation = await confirmPaymentWithDetails(checkout)
      setFlowSession({ checkout, confirmation })
      navigate('/payments-hub/financings/confirmation')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No fue posible procesar el pago.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <HubLoadingState message="Procesando pago..." />

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Stack direction="row" sx={{ mb: 2, justifyContent: 'space-between', alignItems: 'center' }}>
        <HubBreadcrumbs
          backLabel="Volver a Confirmación"
          onBack={() => navigate('/payments-hub/financings/fx-quote')}
          onHome={() => navigate('/payments-hub')}
        />
        <HubTimerBadge label="Tiempo restante" value="07:42" />
      </Stack>

      <HubPageTitle title="Checkout de Pago" subtitle="Confirme el método de pago local para completar la operación." />

      {error && (
        <Box sx={{ mb: 2 }}>
          <Alert variant="error" title="Error en checkout" description={error} />
        </Box>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1.2fr 0.8fr' },
          gap: 3,
        }}
      >
        <Stack spacing={3}>
          <HubPanel sx={{ p: 2.5 }}>
            <Typography variant="h4" color="primary.dark" sx={{ mb: 2 }}>
              Resumen de la Operación
            </Typography>
            <HubKeyValueRow label="Financiaciones seleccionadas" value={quote.itemsCount} />
            <HubKeyValueRow
              label="Monto total USD"
              value={formatCurrency(quote.sourceAmount, quote.sourceCurrency)}
            />
            <HubKeyValueRow
              label="Tasa FX aceptada"
              value={`1 ${quote.sourceCurrency} = ${quote.rate.toLocaleString('es-CO')} ${quote.targetCurrency}`}
            />
            <HubKeyValueRow
              label="Monto final en moneda local"
              value={formatCurrency(quote.targetAmount, quote.targetCurrency)}
              highlight
            />
            <HubKeyValueRow label="País de recaudo" value={quote.country} />
            <HubKeyValueRow label="Moneda de recaudo" value={`${quote.targetCurrency} (Peso colombiano)`} />
          </HubPanel>

          <HubPanel sx={{ p: 2.5 }}>
            <Typography variant="h4" color="primary.dark" sx={{ mb: 2 }}>
              Financiaciones Incluidas
            </Typography>
            {financings.map((item) => (
              <Stack key={item.id} direction="row" sx={{ py: 1, borderBottom: 1, borderColor: 'grey.100', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {item.reference}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Vencimiento: {item.dueDate}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {formatCurrency(item.amount, item.currency)}
                </Typography>
              </Stack>
            ))}
          </HubPanel>
        </Stack>

        <Stack spacing={3}>
          <HubPaymentMethodList value={method} onChange={setMethod} />
          <HubCheckoutStepper
            steps={[
              { label: 'Cotización FX aceptada — Tasa bloqueada correctamente', state: 'done' },
              { label: `Monto en ${quote.targetCurrency} confirmado`, state: 'done' },
              { label: 'Selección de método de pago — En progreso...', state: 'active' },
              { label: 'Confirmación del proveedor — Pendiente', state: 'pending' },
            ]}
          />
        </Stack>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Alert
          variant="warning"
          title="Importante: Temporizador activo"
          description="Si el tiempo expira, el checkout se cancelará automáticamente y deberá solicitar una nueva cotización."
        />
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3, justifyContent: 'center' }}>
        <Button variant="primary" onClick={handlePay}>
          Confirmar y Pagar
        </Button>
        <Button variant="tertiary" onClick={() => navigate('/payments-hub/financings/fx-quote')}>
          Volver
        </Button>
      </Stack>
    </Box>
  )
}
