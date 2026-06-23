import type { Meta, StoryObj } from '@storybook/react';
import { Banner } from './Banner';

const meta: Meta<typeof Banner> = {
  title: 'Components/Banner',
  component: Banner,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Banner de notificación con borde izquierdo de color, fondo blanco y sombra. Variantes: info, warning, success, error.' } },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['info', 'warning', 'success', 'error'] },
    onAction: { action: 'action clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof Banner>;

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Agrega el primer pago a proveedor',
    description: 'Al registrar el pago con el comprobante SWIFT o manual, se generarán fechas estimadas para los próximos pagos.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Agrega el primer pago a proveedor',
    description: 'Al registrar el pago con el comprobante SWIFT o manual, se generarán fechas estimadas para los próximos pagos.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Agrega el primer pago a proveedor',
    description: 'Al registrar el pago con el comprobante SWIFT o manual, se generarán fechas estimadas para los próximos pagos.',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Agrega el primer pago a proveedor',
    description: 'Al registrar el pago con el comprobante SWIFT o manual, se generarán fechas estimadas para los próximos pagos.',
  },
};

export const WithAction: Story = {
  args: {
    variant: 'info',
    title: 'Agrega el primer pago a proveedor',
    description: 'Al registrar el pago con el comprobante SWIFT o manual, se generarán fechas estimadas para los próximos pagos.',
    actionLabel: 'Button',
  },
};

export const WithoutIcon: Story = {
  args: {
    variant: 'warning',
    title: 'Agrega el primer pago a proveedor',
    description: 'Al registrar el pago con el comprobante SWIFT o manual, se generarán fechas estimadas para los próximos pagos.',
    showIcon: false,
  },
};

export const TitleOnly: Story = {
  args: {
    variant: 'success',
    title: 'Configuración guardada correctamente.',
  },
};
