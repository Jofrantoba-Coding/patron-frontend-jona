import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { JButton } from '../../atoms/JButton';
import { JTextBox } from '../../atoms/JTextBox';
import { JField } from '../../molecules/JField';
import { JAuthLayout } from './JAuthLayout';

const STEPS = [
  { id: 'login', label: 'Iniciar sesión' },
  { id: 'contexto', label: 'Contexto de trabajo' },
];

const LoginForm = () => (
  <form
    aria-label="Ingreso"
    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
    onSubmit={(event) => {
      event.preventDefault();
      fn()();
    }}
  >
    <JField id="usuario" label="Usuario" required span={12}>
      {(aria) => <JTextBox {...aria} autoComplete="username" />}
    </JField>
    <JField id="clave" label="Contraseña" required span={12}>
      {(aria) => <JTextBox {...aria} type="password" autoComplete="current-password" />}
    </JField>
    <JButton type="submit" fullWidth density="auto">Ingresar</JButton>
  </form>
);

const meta: Meta<typeof JAuthLayout> = {
  title: 'Layouts/JAuthLayout',
  component: JAuthLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'JAuthLayout es el marco de las pantallas de acceso: un `main` con una tarjeta que muestra el nombre del producto, el título de la página (estilo de título de página) y el formulario del host como hijos. Desde 1024 px un panel de marca muestra el nombre y el lema; por debajo solo se ve la tarjeta, con márgenes de 16 px. Con `steps`, un JStepper marca el paso `currentStep` con `aria-current="step"`. No contiene lógica de formulario.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof JAuthLayout>;

export const Login: Story = {
  render: () => (
    <JAuthLayout
      brand={{ name: 'SoftCommerce', tagline: 'Gestión comercial para tu empresa' }}
      steps={STEPS}
      currentStep="login"
      title="Iniciar sesión"
      description="Ingrese con su usuario de SoftCommerce."
      footer={<span>Base de datos: demo</span>}
    >
      <LoginForm />
    </JAuthLayout>
  ),
};

export const SecondStep: Story = {
  render: () => (
    <JAuthLayout
      brand={{ name: 'SoftCommerce', tagline: 'Gestión comercial para tu empresa' }}
      steps={STEPS}
      currentStep="contexto"
      title="Contexto de trabajo"
      description="Elija la empresa, el punto de venta y el periodo."
    >
      <p>Formulario del contexto</p>
    </JAuthLayout>
  ),
};
