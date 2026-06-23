import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from './Dropdown';

const options = [
  { label: 'Colombia', value: 'co' },
  { label: 'México', value: 'mx' },
  { label: 'Argentina', value: 'ar' },
  { label: 'Chile', value: 'cl' },
  { label: 'Perú', value: 'pe' },
];

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Dropdown con 10 estados de trigger: Default, Hover, Focused, Typing, Disabled, Success, Warning, Open Default, Open Typing, Search.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['large', 'medium', 'small'] },
    disabled: { control: 'boolean' },
    searchable: { control: 'boolean' },
  },
  args: { options, placeholder: 'Seleccionar', size: 'large' },
  decorators: [(Story) => <div style={{ width: 280 }}><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

// ─── Estado 1: Default ────────────────────────────────────────────────────────
export const Default: Story = {
  args: { label: 'Label' },
};

// ─── Estado 2: Hover ─────────────────────────────────────────────────────────
// Hover es un estado CSS (:hover) — se activa pasando el cursor sobre el trigger
export const Hover: Story = {
  args: { label: 'Label' },
  parameters: {
    docs: {
      description: { story: 'Estado hover — border cambia a gray[400]. Interactuar pasando cursor sobre el trigger.' },
    },
  },
};

// ─── Estado 3: Focused ───────────────────────────────────────────────────────
// Focus es un estado CSS (:focus-visible) — se activa con Tab
export const Focused: Story = {
  args: { label: 'Label' },
  parameters: {
    docs: {
      description: { story: 'Estado focused — border secondary.main + box-shadow azul. Usar Tab para enfocar.' },
    },
  },
};

// ─── Estado 4: Typing (valor seleccionado) ───────────────────────────────────
export const Typing: Story = {
  args: { label: 'Label', defaultValue: 'co' },
};

// ─── Estado 5: Disabled ──────────────────────────────────────────────────────
export const Disabled: Story = {
  args: { label: 'Label', disabled: true },
};

// ─── Estado 6: Disabled con valor ────────────────────────────────────────────
export const DisabledWithValue: Story = {
  args: { label: 'Label', disabled: true, defaultValue: 'mx' },
};

// ─── Estado 7: Success ───────────────────────────────────────────────────────
export const Success: Story = {
  args: { label: 'Label', defaultValue: 'co', successText: 'Selección válida' },
};

// ─── Estado 8: Warning ───────────────────────────────────────────────────────
export const Warning: Story = {
  args: { label: 'Label', defaultValue: 'co', warningText: 'Verifica tu selección' },
};

// ─── Estado 9: Error ─────────────────────────────────────────────────────────
export const Error: Story = {
  args: { label: 'Label', errorText: 'Este campo es requerido' },
};

// ─── Estado 10: Searchable (ícono lupa en trigger cerrado) ───────────────────
export const Searchable: Story = {
  args: { label: 'Label', searchable: true },
};

// ─── Tamaños ─────────────────────────────────────────────────────────────────
export const SizeLarge: Story = {
  args: { label: 'Large (48px)', size: 'large' },
};

export const SizeMedium: Story = {
  args: { label: 'Medium (40px)', size: 'medium' },
};

export const SizeSmall: Story = {
  args: { label: 'Small (32px)', size: 'small' },
};

// ─── Todos los estados juntos ─────────────────────────────────────────────────
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 300 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 11, color: '#6C6D8C', fontWeight: 500 }}>Default</span>
        <Dropdown options={options} label="Label" placeholder="Seleccionar" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 11, color: '#6C6D8C', fontWeight: 500 }}>Typing (con valor)</span>
        <Dropdown options={options} label="Label" defaultValue="co" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 11, color: '#6C6D8C', fontWeight: 500 }}>Disabled</span>
        <Dropdown options={options} label="Label" disabled placeholder="Seleccionar" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 11, color: '#6C6D8C', fontWeight: 500 }}>Success</span>
        <Dropdown options={options} label="Label" defaultValue="co" successText="Selección válida" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 11, color: '#6C6D8C', fontWeight: 500 }}>Warning</span>
        <Dropdown options={options} label="Label" defaultValue="co" warningText="Verifica tu selección" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 11, color: '#6C6D8C', fontWeight: 500 }}>Error</span>
        <Dropdown options={options} label="Label" errorText="Este campo es requerido" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 11, color: '#6C6D8C', fontWeight: 500 }}>Searchable (cerrado — lupa)</span>
        <Dropdown options={options} label="Label" searchable placeholder="Seleccionar" />
      </div>
    </div>
  ),
};
