import type { Meta, StoryObj } from '@storybook/react';
import { SiteFooterOrganism } from './SiteFooterOrganism';

const meta: Meta<typeof SiteFooterOrganism> = {
  title: 'Organisms/SiteFooterOrganism',
  component: SiteFooterOrganism,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SiteFooterOrganism>;

export const Default: Story = {
  args: {
    copyright: `© ${new Date().getFullYear()} Develtrex. Todos los derechos reservados.`,
    links: [
      { label: '+51 929 913 524', href: 'tel:+51929913524' },
      { label: 'hola@develtrex.com', href: 'mailto:hola@develtrex.com' },
    ],
  },
};
