import type { Meta, StoryObj } from '@storybook/react';
import { FooterPageOrganism } from './FooterPageOrganism';

const meta: Meta<typeof FooterPageOrganism> = {
  title: 'Organisms/FooterPageOrganism',
  component: FooterPageOrganism,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof FooterPageOrganism>;

export const Default: Story = {
  args: { text: '© 2026 JONA UI — Todos los derechos reservados' },
};

export const WithSlots: Story = {
  args: {
    left:   <span style={{ fontWeight: 'bold' }}>JONA UI</span>,
    center: (
      <nav style={{ display: 'flex', gap: '16px' }}>
        <a href="#">Términos</a>
        <a href="#">Privacidad</a>
        <a href="#">Contacto</a>
      </nav>
    ),
    right: <span>v1.2.5</span>,
  },
};
