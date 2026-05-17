import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JCheckBox } from './JCheckBox';
import { JPanel } from '../JPanel/JPanel';
import { JLabel } from '../JLabel';

const meta: Meta<typeof JCheckBox> = {
  title: 'Atoms/JCheckBox',
  component: JCheckBox,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { onCheckedChange: fn() },
  argTypes: {
    checked:       { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    hasError:      { control: 'boolean' },
    disabled:      { control: 'boolean' },
    size:          { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};
export default meta;
type Story = StoryObj<typeof JCheckBox>;

export const Default: Story = {};

export const Checked: Story = {
  args: { checked: true },
};

export const Indeterminate: Story = {
  args: { indeterminate: true },
};

export const WithError: Story = {
  args: { hasError: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledChecked: Story = {
  args: { disabled: true, checked: true },
};

export const Sizes: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" className="flex items-center gap-4">
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <JPanel key={s} variant="ghost" padding="none" className="flex flex-col items-center gap-1">
          <JCheckBox size={s} defaultChecked />
          <JLabel size="xs" color="muted">{s}</JLabel>
        </JPanel>
      ))}
    </JPanel>
  ),
};

export const AllStates: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" className="flex flex-col gap-3">
      {[
        { label: 'Sin seleccionar',         props: {} },
        { label: 'Seleccionado',            props: { checked: true } },
        { label: 'Indeterminado',           props: { indeterminate: true } },
        { label: 'Con error',               props: { hasError: true } },
        { label: 'Deshabilitado',           props: { disabled: true } },
        { label: 'Deshabilitado + checked', props: { disabled: true, checked: true } },
      ].map(({ label, props }) => (
        <JPanel key={label} variant="ghost" padding="none" className="flex items-center gap-2">
          <JCheckBox {...props} />
          <JLabel as="span" size="sm">{label}</JLabel>
        </JPanel>
      ))}
    </JPanel>
  ),
};

export const Interactive: Story = {
  parameters: {
    docs: {
      source: {
        code: `const [checked, setChecked] = useState(false);

<JCheckBox
  checked={checked}
  onCheckedChange={(v) => setChecked(v)}
/>`,
      },
    },
  },
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <JPanel variant="ghost" padding="none" className="flex items-center gap-2">
        <JCheckBox
          checked={checked}
          onCheckedChange={(v, e) => { args.onCheckedChange?.(v, e); setChecked(v); }}
        />
        <JLabel as="span" size="sm" className="text-neutral-600">
          {checked ? 'Seleccionado' : 'Sin seleccionar'}
        </JLabel>
      </JPanel>
    );
  },
};
