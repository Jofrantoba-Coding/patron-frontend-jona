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
    label:         { control: 'text' },
    labelPosition: { control: 'select', options: ['right', 'left', 'top', 'bottom'] },
  },
};
export default meta;
type Story = StoryObj<typeof JCheckBox>;

export const Default: Story = {};

export const Checked: Story = {
  args: { checked: true },
};

export const WithLabelRight: Story = {
  args: { label: 'Acepto los términos', labelPosition: 'right' },
};

export const WithLabelLeft: Story = {
  args: { label: 'Acepto los términos', labelPosition: 'left' },
};

export const WithLabelTop: Story = {
  args: { label: 'Notificaciones', labelPosition: 'top' },
};

export const WithLabelBottom: Story = {
  args: { label: 'Notificaciones', labelPosition: 'bottom' },
};

export const LabelPositions: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" className="grid grid-cols-2 gap-8 p-4">
      <JPanel variant="ghost" padding="none" className="flex flex-col items-center gap-1">
        <JLabel size="xs" color="muted">right (default)</JLabel>
        <JCheckBox label="Opción A" labelPosition="right" />
      </JPanel>
      <JPanel variant="ghost" padding="none" className="flex flex-col items-center gap-1">
        <JLabel size="xs" color="muted">left</JLabel>
        <JCheckBox label="Opción B" labelPosition="left" />
      </JPanel>
      <JPanel variant="ghost" padding="none" className="flex flex-col items-center gap-1">
        <JLabel size="xs" color="muted">top</JLabel>
        <JCheckBox label="Opción C" labelPosition="top" />
      </JPanel>
      <JPanel variant="ghost" padding="none" className="flex flex-col items-center gap-1">
        <JLabel size="xs" color="muted">bottom</JLabel>
        <JCheckBox label="Opción D" labelPosition="bottom" />
      </JPanel>
    </JPanel>
  ),
};

export const Indeterminate: Story = {
  args: { indeterminate: true },
};

export const WithError: Story = {
  args: { hasError: true, label: 'Campo requerido', labelPosition: 'right' },
};

export const Disabled: Story = {
  args: { disabled: true, label: 'No disponible', labelPosition: 'right' },
};

export const DisabledChecked: Story = {
  args: { disabled: true, checked: true, label: 'Bloqueado', labelPosition: 'right' },
};

export const Sizes: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" className="flex items-center gap-6">
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <JCheckBox key={s} size={s} label={s} labelPosition="bottom" defaultChecked />
      ))}
    </JPanel>
  ),
};

export const AllStates: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" className="flex flex-col gap-3">
      {[
        { label: 'Sin seleccionar',          props: {} },
        { label: 'Seleccionado',             props: { checked: true } },
        { label: 'Indeterminado',            props: { indeterminate: true } },
        { label: 'Con error',                props: { hasError: true } },
        { label: 'Deshabilitado',            props: { disabled: true } },
        { label: 'Deshabilitado + checked',  props: { disabled: true, checked: true } },
      ].map(({ label, props }) => (
        <JCheckBox key={label} label={label} labelPosition="right" {...props} />
      ))}
    </JPanel>
  ),
};

export const Interactive: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <JCheckBox
        label={checked ? 'Seleccionado' : 'Sin seleccionar'}
        labelPosition="right"
        checked={checked}
        onCheckedChange={(v, e) => { args.onCheckedChange?.(v, e); setChecked(v); }}
      />
    );
  },
};
