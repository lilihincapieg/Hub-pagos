import { useMemo, useState } from 'react'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Alert, Banner } from '../../../../design-system'
import HubEmptyState from '../../components/HubEmptyState'
import HubErrorState from '../../components/HubErrorState'
import HubFinancingTable from '../../components/HubFinancingTable'
import HubLoadingState from '../../components/HubLoadingState'
import HubSelectionSummary from '../../components/HubSelectionSummary'
import { HubBreadcrumbs, HubPageTitle } from '../../components/HubPageShell'
import { useAsyncResource } from '../../hooks/useAsyncResource'
import { getPendingFinancings } from '../../services/paymentsHubService'
import type { CurrencyCode } from '../../types'
import { setFlowSession } from '../../utils/flowSession'

export default function FinancingsListPage() {
  const navigate = useNavigate()
  const { data, loading, error, reload } = useAsyncResource(getPendingFinancings)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [validationError, setValidationError] = useState<string | null>(null)

  const selectedItems = useMemo(
    () => (data ?? []).filter((item) => selectedIds.includes(item.id)),
    [data, selectedIds],
  )

  const totalAmount = selectedItems.reduce((sum, item) => sum + item.amount, 0)
  const currency = (selectedItems[0]?.currency ?? 'USD') as CurrencyCode

  const handleToggle = (id: string, checked: boolean) => {
    setValidationError(null)
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((itemId) => itemId !== id)))
  }

  const handleContinue = () => {
    if (selectedIds.length === 0) {
      setValidationError('Selecciona al menos una financiación para continuar.')
      return
    }
    const currencies = new Set(selectedItems.map((item) => item.currency))
    if (currencies.size > 1) {
      setValidationError('Selecciona financiaciones en una sola moneda para continuar.')
      return
    }
    setFlowSession({ financingIds: selectedIds, invoiceIds: undefined, fxQuote: undefined, checkout: undefined, confirmation: undefined })
    navigate('/payments-hub/financings/fx-quote')
  }

  if (loading) return <HubLoadingState message="Cargando financiaciones..." />
  if (error) return <HubErrorState message={error} onRetry={reload} />
  if (!data?.length) {
    return <HubEmptyState title="Sin financiaciones pendientes" description="No hay financiaciones por pagar en este momento." />
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <HubBreadcrumbs backLabel="Volver al Hub" onBack={() => navigate('/payments-hub')} onHome={() => navigate('/payments-hub')} />

      <Box sx={{ mb: 2 }}>
        <Banner
          variant="warning"
          title="Cotización anterior expirada"
          description="Su cotización anterior expiró. Las financiaciones previamente seleccionadas han sido recuperadas. Por favor inicie una nueva cotización."
        />
      </Box>

      <HubPageTitle
        title="Selección de Financiaciones"
        subtitle="Seleccione las financiaciones que desea pagar. Las más antiguas y vencidas aparecen primero."
      />

      {validationError && (
        <Box sx={{ mb: 2 }}>
          <Alert variant="warning" title="Revisa tu selección" description={validationError} />
        </Box>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 320px' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        <Box>
          <HubFinancingTable items={data} selectedIds={selectedIds} onToggle={handleToggle} />
          <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'space-between' }}>
            <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
              Mostrando {data.length} financiaciones activas
            </Box>
            <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
              Ordenado por: Prioridad de protocolo
            </Box>
          </Box>
        </Box>

        <HubSelectionSummary
          title="Resumen de Selección"
          countLabel={`Financiaciones elegidas: ${selectedIds.length}`}
          totalLabel="Total a pagar:"
          totalAmount={totalAmount}
          currency={currency}
          breakdown={selectedItems.map((item) => ({ id: item.reference, amount: item.amount, currency: item.currency }))}
          infoMessage="Tiene financiaciones no seleccionadas con prioridad normal. Puede continuar sin incluirlas."
          primaryLabel="Cotizar precio FX"
          onPrimary={handleContinue}
          onSecondary={() => navigate('/payments-hub')}
          disabled={selectedIds.length === 0}
        />
      </Box>
    </Box>
  )
}
