import type { Meta, StoryObj } from '@storybook/react';
import { BenefitItemMolecule } from './BenefitItemMolecule';

const meta: Meta<typeof BenefitItemMolecule> = {
  title: 'Molecules/BenefitItemMolecule',
  component: BenefitItemMolecule,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BenefitItemMolecule>;

export const Default: Story = {
  args: {
    text: 'Reducción del tiempo de resolución de incidentes en un 40%.',
  },
};
