import type { Meta, StoryObj } from '@storybook/react';
import { JHeroDynamic } from './JHeroDynamic';

const meta: Meta<typeof JHeroDynamic> = {
  title: 'Organisms/JHeroDynamic',
  component: JHeroDynamic,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof JHeroDynamic>;

export const Default: Story = {
  args: {
    eyebrow: 'Desarrollo · Cloud · Seguridad · IA · Talento',
    titlePrefix: 'Construimos',
    rotatingWords: [
      'software a medida',
      'arquitectura cloud',
      'plataformas seguras',
      'IA aplicada',
      'equipos de talento',
    ],
    subtitle:
      'Un solo socio para toda tu pila tecnológica: desarrollo, arquitectura, seguridad, datos, IA e ingeniería de talento.',
    ctas: [
      { label: 'Ver servicios', href: '#servicios', variant: 'primary' },
      { label: 'Agendar diagnóstico', href: '/contacto', variant: 'outline' },
    ],
  },
};

export const SingleWord: Story = {
  args: {
    titlePrefix: 'Transformamos tu',
    rotatingWords: ['tecnología'],
    ctas: [{ label: 'Contactar', href: '/contacto', variant: 'primary' }],
  },
};
