import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
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

// Sin checked en args → uncontrolled, se puede toglear directamente en el canvas
export const Default: Story = {
  args: { size: 'md' },
};

export const Checked: Story = {
  args: { checked: true },
};

export const Small: Story = {
  args: { size: 'sm' },
};

export const Large: Story = {
  args: { size: 'lg', checked: true },
};

export const Disabled: Story = {
  args: { disabled: true },
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

export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div className="flex items-center gap-3">
        <SwitchAtom checked={checked} onCheckedChange={setChecked} />
        <span className="text-sm text-neutral-600">
          {checked ? 'Activado' : 'Desactivado'}
        </span>
      </div>
    );
  },
};
