import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { RadioGroupMolecule } from './RadioGroupMolecule';

const options = [
  { value: 'basic', label: 'Basic', description: 'Para formularios simples y prototipos.' },
  { value: 'pro', label: 'Pro', description: 'Para aplicaciones con flujos frecuentes.' },
  { value: 'enterprise', label: 'Enterprise', description: 'Gobernanza, soporte y auditoria.' },
];

const meta: Meta<typeof RadioGroupMolecule> = {
  title: 'Molecules/RadioGroupMolecule',
  component: RadioGroupMolecule,
  tags: ['autodocs'],
  args: { name: 'plan', options, onValueChange: fn() },
  argTypes: {
    orientation: { control: 'select', options: ['vertical', 'horizontal'] },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof RadioGroupMolecule>;

export const Default: Story = {
  args: {
    label: 'Plan',
    description: 'Selecciona el plan inicial.',
    defaultValue: 'pro',
  },
};

export const Horizontal: Story = {
  args: {
    label: 'Prioridad',
    name: 'priority',
    orientation: 'horizontal',
    defaultValue: 'basic',
    options: [
      { value: 'low', label: 'Baja' },
      { value: 'medium', label: 'Media' },
      { value: 'high', label: 'Alta' },
    ],
  },
};

export const WithError: Story = {
  args: {
    label: 'Plan',
    errorMessage: 'Selecciona una opcion para continuar.',
  },
};

export const DisabledOption: Story = {
  args: {
    label: 'Plan',
    defaultValue: 'basic',
    options: [
      ...options,
      { value: 'custom', label: 'Custom', description: 'Disponible bajo contrato.', disabled: true },
    ],
  },
};
