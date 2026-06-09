import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JSelectField } from './JSelectField';
import { JButton } from '../../atoms/JButton/JButton';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';

const options = [
  { value: 'mx', label: 'México' },
  { value: 'co', label: 'Colombia' },
  { value: 'ar', label: 'Argentina' },
  { value: 'pe', label: 'Perú' },
];

const meta: Meta<typeof JSelectField> = {
  title: 'Molecules/JSelectField',
  component: JSelectField,
  tags: ['autodocs'],
  args: { onChange: fn() },
  argTypes: {
    required: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof JSelectField>;

export const Default: Story = {
  args: { id: 'country', label: 'País', options, placeholder: 'Selecciona un país' },
  decorators: [(Story) => <JPanel variant="ghost" padding="none" style={{ width: '320px' }}><Story /></JPanel>],
};

export const Required: Story = {
  args: { id: 'country-req', label: 'País', options, required: true, placeholder: 'Selecciona un país' },
  decorators: [(Story) => <JPanel variant="ghost" padding="none" style={{ width: '320px' }}><Story /></JPanel>],
};

export const WithError: Story = {
  args: {
    id: 'country-err',
    label: 'País',
    options,
    errorMessage: 'Selecciona un país válido',
    placeholder: 'Selecciona un país',
  },
  decorators: [(Story) => <JPanel variant="ghost" padding="none" style={{ width: '320px' }}><Story /></JPanel>],
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

<JSelectField
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
      <JPanel variant="ghost" padding="none" className="flex flex-col gap-3" style={{ width: '320px' }}>
        <JSelectField
          id="country-interactive"
          label="País de residencia"
          options={options}
          placeholder="Selecciona un país"
          required
          errorMessage={error}
          onChange={(v, e) => { args.onChange?.(v, e); setCountry(v); }}
        />
        <JButton onClick={() => setSubmitted(true)}>
          Confirmar
        </JButton>
        {submitted && country && (
          <JLabel size="sm" className="text-green-600">
            País guardado: <strong>{options.find((o) => o.value === country)?.label}</strong>
          </JLabel>
        )}
      </JPanel>
    );
  },
};
