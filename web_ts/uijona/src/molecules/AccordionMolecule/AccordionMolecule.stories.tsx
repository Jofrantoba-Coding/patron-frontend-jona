import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { AccordionMolecule } from './AccordionMolecule';

const items = [
  {
    value: 'architecture',
    title: 'Arquitectura JONA',
    content: 'Separa contrato, implementacion, vista y template para mantener responsabilidades claras.',
  },
  {
    value: 'events',
    title: 'Eventos Observer',
    content: 'Los componentes interactivos exponen callbacks con datos normalizados y el evento original.',
  },
  {
    value: 'delivery',
    title: 'Entrega app-ready',
    content: 'Incluye exports publicos, stories, tests y build verificable.',
  },
];

const meta: Meta<typeof AccordionMolecule> = {
  title: 'Molecules/AccordionMolecule',
  component: AccordionMolecule,
  tags: ['autodocs'],
  args: { items, onValueChange: fn() },
  argTypes: {
    multiple: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof AccordionMolecule>;

export const Default: Story = {
  args: {
    defaultValue: 'architecture',
  },
};

export const Multiple: Story = {
  args: {
    multiple: true,
    defaultValue: ['architecture', 'events'],
  },
};

export const WithDisabledItem: Story = {
  args: {
    items: [
      ...items,
      {
        value: 'disabled',
        title: 'Seccion bloqueada',
        content: 'Este contenido no deberia abrirse.',
        disabled: true,
      },
    ],
  },
};
