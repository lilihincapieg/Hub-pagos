import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../../design-system'
import HubEmptyState from '../../components/HubEmptyState'
import HubErrorState from '../../components/HubErrorState'
import HubInvoiceTable from '../../components/HubInvoiceTable'
import HubLoadingState from '../../components/HubLoadingState'
import HubPaymentAgenda, { HubImcInviteBand } from '../../components/HubPaymentAgenda'
import HubSelectionActionBar from '../../components/HubSelectionActionBar'
import { HubBreadcrumbs, HubPageTitle } from '../../components/HubPageShell'
import { useAsyncResource } from '../../hooks/useAsyncResource'
import { getPendingInvoices } from '../../services/paymentsHubService'
import type { CurrencyCode, Invoice, PaymentRail } from '../../types'
import { setFlowSession } from '../../utils/flowSession'
import { trackEvent } from '../../utils/trackEvent'

export default function InvoicesListPage() {
  const navigate = useNavigate()
  const { data, loading, error, reload } = useAsyncResource(getPendingInvoices)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [validationError, setValidationError] = useState<string | null>(null)

  const invoices = data ?? []
  const selectedItems = invoices.filter((item) => selectedIds.includes(item.id))
  const payableItems = selectedItems.filter((item) => !item.requiresAmountEntry)

  const breakdown = payableItems.map((item) => ({
    id: item.number,
    amount:
      item.financingId && item.remainingBalance != null ? item.remainingBalance : item.amount,
    currency: item.currency as CurrencyCode,
  }))

  const startPayment = (
    invoice: Invoice,
    options?: { rail?: PaymentRail; amountOverride?: number },
  ) => {
    setFlowSession({
      invoiceIds: [invoice.id],
      financingIds: undefined,
      fxQuote: undefined,
      checkout: undefined,
      confirmation: undefined,
      paymentRail: options?.rail ?? 'local',
      payAmountOverride: options?.amountOverride,
    })
    navigate('/payments-hub/invoices/fx-quote')
  }

  const handleToggle = (id: string, checked: boolean) => {
    setValidationError(null)
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((itemId) => itemId !== id)))
  }

  const handleContinue = () => {
    if (payableItems.length === 0) {
      setValidationError('Selecciona al menos una factura con monto confirmado.')
      return
    }
    const currencies = new Set(payableItems.map((item) => item.currency))
    if (currencies.size > 1) {
      setValidationError('Selecciona facturas en una sola moneda para cotizar una tasa FX.')
      return
    }

    const override =
      payableItems.length === 1 &&
      payableItems[0]!.financingId &&
      payableItems[0]!.remainingBalance != null
        ? payableItems[0]!.remainingBalance
        : undefined

    setValidationError(null)
    setFlowSession({
      invoiceIds: payableItems.map((item) => item.id),
      financingIds: undefined,
      fxQuote: undefined,
      checkout: undefined,
      confirmation: undefined,
      paymentRail: 'local',
      payAmountOverride: override,
    })
    navigate('/payments-hub/invoices/fx-quote')
  }

  const handleCalendarCta = () => {
    trackEvent('payhub_redirect_imc', { from: 'imc_band' })
    navigate('/importacion-como-centro')
  }

  if (loading) return <HubLoadingState message="Cargando facturas..." />
  if (error) return <HubErrorState message={error} onRetry={reload} />
  if (!invoices.length) {
    return (
      <HubEmptyState
        title="Sin facturas pendientes"
        description="No hay facturas propias por pagar."
      />
    )
  }

  return (
    <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
      <HubBreadcrumbs
        backLabel="Volver al Hub"
        onBack={() => navigate('/payments-hub')}
        onHome={() => navigate('/payments-hub')}
      />

      <HubPageTitle
        title="Selección de Facturas"
        subtitle="Atiende pagos urgentes arriba. Selecciona facturas en la tabla para cotizarlas juntas."
      />

      <Box
        sx={{
          mb: 3,
          p: 2.5,
          borderRadius: 2,
          border: 1,
          borderColor: 'primary.ultraLight',
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" color="primary.dark" sx={{ fontWeight: 700, mb: 0.5 }}>
            ¿Quieres pagar una factura nueva?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cotiza valor, moneda, fecha de giro y región. Si apruebas la tasa, cargas la factura y
            recibes la confirmación del giro.
          </Typography>
        </Box>
        <Button
          variant="secondary"
          onClick={() => {
            trackEvent('payhub_start_direct_quote', { source: 'invoices_cta' })
            navigate('/payments-hub/invoices/nueva-cotizacion')
          }}
        >
          Cotizar y pagar factura
        </Button>
      </Box>

      <HubPaymentAgenda
        invoices={invoices}
        onPayBalance={(invoice) =>
          startPayment(invoice, {
            rail: 'local',
            amountOverride: invoice.remainingBalance,
          })
        }
        onPayCustoms={(invoice, rail) => {
          const customs = invoice.customsPayment
          if (!customs) return
          startPayment(invoice, {
            rail,
            amountOverride: customs.amount,
          })
        }}
      />

      <HubImcInviteBand onClick={handleCalendarCta} />

      <HubInvoiceTable items={invoices} selectedIds={selectedIds} onToggle={handleToggle} />

      <HubSelectionActionBar
        selectedCount={payableItems.length}
        breakdown={breakdown}
        onPrimary={handleContinue}
        onClear={() => {
          setSelectedIds([])
          setValidationError(null)
        }}
        validationError={validationError}
      />
    </Box>
  )
}
