import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { LoginOrganism } from './LoginOrganism';

const meta: Meta<typeof LoginOrganism> = {
  title: 'Organisms/LoginOrganism',
  component: LoginOrganism,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { onSubmit: fn(), onGoToCreateAccount: fn(), onGoToRecoverPassword: fn() },
};
export default meta;
type Story = StoryObj<typeof LoginOrganism>;

export const Default: Story = {
  render: () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    return (
      <LoginOrganism
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        onSubmit={(e) => { e.preventDefault(); alert(`Login: ${email}`); }}
        onGoToCreateAccount={() => alert('Ir a crear cuenta')}
        onGoToRecoverPassword={() => alert('Recuperar contraseña')}
      />
    );
  },
};

export const WithErrors: Story = {
  render: () => (
    <LoginOrganism
      email="usuario@"
      password="123"
      setEmail={fn()}
      setPassword={fn()}
      emailError="El email no es válido"
      passwordError="La contraseña debe tener al menos 6 caracteres"
      onSubmit={fn()}
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <LoginOrganism
      email="admin@jona.com"
      password="123456"
      setEmail={fn()}
      setPassword={fn()}
      isLoading={true}
      onSubmit={fn()}
    />
  ),
};

export const WithAlert: Story = {
  render: () => (
    <LoginOrganism
      email="admin@jona.com"
      password="wrong"
      setEmail={fn()}
      setPassword={fn()}
      alertMessage="Credenciales incorrectas. Intenta de nuevo."
      onSubmit={fn()}
    />
  ),
};
