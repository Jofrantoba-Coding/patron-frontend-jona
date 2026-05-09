import type { Meta, StoryObj } from '@storybook/react';
import { ErrorMessageAtom } from './ErrorMessageAtom';

const meta: Meta<typeof ErrorMessageAtom> = {
  title: 'Atoms/ErrorMessageAtom',
  component: ErrorMessageAtom,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'radio', options: ['error', 'description'] },
  },
};
export default meta;
type Story = StoryObj<typeof ErrorMessageAtom>;

export const Error: Story = {
  args: { message: 'El email no es válido', type: 'error' },
};

export const Description: Story = {
  args: { message: 'Mínimo 8 caracteres con letras y números', type: 'description' },
};

export const Empty: Story = {
  args: { message: '' },
};
