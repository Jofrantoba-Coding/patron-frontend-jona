import type { Meta, StoryObj } from '@storybook/react';
import { FaqItemMolecule } from './FaqItemMolecule';

const meta: Meta<typeof FaqItemMolecule> = {
  title: 'Molecules/FaqItemMolecule',
  component: FaqItemMolecule,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FaqItemMolecule>;

export const Default: Story = {
  args: {
    question: '¿Cuánto tiempo tarda la implementación?',
    answer: 'Depende del alcance, pero la mayoría de los proyectos de diagnóstico se completan en 2-4 semanas.',
  },
};
