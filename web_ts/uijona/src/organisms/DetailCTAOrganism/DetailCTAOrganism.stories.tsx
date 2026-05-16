import type { Meta, StoryObj } from '@storybook/react';
import { DetailCTAOrganism } from './DetailCTAOrganism';

const meta: Meta<typeof DetailCTAOrganism> = {
  title: 'Organisms/DetailCTAOrganism',
  component: DetailCTAOrganism,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DetailCTAOrganism>;

export const Default: Story = {
  args: {
    title: '¿Te interesa este servicio?',
    body: 'Conversemos sobre tu caso específico. Una sesión de 30 minutos es suficiente para saber si podemos ayudarte y cómo.',
    primaryHref: 'https://wa.me/51929913524',
    primaryLabel: 'Agendar por WhatsApp',
    secondaryHref: 'mailto:hola@develtrex.com',
    secondaryLabel: 'hola@develtrex.com',
  },
};
