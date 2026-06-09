import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JHomeCreateAccount } from './JHomeCreateAccount';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JButton } from '../../atoms/JButton/JButton';
import { JLabel } from '../../atoms/JLabel';

const meta: Meta<typeof JHomeCreateAccount> = {
  title: 'Pages/JHomeCreateAccount',
  component: JHomeCreateAccount,
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
type Story = StoryObj<typeof JHomeCreateAccount>;

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
        <JPanel variant="ghost" padding="none" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '16px' }}>
          <JLabel size="xl" color="success" className="font-bold">¡Cuenta creada exitosamente!</JLabel>
          <JButton variant="link" size="sm" onClick={() => setSuccess(false)}>Registrar otra cuenta</JButton>
        </JPanel>
      );
    }
    return (
      <JHomeCreateAccount
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
