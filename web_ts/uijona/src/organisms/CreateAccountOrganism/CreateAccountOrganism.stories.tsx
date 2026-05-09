import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { CreateAccountOrganism } from './CreateAccountOrganism';

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
