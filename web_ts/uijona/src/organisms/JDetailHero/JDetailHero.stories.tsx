import type { Meta, StoryObj } from '@storybook/react';
import { JDetailHero } from './JDetailHero';

const meta: Meta<typeof JDetailHero> = {
  title: 'Organisms/JDetailHero',
  component: JDetailHero,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof JDetailHero>;

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
