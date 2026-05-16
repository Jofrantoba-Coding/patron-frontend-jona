import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { MarketingCTAOrganism } from './MarketingCTAOrganism';

const meta: Meta<typeof MarketingCTAOrganism> = {
  title: 'Organisms/MarketingCTAOrganism',
  component: MarketingCTAOrganism,
  tags: ['autodocs'],
  args: { onPrimaryClick: fn() },
};

export default meta;
type Story = StoryObj<typeof MarketingCTAOrganism>;

export const Default: Story = {
  args: {
    heading: 'Ordena tu tecnología antes de que el caos frene tu crecimiento.',
    description: '30 minutos son suficientes para identificar tus principales brechas, riesgos y la primera ruta de acción concreta.',
    primaryLabel: 'Diagnóstico gratuito',
    primaryHref: 'https://wa.me/51929913524',
  },
};

export const ConSecundario: Story = {
  args: {
    heading: '¿Listo para transformar tu tecnología?',
    description: 'Sin compromisos. Sin costo. Solo 30 minutos.',
    primaryLabel: 'Agendar diagnóstico',
    primaryHref: '/contacto',
    secondaryLabel: 'Ver servicios',
    secondaryHref: '#servicios',
  },
};
