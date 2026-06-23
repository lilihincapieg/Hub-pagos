import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  parameters: { layout: 'padded', docs: { description: { component: 'Inline alert banner con borde izquierdo de acento. Variantes: info, warning, error, success. Estilos: fill (fondo coloreado) y border (fondo blanco).' } } },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['info', 'warning', 'error', 'success'] },
    alertStyle: { control: 'select', options: ['fill', 'border'] },
    onAction: { action: 'action clicked' },
  },
  args: { variant: 'info', alertStyle: 'fill', title: 'Título del mensaje' },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = { args: { variant: 'info', title: 'Información disponible' } };
export const Warning: Story = { args: { variant: 'warning', title: 'Advertencia importante' } };
export const Error: Story = { args: { variant: 'error', title: 'Ha ocurrido un error' } };
export const Success: Story = { args: { variant: 'success', title: 'Operación exitosa' } };

export const WithDescription: Story = {
  args: {
    variant: 'info',
    title: 'Actualización disponible',
    description: 'Hay una nueva versión disponible. Actualiza para acceder a las últimas funcionalidades.',
  },
};

export const WithAction: Story = {
  args: {
    variant: 'warning',
    title: 'Sesión por expirar',
    description: 'Tu sesión expirará en 5 minutos.',
    actionLabel: 'Renovar sesión',
  },
};

export const BorderStyle: Story = {
  args: {
    variant: 'error',
    alertStyle: 'border',
    title: 'Error de validación',
    description: 'No se pudo procesar la solicitud. Verifica los datos ingresados.',
    actionLabel: 'Intentar de nuevo',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480 }}>
      <Alert variant="info" title="Información disponible" description="Hay una nueva versión disponible." actionLabel="Ver más" />
      <Alert variant="warning" title="Advertencia importante" description="Verifica los datos antes de continuar." actionLabel="Revisar" />
      <Alert variant="error" title="Ha ocurrido un error" description="No se pudo procesar la solicitud." actionLabel="Intentar de nuevo" />
      <Alert variant="success" title="Operación exitosa" description="Los datos fueron guardados correctamente." />
    </div>
  ),
};

export const BorderStyleVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480 }}>
      <Alert variant="info" alertStyle="border" title="Información disponible" description="Hay una nueva versión disponible." actionLabel="Ver más" />
      <Alert variant="warning" alertStyle="border" title="Advertencia importante" description="Verifica los datos antes de continuar." actionLabel="Revisar" />
      <Alert variant="error" alertStyle="border" title="Ha ocurrido un error" description="No se pudo procesar la solicitud." actionLabel="Intentar de nuevo" />
    </div>
  ),
};
