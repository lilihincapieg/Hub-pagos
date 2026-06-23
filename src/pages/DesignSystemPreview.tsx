import { useState } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import {
  Alert,
  Badge,
  Button,
  Checkbox,
  Dropdown,
  Input,
  Modal,
  Toast,
} from '../design-system'

const dropdownOptions = [
  { label: 'Transferencia bancaria', value: 'transfer' },
  { label: 'Tarjeta de crédito', value: 'card' },
  { label: 'PSE', value: 'pse' },
]

export default function DesignSystemPreview() {
  const [modalOpen, setModalOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [dropdownValue, setDropdownValue] = useState('')
  const [checked, setChecked] = useState(true)

  return (
    <Box sx={{ p: 4, maxWidth: 960, mx: 'auto' }}>
      <Typography variant="h3" sx={{ mb: 1, color: 'text.primary' }}>
        Finkargo Design System
      </Typography>
      <Typography variant="body2" sx={{ mb: 4, color: 'text.secondary' }}>
        Vista temporal de validación — no es el Hub de Pagos.
      </Typography>

      <Stack spacing={4} divider={<Divider flexItem />}>
        <Box>
          <Typography variant="h4" sx={{ mb: 2 }}>Button</Typography>
          <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: 'wrap' }}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="tertiary">Tertiary</Button>
            <Button variant="primary" loading>Loading</Button>
          </Stack>
        </Box>

        <Box>
          <Typography variant="h4" sx={{ mb: 2 }}>Input</Typography>
          <Input
            label="Referencia de pago"
            placeholder="Ej. Pago factura #1234"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            helperText="Campo controlado para validar tipografía y estados."
          />
        </Box>

        <Box>
          <Typography variant="h4" sx={{ mb: 2 }}>Badge</Typography>
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
            <Badge label="Success" variant="success" showIcon />
            <Badge label="Info" variant="info" />
            <Badge label="Warning" variant="warning" badgeStyle="dark" />
            <Badge label="Neutral" variant="neutral" />
          </Stack>
        </Box>

        <Box>
          <Typography variant="h4" sx={{ mb: 2 }}>Alert</Typography>
          <Stack spacing={2}>
            <Alert
              variant="info"
              title="Información"
              description="Este es un mensaje informativo del design system."
              actionLabel="Acción"
              onAction={() => undefined}
            />
            <Alert
              variant="success"
              alertStyle="border"
              title="Operación exitosa"
              description="El componente Alert renderiza correctamente."
            />
          </Stack>
        </Box>

        <Box>
          <Typography variant="h4" sx={{ mb: 2 }}>Checkbox</Typography>
          <Checkbox
            label="Acepto los términos del servicio"
            checked={checked}
            onChange={setChecked}
          />
        </Box>

        <Box>
          <Typography variant="h4" sx={{ mb: 2 }}>Dropdown</Typography>
          <Dropdown
            label="Método de pago"
            placeholder="Selecciona una opción"
            options={dropdownOptions}
            value={dropdownValue}
            onChange={(value) => setDropdownValue(value)}
          />
        </Box>

        <Box>
          <Typography variant="h4" sx={{ mb: 2 }}>Modal</Typography>
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            Abrir modal
          </Button>
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Confirmar pago"
            description="Revisa los datos antes de continuar con la operación."
            actions={[
              { label: 'Cancelar', variant: 'ghost', onClick: () => setModalOpen(false) },
              { label: 'Confirmar', variant: 'primary', onClick: () => setModalOpen(false) },
            ]}
          >
            <Typography variant="body2" sx={{ py: 2, color: 'text.secondary' }}>
              Monto: $1.250.000 COP · Referencia: {inputValue || 'Sin referencia'}
            </Typography>
          </Modal>
        </Box>

        <Box>
          <Typography variant="h4" sx={{ mb: 2 }}>Toast</Typography>
          <Stack spacing={2}>
            <Toast
              variant="success"
              title="Pago registrado"
              message="La transacción se procesó correctamente."
              onClose={() => undefined}
            />
            <Toast
              variant="warning"
              title="Atención"
              message="Verifica el monto antes de confirmar."
            />
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
