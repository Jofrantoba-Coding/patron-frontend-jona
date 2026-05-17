import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JTextArea } from './JTextArea';
import { JPanel } from '../JPanel/JPanel';
import { JLabel } from '../JLabel';

const meta: Meta<typeof JTextArea> = {
  title: 'Atoms/JTextArea',
  component: JTextArea,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { onChange: fn(), onBlur: fn(), onFocus: fn(), onKeyDown: fn() },
  argTypes: {
    size:       { control: 'select', options: ['sm', 'md', 'lg'] },
    variant:    { control: 'select', options: ['default', 'filled'] },
    resize:     { control: 'inline-radio', options: ['none', 'vertical', 'horizontal', 'both'] },
    hasError:   { control: 'boolean' },
    autoResize: { control: 'boolean' },
    disabled:   { control: 'boolean' },
    placeholder:{ control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof JTextArea>;

export const Default: Story = {
  args: { placeholder: 'Describe el caso de uso' },
};

export const WithValue: Story = {
  args: { defaultValue: 'Texto inicial para revisar el alto, el foco y los estados del campo.' },
};

export const WithError: Story = {
  args: { hasError: true, defaultValue: 'Contenido con error' },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Campo deshabilitado' },
};

export const Variants: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" className="flex flex-col gap-3 w-72">
      {(['default', 'filled'] as const).map((v) => (
        <JPanel key={v} variant="ghost" padding="none" className="flex flex-col gap-1">
          <JLabel size="xs" color="muted">{v}</JLabel>
          <JTextArea variant={v} placeholder={`Variante ${v}`} />
        </JPanel>
      ))}
    </JPanel>
  ),
};

export const Sizes: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" className="flex flex-col gap-3 w-72">
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <JPanel key={s} variant="ghost" padding="none" className="flex flex-col gap-1">
          <JLabel size="xs" color="muted">{s}</JLabel>
          <JTextArea size={s} placeholder={`Tamaño ${s}`} />
        </JPanel>
      ))}
    </JPanel>
  ),
};

export const AutoResize: Story = {
  args: {
    autoResize: true,
    resize: 'none',
    defaultValue: 'Este textarea ajusta su altura al contenido.\nAgrega más líneas para probar el comportamiento.',
  },
};

export const ResizeModes: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" className="flex flex-col gap-3 w-72">
      {(['none', 'vertical', 'horizontal', 'both'] as const).map((r) => (
        <JPanel key={r} variant="ghost" padding="none" className="flex flex-col gap-1">
          <JLabel size="xs" color="muted">resize: {r}</JLabel>
          <JTextArea resize={r} defaultValue={`resize="${r}"`} rows={2} />
        </JPanel>
      ))}
    </JPanel>
  ),
};

export const Interactive: Story = {
  parameters: {
    docs: {
      source: {
        code: `const [value, setValue] = useState('');
const max = 200;

<JTextArea
  placeholder="Escribe tu mensaje..."
  value={value}
  autoResize
  hasError={value.length > max}
  onChange={(v) => setValue(v)}
/>`,
      },
    },
  },
  render: (args) => {
    const [value, setValue] = useState('');
    const max = 200;
    const over = value.length > max;
    return (
      <JPanel variant="ghost" padding="none" className="flex flex-col gap-1 w-80">
        <JTextArea
          placeholder="Escribe tu mensaje..."
          value={value}
          autoResize
          resize="none"
          hasError={over}
          onChange={(v, e) => { args.onChange?.(v, e); setValue(v); }}
          onBlur={args.onBlur}
          onFocus={args.onFocus}
        />
        <JLabel size="xs" className={`text-right ${over ? 'text-danger-500' : 'text-neutral-400'}`}>
          {value.length}/{max}
        </JLabel>
        {over && <JLabel size="xs" color="danger">Has superado el límite de {max} caracteres</JLabel>}
      </JPanel>
    );
  },
};
