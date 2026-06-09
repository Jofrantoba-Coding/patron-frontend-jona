import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import React, { type FormEvent, useState } from 'react';
import { JRecoverPassword } from './JRecoverPassword';

const meta: Meta<typeof JRecoverPassword> = {
  title: 'Organisms/JRecoverPassword',
  component: JRecoverPassword,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { onSubmit: fn(), onGoToLogin: fn() },
};
export default meta;
type Story = StoryObj<typeof JRecoverPassword>;

export const Default: Story = {
  render: () => {
    const [email, setEmail] = useState('');
    return (
      <JRecoverPassword
        email={email}
        setEmail={setEmail}
        onSubmit={(e) => { e.preventDefault(); alert(`Enviado a: ${email}`); }}
        onGoToLogin={() => alert('Ir a login')}
      />
    );
  },
};

export const WithError: Story = {
  render: () => (
    <JRecoverPassword
      email="usuario@"
      setEmail={fn()}
      emailError="El email no es válido"
      onSubmit={fn()}
      onGoToLogin={fn()}
    />
  ),
};

export const Success: Story = {
  render: () => (
    <JRecoverPassword
      email="usuario@ejemplo.com"
      setEmail={fn()}
      successMessage="Te enviamos un enlace de recuperación a tu correo."
      onSubmit={fn()}
      onGoToLogin={fn()}
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <JRecoverPassword
      email="usuario@ejemplo.com"
      setEmail={fn()}
      isLoading={true}
      onSubmit={fn()}
      onGoToLogin={fn()}
    />
  ),
};

export const Interactive: Story = {
  args: {
    onSubmit: fn(),
    onGoToLogin: fn(),
  },
  render: (args) => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    const [emailError, setEmailError] = useState('');
    const handleSubmit = async (e: FormEvent) => {
      args.onSubmit?.(e);
      e.preventDefault();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setEmailError('Ingresa un email válido');
        return;
      }
      setEmailError('');
      setStatus('loading');
      await new Promise((r) => setTimeout(r, 1500));
      setStatus('success');
    };
    return (
      <JRecoverPassword
        email={email}
        setEmail={(v) => { setEmail(v); setEmailError(''); }}
        isLoading={status === 'loading'}
        emailError={emailError}
        successMessage={
          status === 'success'
            ? `Enlace enviado a ${email}. Revisa tu bandeja de entrada.`
            : undefined
        }
        onSubmit={handleSubmit}
        onGoToLogin={args.onGoToLogin}
      />
    );
  },
};
