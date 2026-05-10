import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { StepperMolecule } from './StepperMolecule';

const steps = [
  { id: 'account', label: 'Account', description: 'Basic profile data' },
  { id: 'billing', label: 'Billing', description: 'Plan and payment' },
  { id: 'review', label: 'Review', description: 'Confirm details' },
];

const meta: Meta<typeof StepperMolecule> = {
  title: 'Molecules/StepperMolecule',
  component: StepperMolecule,
  tags: ['autodocs'],
  args: {
    steps,
    currentStep: 1,
    allowStepClick: true,
    onStepChange: fn(),
  },
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    allowStepClick: { control: 'boolean' },
    currentStep: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof StepperMolecule>;

export const Horizontal: Story = {};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
};
