import type { Meta, StoryObj } from '@storybook/react';
import { JNumberedStep } from './JNumberedStep';

const meta: Meta<typeof JNumberedStep> = {
  title: 'Molecules/JNumberedStep',
  component: JNumberedStep,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof JNumberedStep>;

export const Default: Story = {
  args: {
    num: '01',
    title: 'Cuéntanos tu situación',
    body: 'En 30 minutos nos describes tu contexto, los problemas que enfrentas y tus objetivos de negocio.',
  },
};
