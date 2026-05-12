import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { LabelAtom } from './LabelAtom';
import { CheckboxAtom } from '../CheckboxAtom/CheckboxAtom';
import { PanelAtom } from '../PanelAtom/PanelAtom';

const meta: Meta<typeof LabelAtom> = {
  title: 'Atoms/LabelAtom',
  component: LabelAtom,
  tags: ['autodocs'],
  argTypes: {
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof LabelAtom>;

export const Default: Story = {
  args: { children: 'Correo electrónico' },
};

export const Required: Story = {
  args: { children: 'Nombre completo', required: true },
};

export const Disabled: Story = {
  args: { children: 'Campo deshabilitado', disabled: true },
};

export const Interactive: Story = {
  render: () => {
    const [required, setRequired] = useState(false);
    const [disabled, setDisabled] = useState(false);
    return (
      <PanelAtom variant="ghost" padding="none" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <LabelAtom required={required} disabled={disabled}>Correo electrónico</LabelAtom>
        <PanelAtom variant="ghost" padding="none" style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <CheckboxAtom checked={required} onCheckedChange={setRequired} />
            Requerido
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <CheckboxAtom checked={disabled} onCheckedChange={setDisabled} />
            Deshabilitado
          </label>
        </PanelAtom>
      </PanelAtom>
    );
  },
};
