import type { Meta, StoryObj } from '@storybook/react';
import { DetailHeroOrganism } from './DetailHeroOrganism';

const meta: Meta<typeof DetailHeroOrganism> = {
  title: 'Organisms/DetailHeroOrganism',
  component: DetailHeroOrganism,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DetailHeroOrganism>;

export const Default: Story = {
  args: {
    backHref: '/',
    backLabel: '← Todos los servicios',
    eyebrow: 'Cloud & Arquitectura',
    title: 'Arquitectura Cloud Resiliente',
    outcome: 'Diseña sistemas que no fallan cuando más los necesitas.',
    primaryHref: 'https://wa.me/51929913524',
    primaryLabel: 'Solicitar información',
    secondaryHref: 'mailto:hola@develtrex.com',
    secondaryLabel: 'Escribirnos',
  },
};
