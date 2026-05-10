import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
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

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const max = 200;
    const over = value.length > max;
    return (
      <div className="flex flex-col gap-1 w-80">
        <TextareaAtom
          placeholder="Escribe tu mensaje..."
          value={value}
          autoResize
          hasError={over}
          onChange={(v) => setValue(v)}
        />
        <p className={`text-xs text-right ${over ? 'text-red-500' : 'text-neutral-400'}`}>
          {value.length}/{max}
        </p>
        {over && <p className="text-xs text-red-500">Has superado el límite de {max} caracteres</p>}
      </div>
    );
  },
};
