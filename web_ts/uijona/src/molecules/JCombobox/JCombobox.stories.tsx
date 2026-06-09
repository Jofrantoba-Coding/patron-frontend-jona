import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JCombobox } from './JCombobox';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';

const COUNTRIES = [
  { value: 'pe', label: 'Perú' },
  { value: 'mx', label: 'México' },
  { value: 'co', label: 'Colombia' },
  { value: 'ar', label: 'Argentina' },
  { value: 'cl', label: 'Chile' },
  { value: 'ec', label: 'Ecuador' },
  { value: 'bo', label: 'Bolivia' },
  { value: 'uy', label: 'Uruguay' },
];

const meta: Meta<typeof JCombobox> = {
  title: 'Molecules/JCombobox',
  component: JCombobox,
  tags: ['autodocs'],
  args: {
    options: COUNTRIES,
    onChange: fn(),
    onSearchChange: fn(),
    placeholder: 'Seleccionar país...',
  },
  decorators: [(Story) => <JPanel variant="ghost" padding="none" className="w-64"><Story /></JPanel>],
};
export default meta;
type Story = StoryObj<typeof JCombobox>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { value: 'pe' },
};

export const Disabled: Story = {
  args: { value: 'mx', disabled: true },
};

export const WithDisabledOption: Story = {
  args: {
    options: [
      { value: 'pe', label: 'Perú' },
      { value: 'mx', label: 'México (no disponible)', disabled: true },
      { value: 'co', label: 'Colombia' },
    ],
  },
};

export const Interactive: Story = {
  parameters: {
    docs: {
      source: {
        code: `const options = [
  { value: 'pe', label: 'Perú' },
  { value: 'mx', label: 'México' },
  { value: 'co', label: 'Colombia' },
];

const [value, setValue] = useState('');

<JCombobox
  options={options}
  value={value}
  placeholder="Seleccionar país..."
  onChange={(v) => setValue(v)}
/>`,
      },
    },
  },
  args: {
    onChange: fn(),
  },
  render: (args) => {
    const [value, setValue] = useState('');
    const selected = COUNTRIES.find((c) => c.value === value);
    return (
      <JPanel variant="ghost" padding="none" className="flex w-64 flex-col gap-3">
        <JCombobox
          options={COUNTRIES}
          value={value}
          placeholder="Seleccionar país..."
          onChange={(v, option) => { args.onChange?.(v, option); setValue(v); }}
        />
        <JLabel size="sm" color="muted">
          {selected ? `Seleccionado: ${selected.label}` : 'Ninguno seleccionado'}
        </JLabel>
      </JPanel>
    );
  },
};
