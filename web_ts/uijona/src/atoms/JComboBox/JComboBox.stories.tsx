import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JComboBox } from './JComboBox';
import { JPanel } from '../JPanel/JPanel';
import { JLabel } from '../JLabel';

const options = [
  { value: 'mx', label: 'México' },
  { value: 'co', label: 'Colombia' },
  { value: 'ar', label: 'Argentina' },
  { value: 'pe', label: 'Perú' },
  { value: 'cl', label: 'Chile', disabled: true },
];

const groups = [
  {
    label: 'América del Norte',
    options: [
      { value: 'mx', label: 'México' },
      { value: 'us', label: 'Estados Unidos' },
      { value: 'ca', label: 'Canadá' },
    ],
  },
  {
    label: 'América del Sur',
    options: [
      { value: 'co', label: 'Colombia' },
      { value: 'ar', label: 'Argentina' },
      { value: 'pe', label: 'Perú' },
    ],
  },
];

const meta: Meta<typeof JComboBox> = {
  title: 'Atoms/JComboBox',
  component: JComboBox,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { onChange: fn(), onBlur: fn() },
  argTypes: {
    size:     { control: 'select', options: ['sm', 'md', 'lg'] },
    variant:  { control: 'select', options: ['default', 'filled'] },
    hasError: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof JComboBox>;

export const Default: Story = {
  args: { options, placeholder: 'Selecciona un país' },
};

export const WithGroups: Story = {
  args: { groups, placeholder: 'Selecciona un país' },
};

export const WithError: Story = {
  args: { options, hasError: true, placeholder: 'Campo requerido' },
};

export const Disabled: Story = {
  args: { options, disabled: true, placeholder: 'Deshabilitado' },
};

export const Variants: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" className="flex flex-col gap-3 w-64">
      {(['default', 'filled'] as const).map((v) => (
        <JPanel key={v} variant="ghost" padding="none" className="flex flex-col gap-1">
          <JLabel size="xs" color="muted">{v}</JLabel>
          <JComboBox options={options} variant={v} placeholder={`Variante ${v}`} />
        </JPanel>
      ))}
    </JPanel>
  ),
};

export const Sizes: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" className="flex flex-col gap-3 w-64">
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <JPanel key={s} variant="ghost" padding="none" className="flex flex-col gap-1">
          <JLabel size="xs" color="muted">{s}</JLabel>
          <JComboBox options={options} size={s} placeholder={`Tamaño ${s}`} />
        </JPanel>
      ))}
    </JPanel>
  ),
};

export const WithDisabledOption: Story = {
  args: { options, placeholder: 'Chile está deshabilitado' },
};

export const Interactive: Story = {
  parameters: {
    docs: {
      source: {
        code: `const [country, setCountry] = useState('');

<JComboBox
  options={options}
  placeholder="Selecciona un país"
  onChange={(v) => setCountry(v)}
/>`,
      },
    },
  },
  render: (args) => {
    const [country, setCountry] = useState('');
    return (
      <JPanel variant="ghost" padding="none" className="flex flex-col gap-2 w-64">
        <JComboBox
          options={options}
          placeholder="Selecciona un país"
          onChange={(v, e) => { args.onChange?.(v, e); setCountry(v); }}
        />
        {country && (
          <JLabel size="sm" className="text-neutral-600">
            País: <strong>{options.find((o) => o.value === country)?.label}</strong>
          </JLabel>
        )}
      </JPanel>
    );
  },
};
