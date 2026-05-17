import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { RadioGroupMolecule } from './RadioGroupMolecule';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { TextAtom } from '../../atoms/TextAtom/TextAtom';

const options = [
  { value: 'basic', label: 'Basic', description: 'Para formularios simples y prototipos.' },
  { value: 'pro', label: 'Pro', description: 'Para aplicaciones con flujos frecuentes.' },
  { value: 'enterprise', label: 'Enterprise', description: 'Gobernanza, soporte y auditoria.' },
];

const meta: Meta<typeof RadioGroupMolecule> = {
  title: 'Molecules/RadioGroupMolecule',
  component: RadioGroupMolecule,
  tags: ['autodocs'],
  args: { name: 'plan', options, onValueChange: fn() },
  argTypes: {
    orientation: { control: 'select', options: ['vertical', 'horizontal'] },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof RadioGroupMolecule>;

export const Default: Story = {
  args: {
    label: 'Plan',
    description: 'Selecciona el plan inicial.',
    defaultValue: 'pro',
  },
};

export const Horizontal: Story = {
  args: {
    label: 'Prioridad',
    name: 'priority',
    orientation: 'horizontal',
    defaultValue: 'basic',
    options: [
      { value: 'low', label: 'Baja' },
      { value: 'medium', label: 'Media' },
      { value: 'high', label: 'Alta' },
    ],
  },
};

export const WithError: Story = {
  args: {
    label: 'Plan',
    errorMessage: 'Selecciona una opcion para continuar.',
  },
};

export const DisabledOption: Story = {
  args: {
    label: 'Plan',
    defaultValue: 'basic',
    options: [
      ...options,
      { value: 'custom', label: 'Custom', description: 'Disponible bajo contrato.', disabled: true },
    ],
  },
};

export const Interactive: Story = {
  args: {
    onValueChange: fn(),
  },
  render: (args) => {
    const [plan, setPlan] = useState<string>('');
    const prices: Record<string, string> = { basic: 'Gratis', pro: '$29/mes', enterprise: 'Contactar ventas' };
    return (
      <JPanel variant="ghost" padding="none" className="flex flex-col gap-4">
        <RadioGroupMolecule
          name="plan-selector"
          label="Selecciona tu plan"
          description="Puedes cambiar de plan en cualquier momento"
          options={options}
          onValueChange={(v, option) => { args.onValueChange?.(v, option); setPlan(v); }}
        />
        {plan && (
          <JPanel variant="ghost" padding="none" className="rounded-md bg-neutral-50 border p-4 text-sm flex justify-between">
            <JPanel variant="ghost" padding="none">
              <TextAtom className="font-semibold">{options.find((o) => o.value === plan)?.label}</TextAtom>
              <TextAtom className="text-neutral-500">{options.find((o) => o.value === plan)?.description}</TextAtom>
            </JPanel>
            <TextAtom className="font-bold text-primary-700">{prices[plan]}</TextAtom>
          </JPanel>
        )}
      </JPanel>
    );
  },
};
