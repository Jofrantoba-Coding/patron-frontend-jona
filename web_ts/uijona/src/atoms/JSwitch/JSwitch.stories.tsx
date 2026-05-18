import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JSwitch } from './JSwitch';
import { JPanel } from '../JPanel/JPanel';
import { JLabel } from '../JLabel';

const meta: Meta<typeof JSwitch> = {
  title: 'Atoms/JSwitch',
  component: JSwitch,
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
type Story = StoryObj<typeof JSwitch>;

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

export const WithError: Story = {
  args: { hasError: true, checked: true },
};

export const AllSizes: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <JSwitch size="sm" checked />
      <JSwitch size="md" checked />
      <JSwitch size="lg" checked />
    </JPanel>
  ),
};

export const Interactive: Story = {
  args: { onCheckedChange: fn() },
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <JPanel variant="ghost" padding="none" className="flex items-center gap-3">
        <JSwitch
          checked={checked}
          onCheckedChange={(v, e) => { args.onCheckedChange?.(v, e); setChecked(v); }}
        />
        <JLabel as="span" size="sm" className="text-neutral-600">
          {checked ? 'Activado' : 'Desactivado'}
        </JLabel>
      </JPanel>
    );
  },
};
