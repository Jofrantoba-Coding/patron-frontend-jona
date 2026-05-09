import type { Meta, StoryObj } from '@storybook/react';
import { AlertMolecule } from './AlertMolecule';

const meta: Meta<typeof AlertMolecule> = {
  title: 'Molecules/AlertMolecule',
  component: AlertMolecule,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: ['default', 'destructive'] },
    title:   { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof AlertMolecule>;

export const Default: Story = {
  args: {
    title: 'Información',
    children: 'Tu sesión expirará en 10 minutos.',
    style: { width: '400px' },
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    title: 'Error',
    children: 'No se pudo procesar tu solicitud. Intenta de nuevo.',
    style: { width: '400px' },
  },
};

export const WithoutTitle: Story = {
  args: {
    children: 'Mensaje informativo sin título.',
    style: { width: '400px' },
  },
};
