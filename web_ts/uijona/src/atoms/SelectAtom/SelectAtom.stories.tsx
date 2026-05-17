import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { SelectAtom } from './SelectAtom';
import { JPanel } from '../JPanel/JPanel';
import { JLabel } from '../JLabel';

const options = [
  { value: 'mx', label: 'México' },
  { value: 'co', label: 'Colombia' },
  { value: 'ar', label: 'Argentina' },
  { value: 'pe', label: 'Perú' },
];

const groups = [
  { label: 'América del Norte', options: [{ value: 'mx', label: 'México' }, { value: 'us', label: 'Estados Unidos' }] },
  { label: 'América del Sur', options: [{ value: 'co', label: 'Colombia' }, { value: 'ar', label: 'Argentina' }] },
];

const meta: Meta<typeof SelectAtom> = {
  title: 'Atoms/SelectAtom',
  component: SelectAtom,
  tags: ['autodocs'],
  args: { onChange: fn() },
  argTypes: {
    hasError: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof SelectAtom>;

export const Default: Story = {
  args: { options, placeholder: 'Selecciona un país' },
};

export const WithGroups: Story = {
  args: { groups, placeholder: 'Selecciona un país' },
};

export const WithError: Story = {
  args: { options, hasError: true, placeholder: 'Campo requerido' },
};

export const Interactive: Story = {
  parameters: {
    docs: {
      source: {
        code: `const options = [
  { value: 'mx', label: 'México' },
  { value: 'co', label: 'Colombia' },
  { value: 'ar', label: 'Argentina' },
];

const [country, setCountry] = useState('');

<SelectAtom
  options={options}
  placeholder="Selecciona un país"
  onChange={(v) => setCountry(v)}
/>`,
      },
    },
  },
  args: {
    onChange: fn(),
  },
  render: (args) => {
    const [country, setCountry] = useState('');
    return (
      <JPanel variant="ghost" padding="none" className="flex flex-col gap-2 w-64">
        <SelectAtom
          options={options}
          placeholder="Selecciona un país"
          onChange={(v, e) => { args.onChange?.(v, e); setCountry(v); }}
        />
        {country && (
          <JLabel size="sm" className="text-neutral-600">
            País seleccionado: <strong>{options.find((o) => o.value === country)?.label}</strong>
          </JLabel>
        )}
      </JPanel>
    );
  },
};
