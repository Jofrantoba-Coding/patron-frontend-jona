import type { Meta, StoryObj } from '@storybook/react';
import { SectionHeadingMolecule } from './SectionHeadingMolecule';

const meta: Meta<typeof SectionHeadingMolecule> = {
  title: 'Molecules/SectionHeadingMolecule',
  component: SectionHeadingMolecule,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SectionHeadingMolecule>;

export const Default: Story = {
  args: {
    eyebrow: 'Nuestros servicios',
    heading: 'Soluciones a medida para tu negocio',
    description: 'Diseñamos, construimos y acompañamos cada etapa de tu transformación digital.',
  },
};

export const SinEyebrow: Story = {
  args: {
    heading: 'Software diseñado para el mercado peruano',
    description: 'Productos listos para usar, adaptados al contexto legal y operativo local.',
  },
};

export const SoloTitulo: Story = {
  args: { heading: 'Por qué Develtrex' },
};
