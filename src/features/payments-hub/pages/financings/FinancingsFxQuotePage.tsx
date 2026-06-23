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

export default function FinancingsFxQuotePage() {
  const navigate = useNavigate()
  const [quote, setQuote] = useState<FxQuote | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [secondsRemaining, setSecondsRemaining] = useState(45)

  useEffect(() => {
    const session = getFlowSession()
    const ids = session.financingIds ?? []
    if (ids.length === 0) {
      navigate('/payments-hub/financings', { replace: true })
      return
    }

    createFxQuote({ itemIds: ids, itemType: 'financing', targetCurrency: 'COP' })
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
    const timer = window.setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [quote])

  if (loading) return <HubLoadingState message="Generando cotización FX..." />
  if (error) return <HubErrorState message={error} onRetry={() => navigate('/payments-hub/financings')} />
  if (!quote) return null

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto' }}>
      <HubBreadcrumbs
        backLabel="Volver a Financiaciones"
        onBack={() => navigate('/payments-hub/financings')}
        onHome={() => navigate('/payments-hub')}
      />

      <HubContextBar>
        País: Colombia | Moneda: COP (Detectado desde su perfil)
      </HubContextBar>

      <HubPageTitle
        centered
        title="Cotización de Tipo de Cambio"
        subtitle="Convierta su total en USD a pesos colombianos (COP) con la mejor tasa disponible"
      />

      <HubQuotePanel quote={quote} secondsRemaining={secondsRemaining} />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3, justifyContent: 'center' }}>
        <Button variant="primary" onClick={() => navigate('/payments-hub/financings/checkout')}>
          Aceptar precio
        </Button>
        <Button variant="secondary" onClick={() => navigate('/payments-hub/financings')}>
          Volver a cotizar
        </Button>
      </Stack>
    </Box>
  )
}
