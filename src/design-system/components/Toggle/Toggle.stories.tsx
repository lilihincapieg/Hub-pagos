import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from './Toggle';

const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  parameters: { layout: 'centered', docs: { description: { component: 'Toggle switch for binary on/off states. Supports medium and small sizes.' } } },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['medium', 'small'] },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
  args: { size: 'medium' },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {};
export const On: Story = { args: { checked: true } };
export const Small: Story = { args: { size: 'small' } };
export const SmallOn: Story = { args: { size: 'small', checked: true } };
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { loading: true } };
export const WithLabel: Story = { args: { label: 'Activar notificaciones', checked: true } };

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gap: '20px 32px', alignItems: 'center' }}>
      <span style={{ fontFamily: 'Albert Sans, sans-serif', fontSize: 12, color: '#6B7280' }}>Size</span>
      <span style={{ fontFamily: 'Albert Sans, sans-serif', fontSize: 12, color: '#6B7280' }}>Default</span>
      <span style={{ fontFamily: 'Albert Sans, sans-serif', fontSize: 12, color: '#6B7280' }}>Loading</span>
      <span style={{ fontFamily: 'Albert Sans, sans-serif', fontSize: 12, color: '#6B7280' }}>Disabled</span>
      <span style={{ fontFamily: 'Albert Sans, sans-serif', fontSize: 12, color: '#6B7280' }}>M</span>
      <Toggle size="medium" defaultChecked />
      <Toggle size="medium" loading />
      <Toggle size="medium" disabled />
      <span style={{ fontFamily: 'Albert Sans, sans-serif', fontSize: 12, color: '#6B7280' }}>S</span>
      <Toggle size="small" defaultChecked />
      <Toggle size="small" loading />
      <Toggle size="small" disabled />
    </div>
  ),
};
