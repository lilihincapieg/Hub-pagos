import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from './Sidebar';

/* ── Icons ─────────────────────────────────────────────────── */
const CompassIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    <path d="M16 8l-3 6-3 0-2 4 3-6 3 0 2-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const ShipIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 17l2-7h14l2 7H3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M8 10V6h8v4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M12 3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M3 17c0 2 18 2 18 0" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const MoneyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="6" width="20" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6 6V5a2 2 0 012-2h8a2 2 0 012 2v1" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const RadarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
    <path d="M12 12l5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const DirectoryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 7h8M8 11h8M8 15h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <rect x="2" y="3" width="2" height="18" rx="1" fill="currentColor" fillOpacity="0.3" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="5" width="14" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M7 9h6M7 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M14 17l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ── Logo ───────────────────────────────────────────────────── */
const FKLogo = () => (
  <svg viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="2" y="24" fontFamily="Albert Sans, sans-serif" fontSize="22" fontWeight="700" fill="#78F7FF">FK</text>
  </svg>
);

/* ── Items ──────────────────────────────────────────────────── */
const items = [
  { id: 'compass', label: 'Inicio', icon: <CompassIcon /> },
  { id: 'operations', label: 'Operaciones', icon: <ShipIcon /> },
  { id: 'finance', label: 'Finanzas', icon: <MoneyIcon /> },
  { id: 'radar', label: 'Radar', icon: <RadarIcon /> },
  { id: 'directory', label: 'Directorio', icon: <DirectoryIcon /> },
  { id: 'checks', label: 'Verificaciones', icon: <CheckIcon /> },
];

/* ── Meta ───────────────────────────────────────────────────── */
const meta: Meta<typeof Sidebar> = {
  title: 'Components/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Sidebar de navegación lateral con fondo oscuro, íconos y tooltip al hacer hover.' } },
    backgrounds: { default: 'dark' },
  },
  tags: ['autodocs'],
  decorators: [(Story) => (
    <div style={{ height: 600, display: 'flex', background: '#F5F6FA' }}>
      <Story />
    </div>
  )],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  args: { items, activeId: 'compass', logo: <FKLogo /> },
};

export const WithActiveOperations: Story = {
  args: { items, activeId: 'operations', logo: <FKLogo /> },
};

export const NoLogo: Story = {
  args: { items, activeId: 'finance' },
};
