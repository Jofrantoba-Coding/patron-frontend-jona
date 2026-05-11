import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { ComboboxMolecule } from './ComboboxMolecule';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';

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

const meta: Meta<typeof ComboboxMolecule> = {
  title: 'Molecules/ComboboxMolecule',
  component: ComboboxMolecule,
  tags: ['autodocs'],
  args: {
    options: COUNTRIES,
    onChange: fn(),
    onSearchChange: fn(),
    placeholder: 'Seleccionar país...',
  },
  decorators: [(Story) => <PanelAtom variant="ghost" padding="none" className="w-64"><Story /></PanelAtom>],
};
export default meta;
type Story = StoryObj<typeof ComboboxMolecule>;

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
  args: {
    onChange: fn(),
  },
  render: (args) => {
    const [value, setValue] = useState('');
    const selected = COUNTRIES.find((c) => c.value === value);
    return (
      <PanelAtom variant="ghost" padding="none" className="flex w-64 flex-col gap-3">
        <ComboboxMolecule
          options={COUNTRIES}
          value={value}
          placeholder="Seleccionar país..."
          onChange={(v, option) => { args.onChange?.(v, option); setValue(v); }}
        />
        <p className="text-sm text-neutral-500">
          {selected ? `Seleccionado: ${selected.label}` : 'Ninguno seleccionado'}
        </p>
      </PanelAtom>
    );
  },
};
