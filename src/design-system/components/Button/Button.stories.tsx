import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Pure presentational button component. Supports three variants (Primary, Secondary, Tertiary), three sizes (Large, Medium, Small) and states: default, hover, disabled, and loading.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['large', 'medium', 'small'],
      description: 'Button size',
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    children: { control: 'text' },
    onClick: { action: 'clicked' },
  },
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'medium',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

/* ——— Single Stories ——— */

export const Primary: Story = {
  args: { variant: 'primary' },
};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Tertiary: Story = {
  args: { variant: 'tertiary' },
};

export const Large: Story = {
  args: { size: 'large' },
};

export const Small: Story = {
  args: { size: 'small' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Loading: Story = {
  args: { loading: true },
};

export const WithIconLeft: Story = {
  args: {
    iconLeft: (
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M8 1L15 8L8 15M1 8H15"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    children: 'Continue',
  },
};

/* ——— Showcase: All Variants × Sizes ——— */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {(['large', 'medium', 'small'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Button variant="primary" size={size}>
            Primary
          </Button>
          <Button variant="secondary" size={size}>
            Secondary
          </Button>
          <Button variant="tertiary" size={size}>
            Tertiary
          </Button>
        </div>
      ))}
    </div>
  ),
};

/* ——— Showcase: All States ——— */
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {(['primary', 'secondary', 'tertiary'] as const).map((variant) => (
        <div key={variant} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Button variant={variant}>Default</Button>
          <Button variant={variant} disabled>
            Disabled
          </Button>
          <Button variant={variant} loading>
            Loading
          </Button>
        </div>
      ))}
    </div>
  ),
};
