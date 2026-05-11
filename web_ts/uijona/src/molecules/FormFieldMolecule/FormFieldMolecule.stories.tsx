import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { FormFieldMolecule } from './FormFieldMolecule';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';

const meta: Meta<typeof FormFieldMolecule> = {
  title: 'Molecules/FormFieldMolecule',
  component: FormFieldMolecule,
  tags: ['autodocs'],
  args: { onChange: fn(), onBlur: fn() },
  argTypes: {
    orientation: { control: 'radio', options: ['vertical', 'horizontal'] },
    required:    { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof FormFieldMolecule>;

export const Default: Story = {
  args: {
    id: 'email',
    label: 'Correo electrónico',
    description: 'Recibirás un enlace de verificación',
  },
  decorators: [(Story) => <PanelAtom variant="ghost" padding="none" style={{ width: '320px' }}><Story /></PanelAtom>],
};

export const Required: Story = {
  args: {
    id: 'name',
    label: 'Nombre completo',
    required: true,
  },
  decorators: [(Story) => <PanelAtom variant="ghost" padding="none" style={{ width: '320px' }}><Story /></PanelAtom>],
};

export const WithError: Story = {
  args: {
    id: 'email-error',
    label: 'Correo electrónico',
    errorMessage: 'El formato de email no es válido',
  },
  decorators: [(Story) => <PanelAtom variant="ghost" padding="none" style={{ width: '320px' }}><Story /></PanelAtom>],
};

export const Horizontal: Story = {
  args: {
    id: 'username',
    label: 'Usuario',
    orientation: 'horizontal',
  },
  decorators: [(Story) => <PanelAtom variant="ghost" padding="none" style={{ width: '400px' }}><Story /></PanelAtom>],
};

export const Interactive: Story = {
  args: {
    onChange: fn(),
    onBlur: fn(),
  },
  render: (args) => {
    const [email, setEmail] = useState('');
    const [touched, setTouched] = useState(false);
    const error =
      touched && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? 'El formato de email no es válido'
        : undefined;
    return (
      <PanelAtom variant="ghost" padding="none" style={{ width: '320px' }}>
        <FormFieldMolecule
          id="interactive-email"
          label="Correo electrónico"
          required
          description="Usaremos este correo para enviarte notificaciones"
          errorMessage={error}
          value={email}
          onChange={(v, e) => { args.onChange?.(v, e); setEmail(v); }}
          onBlur={(v, e) => { args.onBlur?.(v, e); setTouched(true); }}
        />
      </PanelAtom>
    );
  },
};
