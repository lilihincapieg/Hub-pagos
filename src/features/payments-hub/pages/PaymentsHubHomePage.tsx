import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import HubActionCard from '../components/HubActionCard'
import HubLoadingState from '../components/HubLoadingState'
import HubErrorState from '../components/HubErrorState'
import { HubPageTitle } from '../components/HubPageShell'
import { useAsyncResource } from '../hooks/useAsyncResource'
import { getHubHomeMetrics } from '../services/paymentsHubService'
import { formatCurrency } from '../utils/currency'

const icons = {
  financing: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3c-2 0-3.5 1.5-3.5 3.5S10 10 12 10s3.5-1.5 3.5-3.5S14 3 12 3z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 14c0-2 1.8-3.5 4-3.5s4 1.5 4 3.5M6 21h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 10v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  invoice: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 4h8l2 2v14H6V4h2zM9 10h6M9 14h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  dashboard: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 19V9M12 19V5M19 19v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
}

export default function PaymentsHubHomePage() {
  const navigate = useNavigate()
  const { data, loading, error, reload } = useAsyncResource(getHubHomeMetrics)

  if (loading) return <HubLoadingState message="Cargando Hub de Pagos..." />
  if (error || !data) return <HubErrorState message={error ?? 'No fue posible cargar el hub.'} onRetry={reload} />

  return (
    <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
      <HubPageTitle
        centered
        title="Hub de Pagos"
        subtitle="Seleccione la opción de pago que desea realizar"
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 2,
        }}
      >
        <HubActionCard
          accent="navy"
          icon={icons.financing}
          title="Pagar Financiaciones"
          description="Realice el pago de sus financiaciones activas en dólares americanos. Consulte saldos, plazos y realice abonos parciales o totales."
          stats={[
            { label: 'Financiaciones activas', value: String(data.pendingFinancings) },
            { label: 'Próximo vencimiento', value: data.nextFinancingDueDate },
          ]}
          ctaLabel="Ir a Pagar"
          onClick={() => navigate('/payments-hub/financings')}
        />
        <HubActionCard
          accent="blue"
          icon={icons.invoice}
          title="Pagar Facturas Propias"
          description="Gestione y pague sus facturas pendientes de manera rápida y segura. Realice pagos parciales o totales. Visualice el detalle de cada factura antes de confirmar el pago."
          stats={[
            { label: 'Facturas pendientes', value: String(data.pendingInvoices) },
            {
              label: 'Total por pagar',
              value: formatCurrency(data.totalInvoicesAmount, data.totalInvoicesCurrency),
            },
          ]}
          ctaLabel="Ir a Pagar"
          onClick={() => navigate('/payments-hub/invoices')}
        />
        <HubActionCard
          accent="orange"
          icon={icons.dashboard}
          title="Dashboard de Operaciones"
          description="Visualice el historial completo de sus pagos realizados, consulte el estado de sus operaciones activas y revise las condiciones de sus financiaciones."
          stats={[
            { label: 'Operaciones totales', value: String(data.totalOperations) },
            { label: 'Último pago', value: data.lastPaymentDate },
          ]}
          ctaLabel="Ver Dashboard"
          onClick={() => navigate('/payments-hub/dashboard')}
        />
      </Box>
    </Box>
  )
}
