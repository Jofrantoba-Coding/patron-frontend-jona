import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JRadioButton } from './JRadioButton';
import { JLabel } from '../JLabel';
import { JPanel } from '../JPanel/JPanel';

const meta: Meta<typeof JRadioButton> = {
  title: 'Atoms/JRadioButton',
  component: JRadioButton,
  tags: ['autodocs'],
  args: { onCheckedChange: fn(), onFocus: fn(), onBlur: fn() },
  argTypes: {
    checked:       { control: 'boolean' },
    hasError:      { control: 'boolean' },
    disabled:      { control: 'boolean' },
    label:         { control: 'text' },
    labelPosition: { control: 'select', options: ['right', 'left', 'top', 'bottom'] },
  },
};
export default meta;
type Story = StoryObj<typeof JRadioButton>;

export const Default: Story = {
  args: { name: 'radio-default', value: 'default' },
};

export const Checked: Story = {
  args: { name: 'radio-checked', value: 'checked', checked: true },
};

export const WithLabelRight: Story = {
  args: { name: 'r1', value: 'a', label: 'Opción A', labelPosition: 'right' },
};

export const WithLabelLeft: Story = {
  args: { name: 'r2', value: 'b', label: 'Opción B', labelPosition: 'left' },
};

export const WithLabelTop: Story = {
  args: { name: 'r3', value: 'c', label: 'Arriba', labelPosition: 'top' },
};

export const WithLabelBottom: Story = {
  args: { name: 'r4', value: 'd', label: 'Abajo', labelPosition: 'bottom' },
};

export const LabelPositions: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" className="grid grid-cols-2 gap-8 p-4">
      <JPanel variant="ghost" padding="none" className="flex flex-col items-center gap-1">
        <JLabel size="xs" color="muted">right (default)</JLabel>
        <JRadioButton name="pos" value="right" label="Opción A" labelPosition="right" />
      </JPanel>
      <JPanel variant="ghost" padding="none" className="flex flex-col items-center gap-1">
        <JLabel size="xs" color="muted">left</JLabel>
        <JRadioButton name="pos" value="left" label="Opción B" labelPosition="left" />
      </JPanel>
      <JPanel variant="ghost" padding="none" className="flex flex-col items-center gap-1">
        <JLabel size="xs" color="muted">top</JLabel>
        <JRadioButton name="pos" value="top" label="Opción C" labelPosition="top" />
      </JPanel>
      <JPanel variant="ghost" padding="none" className="flex flex-col items-center gap-1">
        <JLabel size="xs" color="muted">bottom</JLabel>
        <JRadioButton name="pos" value="bottom" label="Opción D" labelPosition="bottom" />
      </JPanel>
    </JPanel>
  ),
};

export const WithError: Story = {
  args: { name: 'radio-error', value: 'error', hasError: true, label: 'Campo requerido' },
};

export const Disabled: Story = {
  args: { name: 'radio-disabled', value: 'disabled', disabled: true, label: 'No disponible' },
};

export const Interactive: Story = {
  args: { onCheckedChange: fn() },
  render: (args) => {
    const [selected, setSelected] = useState('');
    const methods = [
      { value: 'card',     label: 'Tarjeta de crédito' },
      { value: 'transfer', label: 'Transferencia bancaria' },
      { value: 'paypal',   label: 'PayPal' },
    ];
    return (
      <JPanel variant="ghost" padding="none" className="flex flex-col gap-3">
        <JLabel size="sm" className="font-medium text-neutral-700">Método de pago</JLabel>
        {methods.map((m) => (
          <JRadioButton
            key={m.value}
            name="payment"
            value={m.value}
            label={m.label}
            labelPosition="right"
            checked={selected === m.value}
            onCheckedChange={(checked, value, e) => { args.onCheckedChange?.(checked, value, e); setSelected(m.value); }}
          />
        ))}
        {selected && (
          <JLabel size="xs" color="muted" className="mt-1">
            Elegido: <strong>{methods.find((m) => m.value === selected)?.label}</strong>
          </JLabel>
        )}
      </JPanel>
    );
  },
};
