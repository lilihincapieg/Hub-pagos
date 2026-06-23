import type { Meta, StoryObj } from '@storybook/react';
import { Chip } from './Chip';

const meta: Meta<typeof Chip> = {
  title: 'Components/Chip',
  component: Chip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Chip con 3 estados: Default, Selected (con X), Disabled. Soporta badge numérico (count) e ícono izquierdo.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    count: { control: 'number' },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { label: 'Text', count: 15 },
};

export default meta;
type Story = StoryObj<typeof Chip>;

// Estado 1 — Default
export const Default: Story = {};

// Estado 2 — Selected (muestra X y cambia badge bg a blanco)
export const Selected: Story = {
  args: { selected: true, onRemove: () => {} },
};

// Estado 3 — Disabled
export const Disabled: Story = {
  args: { disabled: true },
};

// Sin número
export const WithoutCount: Story = {
  args: { count: undefined },
};

// Todos los estados juntos
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ width: 70, fontSize: 12, color: '#6C6D8C' }}>Default</span>
        <Chip label="Text" count={15} onSelect={() => {}} />
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ width: 70, fontSize: 12, color: '#6C6D8C' }}>Selected</span>
        <Chip label="Text" count={15} selected onSelect={() => {}} onRemove={() => {}} />
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ width: 70, fontSize: 12, color: '#6C6D8C' }}>Disabled</span>
        <Chip label="Text" count={15} disabled />
      </div>
    </div>
  ),
};
