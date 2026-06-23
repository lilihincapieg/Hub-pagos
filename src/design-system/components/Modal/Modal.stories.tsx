import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import type { ModalProps } from './Modal';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const triggerStyle: React.CSSProperties = {
  padding: '10px 24px',
  borderRadius: '24px',
  background: '#2128B1',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
  fontFamily: '"Albert Sans", sans-serif',
  fontWeight: 500,
  fontSize: '14px',
};

/** Wrapper interactivo — muestra un botón que abre el modal */
const ModalDemo = (props: Omit<ModalProps, 'open' | 'onClose'>) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button style={triggerStyle} onClick={() => setOpen(true)}>
        Abrir modal
      </button>
      <Modal {...props} open={open} onClose={() => setOpen(false)} />
    </>
  );
};

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Ventana superpuesta con focus trap, ESC para cerrar y restauración del foco al elemento trigger. 3 estados de header × 4 estados de footer.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
    headerState: {
      control: 'select',
      options: ['header', 'only-close', 'none'],
      description: 'header = título + descripción + X · only-close = solo X · none = sin header',
    },
    title: { control: 'text' },
    description: { control: 'text' },
    disableBackdropClose: {
      control: 'boolean',
      description: 'Cuando true, el click en el backdrop no cierra el modal',
    },
  },
  args: {
    open: false,
    title: 'Title',
    description: 'Text description',
    headerState: 'header',
    disableBackdropClose: false,
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

/* ——— Header states ——— */

export const HeaderDefault: Story = {
  name: 'Header — State=Header',
  render: () => (
    <ModalDemo
      headerState="header"
      title="Title"
      description="Text description"
      actions={[
        { label: 'Button', variant: 'ghost' },
        { label: 'Button', variant: 'outlined' },
        { label: 'Button', variant: 'primary', icon: <PlusIcon /> },
      ]}
    />
  ),
};

export const HeaderOnlyClose: Story = {
  name: 'Header — State=Only close',
  render: () => (
    <ModalDemo
      headerState="only-close"
      actions={[
        { label: 'Button', variant: 'outlined' },
        { label: 'Button', variant: 'primary', icon: <PlusIcon /> },
      ]}
    />
  ),
};

export const HeaderNone: Story = {
  name: 'Header — State=No-option',
  render: () => (
    <ModalDemo
      headerState="none"
      actions={[
        { label: 'Button', variant: 'outlined' },
        { label: 'Button', variant: 'primary', icon: <PlusIcon /> },
      ]}
    />
  ),
};

/* ——— Footer states ——— */

export const Footer3Button: Story = {
  name: 'Footer — State=3 button',
  render: () => (
    <ModalDemo
      headerState="header"
      title="Title"
      description="Text description"
      actions={[
        { label: 'Button', variant: 'ghost' },
        { label: 'Button', variant: 'outlined' },
        { label: 'Button', variant: 'primary', icon: <PlusIcon /> },
      ]}
    />
  ),
};

export const Footer2Button: Story = {
  name: 'Footer — State=2 button',
  render: () => (
    <ModalDemo
      headerState="header"
      title="Title"
      description="Text description"
      actions={[
        { label: 'Button', variant: 'outlined' },
        { label: 'Button', variant: 'primary', icon: <PlusIcon /> },
      ]}
    />
  ),
};

export const Footer1Button: Story = {
  name: 'Footer — State=1 button',
  render: () => (
    <ModalDemo
      headerState="header"
      title="Title"
      description="Text description"
      actions={[{ label: 'Button', variant: 'primary', icon: <PlusIcon /> }]}
    />
  ),
};

export const FooterNone: Story = {
  name: 'Footer — State=No-option',
  render: () => (
    <ModalDemo
      headerState="header"
      title="Title"
      description="Text description"
      actions={[]}
    />
  ),
};

/* ——— Con slot content ——— */

export const ConSlot: Story = {
  name: 'Con contenido en slot',
  render: () => (
    <ModalDemo
      headerState="header"
      title="Title"
      description="Text description"
      actions={[
        { label: 'Button', variant: 'ghost' },
        { label: 'Button', variant: 'outlined' },
        { label: 'Button', variant: 'primary', icon: <PlusIcon /> },
      ]}
    >
      <div
        style={{
          height: '42px',
          border: '1px dashed #F98A3A',
          backgroundColor: '#FFF2DB',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#F98A3A',
          fontFamily: '"Albert Sans", sans-serif',
          fontSize: '14px',
          marginBottom: '8px',
        }}
      >
        Slot
      </div>
    </ModalDemo>
  ),
};

/* ——— All States ——— */

export const AllStates: Story = {
  name: 'All States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {[
        {
          label: 'Header — State=Header · Footer — State=3 button',
          props: {
            headerState: 'header' as const,
            title: 'Title',
            description: 'Text description',
            actions: [
              { label: 'Button', variant: 'ghost' as const },
              { label: 'Button', variant: 'outlined' as const },
              { label: 'Button', variant: 'primary' as const, icon: <PlusIcon /> },
            ],
          },
        },
        {
          label: 'Header — State=Header · Footer — State=2 button',
          props: {
            headerState: 'header' as const,
            title: 'Title',
            description: 'Text description',
            actions: [
              { label: 'Button', variant: 'outlined' as const },
              { label: 'Button', variant: 'primary' as const, icon: <PlusIcon /> },
            ],
          },
        },
        {
          label: 'Header — State=Header · Footer — State=1 button',
          props: {
            headerState: 'header' as const,
            title: 'Title',
            description: 'Text description',
            actions: [{ label: 'Button', variant: 'primary' as const, icon: <PlusIcon /> }],
          },
        },
        {
          label: 'Header — State=Header · Footer — State=No-option',
          props: {
            headerState: 'header' as const,
            title: 'Title',
            description: 'Text description',
            actions: [],
          },
        },
        {
          label: 'Header — State=Only close · Footer — State=2 button',
          props: {
            headerState: 'only-close' as const,
            actions: [
              { label: 'Button', variant: 'outlined' as const },
              { label: 'Button', variant: 'primary' as const, icon: <PlusIcon /> },
            ],
          },
        },
        {
          label: 'Header — State=No-option · Footer — State=2 button',
          props: {
            headerState: 'none' as const,
            actions: [
              { label: 'Button', variant: 'outlined' as const },
              { label: 'Button', variant: 'primary' as const, icon: <PlusIcon /> },
            ],
          },
        },
      ].map(({ label, props }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 340, fontSize: 11, color: '#6C6D8C', flexShrink: 0 }}>{label}</span>
          <ModalDemo {...props} />
        </div>
      ))}
    </div>
  ),
};
