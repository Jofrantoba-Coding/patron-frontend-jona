import type { Meta, StoryObj } from '@storybook/react';
import { MarketingHeroOrganism } from './MarketingHeroOrganism';

const meta: Meta<typeof MarketingHeroOrganism> = {
  title: 'Organisms/MarketingHeroOrganism',
  component: MarketingHeroOrganism,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof MarketingHeroOrganism>;

export const Default: Story = {
  args: {
    eyebrow: 'Desarrollo · Cloud · Datos · Automatización',
    title: 'De la app al cloud, del dato a la decisión',
    subtitle: 'Un solo equipo para toda tu pila tecnológica. Desarrollamos apps, gestionamos infraestructura cloud e integramos sistemas.',
    ctas: [
      { label: 'Ver servicios', href: '#servicios', variant: 'primary' },
      { label: 'Agendar diagnóstico', href: '/contacto', variant: 'outline' },
    ],
  },
};

export const Minimal: Story = {
  args: {
    title: 'Transforma tu tecnología',
    ctas: [{ label: 'Contactar', href: '/contacto', variant: 'primary' }],
  },
};
