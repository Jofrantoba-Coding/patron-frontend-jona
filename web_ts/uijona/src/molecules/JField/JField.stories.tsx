import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { JField, JFIELD_DEFAULTS } from './JField';
import { JTextBox } from '../../atoms/JTextBox';
import { JRadioButton } from '../../atoms/JRadioButton';

const meta: Meta<typeof JField> = {
  title: 'Molecules/JField',
  component: JField,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'JField envuelve cualquier control con su etiqueta, ayuda y error. Sus `children` son una función que recibe el cableado (`id`, `aria-describedby`, `aria-invalid`, `aria-required`) para pasarlo al control. La etiqueta es el nombre accesible exacto; el `*` es visual. El error forma parte de la descripción y no es una región `alert`: un `JErrorSummary` anuncia los errores.',
      },
    },
  },
  args: {
    id: 'usuario',
    label: 'Usuario',
    children: (aria) => <JTextBox {...aria} />,
  },
  argTypes: {
    span: { control: 'select', options: [3, 4, 6, 12], table: { defaultValue: { summary: String(JFIELD_DEFAULTS.span) } } },
    as: { control: 'inline-radio', options: ['field', 'fieldset'], table: { defaultValue: { summary: JFIELD_DEFAULTS.as } } },
    requiredLabel: { control: 'text', table: { defaultValue: { summary: JFIELD_DEFAULTS.requiredLabel } } },
    children: { control: false },
  },
};
export default meta;
type Story = StoryObj<typeof JField>;

export const Default: Story = {
  args: { description: 'Máximo 50 caracteres' },
};

export const Required: Story = {
  args: { required: true, description: 'Máximo 50 caracteres' },
};

export const WithError: Story = {
  args: { required: true, description: 'Máximo 50 caracteres', error: 'Ingrese Usuario' },
};

export const Fieldset: Story = {
  args: {
    id: 'sexo',
    label: 'Sexo',
    as: 'fieldset',
    required: true,
    error: 'Seleccione Sexo',
    children: (aria) => (
      <>
        <JRadioButton name="sexo" value="F" label="Femenino" hasError={!!aria['aria-invalid']} />
        <JRadioButton name="sexo" value="M" label="Masculino" hasError={!!aria['aria-invalid']} />
      </>
    ),
  },
};

const ValidatedField = () => {
  const [value, setValue] = useState('');
  return (
    <JField
      id="usuario-interactivo"
      label="Usuario"
      required
      description="Máximo 50 caracteres"
      error={value.trim() ? undefined : 'Ingrese Usuario'}
    >
      {(aria) => <JTextBox {...aria} value={value} onChange={setValue} />}
    </JField>
  );
};

export const Interactive: Story = {
  render: () => <ValidatedField />,
};
