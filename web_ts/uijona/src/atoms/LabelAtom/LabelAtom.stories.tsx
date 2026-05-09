import type { Meta, StoryObj } from '@storybook/react';
import { LabelAtom } from './LabelAtom';

const meta: Meta<typeof LabelAtom> = {
  title: 'Atoms/LabelAtom',
  component: LabelAtom,
  tags: ['autodocs'],
  argTypes: {
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof LabelAtom>;

export const Default: Story = {
  args: { children: 'Correo electrónico' },
};

export const Required: Story = {
  args: { children: 'Nombre completo', required: true },
};

export const Disabled: Story = {
  args: { children: 'Campo deshabilitado', disabled: true },
};
