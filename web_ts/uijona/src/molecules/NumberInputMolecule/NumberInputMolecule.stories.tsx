import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { NumberInputMolecule } from './NumberInputMolecule';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';

const meta: Meta<typeof NumberInputMolecule> = {
  title: 'Molecules/NumberInputMolecule',
  component: NumberInputMolecule,
  tags: ['autodocs'],
  args: {
    defaultValue: 3,
    min: 0,
    max: 10,
    step: 1,
    onValueChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof NumberInputMolecule>;

export const Default: Story = {};

export const Error: Story = {
  args: {
    hasError: true,
    value: 12,
  },
};

export const Interactive: Story = {
  args: {
    onValueChange: fn(),
  },
  render: (args) => {
    const [qty, setQty] = useState(1);
    const pricePerUnit = 49.99;
    const total = qty * pricePerUnit;
    return (
      <JPanel variant="ghost" padding="none" className="flex flex-col gap-3 w-56">
        <JLabel size="sm" className="font-medium">Cantidad en carrito</JLabel>
        <NumberInputMolecule
          min={1}
          max={10}
          step={1}
          value={qty}
          onValueChange={(v, e) => { args.onValueChange?.(v, e); setQty(v ?? 1); }}
        />
        <JPanel variant="ghost" padding="none" className="rounded-md bg-neutral-50 border p-3 text-sm">
          <JLabel className="text-neutral-500">Precio unitario: <strong>${pricePerUnit.toFixed(2)}</strong></JLabel>
          <JLabel className="text-neutral-800 font-semibold mt-1">Total: ${total.toFixed(2)}</JLabel>
        </JPanel>
      </JPanel>
    );
  },
};
