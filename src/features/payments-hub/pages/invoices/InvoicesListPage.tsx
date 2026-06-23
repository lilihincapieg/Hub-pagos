import { useMemo, useState } from 'react'
import { Box } from '@mui/material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Alert, Banner } from '../../../../design-system'
import HubEmptyState from '../../components/HubEmptyState'
import HubErrorState from '../../components/HubErrorState'
import HubInvoiceTable, { HubCurrencySummaryCards } from '../../components/HubInvoiceTable'
import HubLoadingState from '../../components/HubLoadingState'
import HubSelectionSummary from '../../components/HubSelectionSummary'
import { HubBreadcrumbs, HubPageTitle } from '../../components/HubPageShell'
import { useAsyncResource } from '../../hooks/useAsyncResource'
import { getPendingInvoices } from '../../services/paymentsHubService'
import type { CurrencyCode } from '../../types'
import { isForeignCurrency } from '../../utils/currency'
import { setFlowSession } from '../../utils/flowSession'

export default function InvoicesListPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const foreignOnly = searchParams.get('foreign') === 'true'
  const { data, loading, error, reload } = useAsyncResource(getPendingInvoices)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [validationError, setValidationError] = useState<string | null>(null)

  const filteredData = useMemo(
    () => (foreignOnly ? (data ?? []).filter((invoice) => isForeignCurrency(invoice.currency)) : (data ?? [])),
    [data, foreignOnly],
  )

  const selectedItems = filteredData.filter((item) => selectedIds.includes(item.id))
  const totalAmount = selectedItems.reduce((sum, item) => sum + item.amount, 0)
  const currency = (selectedItems[0]?.currency ?? 'USD') as CurrencyCode

  const currencyGroups = useMemo(() => {
    const groups: Record<string, { count: number; total: number; currency: string }> = {}
    selectedItems.forEach((invoice) => {
      groups[invoice.currency] = groups[invoice.currency] ?? { count: 0, total: 0, currency: invoice.currency }
      groups[invoice.currency].count += 1
      groups[invoice.currency].total += invoice.amount
    })
    return groups
  }, [selectedItems])

  const handleToggle = (id: string, checked: boolean) => {
    setValidationError(null)
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((itemId) => itemId !== id)))
  }

  const handleContinue = () => {
    if (selectedIds.length === 0) {
      setValidationError('Selecciona al menos una factura para continuar.')
      return
    }
    const currencies = new Set(selectedItems.map((item) => item.currency))
    if (currencies.size > 1) {
      setValidationError('Selecciona facturas en una sola moneda para continuar.')
      return
    }
    setFlowSession({ invoiceIds: selectedIds, financingIds: undefined, fxQuote: undefined, checkout: undefined, confirmation: undefined })
    navigate('/payments-hub/invoices/fx-quote')
  }

  if (loading) return <HubLoadingState message="Cargando facturas..." />
  if (error) return <HubErrorState message={error} onRetry={reload} />
  if (!filteredData.length) {
    return (
      <HubEmptyState
        title={foreignOnly ? 'Sin facturas en otra moneda' : 'Sin facturas pendientes'}
        description={foreignOnly ? 'No hay facturas pendientes en moneda extranjera.' : 'No hay facturas propias por pagar.'}
      />
    )
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <HubBreadcrumbs backLabel="Volver al Hub" onBack={() => navigate('/payments-hub')} onHome={() => navigate('/payments-hub')} />

      <HubPageTitle
        title={foreignOnly ? 'Facturas en Otra Moneda' : 'Selección de Facturas'}
        subtitle="Escoja las facturas que desea pagar. El pago final será procesado en moneda local."
      />

      {foreignOnly ? (
        <Box sx={{ mb: 2 }}>
          <Banner variant="info" title="Monedas soportadas" description="USD, EUR, GBP, JPY. El pago final será procesado en MXN o COP según su país." />
        </Box>
      ) : (
        <Box sx={{ mb: 2 }}>
          <Banner variant="info" title="Facturas propias" description="Seleccione facturas registradas en Comex o cargadas previamente en el flujo." />
        </Box>
      )}

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
          <HubInvoiceTable items={filteredData} selectedIds={selectedIds} onToggle={handleToggle} />
          {selectedIds.length > 0 && <HubCurrencySummaryCards groups={currencyGroups} />}
        </Box>

        <HubSelectionSummary
          title="Resumen de Selección"
          countLabel={`Facturas elegidas: ${selectedIds.length}`}
          totalLabel="Total a pagar:"
          totalAmount={totalAmount}
          currency={currency}
          breakdown={selectedItems.map((item) => ({ id: item.number, amount: item.amount, currency: item.currency }))}
          primaryLabel="Cotizar precio FX"
          onPrimary={handleContinue}
          onSecondary={() => navigate('/payments-hub')}
          disabled={selectedIds.length === 0}
        />
      </Box>
    </Box>
  )
}
