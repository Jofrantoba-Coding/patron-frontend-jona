import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { CreateAccountOrganism } from './CreateAccountOrganism';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { ButtonAtom } from '../../atoms/ButtonAtom/ButtonAtom';
import { TextAtom } from '../../atoms/TextAtom/TextAtom';

const meta: Meta<typeof CreateAccountOrganism> = {
  title: 'Organisms/CreateAccountOrganism',
  component: CreateAccountOrganism,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { onSubmit: fn(), onGoToLogin: fn() },
};
export default meta;
type Story = StoryObj<typeof CreateAccountOrganism>;

export const Default: Story = {
  render: () => {
    const [name, setName]                     = useState('');
    const [email, setEmail]                   = useState('');
    const [password, setPassword]             = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    return (
      <CreateAccountOrganism
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
    <CreateAccountOrganism
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
    <CreateAccountOrganism
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
        <PanelAtom variant="ghost" padding="none" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '16px' }}>
          <TextAtom size="xl" color="success" className="font-bold">¡Cuenta creada!</TextAtom>
          <TextAtom size="sm" color="muted">Bienvenido, {name}</TextAtom>
          <ButtonAtom variant="link" size="sm" onClick={() => { setStatus('idle'); setName(''); setEmail(''); setPassword(''); setConfirmPassword(''); setErrors({}); }}>Volver</ButtonAtom>
        </PanelAtom>
      );
    }
    return (
      <CreateAccountOrganism
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
