import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
    <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Campo de texto con 4 estados: default, error, warning, autoAI. Soporta label, hint, íconos, texto de ayuda y badge AutoAI.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    status: { control: 'select', options: ['default', 'error', 'warning', 'autoAI'] },
    disabled: { control: 'boolean' },
    showLabelIcon: { control: 'boolean' },
  },
  args: { placeholder: 'Ingresa texto aquí', status: 'default' },
};

export default meta;
type Story = StoryObj<typeof Input>;

// ─── Estados individuales ───────────────────────────────────────────────────

export const Default: Story = {
  args: { label: 'Label', placeholder: 'Placeholder' },
};

export const Filled: Story = {
  args: { label: 'Label', value: 'Valor ingresado' },
};

export const Error: Story = {
  args: {
    label: 'Email',
    status: 'error',
    value: 'texto-invalido',
    helperText: 'El formato del email no es válido',
    iconRight: <ChevronDownIcon />,
  },
};

export const Warning: Story = {
  args: {
    label: 'Nombre',
    status: 'warning',
    value: 'Juan',
    helperText: 'Este campo es recomendado para completar tu perfil',
    iconRight: <ChevronDownIcon />,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Campo deshabilitado',
    disabled: true,
    value: 'Valor fijo',
  },
};

export const AutoAI: Story = {
  args: {
    label: 'Razón social',
    status: 'autoAI',
    value: 'Finkargo S.A.S.',
    iconLeft: <ChevronDownIcon />,
  },
};

// ─── Con label icon ─────────────────────────────────────────────────────────

export const WithLabelIcon: Story = {
  args: {
    label: 'NIT',
    placeholder: '000.000.000-0',
    showLabelIcon: true,
  },
};

// ─── Con hint text ──────────────────────────────────────────────────────────

export const WithHintText: Story = {
  args: {
    label: 'Contraseña',
    type: 'password',
    hintText: 'Opcional',
    placeholder: 'Mínimo 8 caracteres',
  },
};

// ─── Con íconos ─────────────────────────────────────────────────────────────

export const WithIconLeft: Story = {
  args: {
    label: 'Buscar',
    placeholder: 'Buscar...',
    iconLeft: <SearchIcon />,
  },
};

export const WithIconRight: Story = {
  args: {
    label: 'Selector',
    placeholder: 'Seleccionar...',
    iconRight: <ChevronDownIcon />,
  },
};

export const WithBothIcons: Story = {
  args: {
    label: 'Buscar en lista',
    placeholder: 'Buscar...',
    iconLeft: <SearchIcon />,
    iconRight: <ChevronDownIcon />,
  },
};

// ─── Todos los estados ───────────────────────────────────────────────────────

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 320 }}>
      <Input
        label="Default"
        placeholder="Placeholder"
      />
      <Input
        label="Filled"
        value="Valor ingresado"
      />
      <Input
        label="Error"
        status="error"
        value="valor-invalido"
        helperText="Este campo tiene un error"
      />
      <Input
        label="Warning"
        status="warning"
        value="Valor incompleto"
        helperText="Verifica este campo antes de continuar"
      />
      <Input
        label="Disabled"
        disabled
        value="Campo deshabilitado"
      />
      <Input
        label="Auto AI"
        status="autoAI"
        value="Detectado automáticamente"
      />
    </div>
  ),
};
