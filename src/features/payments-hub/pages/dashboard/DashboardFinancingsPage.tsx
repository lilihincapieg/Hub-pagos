import { useState } from 'react'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import HubErrorState from '../../components/HubErrorState'
import HubLoadingState from '../../components/HubLoadingState'
import { HubDashboardMetricCards, HubFilterBar, HubFinancingDashboardTable } from '../../components/HubDashboardTable'
import { HubBreadcrumbs, HubPageTitle } from '../../components/HubPageShell'
import { useAsyncResource } from '../../hooks/useAsyncResource'
import { getFinancingOperations } from '../../services/paymentsHubService'
import { formatCurrency } from '../../utils/currency'

export default function DashboardFinancingsPage() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState('Último mes')
  const { data, loading, error, reload } = useAsyncResource(getFinancingOperations)

  if (loading) return <HubLoadingState message="Cargando dashboard de financiaciones..." />
  if (error || !data) return <HubErrorState message={error ?? 'No fue posible cargar los datos.'} onRetry={reload} />

  const paid = data.filter((op) => op.status === 'paid')
  const totalPaid = paid.reduce((sum, op) => sum + op.amount, 0)

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <HubBreadcrumbs backLabel="Volver al dashboard" onBack={() => navigate('/payments-hub/dashboard')} />
      <HubPageTitle title="Dashboard Financiaciones Pagadas" subtitle="Historial de pagos y contravalor en moneda local." />
      <HubFilterBar activePeriod={period} onChange={setPeriod} />
      <HubDashboardMetricCards
        metrics={[
          { label: 'Volumen Total USD', value: formatCurrency(totalPaid, 'USD') },
          { label: 'Número Financiaciones', value: String(data.length) },
          { label: 'Promedio Operación', value: paid.length ? formatCurrency(totalPaid / paid.length, 'USD') : '—' },
          { label: 'Tasa Promedio', value: '8.45%' },
        ]}
      />
      <HubFinancingDashboardTable operations={data} />
    </Box>
  )
}
