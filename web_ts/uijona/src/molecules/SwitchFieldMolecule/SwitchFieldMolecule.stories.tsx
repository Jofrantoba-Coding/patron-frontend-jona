import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { SwitchFieldMolecule } from './SwitchFieldMolecule';

const meta: Meta<typeof SwitchFieldMolecule> = {
  title: 'Molecules/SwitchFieldMolecule',
  component: SwitchFieldMolecule,
  tags: ['autodocs'],
  args: { onCheckedChange: fn() },
  argTypes: {
    checked:  { control: 'boolean' },
    disabled: { control: 'boolean' },
    size:     { control: 'radio', options: ['sm', 'md', 'lg'] },
    card:     { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof SwitchFieldMolecule>;

// Sin checked en args → uncontrolled, se puede toglear directamente en el canvas
export const Default: Story = {
  args: { id: 'notifications', label: 'Recibir notificaciones' },
};

export const WithDescription: Story = {
  args: {
    id: 'dark-mode',
    label: 'Modo oscuro',
    description: 'Cambia el tema de la aplicación',
  },
};

export const Checked: Story = {
  args: { id: 'checked', label: 'Opción activada', checked: true },
};

export const CardStyle: Story = {
  args: {
    id: 'card-switch',
    label: 'Notificaciones push',
    description: 'Recibe alertas en tu dispositivo',
    card: true,
  },
};

export const Disabled: Story = {
  args: { id: 'disabled', label: 'Opción bloqueada', disabled: true },
};

export const Interactive: Story = {
  render: () => {
    const [values, setValues] = useState({ emails: false, push: true, sms: false });
    const set = (key: keyof typeof values) => (v: boolean) =>
      setValues((s) => ({ ...s, [key]: v }));
    return (
      <div className="flex flex-col gap-4 w-72">
        <SwitchFieldMolecule id="emails" label="Correos electrónicos"
          description="Notificaciones por email" checked={values.emails} onCheckedChange={set('emails')} />
        <SwitchFieldMolecule id="push" label="Notificaciones push"
          description="Alertas en tu dispositivo" checked={values.push} onCheckedChange={set('push')} />
        <SwitchFieldMolecule id="sms" label="Mensajes SMS"
          description="Solo alertas críticas" checked={values.sms} onCheckedChange={set('sms')} />
      </div>
    );
  },
};
