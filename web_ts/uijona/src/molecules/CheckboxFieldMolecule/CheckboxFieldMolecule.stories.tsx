import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { CheckboxFieldMolecule } from './CheckboxFieldMolecule';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { TextAtom } from '../../atoms/TextAtom/TextAtom';

const meta: Meta<typeof CheckboxFieldMolecule> = {
  title: 'Molecules/CheckboxFieldMolecule',
  component: CheckboxFieldMolecule,
  tags: ['autodocs'],
  args: { onCheckedChange: fn() },
  argTypes: {
    checked:  { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof CheckboxFieldMolecule>;

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

<CheckboxFieldMolecule
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
      <PanelAtom variant="ghost" padding="none" className="flex flex-col gap-3">
        <CheckboxFieldMolecule
          id="terms"
          label="Acepto los términos y condiciones"
          checked={values.terms}
          onCheckedChange={(v) => { args.onCheckedChange?.(v); setValues((s) => ({ ...s, terms: v })); }}
        />
        <CheckboxFieldMolecule
          id="newsletter"
          label="Suscribirme al boletín"
          description="Recibirás noticias y actualizaciones cada semana"
          checked={values.newsletter}
          onCheckedChange={(v) => { args.onCheckedChange?.(v); setValues((s) => ({ ...s, newsletter: v })); }}
        />
        <CheckboxFieldMolecule
          id="offers"
          label="Recibir ofertas especiales"
          checked={values.offers}
          onCheckedChange={(v) => { args.onCheckedChange?.(v); setValues((s) => ({ ...s, offers: v })); }}
        />
        <TextAtom size="xs" color="muted" className="mt-1">
          Seleccionados: {Object.entries(values).filter(([, v]) => v).map(([k]) => k).join(', ') || 'ninguno'}
        </TextAtom>
      </PanelAtom>
    );
  },
};
