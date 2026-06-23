import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Standalone tooltip bubble. NOT a hover wrapper — renderiza el bubble directamente. El posicionamiento relativo al trigger lo maneja el padre. Soporta 4 placements (top/bottom/left/right), title opcional, CTA opcional y botón de cierre opcional.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Dónde está el trigger respecto al tooltip (determina la dirección de la flecha)',
    },
    title: { control: 'text' },
    description: { control: 'text' },
    ctaLabel: { control: 'text' },
    showClose: { control: 'boolean' },
    onCtaClick: { action: 'cta clicked' },
    onClose: { action: 'close clicked' },
  },
  args: {
    description: 'Description',
    title: 'Title',
    placement: 'top',
    showClose: true,
    ctaLabel: 'Call to action',
  },
  decorators: [(Story) => <div style={{ padding: 40 }}><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

/* ——— Placements ——— */

export const Top: Story = {
  args: { placement: 'top' },
};

export const Bottom: Story = {
  args: { placement: 'bottom' },
};

export const Left: Story = {
  args: { placement: 'left' },
};

export const Right: Story = {
  args: { placement: 'right' },
};

/* ——— Variants ——— */

export const WithoutTitle: Story = {
  args: { title: undefined },
};

export const WithoutCTA: Story = {
  args: { ctaLabel: undefined },
};

export const WithoutClose: Story = {
  args: { showClose: false },
};

export const Simple: Story = {
  name: 'Simple (solo description)',
  args: {
    title: undefined,
    ctaLabel: undefined,
    showClose: false,
    description: 'Tooltip informativo breve.',
  },
};

/* ——— Showcase: todos los placements ——— */
export const AllPlacements: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'flex-start' }}>
      {(['top', 'bottom', 'right', 'left'] as const).map((placement) => (
        <div key={placement} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 60, fontSize: 12, color: '#6B7280' }}>{placement}</span>
          <Tooltip
            placement={placement}
            title="Title"
            description="Description"
            ctaLabel="Call to action"
            showClose
          />
        </div>
      ))}
    </div>
  ),
};
