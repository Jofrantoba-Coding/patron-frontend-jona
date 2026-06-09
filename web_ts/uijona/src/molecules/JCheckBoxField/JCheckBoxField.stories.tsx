import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JCheckBoxField } from './JCheckBoxField';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';

const meta: Meta<typeof JCheckBoxField> = {
  title: 'Molecules/JCheckBoxField',
  component: JCheckBoxField,
  tags: ['autodocs'],
  args: { onCheckedChange: fn() },
  argTypes: {
    checked:  { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof JCheckBoxField>;

// Sin checked en args → uncontrolled, se puede toglear directamente en el canvas
export const Default: Story = {
  args: { id: 'terms', label: 'Acepto los términos y condiciones' },
};

export const WithDescription: Story = {
  args: {
    id: 'newsletter',
    label: 'Suscribirse al boletín',
    description: 'Recibirás noticias y actualizaciones cada semana',
  },
};

export const Checked: Story = {
  args: {
    id: 'checked',
    label: 'Opción preseleccionada',
    checked: true,
  },
};

export const WithError: Story = {
  args: {
    id: 'terms-error',
    label: 'Acepto los términos',
    errorMessage: 'Debes aceptar los términos para continuar',
  },
};

export const Disabled: Story = {
  args: { id: 'disabled', label: 'Opción deshabilitada', disabled: true },
};

export const Interactive: Story = {
  parameters: {
    docs: {
      source: {
        code: `const [checked, setChecked] = useState(false);

<JCheckBoxField
  id="terms"
  label="Acepto los términos y condiciones"
  checked={checked}
  onCheckedChange={setChecked}
/>`,
      },
    },
  },
  args: {
    onCheckedChange: fn(),
  },
  render: (args) => {
    const [values, setValues] = useState({ terms: false, newsletter: false, offers: false });
    return (
      <JPanel variant="ghost" padding="none" className="flex flex-col gap-3">
        <JCheckBoxField
          id="terms"
          label="Acepto los términos y condiciones"
          checked={values.terms}
          onCheckedChange={(v) => { args.onCheckedChange?.(v); setValues((s) => ({ ...s, terms: v })); }}
        />
        <JCheckBoxField
          id="newsletter"
          label="Suscribirme al boletín"
          description="Recibirás noticias y actualizaciones cada semana"
          checked={values.newsletter}
          onCheckedChange={(v) => { args.onCheckedChange?.(v); setValues((s) => ({ ...s, newsletter: v })); }}
        />
        <JCheckBoxField
          id="offers"
          label="Recibir ofertas especiales"
          checked={values.offers}
          onCheckedChange={(v) => { args.onCheckedChange?.(v); setValues((s) => ({ ...s, offers: v })); }}
        />
        <JLabel size="xs" color="muted" className="mt-1">
          Seleccionados: {Object.entries(values).filter(([, v]) => v).map(([k]) => k).join(', ') || 'ninguno'}
        </JLabel>
      </JPanel>
    );
  },
};
