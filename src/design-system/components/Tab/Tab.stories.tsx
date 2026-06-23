import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tab } from './Tab';

const meta: Meta<typeof Tab> = {
  title: 'Components/Tab',
  component: Tab,
  parameters: { layout: 'padded', docs: { description: { component: 'Horizontal tab navigation. Supports active indicator, disabled tabs and optional icons.' } } },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tab>;

const defaultItems = [
  { label: 'General', value: 'general' },
  { label: 'Configuración', value: 'config' },
  { label: 'Historial', value: 'history' },
];

export const Default: Story = { args: { items: defaultItems, defaultValue: 'general' } };

export const WithDisabled: Story = {
  args: {
    items: [
      { label: 'Activo', value: 'active' },
      { label: 'Pendiente', value: 'pending' },
      { label: 'Archivado', value: 'archived', disabled: true },
    ],
    defaultValue: 'active',
  },
};

export const Controlled: Story = {
  render: () => {
    const [active, setActive] = useState('general');
    const content: Record<string, string> = {
      general: 'Contenido de General',
      config: 'Contenido de Configuración',
      history: 'Contenido de Historial',
    };
    return (
      <div>
        <Tab items={defaultItems} value={active} onChange={setActive} />
        <div style={{ padding: '16px', fontFamily: 'Albert Sans, sans-serif', fontSize: 14, color: '#374151' }}>
          {content[active]}
        </div>
      </div>
    );
  },
};
