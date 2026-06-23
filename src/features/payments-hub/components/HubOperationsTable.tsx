import { Box, Typography } from '@mui/material'
import type { PaymentOperation } from '../types'
import { formatCurrency } from '../utils/currency'
import { paymentMethodLabels } from '../utils/status'
import HubStatusBadge from './HubStatusBadge'

export default function HubOperationsTable({
  operations,
}: {
  operations: PaymentOperation[]
}) {
  if (operations.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No hay operaciones para mostrar.
      </Typography>
    )
  }

  return (
    <Box
      sx={{
        overflowX: 'auto',
        borderRadius: 2,
        border: 1,
        borderColor: 'grey.200',
        bgcolor: 'background.paper',
      }}
    >
      <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
        <Box component="thead" sx={{ bgcolor: 'grey.100' }}>
          <Box component="tr">
            {['Referencia', 'Contraparte', 'Monto', 'Estado', 'Fecha', 'Método'].map((header) => (
              <Box
                component="th"
                key={header}
                sx={{
                  textAlign: 'left',
                  px: 2,
                  py: 1.5,
                  typography: 'caption',
                  color: 'text.secondary',
                  fontWeight: 600,
                }}
              >
                {header}
              </Box>
            ))}
          </Box>
        </Box>
        <Box component="tbody">
          {operations.map((operation) => (
            <Box
              component="tr"
              key={operation.id}
              sx={{ borderTop: 1, borderColor: 'grey.200' }}
            >
              <Box component="td" sx={{ px: 2, py: 1.5 }}>
                <Typography variant="body2">{operation.reference}</Typography>
              </Box>
              <Box component="td" sx={{ px: 2, py: 1.5 }}>
                <Typography variant="body2">{operation.counterparty}</Typography>
              </Box>
              <Box component="td" sx={{ px: 2, py: 1.5 }}>
                <Typography variant="body2">
                  {formatCurrency(operation.amount, operation.currency)}
                </Typography>
              </Box>
              <Box component="td" sx={{ px: 2, py: 1.5 }}>
                <HubStatusBadge status={operation.status} />
              </Box>
              <Box component="td" sx={{ px: 2, py: 1.5 }}>
                <Typography variant="body2">{operation.paymentDate}</Typography>
              </Box>
              <Box component="td" sx={{ px: 2, py: 1.5 }}>
                <Typography variant="body2">
                  {paymentMethodLabels[operation.method]}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
