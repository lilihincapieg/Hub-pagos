import { useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Badge, Button, Input } from '../design-system'
import { trackEvent } from '../features/payments-hub/utils/trackEvent'
import { useEffect } from 'react'

type ImportStatus =
  | 'en_produccion'
  | 'puerto_origen'
  | 'en_transito'
  | 'puerto_destino'
  | 'camino_destino'
  | 'entregado'

interface ImportRow {
  id: string
  status: ImportStatus
  bl: string
  containers: number
  supplierRoute: string
  merchandiseValue: string
  eta: string
  docs: number
}

const statusMeta: Record<
  ImportStatus,
  { label: string; badge: 'success' | 'info' | 'warning' | 'neutral' }
> = {
  en_produccion: { label: 'En producción', badge: 'neutral' },
  puerto_origen: { label: 'Puerto de origen', badge: 'info' },
  en_transito: { label: 'En tránsito', badge: 'info' },
  puerto_destino: { label: 'Puerto de destino', badge: 'warning' },
  camino_destino: { label: 'En camino a destino final', badge: 'warning' },
  entregado: { label: 'Entregado', badge: 'success' },
}

// TODO: reemplazar por integración real — listado IMC / tracking
const mockImports: ImportRow[] = [
  {
    id: 'IMP-39',
    status: 'entregado',
    bl: 'QGD1706632',
    containers: 1,
    supplierRoute: 'QINGDAO, CHINA → MANZANILLO',
    merchandiseValue: '—',
    eta: '19/04/2025',
    docs: 2,
  },
  {
    id: 'IMP-34',
    status: 'entregado',
    bl: 'QGD1706610',
    containers: 1,
    supplierRoute: 'QINGDAO, CHINA → MANZANILLO',
    merchandiseValue: '—',
    eta: '12/04/2025',
    docs: 2,
  },
  {
    id: 'IMP-31',
    status: 'entregado',
    bl: 'SHA8821001',
    containers: 2,
    supplierRoute: 'SHANGHAI, CHINA → BUENAVENTURA',
    merchandiseValue: '—',
    eta: '03/04/2025',
    docs: 3,
  },
  {
    id: 'IMP-28',
    status: 'entregado',
    bl: 'ROT550221',
    containers: 1,
    supplierRoute: 'ROTTERDAM, NL → CARTAGENA',
    merchandiseValue: '—',
    eta: '28/03/2025',
    docs: 1,
  },
]

const statusFilters: { id: ImportStatus | 'all'; label: string }[] = [
  { id: 'en_produccion', label: 'En producción' },
  { id: 'puerto_origen', label: 'Puerto de origen' },
  { id: 'en_transito', label: 'En tránsito' },
  { id: 'puerto_destino', label: 'Puerto de destino' },
  { id: 'camino_destino', label: 'En camino a destino final' },
  { id: 'entregado', label: 'Entregado' },
]

function MetricCard({
  title,
  value,
  subtitle,
}: {
  title: string
  value: string
  subtitle: string
}) {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: 1,
        borderColor: 'grey.200',
        p: 2,
        minHeight: 100,
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="h3" color="primary.dark" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {subtitle}
      </Typography>
    </Box>
  )
}

/**
 * Pantalla Importación como Centro — Centro de control logístico.
 * Destino del CTA "Agregar facturas" desde Hub de Pagos.
 */
export default function ImportacionComoCentroPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ImportStatus | 'all'>('entregado')

  useEffect(() => {
    trackEvent('payhub_redirect_imc', { route: '/importacion-como-centro' })
  }, [])

  const counts = useMemo(() => {
    const base: Record<ImportStatus, number> = {
      en_produccion: 0,
      puerto_origen: 0,
      en_transito: 0,
      puerto_destino: 0,
      camino_destino: 0,
      entregado: 0,
    }
    mockImports.forEach((row) => {
      base[row.status] += 1
    })
    return base
  }, [])

  const filtered = useMemo(() => {
    return mockImports.filter((row) => {
      const matchesStatus = statusFilter === 'all' ? true : row.status === statusFilter
      const q = query.trim().toLowerCase()
      const matchesQuery =
        !q ||
        row.id.toLowerCase().includes(q) ||
        row.bl.toLowerCase().includes(q) ||
        row.supplierRoute.toLowerCase().includes(q)
      return matchesStatus && matchesQuery
    })
  }, [query, statusFilter])

  return (
    <Box sx={{ maxWidth: 1280, mx: 'auto', pb: 6 }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h3" color="primary.dark" sx={{ fontWeight: 700 }}>
          Centro de control logístico
        </Typography>
        <Button variant="tertiary" onClick={() => navigate('/payments-hub/invoices')}>
          ← Volver a facturas
        </Button>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1.2fr 0.8fr' },
          gap: 2,
          mb: 4,
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 1.5,
          }}
        >
          <MetricCard title="Importaciones activas" value="17" subtitle="Total de importaciones en curso" />
          <MetricCard title="Próximos arribos" value="0" subtitle="En los próximos 8 días" />
          <MetricCard title="Cambios en ETA" value="2" subtitle="Importaciones con cambios recientes" />
          <MetricCard title="Importaciones en puerto" value="0" subtitle="Importaciones en puerto de destino" />
        </Box>

        <Box
          sx={{
            borderRadius: 3,
            bgcolor: 'primary.dark',
            color: 'common.white',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: 2,
            minHeight: 180,
            backgroundImage:
              'radial-gradient(circle at 20% 30%, rgba(120,247,255,0.12), transparent 40%), radial-gradient(circle at 80% 70%, rgba(60,71,211,0.35), transparent 45%)',
          }}
        >
          <Box sx={{ color: 'quaternary.main' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M3 16h13l3-5h2v7H3v-2zM4 11h8M6 8h6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="7" cy="18.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="15" cy="18.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </Box>
          <Typography variant="body1" sx={{ maxWidth: 320, color: 'common.white' }}>
            Sube tus importaciones y accede al rastreo paso a paso de tus cargas
          </Typography>
          <Button variant="primary">+ Crear importación</Button>
        </Box>
      </Box>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, mb: 2, gap: 2 }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography variant="h4" color="primary.dark" sx={{ fontWeight: 700 }}>
            Tus importaciones
          </Typography>
          <Badge label={String(mockImports.length)} variant="info" size="small" />
        </Stack>
        <Stack direction="row" spacing={1.5}>
          <Button variant="secondary">Descargar</Button>
          <Button variant="primary">+ Agregar importación</Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 1.5,
          mb: 2,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Input
            placeholder="Busca por importación, BL, Proveedor, referencia..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Buscar importaciones"
          />
        </Box>
        <Button variant="secondary">Filtros</Button>
      </Box>

      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
        {statusFilters.map((filter) => {
          const count = counts[filter.id as ImportStatus] ?? 0
          const active = statusFilter === filter.id
          return (
            <Box
              key={filter.id}
              component="button"
              type="button"
              onClick={() => setStatusFilter(filter.id)}
              sx={{
                border: 1,
                borderColor: active ? 'secondary.main' : 'grey.200',
                bgcolor: active ? 'primary.50' : 'background.paper',
                borderRadius: 999,
                px: 1.5,
                py: 0.75,
                cursor: 'pointer',
                fontFamily: 'inherit',
                typography: 'caption',
                color: 'text.primary',
                fontWeight: active ? 700 : 500,
              }}
            >
              {filter.label} ({count})
            </Box>
          )
        })}
      </Stack>

      <Box
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: 1,
          borderColor: 'grey.200',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ overflowX: 'auto' }}>
          <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', minWidth: 960 }}>
            <Box component="thead">
              <Box component="tr" sx={{ bgcolor: 'grey.100' }}>
                {['Importación', 'Estado', 'BL', 'Proveedor', 'Valor mercancía', 'ETA', 'Docs', 'Acciones'].map(
                  (header) => (
                    <Box
                      component="th"
                      key={header}
                      sx={{
                        px: 1.5,
                        py: 1.25,
                        textAlign: 'left',
                        typography: 'caption',
                        color: 'text.secondary',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      }}
                    >
                      {header}
                    </Box>
                  ),
                )}
              </Box>
            </Box>
            <Box component="tbody">
              {filtered.map((row) => (
                <Box component="tr" key={row.id} sx={{ borderTop: 1, borderColor: 'grey.200' }}>
                  <Box component="td" sx={{ px: 1.5, py: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {row.id}
                    </Typography>
                  </Box>
                  <Box component="td" sx={{ px: 1.5, py: 1.5 }}>
                    <Badge
                      label={statusMeta[row.status].label}
                      variant={statusMeta[row.status].badge}
                      size="small"
                    />
                  </Box>
                  <Box component="td" sx={{ px: 1.5, py: 1.5 }}>
                    <Typography variant="body2">{row.bl}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {row.containers} contenedor{row.containers === 1 ? '' : 'es'}
                    </Typography>
                  </Box>
                  <Box component="td" sx={{ px: 1.5, py: 1.5 }}>
                    <Typography variant="body2">{row.supplierRoute}</Typography>
                  </Box>
                  <Box component="td" sx={{ px: 1.5, py: 1.5 }}>
                    <Typography variant="body2">{row.merchandiseValue}</Typography>
                  </Box>
                  <Box component="td" sx={{ px: 1.5, py: 1.5 }}>
                    <Typography variant="body2">{row.eta}</Typography>
                  </Box>
                  <Box component="td" sx={{ px: 1.5, py: 1.5 }}>
                    <Typography variant="body2">{row.docs} docs</Typography>
                  </Box>
                  <Box component="td" sx={{ px: 1.5, py: 1.5 }}>
                    <Typography variant="caption" color="secondary.main" sx={{ cursor: 'pointer' }}>
                      Ver →
                    </Typography>
                  </Box>
                </Box>
              ))}
              {filtered.length === 0 && (
                <Box component="tr">
                  <Box component="td" colSpan={8} sx={{ px: 2, py: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      No hay importaciones para este filtro.
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
