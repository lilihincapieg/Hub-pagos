import { Box, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Badge } from '../../../../design-system'
import HubErrorState from '../../components/HubErrorState'
import HubLoadingState from '../../components/HubLoadingState'
import { HubBreadcrumbs, HubPageTitle, HubPanel } from '../../components/HubPageShell'
import { useAsyncResource } from '../../hooks/useAsyncResource'
import { getImportReconciliations } from '../../services/paymentsHubService'
import type { ImportReconciliationParty, PaymentStatus } from '../../types'
import { formatCurrency } from '../../utils/currency'
import { paymentStatusLabels } from '../../utils/status'

function PartyList({
  title,
  parties,
  emptyLabel,
}: {
  title: string
  parties: ImportReconciliationParty[]
  emptyLabel: string
}) {
  return (
    <Box sx={{ flex: 1 }}>
      <Typography variant="h4" color="primary.dark" sx={{ mb: 1.5 }}>
        {title}
      </Typography>
      {parties.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {emptyLabel}
        </Typography>
      ) : (
        <Stack spacing={1}>
          {parties.map((party) => (
            <Box
              key={`${party.reference}-${party.name}`}
              sx={{
                p: 1.5,
                borderRadius: 2,
                border: 1,
                borderColor: 'grey.200',
                bgcolor: 'background.paper',
              }}
            >
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {party.name}
                </Typography>
                <StatusBadge status={party.status} />
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                {party.role} · {party.reference}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5 }}>
                {formatCurrency(party.amount, party.currency)}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  )
}

function StatusBadge({ status }: { status: PaymentStatus }) {
  const variant =
    status === 'paid' ? 'success' : status === 'overdue' ? 'error' : status === 'in_progress' ? 'info' : 'warning'
  return <Badge label={paymentStatusLabels[status]} variant={variant} size="small" />
}

export default function DashboardReconciliationPage() {
  const navigate = useNavigate()
  const { data, loading, error, reload } = useAsyncResource(getImportReconciliations)

  if (loading) return <HubLoadingState message="Cargando reconciliación por importación..." />
  if (error || !data) {
    return <HubErrorState message={error ?? 'No fue posible cargar la reconciliación.'} onRetry={reload} />
  }

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
      <HubBreadcrumbs backLabel="Volver al dashboard" onBack={() => navigate('/payments-hub/dashboard')} />
      <HubPageTitle
        title="Reconciliación por importación"
        subtitle="A quién le has pagado frente a quién falta por pagar, agrupado por operación de importación."
      />

      <Stack spacing={3}>
        {data.map((group) => (
          <HubPanel key={group.importOperationId} sx={{ p: 2.5 }}>
            <Typography variant="caption" color="text.secondary">
              {group.importOperationId}
            </Typography>
            <Typography variant="h4" color="primary.dark" sx={{ mb: 2 }}>
              {group.label}
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 3,
              }}
            >
              <PartyList title="Pagado" parties={group.paid} emptyLabel="Sin pagos registrados aún." />
              <PartyList
                title="Pendiente por pagar"
                parties={group.pending}
                emptyLabel="No hay saldos pendientes en esta importación."
              />
            </Box>
          </HubPanel>
        ))}
      </Stack>
    </Box>
  )
}
