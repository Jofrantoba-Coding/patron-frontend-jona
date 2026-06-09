import type { Meta, StoryObj } from '@storybook/react';
import { JSiteFooter } from './JSiteFooter';

const meta: Meta<typeof JSiteFooter> = {
  title: 'Organisms/JSiteFooter',
  component: JSiteFooter,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof JSiteFooter>;

export const Default: Story = {
  args: {
    copyright: `© ${new Date().getFullYear()} Develtrex. Todos los derechos reservados.`,
    links: [
      { label: '+51 929 913 524', href: 'tel:+51929913524' },
      { label: 'hola@develtrex.com', href: 'mailto:hola@develtrex.com' },
    ],
  },
};
