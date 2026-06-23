import { useState } from 'react'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import HubErrorState from '../../components/HubErrorState'
import HubLoadingState from '../../components/HubLoadingState'
import HubOperationsTable from '../../components/HubOperationsTable'
import { HubDashboardMetricCards, HubFilterBar } from '../../components/HubDashboardTable'
import { HubBreadcrumbs, HubPageTitle } from '../../components/HubPageShell'
import { useAsyncResource } from '../../hooks/useAsyncResource'
import { getInvoiceOperations } from '../../services/paymentsHubService'
import { formatCurrency } from '../../utils/currency'

export default function DashboardInvoicesPage() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState('Último mes')
  const { data, loading, error, reload } = useAsyncResource(getInvoiceOperations)

  if (loading) return <HubLoadingState message="Cargando dashboard de facturas..." />
  if (error || !data) return <HubErrorState message={error ?? 'No fue posible cargar los datos.'} onRetry={reload} />

  const paid = data.filter((op) => op.status === 'paid')

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <HubBreadcrumbs backLabel="Volver al dashboard" onBack={() => navigate('/payments-hub/dashboard')} />
      <HubPageTitle title="Dashboard Facturas Propias" subtitle="Transacciones de facturas pagadas y pendientes." />
      <HubFilterBar activePeriod={period} onChange={setPeriod} />
      <HubDashboardMetricCards
        metrics={[
          { label: 'Operaciones', value: String(data.length) },
          { label: 'Pagadas', value: String(paid.length) },
          { label: 'Vencidas', value: String(data.filter((op) => op.status === 'overdue').length) },
          {
            label: 'Último pago',
            value: paid[0] ? formatCurrency(paid[0].amount, paid[0].currency) : '—',
          },
        ]}
      />
      <HubOperationsTable operations={data} />
    </Box>
  )
}
