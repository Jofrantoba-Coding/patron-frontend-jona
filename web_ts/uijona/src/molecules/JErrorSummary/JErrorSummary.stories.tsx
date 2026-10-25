import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JErrorSummary, JERRORSUMMARY_DEFAULTS } from './JErrorSummary';
import { JField } from '../JField';
import { JFieldGrid } from '../../layouts/JFieldGrid';
import { JTextBox } from '../../atoms/JTextBox';
import { JButton } from '../../atoms/JButton';

const ERRORS = [
  { field: 'usuario', label: 'Usuario', message: 'Ingrese Usuario' },
  { field: 'clave', label: 'Clave', message: 'Ingrese Clave' },
];

const meta: Meta<typeof JErrorSummary> = {
  title: 'Molecules/JErrorSummary',
  component: JErrorSummary,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'JErrorSummary anuncia los errores de un envío bloqueado en una sola región `role="alert"`. Cada entrada es un botón que llama `onSelect(field)` para que el host enfoque el campo. No toma el foco por sí mismo y no renderiza nada con la lista vacía.',
      },
    },
  },
  args: { errors: ERRORS, onSelect: fn() },
  argTypes: {
    title: { control: 'text', table: { defaultValue: { summary: JERRORSUMMARY_DEFAULTS.title } } },
  },
};
export default meta;
type Story = StoryObj<typeof JErrorSummary>;

export const Default: Story = {};

const BlockedSubmit = () => {
  const [values, setValues] = useState({ usuario: '', clave: '' });
  const [submitted, setSubmitted] = useState(false);
  const errors = submitted
    ? ERRORS.filter((error) => !values[error.field as keyof typeof values].trim())
    : [];
  const errorOf = (field: string) => errors.find((error) => error.field === field)?.message;
  const focusField = (field: string) => document.getElementById(field)?.focus();

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <JErrorSummary errors={errors} onSelect={focusField} />
      <JFieldGrid>
        <JField id="usuario" label="Usuario" required error={errorOf('usuario')}>
          {(aria) => <JTextBox {...aria} value={values.usuario} onChange={(usuario) => setValues((v) => ({ ...v, usuario }))} />}
        </JField>
        <JField id="clave" label="Clave" required error={errorOf('clave')}>
          {(aria) => <JTextBox {...aria} type="password" value={values.clave} onChange={(clave) => setValues((v) => ({ ...v, clave }))} />}
        </JField>
      </JFieldGrid>
      <JButton type="submit">Guardar</JButton>
    </form>
  );
};

export const Interactive: Story = {
  render: () => <BlockedSubmit />,
};
