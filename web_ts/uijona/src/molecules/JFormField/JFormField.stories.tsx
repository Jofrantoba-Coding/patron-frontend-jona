import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JFormField, JFORMFIELD_DEFAULTS } from './JFormField';

const meta: Meta<typeof JFormField> = {
  title: 'Molecules/JFormField',
  component: JFormField,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'JFormField es el campo de texto con etiqueta de JONA. Combina `JLabel` + `JTextBox` con soporte de orientación vertical/horizontal, descripción, mensaje de error y callbacks de validación (`onValid` / `onInvalid`).',
      },
    },
  },
  args: { onChange: fn(), onBlur: fn() },
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['vertical', 'horizontal'],
      table: { type: { summary: 'string' }, defaultValue: { summary: JFORMFIELD_DEFAULTS.orientation } },
    },
    required: { control: 'boolean' },
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
type Story = StoryObj<typeof JFormField>;

export const Default: Story = {
  args: {
    id:          'email',
    label:       'Correo electrónico',
    description: 'Recibirás un enlace de verificación',
  },
};

export const Required: Story = {
  args: {
    id:       'name',
    label:    'Nombre completo',
    required: true,
  },
};

export const WithError: Story = {
  args: {
    id:           'email-error',
    label:        'Correo electrónico',
    errorMessage: 'El formato de email no es válido',
  },
  parameters: {
    docs: { description: { story: 'Con `errorMessage`: el input se marca en rojo y `aria-describedby` apunta al mensaje de error.' } },
  },
};

export const Horizontal: Story = {
  args: {
    id:          'username',
    label:       'Usuario',
    orientation: 'horizontal',
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: { description: { story: '`orientation="horizontal"` alinea etiqueta e input en fila a partir de `sm` (640 px).' } },
  },
};

export const Interactive: Story = {
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: { story: 'Validación en tiempo real: el error aparece al salir del campo. `onValid` / `onInvalid` se registran en el panel de acciones.' },
      source: {
        code: `const [email, setEmail] = useState('');
const [touched, setTouched] = useState(false);
const error = touched && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)
  ? 'El formato de email no es válido'
  : undefined;

<JFormField
  id="email"
  label="Correo electrónico"
  required
  description="Usaremos este correo para enviarte notificaciones"
  errorMessage={error}
  value={email}
  onChange={(v) => setEmail(v)}
  onBlur={() => setTouched(true)}
/>`,
      },
    },
  },
  args: {
    onChange: fn(),
    onBlur:   fn(),
    onValid:  fn(),
    onInvalid: fn(),
  },
  render: (args) => {
    const [email, setEmail]     = useState('');
    const [touched, setTouched] = useState(false);
    const error =
      touched && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? 'El formato de email no es válido'
        : undefined;
    return (
      <JFormField
        id="interactive-email"
        label="Correo electrónico"
        required
        description="Usaremos este correo para enviarte notificaciones"
        errorMessage={error}
        value={email}
        onChange={(v, e) => { args.onChange?.(v, e); setEmail(v); }}
        onBlur={(v, e)  => { args.onBlur?.(v, e);   setTouched(true); }}
        onValid={(v)    =>   args.onValid?.(v)}
        onInvalid={(v, msg) => args.onInvalid?.(v, msg)}
      />
    );
  },
};
