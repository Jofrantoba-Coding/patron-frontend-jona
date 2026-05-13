import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { SelectFieldMolecule } from './SelectFieldMolecule';
import { ButtonAtom } from '../../atoms/ButtonAtom/ButtonAtom';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { TextAtom } from '../../atoms/TextAtom/TextAtom';

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
  decorators: [(Story) => <PanelAtom variant="ghost" padding="none" style={{ width: '320px' }}><Story /></PanelAtom>],
};

export const Required: Story = {
  args: { id: 'country-req', label: 'País', options, required: true, placeholder: 'Selecciona un país' },
  decorators: [(Story) => <PanelAtom variant="ghost" padding="none" style={{ width: '320px' }}><Story /></PanelAtom>],
};

export const WithError: Story = {
  args: {
    id: 'country-err',
    label: 'País',
    options,
    errorMessage: 'Selecciona un país válido',
    placeholder: 'Selecciona un país',
  },
  decorators: [(Story) => <PanelAtom variant="ghost" padding="none" style={{ width: '320px' }}><Story /></PanelAtom>],
};

export const Interactive: Story = {
  parameters: {
    docs: {
      source: {
        code: `const options = [
  { value: 'mx', label: 'México' },
  { value: 'co', label: 'Colombia' },
  { value: 'pe', label: 'Perú' },
];

const [country, setCountry] = useState('');

<SelectFieldMolecule
  id="country"
  label="País de residencia"
  options={options}
  placeholder="Selecciona un país"
  required
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
    const [submitted, setSubmitted] = useState(false);
    const error = submitted && !country ? 'Este campo es requerido' : undefined;
    return (
      <PanelAtom variant="ghost" padding="none" className="flex flex-col gap-3" style={{ width: '320px' }}>
        <SelectFieldMolecule
          id="country-interactive"
          label="País de residencia"
          options={options}
          placeholder="Selecciona un país"
          required
          errorMessage={error}
          onChange={(v, e) => { args.onChange?.(v, e); setCountry(v); }}
        />
        <ButtonAtom onClick={() => setSubmitted(true)}>
          Confirmar
        </ButtonAtom>
        {submitted && country && (
          <TextAtom size="sm" className="text-green-600">
            País guardado: <strong>{options.find((o) => o.value === country)?.label}</strong>
          </TextAtom>
        )}
      </PanelAtom>
    );
  },
};
