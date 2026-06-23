import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Indicador visual compacto. 7 estados semánticos × 2 estilos (light/dark) × 3 tamaños × border opcional = 84 variantes totales.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'info', 'warning', 'error', 'neutral', 'bag', 'simple'],
    },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    badgeStyle: { control: 'select', options: ['light', 'dark'] },
    border: { control: 'boolean' },
    showIcon: { control: 'boolean' },
    showIconLeft: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: {
    label: 'Badge',
    variant: 'neutral',
    size: 'medium',
    badgeStyle: 'light',
    border: true,
    showIcon: false,
    showIconLeft: false,
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

/* ——— Individual states ——— */
export const Success: Story = { args: { variant: 'success', label: 'Activo' } };
export const Info: Story = { args: { variant: 'info', label: 'Info' } };
export const Warning: Story = { args: { variant: 'warning', label: 'Pendiente' } };
export const Error: Story = { args: { variant: 'error', label: 'Error' } };
export const Neutral: Story = { args: { variant: 'neutral', label: 'Neutral' } };
export const Bag: Story = { args: { variant: 'bag', label: 'Bag' } };
export const Simple: Story = { args: { variant: 'simple', label: 'Simple' } };

/* ——— With icons ——— */
export const WithIconRight: Story = {
  name: 'Icon — right',
  args: { variant: 'info', label: 'Info', showIcon: true },
};

export const WithIconLeft: Story = {
  name: 'Icon — left',
  args: { variant: 'success', label: 'Activo', showIconLeft: true },
};

export const WithBothIcons: Story = {
  name: 'Icon — both sides',
  args: { variant: 'warning', label: 'Pendiente', showIcon: true, showIconLeft: true },
};

/* ——— No border ——— */
export const NoBorder: Story = {
  args: { variant: 'success', label: 'Sin borde', border: false },
};

/* ——— Showcase: todos los estados × light + dark ——— */
export const AllStates: Story = {
  name: 'All States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
        <span style={{ width: 70, fontSize: 11, color: '#6B7280' }} />
        <span style={{ width: 80, fontSize: 11, color: '#6B7280', textAlign: 'center' }}>Light</span>
        <span style={{ width: 80, fontSize: 11, color: '#6B7280', textAlign: 'center' }}>Dark</span>
      </div>
      {(['success', 'info', 'warning', 'error', 'neutral', 'bag', 'simple'] as const).map((v) => (
        <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 70, fontSize: 11, color: '#6B7280' }}>{v}</span>
          <Badge variant={v} label={v} badgeStyle="light" size="medium" border />
          <Badge variant={v} label={v} badgeStyle="dark" size="medium" border />
        </div>
      ))}
    </div>
  ),
};

/* ——— Showcase: tamaños ——— */
export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {(['small', 'medium', 'large'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 60, fontSize: 11, color: '#6B7280' }}>{size}</span>
          {(['success', 'info', 'warning', 'error', 'neutral', 'bag', 'simple'] as const).map((v) => (
            <Badge key={v} variant={v} label={v} size={size} badgeStyle="light" border />
          ))}
        </div>
      ))}
    </div>
  ),
};

/* ——— Showcase: border on vs off ——— */
export const BorderComparison: Story = {
  name: 'Border On vs Off',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {(['success', 'info', 'warning', 'error', 'neutral', 'bag', 'simple'] as const).map((v) => (
        <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 70, fontSize: 11, color: '#6B7280' }}>{v}</span>
          <Badge variant={v} label="border" badgeStyle="light" border={true} />
          <Badge variant={v} label="no border" badgeStyle="light" border={false} />
          <Badge variant={v} label="dark" badgeStyle="dark" border={true} />
          <Badge variant={v} label="dark no border" badgeStyle="dark" border={false} />
        </div>
      ))}
    </div>
  ),
};
