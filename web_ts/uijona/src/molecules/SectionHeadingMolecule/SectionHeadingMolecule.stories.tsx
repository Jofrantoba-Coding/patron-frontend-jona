import type { Meta, StoryObj } from '@storybook/react';
import { SectionHeadingMolecule } from './SectionHeadingMolecule';

const meta: Meta<typeof SectionHeadingMolecule> = {
  title: 'Molecules/SectionHeadingMolecule',
  component: SectionHeadingMolecule,
  tags: ['autodocs'],
  argTypes: {
    align: { control: 'radio', options: ['left', 'center'] },
    tone: { control: 'radio', options: ['light', 'dark'] },
    eyebrowVariant: { control: 'radio', options: ['primary', 'white', 'muted'] },
  },
};

export default meta;
type Story = StoryObj<typeof SectionHeadingMolecule>;

export const Default: Story = {
  args: {
    eyebrow: 'Nuestros servicios',
    heading: 'Soluciones a medida para tu negocio',
    description:
      'Diseñamos, construimos y acompañamos cada etapa de tu transformación digital.',
  },
};

export const Centered: Story = {
  args: {
    eyebrow: 'Por qué elegirnos',
    heading: 'Más de 50 proyectos entregados',
    description: 'Empresas peruanas confían en Develtrex para sus sistemas críticos.',
    align: 'center',
  },
};

export const Dark: Story = {
  args: {
    eyebrow: 'Contacto',
    heading: '¿Listo para ordenar tu tecnología?',
    description: 'Conversemos 30 minutos. Sin costo, sin compromiso.',
    tone: 'dark',
    eyebrowVariant: 'white',
  },
  decorators: [(Story) => <div style={{ background: '#0f172a', padding: '32px' }}><Story /></div>],
};

export const NoEyebrow: Story = {
  args: {
    heading: 'Software diseñado para el mercado peruano',
    description: 'Productos listos para usar, adaptados al contexto legal y operativo local.',
  },
};
