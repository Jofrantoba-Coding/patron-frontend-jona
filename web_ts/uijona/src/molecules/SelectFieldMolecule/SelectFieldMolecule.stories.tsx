import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { SelectFieldMolecule } from './SelectFieldMolecule';

const options = [
  { value: 'mx', label: 'México' },
  { value: 'co', label: 'Colombia' },
  { value: 'ar', label: 'Argentina' },
  { value: 'pe', label: 'Perú' },
];

const meta: Meta<typeof SelectFieldMolecule> = {
  title: 'Molecules/SelectFieldMolecule',
  component: SelectFieldMolecule,
  tags: ['autodocs'],
  args: { onChange: fn() },
  argTypes: {
    required: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof SelectFieldMolecule>;

export const Default: Story = {
  args: { id: 'country', label: 'País', options, placeholder: 'Selecciona un país' },
  decorators: [(Story) => <div style={{ width: '320px' }}><Story /></div>],
};

export const Required: Story = {
  args: { id: 'country-req', label: 'País', options, required: true, placeholder: 'Selecciona un país' },
  decorators: [(Story) => <div style={{ width: '320px' }}><Story /></div>],
};

export const WithError: Story = {
  args: {
    id: 'country-err',
    label: 'País',
    options,
    errorMessage: 'Selecciona un país válido',
    placeholder: 'Selecciona un país',
  },
  decorators: [(Story) => <div style={{ width: '320px' }}><Story /></div>],
};

export const Interactive: Story = {
  args: {
    onChange: fn(),
  },
  render: (args) => {
    const [country, setCountry] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const error = submitted && !country ? 'Este campo es requerido' : undefined;
    return (
      <div className="flex flex-col gap-3" style={{ width: '320px' }}>
        <SelectFieldMolecule
          id="country-interactive"
          label="País de residencia"
          options={options}
          placeholder="Selecciona un país"
          required
          errorMessage={error}
          onChange={(v, e) => { args.onChange?.(v, e); setCountry(v); }}
        />
        <button
          onClick={() => setSubmitted(true)}
          style={{ borderRadius: '6px', background: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px', fontSize: '14px', cursor: 'pointer' }}
        >
          Confirmar
        </button>
        {submitted && country && (
          <p className="text-sm text-green-600">
            País guardado: <strong>{options.find((o) => o.value === country)?.label}</strong>
          </p>
        )}
      </div>
    );
  },
};
