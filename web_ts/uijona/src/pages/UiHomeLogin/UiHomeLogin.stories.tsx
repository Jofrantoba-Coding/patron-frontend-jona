import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { UiHomeLogin } from './UiHomeLogin';

const meta: Meta<typeof UiHomeLogin> = {
  title: 'Pages/UiHomeLogin',
  component: UiHomeLogin,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    appTitle: 'JONA UI',
    footerText: '2026 JONA Pattern',
    onLogin: fn(),
    onGoToCreateAccount: fn(),
    onGoToRecoverPassword: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof UiHomeLogin>;

export const Default: Story = {};

export const LoginError: Story = {
  args: {
    onLogin: async () => {
      throw new Error('Credenciales invalidas.');
    },
  },
};

export const Interactive: Story = {
  args: {
    onLogin: fn(),
    onGoToCreateAccount: fn(),
    onGoToRecoverPassword: fn(),
  },
  render: (args) => {
    const [attempts, setAttempts] = useState(0);
    return (
      <UiHomeLogin
        appTitle="JONA UI"
        footerText="© 2026 JONA Pattern"
        onLogin={async (email, password) => {
          await args.onLogin?.(email, password);
          await new Promise((r) => setTimeout(r, 1200));
          const next = attempts + 1;
          setAttempts(next);
          if (next <= 2) {
            throw new Error(
              next === 1
                ? 'Credenciales incorrectas. Intenta de nuevo.'
                : 'Demasiados intentos. Espera un momento.'
            );
          }
        }}
        onGoToCreateAccount={args.onGoToCreateAccount}
        onGoToRecoverPassword={args.onGoToRecoverPassword}
      />
    );
  },
};
