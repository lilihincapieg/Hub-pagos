import type { Meta, StoryObj } from '@storybook/react';
import { RadioButton, RadioGroup } from './RadioButton';

const meta: Meta<typeof RadioButton> = {
  title: 'Components/RadioButton',
  component: RadioButton,
  parameters: { layout: 'centered', docs: { description: { component: 'Radio button for single selection within a group. Use RadioGroup for multiple options.' } } },
  tags: ['autodocs'],
  args: { label: 'Text here', value: 'opt1', name: 'demo' },
};

export default meta;
type Story = StoryObj<typeof RadioButton>;

export const Default: Story = {};
export const Checked: Story = { args: { checked: true } };
export const Disabled: Story = { args: { disabled: true } };
export const DisabledChecked: Story = { args: { disabled: true, checked: true } };

export const GroupVertical: StoryObj<typeof RadioGroup> = {
  render: () => (
    <RadioGroup
      name="vertical"
      options={[
        { label: 'Opción 1', value: 'opt1' },
        { label: 'Opción 2', value: 'opt2' },
        { label: 'Opción 3 (deshabilitada)', value: 'opt3', disabled: true },
      ]}
      defaultValue="opt1"
    />
  ),
};

export const GroupHorizontal: StoryObj<typeof RadioGroup> = {
  render: () => (
    <RadioGroup
      name="horizontal"
      direction="horizontal"
      options={[
        { label: 'Sí', value: 'yes' },
        { label: 'No', value: 'no' },
        { label: 'Tal vez', value: 'maybe' },
      ]}
    />
  ),
};
