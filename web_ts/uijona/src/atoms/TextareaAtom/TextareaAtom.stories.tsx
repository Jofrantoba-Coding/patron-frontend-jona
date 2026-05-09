import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TextareaAtom } from './TextareaAtom';

const meta: Meta<typeof TextareaAtom> = {
  title: 'Atoms/TextareaAtom',
  component: TextareaAtom,
  tags: ['autodocs'],
  args: { onChange: fn(), onBlur: fn(), onFocus: fn(), onKeyDown: fn() },
  argTypes: {
    hasError: { control: 'boolean' },
    autoResize: { control: 'boolean' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof TextareaAtom>;

export const Default: Story = {
  args: {
    placeholder: 'Describe el caso de uso',
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: 'Texto inicial para revisar el alto, el foco y los estados del campo.',
  },
};

export const Error: Story = {
  args: {
    hasError: true,
    defaultValue: 'Contenido con error',
  },
};

export const AutoResize: Story = {
  args: {
    autoResize: true,
    defaultValue: 'Este textarea ajusta su altura al contenido.\nAgrega mas lineas para probar el comportamiento.',
  },
};
