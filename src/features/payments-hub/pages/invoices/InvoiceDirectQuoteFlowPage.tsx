import { useEffect, useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Alert, Badge, Button, Dropdown, Input, Upload } from '../../../../design-system'
import type { UploadFile } from '../../../../design-system'
import HubLoadingState from '../../components/HubLoadingState'
import { HubBreadcrumbs, HubKeyValueRow, HubPageTitle, HubPanel } from '../../components/HubPageShell'
import {
  confirmDirectInvoiceTransfer,
  createDirectInvoiceQuote,
} from '../../services/paymentsHubService'
import type {
  CurrencyCode,
  DirectInvoiceQuote,
  DirectInvoiceQuoteRequest,
  DirectInvoiceTransferConfirmation,
  GiroDateOption,
  QuoteRegion,
} from '../../types'
import { formatCurrency } from '../../utils/currency'
import {
  clearDirectQuoteSession,
  getDirectQuoteSession,
  setDirectQuoteSession,
} from '../../utils/flowSession'
import { trackEvent } from '../../utils/trackEvent'

type Step = 'form' | 'review' | 'upload' | 'confirmation'

const currencyOptions = [
  { label: 'USD — Dólar estadounidense', value: 'USD' },
  { label: 'EUR — Euro', value: 'EUR' },
  { label: 'GBP — Libra esterlina', value: 'GBP' },
  { label: 'JPY — Yen japonés', value: 'JPY' },
  { label: 'MXN — Peso mexicano', value: 'MXN' },
]

const giroOptions = [
  { label: 'Hoy', value: 'today' },
  { label: 'Mañana', value: 'tomorrow' },
  { label: 'Indicativa', value: 'indicative' },
]

const regionOptions = [
  { label: 'Asia', value: 'asia' },
  { label: 'América del Norte', value: 'north_america' },
  { label: 'Europa', value: 'europe' },
]

const stepLabels: { id: Step; label: string }[] = [
  { id: 'form', label: '1. Cotizar' },
  { id: 'review', label: '2. Aprobar tasa' },
  { id: 'upload', label: '3. Cargar factura' },
  { id: 'confirmation', label: '4. Confirmación' },
]

function Stepper({ current }: { current: Step }) {
  const currentIndex = stepLabels.findIndex((step) => step.id === current)
  return (
    <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
      {stepLabels.map((step, index) => {
        const active = index === currentIndex
        const done = index < currentIndex
        return (
          <Box
            key={step.id}
            sx={{
              px: 1.5,
              py: 0.75,
              borderRadius: 999,
              bgcolor: active ? 'primary.50' : done ? 'success.ultraLight' : 'grey.100',
              border: 1,
              borderColor: active ? 'secondary.main' : done ? 'success.light' : 'grey.200',
            }}
          >
            <Typography
              variant="caption"
              color={active ? 'primary.dark' : done ? 'success.dark' : 'text.secondary'}
              sx={{ fontWeight: active ? 700 : 500 }}
            >
              {step.label}
            </Typography>
          </Box>
        )
      })}
    </Stack>
  )
}

export default function InvoiceDirectQuoteFlowPage() {
  const navigate = useNavigate()
  const saved = getDirectQuoteSession()

  const [step, setStep] = useState<Step>(saved.step ?? 'form')
  const [amount, setAmount] = useState(saved.request?.amount ? String(saved.request.amount) : '')
  const [currency, setCurrency] = useState<CurrencyCode>(saved.request?.currency ?? 'USD')
  const [giroDate, setGiroDate] = useState<GiroDateOption>(saved.request?.giroDate ?? 'today')
  const [region, setRegion] = useState<QuoteRegion>(saved.request?.region ?? 'north_america')
  const [quote, setQuote] = useState<DirectInvoiceQuote | null>(saved.quote ?? null)
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>(
    saved.upload
      ? [
          {
            id: 'uploaded-1',
            name: saved.upload.fileName,
            size: saved.upload.fileSize,
            status: 'success',
          },
        ]
      : [],
  )
  const [confirmation, setConfirmation] = useState<DirectInvoiceTransferConfirmation | null>(
    saved.confirmation ?? null,
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [secondsRemaining, setSecondsRemaining] = useState(55)

  useEffect(() => {
    trackEvent('payhub_start_direct_quote', { source: 'invoices_propias' })
  }, [])

  useEffect(() => {
    if (step !== 'review' || !quote) return
    const timer = window.setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [step, quote])

  const hasUpload = useMemo(
    () => uploadFiles.some((file) => file.status === 'success' || file.status === 'idle'),
    [uploadFiles],
  )

  const goBackToList = () => navigate('/payments-hub/invoices')

  const handleRequestQuote = async () => {
    setError(null)
    const parsed = Number(amount.replace(/,/g, ''))
    if (!parsed || parsed <= 0) {
      setError('Indica el valor a cotizar.')
      return
    }

    setLoading(true)
    try {
      const request: DirectInvoiceQuoteRequest = {
        amount: parsed,
        currency,
        giroDate,
        region,
      }
      trackEvent('payhub_submit_direct_quote_request', {
        amount: parsed,
        currency,
        giroDate,
        region,
      })
      const result = await createDirectInvoiceQuote(request)
      setQuote(result)
      setSecondsRemaining(55)
      setDirectQuoteSession({ request, quote: result, step: 'review' })
      setStep('review')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No fue posible cotizar.')
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptQuote = () => {
    if (!quote) return
    if (secondsRemaining <= 0) {
      setError('La cotización expiró. Solicita una nueva tasa.')
      return
    }
    trackEvent('payhub_accept_direct_quote', { quoteId: quote.id, rate: quote.rate })
    setDirectQuoteSession({ quote, step: 'upload' })
    setError(null)
    setStep('upload')
  }

  const handleFilesChange = (files: File[]) => {
    const next: UploadFile[] = files.map((file, index) => ({
      id: `file-${index}-${file.name}`,
      name: file.name,
      size: file.size,
      status: 'success',
    }))
    setUploadFiles(next)
    if (next[0]) {
      trackEvent('payhub_upload_direct_invoice', {
        fileName: next[0].name,
        fileSize: next[0].size,
      })
      setDirectQuoteSession({
        upload: {
          fileName: next[0].name,
          fileSize: next[0].size,
          uploadedAt: new Date().toISOString(),
        },
        step: 'upload',
      })
    }
  }

  const handleConfirmTransfer = async () => {
    if (!quote || !uploadFiles[0]) {
      setError('Carga la factura para continuar.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const upload = {
        fileName: uploadFiles[0].name,
        fileSize: uploadFiles[0].size,
        uploadedAt: new Date().toISOString(),
      }
      const result = await confirmDirectInvoiceTransfer({ quote, upload })
      trackEvent('payhub_confirm_direct_transfer', {
        transferId: result.transferId,
        status: result.status,
      })
      setConfirmation(result)
      setDirectQuoteSession({ upload, confirmation: result, step: 'confirmation' })
      setStep('confirmation')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No fue posible confirmar el giro.')
    } finally {
      setLoading(false)
    }
  }

  if (loading && step === 'form') {
    return <HubLoadingState message="Cotizando tasa FX..." />
  }
  if (loading && step === 'upload') {
    return <HubLoadingState message="Confirmando giro..." />
  }

  return (
    <Box sx={{ maxWidth: 760, mx: 'auto' }}>
      <HubBreadcrumbs
        backLabel="Volver a facturas"
        onBack={goBackToList}
        onHome={() => navigate('/payments-hub')}
      />
      <HubPageTitle
        title="Pagar una factura propia"
        subtitle="Primero cotiza el valor. Si apruebas la tasa, cargas la factura y recibes la confirmación del giro."
      />
      <Stepper current={step} />

      {error && (
        <Box sx={{ mb: 2 }}>
          <Alert variant="error" title="Revisa el paso" description={error} />
        </Box>
      )}

      {step === 'form' && (
        <HubPanel sx={{ p: 3 }}>
          <Typography variant="h4" color="primary.dark" sx={{ mb: 2 }}>
            Datos para cotizar
          </Typography>
          <Stack spacing={2}>
            <Input
              label="Valor a cotizar"
              type="number"
              placeholder="Ej. 12500"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              required
            />
            <Dropdown
              label="Moneda"
              options={currencyOptions}
              value={currency}
              onChange={(value) => setCurrency(value as CurrencyCode)}
            />
            <Dropdown
              label="Fecha de giro"
              options={giroOptions}
              value={giroDate}
              onChange={(value) => setGiroDate(value as GiroDateOption)}
              helperText="Hoy, mañana o una fecha indicativa para programar el giro."
            />
            <Dropdown
              label="País / región del proveedor"
              options={regionOptions}
              value={region}
              onChange={(value) => setRegion(value as QuoteRegion)}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ pt: 1 }}>
              <Button variant="primary" onClick={handleRequestQuote}>
                Cotizar tasa
              </Button>
              <Button variant="tertiary" onClick={goBackToList}>
                Cancelar
              </Button>
            </Stack>
          </Stack>
        </HubPanel>
      )}

      {step === 'review' && quote && (
        <HubPanel sx={{ p: 3 }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" color="primary.dark">
              Cotización FX
            </Typography>
            <Badge
              label={secondsRemaining > 0 ? `Expira en ${secondsRemaining}s` : 'Expirada'}
              variant={secondsRemaining > 0 ? 'warning' : 'error'}
              size="small"
            />
          </Stack>
          <HubKeyValueRow label="Valor cotizado" value={formatCurrency(quote.sourceAmount, quote.sourceCurrency)} highlight />
          <HubKeyValueRow label="Moneda local estimada" value={formatCurrency(quote.targetAmount, quote.targetCurrency)} />
          <HubKeyValueRow
            label="Tasa FX"
            value={`1 ${quote.sourceCurrency} = ${quote.rate.toLocaleString('es-CO')} ${quote.targetCurrency}`}
          />
          <HubKeyValueRow label="Spread" value={`${quote.spreadPercent}%`} />
          <HubKeyValueRow label="Región" value={quote.regionLabel} />
          <HubKeyValueRow label="Fecha de giro" value={`${quote.giroDateLabel} · ${quote.estimatedGiroDate}`} />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3 }}>
            <Button variant="primary" onClick={handleAcceptQuote} disabled={secondsRemaining <= 0}>
              Aprobar tasa y continuar
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setStep('form')
                setDirectQuoteSession({ step: 'form' })
              }}
            >
              Nueva cotización
            </Button>
          </Stack>
        </HubPanel>
      )}

      {step === 'upload' && quote && (
        <HubPanel sx={{ p: 3 }}>
          <Typography variant="h4" color="primary.dark" sx={{ mb: 1 }}>
            Cargar factura
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Tasa aprobada: 1 {quote.sourceCurrency} = {quote.rate.toLocaleString('es-CO')}{' '}
            {quote.targetCurrency}. Sube el PDF o imagen de la factura para emitir el giro.
          </Typography>
          <Upload
            accept=".pdf,.png,.jpg,.jpeg"
            multiple={false}
            files={uploadFiles}
            onFilesChange={handleFilesChange}
            onRemoveFile={() => {
              setUploadFiles([])
              setDirectQuoteSession({ upload: undefined, step: 'upload' })
            }}
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3 }}>
            <Button variant="primary" onClick={handleConfirmTransfer} disabled={!hasUpload}>
              Confirmar giro
            </Button>
            <Button variant="tertiary" onClick={() => setStep('review')}>
              Volver a la tasa
            </Button>
          </Stack>
        </HubPanel>
      )}

      {step === 'confirmation' && confirmation && (
        <HubPanel sx={{ p: 3 }}>
          <Stack sx={{ alignItems: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                bgcolor: 'success.ultraLight',
                color: 'success.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                mb: 1,
              }}
            >
              ✓
            </Box>
            <Typography variant="h3" color="primary.dark" sx={{ textAlign: 'center' }}>
              Confirmación de giro
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Badge label={confirmation.statusLabel} variant="info" size="small" />
            </Box>
          </Stack>

          <HubKeyValueRow label="ID de transferencia" value={confirmation.transferId} highlight />
          <HubKeyValueRow label="Referencia" value={confirmation.reference} />
          <HubKeyValueRow label="Estado" value={confirmation.statusLabel} />
          <HubKeyValueRow
            label="Monto"
            value={formatCurrency(confirmation.amount, confirmation.currency)}
          />
          <HubKeyValueRow
            label="Equivalente local"
            value={formatCurrency(confirmation.localAmount, confirmation.localCurrency)}
          />
          <HubKeyValueRow
            label="Tasa aplicada"
            value={`1 ${confirmation.currency} = ${confirmation.rate.toLocaleString('es-CO')} ${confirmation.localCurrency}`}
          />
          <HubKeyValueRow label="Fecha de giro" value={confirmation.giroDate} />
          <HubKeyValueRow label="Región" value={confirmation.regionLabel} />
          <HubKeyValueRow label="Factura cargada" value={confirmation.invoiceFileName} />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3, justifyContent: 'center' }}>
            <Button
              variant="primary"
              onClick={() => {
                clearDirectQuoteSession()
                navigate('/payments-hub')
              }}
            >
              Volver al Hub
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                clearDirectQuoteSession()
                navigate('/payments-hub/invoices')
              }}
            >
              Ir a facturas
            </Button>
          </Stack>
        </HubPanel>
      )}
    </Box>
  )
}
