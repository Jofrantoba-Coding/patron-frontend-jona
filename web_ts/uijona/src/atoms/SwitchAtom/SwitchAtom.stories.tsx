import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { SwitchAtom } from './SwitchAtom';
import { PanelAtom } from '../PanelAtom/PanelAtom';
import { TextAtom } from '../TextAtom/TextAtom';

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
    <PanelAtom variant="ghost" padding="none" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <SwitchAtom size="sm" checked />
      <SwitchAtom size="md" checked />
      <SwitchAtom size="lg" checked />
    </PanelAtom>
  ),
};

export const Interactive: Story = {
  args: {
    onCheckedChange: fn(),
  },
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <PanelAtom variant="ghost" padding="none" className="flex items-center gap-3">
        <SwitchAtom checked={checked} onCheckedChange={(v) => { args.onCheckedChange?.(v); setChecked(v); }} />
        <TextAtom as="span" size="sm" className="text-neutral-600">
          {checked ? 'Activado' : 'Desactivado'}
        </TextAtom>
      </PanelAtom>
    );
  },
};
