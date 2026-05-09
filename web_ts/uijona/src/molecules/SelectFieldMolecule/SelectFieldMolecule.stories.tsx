import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
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
