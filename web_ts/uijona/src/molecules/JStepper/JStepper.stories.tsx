import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JStepper, JSTEPPER_DEFAULTS } from './JStepper';
import { JButton } from '../../atoms/JButton/JButton';
import { JLabel } from '../../atoms/JLabel';

const steps = [
  { id: 'account', label: 'Account', description: 'Basic profile data' },
  { id: 'billing', label: 'Billing', description: 'Plan and payment' },
  { id: 'review',  label: 'Review',  description: 'Confirm details' },
];

const meta: Meta<typeof JStepper> = {
  title: 'Molecules/JStepper',
  component: JStepper,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'JStepper muestra el progreso de un flujo de pasos. Soporta orientación `horizontal` / `vertical`, pasos clickeables (`allowStepClick`) y modo controlado / no-controlado (`currentStep` / `defaultStep`).',
      },
    },
  },
  args: {
    steps,
    currentStep:    1,
    allowStepClick: true,
    onStepChange:   fn(),
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      table: { defaultValue: { summary: JSTEPPER_DEFAULTS.orientation } },
    },
    allowStepClick: {
      control: 'boolean',
      table: { defaultValue: { summary: String(JSTEPPER_DEFAULTS.allowStepClick) } },
    },
    currentStep: { control: 'number' },
  },
};
export default meta;
type Story = StoryObj<typeof JStepper>;

export const Horizontal: Story = {};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  parameters: {
    docs: { description: { story: '`orientation="vertical"`: los pasos se apilan en columna.' } },
  },
};

export const NoClick: Story = {
  args: { allowStepClick: false },
  parameters: {
    docs: { description: { story: '`allowStepClick=false` (default): los pasos son decorativos, sin interacción.' } },
  },
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: { story: 'Wizard completo con navegación Anterior / Siguiente y pantalla de fin.' },
    },
  },
  args: { onStepChange: fn() },
  render: (args) => {
    const wizardSteps = [
      { id: 'account', label: 'Cuenta',      description: 'Datos básicos' },
      { id: 'billing', label: 'Facturación', description: 'Plan de pago' },
      { id: 'review',  label: 'Revisión',    description: 'Confirmar datos' },
    ];
    const contents = [
      'Configura tu nombre de usuario y correo electrónico.',
      'Elige tu plan y método de pago preferido.',
      'Revisa toda la información antes de confirmar.',
    ];
    const [step, setStep] = useState(0);
    const done = step >= wizardSteps.length;

    if (done) {
      return (
        <div className="flex flex-col items-center gap-4 p-8">
          <JLabel size="lg" className="font-semibold text-green-600">Configuración completada</JLabel>
          <JButton variant="outline" size="sm" onClick={() => setStep(0)}>Reiniciar</JButton>
        </div>
      );
    }

    return (
      <div className="flex w-full max-w-lg flex-col gap-6">
        <JStepper
          steps={wizardSteps}
          currentStep={step}
          allowStepClick
          onStepChange={(i, s) => { args.onStepChange?.(i, s); setStep(i); }}
        />
        <div className="rounded-lg border p-4 text-sm text-neutral-600">{contents[step]}</div>
        <div className="flex justify-between">
          <JButton variant="outline" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
            Anterior
          </JButton>
          <JButton onClick={() => setStep((s) => s + 1)}>
            {step === wizardSteps.length - 1 ? 'Finalizar' : 'Siguiente'}
          </JButton>
        </div>
      </div>
    );
  },
};
