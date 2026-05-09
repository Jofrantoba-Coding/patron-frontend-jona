import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { SelectAtom } from './SelectAtom';

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
