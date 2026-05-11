import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { UiHomeCreateAccount } from './UiHomeCreateAccount';

const meta: Meta<typeof UiHomeCreateAccount> = {
  title: 'Pages/UiHomeCreateAccount',
  component: UiHomeCreateAccount,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    appTitle: 'JONA UI',
    footerText: '2026 JONA Pattern',
    onCreateAccount: fn(),
    onGoToLogin: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof UiHomeCreateAccount>;

export const Default: Story = {};

export const CreateError: Story = {
  args: {
    onCreateAccount: async () => {
      throw new Error('No se pudo crear la cuenta.');
    },
  },
};

export const Interactive: Story = {
  args: {
    onCreateAccount: fn(),
    onGoToLogin: fn(),
  },
  render: (args) => {
    const [success, setSuccess] = useState(false);
    if (success) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '16px' }}>
          <p style={{ fontSize: '20px', fontWeight: 700, color: '#16a34a' }}>¡Cuenta creada exitosamente!</p>
          <button onClick={() => setSuccess(false)} style={{ fontSize: '14px', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}>Registrar otra cuenta</button>
        </div>
      );
    }
    return (
      <UiHomeCreateAccount
        appTitle="JONA UI"
        footerText="© 2026 JONA Pattern"
        onCreateAccount={async (name, email, password) => {
          await args.onCreateAccount?.(name, email, password);
          await new Promise((r) => setTimeout(r, 1500));
          setSuccess(true);
        }}
        onGoToLogin={args.onGoToLogin}
      />
    );
  },
};
