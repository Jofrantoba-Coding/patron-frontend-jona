import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { SwitchAtom } from './SwitchAtom';

const meta: Meta<typeof SwitchAtom> = {
  title: 'Atoms/SwitchAtom',
  component: SwitchAtom,
  tags: ['autodocs'],
  args: { onCheckedChange: fn() },
  argTypes: {
    size:     { control: 'radio', options: ['sm', 'md', 'lg'] },
    checked:  { control: 'boolean' },
    disabled: { control: 'boolean' },
    hasError: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof SwitchAtom>;

export const Default: Story = {
  args: { checked: false, size: 'md' },
};

export const Checked: Story = {
  args: { checked: true },
};

export const Small: Story = {
  args: { size: 'sm', checked: false },
};

export const Large: Story = {
  args: { size: 'lg', checked: true },
};

export const Disabled: Story = {
  args: { disabled: true, checked: false },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <SwitchAtom size="sm" checked />
      <SwitchAtom size="md" checked />
      <SwitchAtom size="lg" checked />
    </div>
  ),
};
