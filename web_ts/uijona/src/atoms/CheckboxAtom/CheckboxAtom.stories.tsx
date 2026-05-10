import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { CheckboxAtom } from './CheckboxAtom';

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
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div className="flex items-center gap-2">
        <CheckboxAtom checked={checked} onCheckedChange={setChecked} />
        <span className="text-sm text-neutral-600">
          {checked ? 'Seleccionado' : 'Sin seleccionar'}
        </span>
      </div>
    );
  },
};
