import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { JCreateAccount } from './JCreateAccount';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JButton } from '../../atoms/JButton/JButton';
import { JLabel } from '../../atoms/JLabel';

const meta: Meta<typeof JCreateAccount> = {
  title: 'Organisms/JCreateAccount',
  component: JCreateAccount,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { onSubmit: fn(), onGoToLogin: fn() },
};
export default meta;
type Story = StoryObj<typeof JCreateAccount>;

export const Default: Story = {
  render: () => {
    const [name, setName]                     = useState('');
    const [email, setEmail]                   = useState('');
    const [password, setPassword]             = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    return (
      <JCreateAccount
        name={name} setName={setName}
        email={email} setEmail={setEmail}
        password={password} setPassword={setPassword}
        confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
        onSubmit={(e) => { e.preventDefault(); alert(`Crear cuenta: ${email}`); }}
        onGoToLogin={() => alert('Ir a login')}
      />
    );
  },
};

export const WithErrors: Story = {
  render: () => (
    <JCreateAccount
      name="" setName={fn()}
      email="usuario@" setEmail={fn()}
      password="123" setPassword={fn()}
      confirmPassword="456" setConfirmPassword={fn()}
      nameError="El nombre es requerido"
      emailError="Email no válido"
      passwordError="Mínimo 8 caracteres"
      confirmPasswordError="Las contraseñas no coinciden"
      onSubmit={fn()}
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <JCreateAccount
      name="Jonathan" setName={fn()}
      email="jona@email.com" setEmail={fn()}
      password="12345678" setPassword={fn()}
      confirmPassword="12345678" setConfirmPassword={fn()}
      isLoading={true}
      onSubmit={fn()}
    />
  ),
};

export const Interactive: Story = {
  args: {
    onSubmit: fn(),
    onGoToLogin: fn(),
  },
  render: (args) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const validate = () => {
      const e: Record<string, string> = {};
      if (!name.trim()) e.name = 'El nombre es requerido';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Email no válido';
      if (password.length < 8) e.password = 'Mínimo 8 caracteres';
      if (password !== confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden';
      return e;
    };
    const handleSubmit = async (e: FormEvent) => {
      args.onSubmit?.(e as FormEvent);
      e.preventDefault();
      const errs = validate();
      if (Object.keys(errs).length > 0) { setErrors(errs); return; }
      setErrors({});
      setStatus('loading');
      await new Promise((r) => setTimeout(r, 1500));
      setStatus('success');
    };
    if (status === 'success') {
      return (
        <JPanel variant="ghost" padding="none" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '16px' }}>
          <JLabel size="xl" color="success" className="font-bold">¡Cuenta creada!</JLabel>
          <JLabel size="sm" color="muted">Bienvenido, {name}</JLabel>
          <JButton variant="link" size="sm" onClick={() => { setStatus('idle'); setName(''); setEmail(''); setPassword(''); setConfirmPassword(''); setErrors({}); }}>Volver</JButton>
        </JPanel>
      );
    }
    return (
      <JCreateAccount
        name={name} setName={setName}
        email={email} setEmail={setEmail}
        password={password} setPassword={setPassword}
        confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
        isLoading={status === 'loading'}
        nameError={errors.name}
        emailError={errors.email}
        passwordError={errors.password}
        confirmPasswordError={errors.confirmPassword}
        onSubmit={handleSubmit}
        onGoToLogin={args.onGoToLogin}
      />
    );
  },
};
