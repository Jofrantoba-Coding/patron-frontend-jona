import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { InputAtom } from './InputAtom';

const meta: Meta<typeof InputAtom> = {
  title: 'Atoms/InputAtom',
  component: InputAtom,
  tags: ['autodocs'],
  args: { onChange: fn(), onBlur: fn() },
  argTypes: {
    hasError: { control: 'boolean' },
    disabled: { control: 'boolean' },
    type:     { control: 'select', options: ['text', 'email', 'password', 'number'] },
  },
};
export default meta;
type Story = StoryObj<typeof InputAtom>;

export const Default: Story = {
  args: { placeholder: 'Escribe aquí...' },
};

export const WithError: Story = {
  args: { placeholder: 'Email inválido', hasError: true, defaultValue: 'usuario@' },
};

export const Password: Story = {
  args: { type: 'password', placeholder: 'Contraseña' },
};

export const Disabled: Story = {
  args: { placeholder: 'No editable', disabled: true, defaultValue: 'Valor fijo' },
};

export const WithValue: Story = {
  args: { defaultValue: 'usuario@ejemplo.com', type: 'email' },
};
