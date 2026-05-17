import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { InputAtom } from './InputAtom';
import { JPanel } from '../JPanel/JPanel';
import { TextAtom } from '../TextAtom/TextAtom';

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

export const Interactive: Story = {
  parameters: {
    docs: {
      source: {
        code: `const [value, setValue] = useState('');
const hasError = value.length > 0 && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value);

<InputAtom
  type="email"
  placeholder="correo@ejemplo.com"
  value={value}
  hasError={hasError}
  onChange={(v) => setValue(v)}
/>`,
      },
    },
  },
  args: {
    onChange: fn(),
    onBlur: fn(),
  },
  render: (args) => {
    const [value, setValue] = useState('');
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const hasError = value.length > 0 && !isValid;
    return (
      <JPanel variant="ghost" padding="none" className="flex flex-col gap-1 w-72">
        <InputAtom
          type="email"
          placeholder="correo@ejemplo.com"
          value={value}
          hasError={hasError}
          onChange={(v, e) => { args.onChange?.(v, e); setValue(v); }}
          onBlur={args.onBlur}
        />
        {hasError && <TextAtom size="xs" className="text-red-500">El formato de email no es válido</TextAtom>}
        {isValid && <TextAtom size="xs" className="text-green-600">Email válido</TextAtom>}
      </JPanel>
    );
  },
};
