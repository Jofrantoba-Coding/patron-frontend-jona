import type { Meta, StoryObj } from '@storybook/react';
import { JContactMethods } from './JContactMethods';

const meta: Meta<typeof JContactMethods> = {
  title: 'Organisms/JContactMethods',
  component: JContactMethods,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof JContactMethods>;

export const Default: Story = {
  args: {
    methods: [
      {
        icon: '💬',
        label: 'WhatsApp',
        description: 'La forma más rápida. Respondemos en menos de 2 horas en horario laboral.',
        href: 'https://wa.me/51929913524',
        actionLabel: 'Abrir WhatsApp',
        isPrimary: true,
      },
      {
        icon: '📞',
        label: 'Teléfono',
        description: 'Llámanos directamente para una conversación inmediata.',
        href: 'tel:+51929913524',
        isPrimary: false,
      },
      {
        icon: '✉️',
        label: 'Email',
        description: 'Para consultas detalladas o documentación. Respondemos el mismo día.',
        href: 'mailto:hola@develtrex.com',
        isPrimary: false,
      },
    ],
  },
};
