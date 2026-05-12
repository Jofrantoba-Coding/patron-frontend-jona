import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { RadioAtom } from './RadioAtom';
import { LabelAtom } from '../LabelAtom/LabelAtom';
import { PanelAtom } from '../PanelAtom/PanelAtom';
import { TextAtom } from '../TextAtom/TextAtom';

const meta: Meta<typeof RadioAtom> = {
  title: 'Atoms/RadioAtom',
  component: RadioAtom,
  tags: ['autodocs'],
  args: { onCheckedChange: fn(), onFocus: fn(), onBlur: fn() },
  argTypes: {
    checked: { control: 'boolean' },
    hasError: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof RadioAtom>;

export const Default: Story = {
  args: {
    name: 'radio-default',
    value: 'default',
  },
};

export const Checked: Story = {
  args: {
    name: 'radio-checked',
    value: 'checked',
    checked: true,
  },
};

export const Error: Story = {
  args: {
    name: 'radio-error',
    value: 'error',
    hasError: true,
  },
};

export const Disabled: Story = {
  args: {
    name: 'radio-disabled',
    value: 'disabled',
    disabled: true,
  },
};

export const Interactive: Story = {
  args: {
    onCheckedChange: fn(),
  },
  render: (args) => {
    const [selected, setSelected] = useState('');
    const methods = [
      { value: 'card', label: 'Tarjeta de crédito' },
      { value: 'transfer', label: 'Transferencia bancaria' },
      { value: 'paypal', label: 'PayPal' },
    ];
    return (
      <PanelAtom variant="ghost" padding="none" className="flex flex-col gap-3">
        <TextAtom size="sm" className="font-medium text-neutral-700">Método de pago</TextAtom>
        {methods.map((m) => (
          <LabelAtom key={m.value} className="flex items-center gap-2 cursor-pointer">
            <RadioAtom
              name="payment"
              value={m.value}
              checked={selected === m.value}
              onCheckedChange={(checked, value, e) => { args.onCheckedChange?.(checked, value, e); setSelected(m.value); }}
            />
            <TextAtom as="span" size="sm">{m.label}</TextAtom>
          </LabelAtom>
        ))}
        {selected && (
          <TextAtom size="xs" color="muted" className="mt-1">
            Método elegido: <strong>{methods.find((m) => m.value === selected)?.label}</strong>
          </TextAtom>
        )}
      </PanelAtom>
    );
  },
};
