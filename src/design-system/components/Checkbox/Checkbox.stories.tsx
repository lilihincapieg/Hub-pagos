import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Checkbox con 6 estados: Default, Hover, Focused, Disabled, Indeterminate, Selected.',
      },
    },
  },
  tags: ['autodocs'],
  args: { label: 'Text here' },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

// Estado 1 — Default
export const Default: Story = {};

// Estado 2 — Hover (interacción CSS, visible al pasar el cursor)
export const Hover: Story = {
  parameters: {
    docs: { description: { story: 'Borde cambia a #3C47D3 al hacer hover.' } },
  },
};

// Estado 3 — Focused (interacción CSS + box-shadow)
export const Focused: Story = {
  parameters: {
    docs: { description: { story: 'Borde #3C47D3 + box-shadow rgba(33,40,177,0.2) al recibir foco (Tab).' } },
  },
};

// Estado 4 — Disabled
export const Disabled: Story = {
  args: { disabled: true },
};

// Estado 5 — Indeterminate
export const Indeterminate: Story = {
  args: { indeterminate: true },
};

// Estado 6 — Selected (checked)
export const Selected: Story = {
  args: { checked: true },
};

// Extras
export const DisabledSelected: Story = {
  args: { disabled: true, checked: true },
};

export const WithHelperText: Story = {
  args: {
    label: 'Acepto los términos',
    helperText: 'Lee los términos y condiciones antes de aceptar',
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Checkbox label="Default" />
      <Checkbox label="Indeterminate" indeterminate />
      <Checkbox label="Selected" checked />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled Selected" disabled checked />
      <Checkbox label="With helper text" helperText="Texto de ayuda secundario" />
    </div>
  ),
};
