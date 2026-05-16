import type { Meta, StoryObj } from '@storybook/react';
import { ContactMethodCardMolecule } from './ContactMethodCardMolecule';

const meta: Meta<typeof ContactMethodCardMolecule> = {
  title: 'Molecules/ContactMethodCardMolecule',
  component: ContactMethodCardMolecule,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ContactMethodCardMolecule>;

export const Default: Story = {
  args: {
    icon: '💬',
    label: 'WhatsApp',
    description: 'La forma más rápida. Respondemos en menos de 2 horas en horario laboral.',
    href: 'https://wa.me/51929913524',
    actionLabel: 'Abrir WhatsApp',
    isPrimary: true,
  },
};

export const Secondary: Story = {
  args: {
    icon: '✉️',
    label: 'Email',
    description: 'Para consultas detalladas o documentación. Respondemos el mismo día.',
    href: 'mailto:hola@develtrex.com',
    isPrimary: false,
  },
};
