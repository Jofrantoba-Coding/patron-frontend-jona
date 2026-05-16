import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { SalesCTAMolecule } from './SalesCTAMolecule';

const meta: Meta<typeof SalesCTAMolecule> = {
  title: 'Molecules/SalesCTAMolecule',
  component: SalesCTAMolecule,
  tags: ['autodocs'],
  args: { onPrimaryClick: fn(), onSecondaryClick: fn() },
  argTypes: {
    tone: { control: 'radio', options: ['brand', 'dark', 'light'] },
  },
};

export default meta;
type Story = StoryObj<typeof SalesCTAMolecule>;

export const Brand: Story = {
  args: {
    heading: '¿Listo para transformar tu tecnología?',
    description: 'Agendar un diagnóstico gratuito de 30 minutos. Sin compromisos.',
    primaryLabel: 'Agendar diagnóstico',
    primaryHref: '/contacto',
    secondaryLabel: 'Ver servicios',
    secondaryHref: '#servicios',
  },
};

export const Dark: Story = {
  args: {
    heading: 'Empieza hoy — sin riesgos',
    description: 'Diagnóstico gratuito de 30 minutos con uno de nuestros arquitectos.',
    primaryLabel: 'Agendar ahora',
    primaryHref: '/contacto',
    tone: 'dark',
  },
};

export const Light: Story = {
  args: {
    heading: '¿Tienes preguntas sobre nuestros productos?',
    primaryLabel: 'Contactar al equipo',
    primaryHref: '/contacto',
    secondaryLabel: 'Ver documentación',
    tone: 'light',
  },
};

export const WithCallback: Story = {
  args: {
    heading: '¿Listo para empezar?',
    description: 'Escríbenos y un especialista te contacta en menos de 2 horas.',
    primaryLabel: 'Escribir por WhatsApp',
    tone: 'brand',
  },
};
