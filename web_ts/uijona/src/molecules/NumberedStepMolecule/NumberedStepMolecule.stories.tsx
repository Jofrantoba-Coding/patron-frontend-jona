import type { Meta, StoryObj } from '@storybook/react';
import { NumberedStepMolecule } from './NumberedStepMolecule';

const meta: Meta<typeof NumberedStepMolecule> = {
  title: 'Molecules/NumberedStepMolecule',
  component: NumberedStepMolecule,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NumberedStepMolecule>;

export const Default: Story = {
  args: {
    num: '01',
    title: 'Cuéntanos tu situación',
    body: 'En 30 minutos nos describes tu contexto, los problemas que enfrentas y tus objetivos de negocio.',
  },
};
