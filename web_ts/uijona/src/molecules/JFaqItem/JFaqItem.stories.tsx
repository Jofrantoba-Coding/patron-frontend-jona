import type { Meta, StoryObj } from '@storybook/react';
import { JFaqItem } from './JFaqItem';

const meta: Meta<typeof JFaqItem> = {
  title: 'Molecules/JFaqItem',
  component: JFaqItem,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof JFaqItem>;

export const Default: Story = {
  args: {
    question: '¿Cuánto tiempo tarda la implementación?',
    answer: 'Depende del alcance, pero la mayoría de los proyectos de diagnóstico se completan en 2-4 semanas.',
  },
};
