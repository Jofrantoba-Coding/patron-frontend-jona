import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { StepperMolecule } from './StepperMolecule';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JButton } from '../../atoms/JButton/JButton';
import { TextAtom } from '../../atoms/TextAtom/TextAtom';

const steps = [
  { id: 'account', label: 'Account', description: 'Basic profile data' },
  { id: 'billing', label: 'Billing', description: 'Plan and payment' },
  { id: 'review', label: 'Review', description: 'Confirm details' },
];

const meta: Meta<typeof StepperMolecule> = {
  title: 'Molecules/StepperMolecule',
  component: StepperMolecule,
  tags: ['autodocs'],
  args: {
    steps,
    currentStep: 1,
    allowStepClick: true,
    onStepChange: fn(),
  },
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    allowStepClick: { control: 'boolean' },
    currentStep: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof StepperMolecule>;

export const Horizontal: Story = {};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
};

export const Interactive: Story = {
  args: {
    onStepChange: fn(),
  },
  render: (args) => {
    const [step, setStep] = useState(0);
    const wizardSteps = [
      { id: 'account', label: 'Cuenta', description: 'Datos básicos' },
      { id: 'billing', label: 'Facturación', description: 'Plan de pago' },
      { id: 'review', label: 'Revisión', description: 'Confirmar datos' },
    ];
    const contents = [
      'Configura tu nombre de usuario y correo electrónico.',
      'Elige tu plan y método de pago preferido.',
      'Revisa toda la información antes de confirmar.',
    ];
    const done = step >= wizardSteps.length;
    if (done) {
      return (
        <JPanel variant="ghost" padding="none" className="flex flex-col items-center gap-4 p-8">
          <TextAtom size="lg" className="font-semibold text-green-600">Configuración completada</TextAtom>
          <JButton variant="outline" size="sm" onClick={() => setStep(0)}>Reiniciar</JButton>
        </JPanel>
      );
    }
    return (
      <JPanel variant="ghost" padding="none" className="flex flex-col gap-6 w-full max-w-lg">
        <StepperMolecule
          steps={wizardSteps}
          currentStep={step}
          onStepChange={(i, s) => { args.onStepChange?.(i, s); setStep(i); }}
          allowStepClick
        />
        <JPanel variant="ghost" padding="none" className="rounded-lg border p-4 text-sm text-neutral-600">{contents[step]}</JPanel>
        <JPanel variant="ghost" padding="none" className="flex justify-between">
          <JButton variant="outline" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
            Anterior
          </JButton>
          <JButton onClick={() => setStep((s) => s + 1)}>
            {step === wizardSteps.length - 1 ? 'Finalizar' : 'Siguiente'}
          </JButton>
        </JPanel>
      </JPanel>
    );
  },
};
