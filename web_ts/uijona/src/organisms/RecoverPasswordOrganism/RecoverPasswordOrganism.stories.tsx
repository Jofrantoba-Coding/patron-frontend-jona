import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { RecoverPasswordOrganism } from './RecoverPasswordOrganism';

const meta: Meta<typeof RecoverPasswordOrganism> = {
  title: 'Organisms/RecoverPasswordOrganism',
  component: RecoverPasswordOrganism,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { onSubmit: fn(), onGoToLogin: fn() },
};
export default meta;
type Story = StoryObj<typeof RecoverPasswordOrganism>;

export const Default: Story = {
  render: () => {
    const [email, setEmail] = useState('');
    return (
      <RecoverPasswordOrganism
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
    <RecoverPasswordOrganism
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
    <RecoverPasswordOrganism
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
    <RecoverPasswordOrganism
      email="usuario@ejemplo.com"
      setEmail={fn()}
      isLoading={true}
      onSubmit={fn()}
      onGoToLogin={fn()}
    />
  ),
};
