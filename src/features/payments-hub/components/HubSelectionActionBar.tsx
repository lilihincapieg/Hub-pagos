import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Popover, Stack, Typography } from '@mui/material'
import { Button, Chip } from '../../../design-system'
import type { CurrencyCode } from '../types'
import { formatCurrency } from '../utils/currency'
import { trackEvent } from '../utils/trackEvent'

const BAR_HEIGHT = 72

export default function HubSelectionActionBar({
  selectedCount,
  breakdown,
  onPrimary,
  onClear,
  validationError,
}: {
  selectedCount: number
  breakdown: { id: string; amount: number; currency: CurrencyCode }[]
  onPrimary: () => void
  onClear: () => void
  validationError?: string | null
}) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const tracked = useRef(false)

  const totalsByCurrency = useMemo(() => {
    const map = new Map<CurrencyCode, number>()
    breakdown.forEach((item) => {
      map.set(item.currency, (map.get(item.currency) ?? 0) + item.amount)
    })
    return Array.from(map.entries()).map(([currency, amount]) => ({ currency, amount }))
  }, [breakdown])

  const visible = selectedCount > 0

  useEffect(() => {
    if (visible && !tracked.current) {
      tracked.current = true
      trackEvent('payhub_view_selection_bar', { selectedCount })
    }
  }, [visible, selectedCount])

  if (!visible) return null

  const singleCurrency = totalsByCurrency.length === 1 ? totalsByCurrency[0] : null

  return (
    <>
      <Box sx={{ height: BAR_HEIGHT + (validationError ? 28 : 0) }} aria-hidden="true" />
      <Box
        component="aside"
        sx={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1200,
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'grey.200',
          boxShadow: '0 -8px 24px rgba(6, 7, 53, 0.08)',
          px: { xs: 2, md: 4 },
          py: 1.5,
        }}
      >
        {validationError && (
          <Typography variant="caption" color="error.main" sx={{ display: 'block', mb: 1 }}>
            {validationError}
          </Typography>
        )}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between' }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
              {selectedCount} factura{selectedCount === 1 ? '' : 's'} seleccionada
              {selectedCount === 1 ? '' : 's'}
            </Typography>

            {singleCurrency ? (
              <Box
                component="button"
                type="button"
                onClick={(event) => setAnchorEl(event.currentTarget)}
                sx={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  p: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <Typography variant="body2" color="primary.dark" sx={{ fontWeight: 700 }}>
                  Total {formatCurrency(singleCurrency.amount, singleCurrency.currency)}
                </Typography>
                <Typography variant="caption" color="secondary.main">
                  ▾
                </Typography>
              </Box>
            ) : (
              <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', gap: 0.75 }}>
                {totalsByCurrency.map((total) => (
                  <Chip
                    key={total.currency}
                    label={`${total.currency} ${formatCurrency(total.amount, total.currency)}`}
                  />
                ))}
                <Box
                  component="button"
                  type="button"
                  onClick={(event) => setAnchorEl(event.currentTarget)}
                  sx={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: 'secondary.main',
                    fontFamily: 'inherit',
                    typography: 'caption',
                    fontWeight: 600,
                  }}
                >
                  Ver desglose ▾
                </Box>
              </Stack>
            )}

            {selectedCount >= 2 && (
              <Typography variant="caption" color="text.secondary">
                Una sola tasa FX para las {selectedCount} facturas
              </Typography>
            )}
          </Stack>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Button variant="tertiary" onClick={onClear}>
              Limpiar selección
            </Button>
            <Button variant="primary" onClick={onPrimary}>
              Cotizar precio FX
            </Button>
          </Stack>
        </Stack>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Box sx={{ p: 2, minWidth: 240 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Desglose
            </Typography>
            {breakdown.map((item) => (
              <Stack
                key={item.id}
                direction="row"
                sx={{ justifyContent: 'space-between', py: 0.5, gap: 2 }}
              >
                <Typography variant="body2">{item.id}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCurrency(item.amount, item.currency)}
                </Typography>
              </Stack>
            ))}
          </Box>
        </Popover>
      </Box>
    </>
  )
}

export { BAR_HEIGHT as SELECTION_ACTION_BAR_HEIGHT }
