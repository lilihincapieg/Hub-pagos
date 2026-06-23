import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Alert, Button, Input } from '../../../../design-system'
import HubLoadingState from '../../components/HubLoadingState'
import HubPaymentMethodList, { HubTimerBadge } from '../../components/HubPaymentMethodList'
import { HubBreadcrumbs, HubKeyValueRow, HubPageTitle, HubPanel } from '../../components/HubPageShell'
import type { PaymentMethod } from '../../types'
import { confirmPaymentWithDetails, createCheckoutFromItems, getInvoicesByIds } from '../../services/paymentsHubService'
import { formatCurrency } from '../../utils/currency'
import { getFlowSession, setFlowSession } from '../../utils/flowSession'

export default function InvoicesCheckoutPage() {
  const navigate = useNavigate()
  const session = getFlowSession()
  const [method, setMethod] = useState<PaymentMethod>('pse')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const quote = session.fxQuote
  const ids = session.invoiceIds ?? []

  if (!quote || ids.length === 0) {
    navigate('/payments-hub/invoices', { replace: true })
    return null
  }

  const invoices = getInvoicesByIds(ids)

  const handlePay = async () => {
    setLoading(true)
    setError(null)
    try {
      const checkout = await createCheckoutFromItems(ids, 'invoice', method, quote)
      checkout.totalAmount = quote.targetAmount
      checkout.currency = quote.targetCurrency
      const confirmation = await confirmPaymentWithDetails(checkout)
      setFlowSession({ checkout, confirmation })
      navigate('/payments-hub/invoices/confirmation')
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
        <HubBreadcrumbs backLabel="Volver a Revisión" onBack={() => navigate('/payments-hub/invoices/fx-quote')} onHome={() => navigate('/payments-hub')} />
        <HubTimerBadge label="Tiempo restante" value="09:47" />
      </Stack>

      <HubPageTitle title="Checkout de Pago Local" subtitle="Complete los datos para iniciar la transferencia bancaria." />

      {error && (
        <Box sx={{ mb: 2 }}>
          <Alert variant="error" title="Error en checkout" description={error} />
        </Box>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.1fr 0.9fr' }, gap: 3 }}>
        <Stack spacing={3}>
          <HubPaymentMethodList value={method} onChange={setMethod} />
          <HubPanel sx={{ p: 2.5 }}>
            <Typography variant="h4" color="primary.dark" sx={{ mb: 1 }}>
              Pago vía PSE
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Complete los datos para iniciar la transferencia bancaria.
            </Typography>
            <Stack spacing={2}>
              <Input label="Banco" defaultValue="Bancolombia" disabled />
              <Input label="Tipo de persona" defaultValue="Persona Jurídica" disabled />
              <Input label="Tipo de documento" defaultValue="NIT" disabled />
              <Input label="Número de documento" defaultValue="900.456.789-1" disabled />
            </Stack>
            <Box sx={{ mt: 3 }}>
              <Button variant="primary" onClick={handlePay}>
                Pagar {formatCurrency(quote.targetAmount, quote.targetCurrency)}
              </Button>
            </Box>
          </HubPanel>
        </Stack>

        <HubPanel sx={{ p: 2.5 }}>
          <Typography variant="h4" color="primary.dark" sx={{ mb: 2 }}>
            Resumen de Operación
          </Typography>
          <HubKeyValueRow label="Referencia de pago" value={session.checkout?.reference ?? 'FK-2025-00847'} />
          <HubKeyValueRow label="Facturas incluidas" value={quote.itemsCount} />
          <Box sx={{ bgcolor: 'grey.100', borderRadius: 2, p: 1.5, my: 2 }}>
            {invoices.map((invoice) => (
              <Stack key={invoice.id} direction="row" sx={{ py: 0.5, justifyContent: 'space-between' }}>
                <Typography variant="body2">{invoice.number}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {formatCurrency(invoice.amount, invoice.currency)}
                </Typography>
              </Stack>
            ))}
          </Box>
          <HubKeyValueRow label="Total USD" value={formatCurrency(quote.sourceAmount, quote.sourceCurrency)} />
          <HubKeyValueRow label="Tasa aplicada" value={`1 ${quote.sourceCurrency} = ${quote.rate.toLocaleString('es-CO')} ${quote.targetCurrency}`} />
          <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.50', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Total a pagar
            </Typography>
            <Typography variant="h3" color="primary.dark">
              {formatCurrency(quote.targetAmount, quote.targetCurrency)}
            </Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Alert variant="warning" title="Sesión con límite de tiempo" description="Si el tiempo expira, deberá solicitar una nueva cotización." />
          </Box>
        </HubPanel>
      </Box>
    </Box>
  )
}
