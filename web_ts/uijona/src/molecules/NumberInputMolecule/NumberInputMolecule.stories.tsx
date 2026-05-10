import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { NumberInputMolecule } from './NumberInputMolecule';

const meta: Meta<typeof NumberInputMolecule> = {
  title: 'Molecules/NumberInputMolecule',
  component: NumberInputMolecule,
  tags: ['autodocs'],
  args: {
    defaultValue: 3,
    min: 0,
    max: 10,
    step: 1,
    onValueChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof NumberInputMolecule>;

export const Default: Story = {};

export const Error: Story = {
  args: {
    hasError: true,
    value: 12,
  },
};
