import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { CheckboxFieldMolecule } from './CheckboxFieldMolecule';

const meta: Meta<typeof CheckboxFieldMolecule> = {
  title: 'Molecules/CheckboxFieldMolecule',
  component: CheckboxFieldMolecule,
  tags: ['autodocs'],
  args: { onCheckedChange: fn() },
  argTypes: {
    checked:  { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof CheckboxFieldMolecule>;

export const Default: Story = {
  args: { id: 'terms', label: 'Acepto los términos y condiciones' },
};

export const WithDescription: Story = {
  args: {
    id: 'newsletter',
    label: 'Suscribirse al boletín',
    description: 'Recibirás noticias y actualizaciones cada semana',
    checked: true,
  },
};

export const WithError: Story = {
  args: {
    id: 'terms-error',
    label: 'Acepto los términos',
    errorMessage: 'Debes aceptar los términos para continuar',
  },
};

export const Disabled: Story = {
  args: { id: 'disabled', label: 'Opción deshabilitada', disabled: true },
};
