import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JSwitchField, JSWITCHFIELD_DEFAULTS } from './JSwitchField';

const meta: Meta<typeof JSwitchField> = {
  title: 'Molecules/JSwitchField',
  component: JSwitchField,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'JSwitchField combina `JSwitch` + `JLabel` con soporte de descripción, mensaje de error, modo card (clic en toda la fila) y modo controlado/no-controlado.',
      },
    },
  },
  args: { onCheckedChange: fn() },
  argTypes: {
    checked:  { control: 'boolean' },
    disabled: { control: 'boolean' },
    size:     {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      table: { defaultValue: { summary: JSWITCHFIELD_DEFAULTS.size } },
    },
    card: {
      control: 'boolean',
      table: { defaultValue: { summary: String(JSWITCHFIELD_DEFAULTS.card) } },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof JSwitchField>;

export const Default: Story = {
  args: { id: 'notifications', label: 'Recibir notificaciones' },
};

export const WithDescription: Story = {
  args: {
    id:          'dark-mode',
    label:       'Modo oscuro',
    description: 'Cambia el tema de la aplicación',
  },
};

export const Checked: Story = {
  args: { id: 'checked', label: 'Opción activada', checked: true },
};

export const WithError: Story = {
  args: {
    id:           'error-switch',
    label:        'Términos y condiciones',
    errorMessage: 'Debes aceptar los términos para continuar',
  },
  parameters: {
    docs: { description: { story: 'Con `errorMessage`: el switch se marca en rojo y se muestra el mensaje.' } },
  },
};

export const CardStyle: Story = {
  args: {
    id:          'card-switch',
    label:       'Notificaciones push',
    description: 'Recibe alertas en tu dispositivo',
    card:        true,
  },
  parameters: {
    docs: { description: { story: '`card=true`: toda la fila es clickeable y muestra borde con hover.' } },
  },
};

export const Disabled: Story = {
  args: { id: 'disabled', label: 'Opción bloqueada', disabled: true },
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: { story: 'Tres switches controlados que comparten estado. El panel de acciones registra cada cambio.' },
      source: {
        code: `const [values, setValues] = useState({ emails: false, push: true, sms: false });
const set = (key) => (v) => setValues((s) => ({ ...s, [key]: v }));

<JSwitchField id="emails" label="Correos electrónicos"
  description="Notificaciones por email" checked={values.emails} onCheckedChange={set('emails')} />
<JSwitchField id="push" label="Notificaciones push"
  description="Alertas en tu dispositivo" checked={values.push} onCheckedChange={set('push')} />
<JSwitchField id="sms" label="Mensajes SMS"
  description="Solo alertas críticas" checked={values.sms} onCheckedChange={set('sms')} />`,
      },
    },
  },
  args: { onCheckedChange: fn() },
  render: (args) => {
    const [values, setValues] = useState({ emails: false, push: true, sms: false });
    const set = (key: keyof typeof values) => (v: boolean) => {
      args.onCheckedChange?.(v);
      setValues((s) => ({ ...s, [key]: v }));
    };
    return (
      <div className="flex w-72 flex-col gap-4">
        <JSwitchField id="emails" label="Correos electrónicos"
          description="Notificaciones por email" checked={values.emails} onCheckedChange={set('emails')} />
        <JSwitchField id="push" label="Notificaciones push"
          description="Alertas en tu dispositivo" checked={values.push} onCheckedChange={set('push')} />
        <JSwitchField id="sms" label="Mensajes SMS"
          description="Solo alertas críticas" checked={values.sms} onCheckedChange={set('sms')} />
      </div>
    );
  },
};
