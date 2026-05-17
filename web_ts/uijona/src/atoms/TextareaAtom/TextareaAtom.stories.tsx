import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { TextareaAtom } from './TextareaAtom';
import { JPanel } from '../JPanel/JPanel';
import { JLabel } from '../JLabel';

const meta: Meta<typeof TextareaAtom> = {
  title: 'Atoms/TextareaAtom',
  component: TextareaAtom,
  tags: ['autodocs'],
  args: { onChange: fn(), onBlur: fn(), onFocus: fn(), onKeyDown: fn() },
  argTypes: {
    hasError: { control: 'boolean' },
    autoResize: { control: 'boolean' },
    resize: {
      control: 'inline-radio',
      options: ['none', 'vertical', 'horizontal', 'both'],
    },
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
    resize: 'horizontal',
    defaultValue: 'Este textarea ajusta su altura al contenido.\nAgrega mas lineas para probar el comportamiento.',
  },
};

export const ResizableBoth: Story = {
  args: {
    resize: 'both',
    defaultValue: 'Puedes redimensionar este textarea en horizontal y vertical.',
  },
  render: (args) => (
    <JPanel variant="ghost" padding="none" className="w-80 max-w-full">
      <TextareaAtom {...args} />
    </JPanel>
  ),
};

export const Interactive: Story = {
  parameters: {
    docs: {
      source: {
        code: `const [value, setValue] = useState('');
const max = 200;

<TextareaAtom
  placeholder="Escribe tu mensaje..."
  value={value}
  autoResize
  hasError={value.length > max}
  onChange={(v) => setValue(v)}
/>`,
      },
    },
  },
  args: {
    onChange: fn(),
    onBlur: fn(),
    onFocus: fn(),
  },
  render: (args) => {
    const [value, setValue] = useState('');
    const max = 200;
    const over = value.length > max;
    return (
      <JPanel variant="ghost" padding="none" className="flex flex-col gap-1 w-80">
        <TextareaAtom
          placeholder="Escribe tu mensaje..."
          value={value}
          autoResize
          resize="horizontal"
          hasError={over}
          onChange={(v, e) => { args.onChange?.(v, e); setValue(v); }}
          onBlur={args.onBlur}
          onFocus={args.onFocus}
        />
        <JLabel size="xs" className={`text-right ${over ? 'text-red-500' : 'text-neutral-400'}`}>
          {value.length}/{max}
        </JLabel>
        {over && <JLabel size="xs" className="text-red-500">Has superado el límite de {max} caracteres</JLabel>}
      </JPanel>
    );
  },
};
