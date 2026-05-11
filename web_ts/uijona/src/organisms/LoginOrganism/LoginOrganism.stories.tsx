import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import React, { type FormEvent, useState } from 'react';
import { LoginOrganism } from './LoginOrganism';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { ButtonAtom } from '../../atoms/ButtonAtom/ButtonAtom';

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

export const Interactive: Story = {
  args: {
    onSubmit: fn(),
    onGoToCreateAccount: fn(),
    onGoToRecoverPassword: fn(),
  },
  render: (args) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
    const [alertMessage, setAlertMessage] = useState('');
    const handleSubmit = async (e: FormEvent) => {
      args.onSubmit?.(e);
      e.preventDefault();
      setStatus('loading');
      await new Promise((r) => setTimeout(r, 1500));
      if (email === 'admin@jona.com' && password === '123456') {
        setStatus('success');
        setAlertMessage('');
      } else {
        setStatus('error');
        setAlertMessage('Credenciales incorrectas. Prueba: admin@jona.com / 123456');
      }
    };
    if (status === 'success') {
      return (
        <PanelAtom variant="ghost" padding="none" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '16px' }}>
          <p style={{ fontSize: '20px', fontWeight: 700, color: '#16a34a' }}>¡Bienvenido, {email}!</p>
          <ButtonAtom variant="link" size="sm" onClick={() => { setStatus('idle'); setEmail(''); setPassword(''); setAlertMessage(''); }}>Cerrar sesión</ButtonAtom>
        </PanelAtom>
      );
    }
    return (
      <LoginOrganism
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        isLoading={status === 'loading'}
        alertMessage={alertMessage}
        onSubmit={handleSubmit}
        onGoToCreateAccount={args.onGoToCreateAccount}
        onGoToRecoverPassword={args.onGoToRecoverPassword}
      />
    );
  },
};
