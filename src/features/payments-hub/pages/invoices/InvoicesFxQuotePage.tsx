import { useEffect, useState } from 'react'
import { Box, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../../design-system'
import HubErrorState from '../../components/HubErrorState'
import HubLoadingState from '../../components/HubLoadingState'
import HubQuotePanel from '../../components/HubQuotePanel'
import { HubBreadcrumbs, HubContextBar, HubPageTitle } from '../../components/HubPageShell'
import type { FxQuote } from '../../types'
import { createFxQuote } from '../../services/paymentsHubService'
import { getFlowSession, setFlowSession } from '../../utils/flowSession'

export default function InvoicesFxQuotePage() {
  const navigate = useNavigate()
  const [quote, setQuote] = useState<FxQuote | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [secondsRemaining, setSecondsRemaining] = useState(47)

  useEffect(() => {
    const session = getFlowSession()
    const ids = session.invoiceIds ?? []
    if (ids.length === 0) {
      navigate('/payments-hub/invoices', { replace: true })
      return
    }

    createFxQuote({
      itemIds: ids,
      itemType: 'invoice',
      targetCurrency: 'COP',
      amountOverride: session.payAmountOverride,
    })
      .then((result) => {
        setQuote(result)
        setFlowSession({ fxQuote: result })
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'No fue posible crear la cotización.')
      })
      .finally(() => setLoading(false))
  }, [navigate])

  useEffect(() => {
    if (!quote) return
    const timer = window.setInterval(() => setSecondsRemaining((prev) => Math.max(0, prev - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [quote])

  const session = getFlowSession()
  const railLabel =
    session.paymentRail === 'payops'
      ? 'Riel: PayOps (transferencia internacional)'
      : 'Riel: Paga Local'

  if (loading) return <HubLoadingState message="Generando cotización de divisas..." />
  if (error) return <HubErrorState message={error} onRetry={() => navigate('/payments-hub/invoices')} />
  if (!quote) return null

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto' }}>
      <HubBreadcrumbs backLabel="Volver a Facturas" onBack={() => navigate('/payments-hub/invoices')} onHome={() => navigate('/payments-hub')} />
      <HubContextBar>
        País: Colombia | Moneda de cobro: COP | {railLabel}
      </HubContextBar>
      <HubPageTitle centered title="Cotización de Divisas" subtitle="La cotización es válida por 1 minuto. Acepte antes de que expire para asegurar estas tasas." />
      <HubQuotePanel quote={quote} secondsRemaining={secondsRemaining} />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3, justifyContent: 'center' }}>
        <Button variant="primary" onClick={() => navigate('/payments-hub/invoices/checkout')}>
          Aceptar Cotización
        </Button>
        <Button variant="secondary" onClick={() => navigate('/payments-hub/invoices')}>
          Nueva Cotización
        </Button>
      </Stack>
    </Box>
  )
}
