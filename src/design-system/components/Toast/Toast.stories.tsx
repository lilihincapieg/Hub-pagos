import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './Toast';

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
  parameters: { layout: 'centered', docs: { description: { component: 'Notificación toast con fondo coloreado por variante. Variantes: success, info, warning, error.' } } },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['success', 'info', 'warning', 'error'] },
    showBorder: { control: 'boolean' },
    showIcon: { control: 'boolean' },
    onClose: { action: 'closed' },
  },
  args: { title: 'Notificación', variant: 'success', showBorder: true, showIcon: true },
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Success: Story = {
  args: { variant: 'success', title: 'Guardado correctamente', message: 'Los datos fueron guardados.' },
};

export const Info: Story = {
  args: { variant: 'info', title: 'Nueva información disponible', message: 'Versión 2.0 disponible.' },
};

export const Warning: Story = {
  args: { variant: 'warning', title: 'Atención requerida', message: 'Verifica los datos antes de continuar.' },
};

export const Error: Story = {
  args: { variant: 'error', title: 'Error al procesar', message: 'Intenta de nuevo más tarde.' },
};

export const WithClose: Story = {
  args: {
    variant: 'success',
    title: 'Pago procesado',
    message: 'El pago de $1,200 USD fue procesado exitosamente.',
    onClose: () => {},
  },
};

export const NoBorder: Story = {
  args: {
    variant: 'info',
    title: 'Sin borde',
    message: 'Variante sin borde visible.',
    showBorder: false,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Toast variant="success" title="Operación exitosa" message="Los datos fueron guardados." onClose={() => {}} />
      <Toast variant="info" title="Nueva actualización" message="Versión 2.0 disponible." onClose={() => {}} />
      <Toast variant="warning" title="Advertencia" message="Verifica los datos antes de continuar." onClose={() => {}} />
      <Toast variant="error" title="Error inesperado" message="Intenta de nuevo más tarde." onClose={() => {}} />
    </div>
  ),
};
