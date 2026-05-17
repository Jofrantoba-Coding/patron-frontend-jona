import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { CheckboxAtom } from './CheckboxAtom';
import { JPanel } from '../JPanel/JPanel';
import { JLabel } from '../JLabel';

const meta: Meta<typeof CheckboxAtom> = {
  title: 'Atoms/CheckboxAtom',
  component: CheckboxAtom,
  tags: ['autodocs'],
  args: { onCheckedChange: fn() },
  argTypes: {
    checked:  { control: 'boolean' },
    hasError: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof CheckboxAtom>;

// Sin checked en args → uncontrolled, se puede toglear directamente en el canvas
export const Default: Story = {};

export const Checked: Story = {
  args: { checked: true },
};

export const WithError: Story = {
  args: { hasError: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledChecked: Story = {
  args: { disabled: true, checked: true },
};

export const Interactive: Story = {
  parameters: {
    docs: {
      source: {
        code: `const [checked, setChecked] = useState(false);

<CheckboxAtom
  checked={checked}
  onCheckedChange={setChecked}
/>`,
      },
    },
  },
  args: {
    onCheckedChange: fn(),
  },
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <JPanel variant="ghost" padding="none" className="flex items-center gap-2">
        <CheckboxAtom checked={checked} onCheckedChange={(v) => { args.onCheckedChange?.(v); setChecked(v); }} />
        <JLabel as="span" size="sm" className="text-neutral-600">
          {checked ? 'Seleccionado' : 'Sin seleccionar'}
        </JLabel>
      </JPanel>
    );
  },
};
