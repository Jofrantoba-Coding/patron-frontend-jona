import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { UiHomeRecoverPassword } from './UiHomeRecoverPassword';

const meta: Meta<typeof UiHomeRecoverPassword> = {
  title: 'Pages/UiHomeRecoverPassword',
  component: UiHomeRecoverPassword,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    appTitle: 'JONA UI',
    footerText: '2026 JONA Pattern',
    onRecover: fn(),
    onGoToLogin: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof UiHomeRecoverPassword>;

export const Default: Story = {};

export const RecoverError: Story = {
  args: {
    onRecover: async () => {
      throw new Error('No se pudo enviar el enlace.');
    },
  },
};

export const Interactive: Story = {
  render: () => {
    const [attempt, setAttempt] = useState(0);
    return (
      <UiHomeRecoverPassword
        appTitle="JONA UI"
        footerText="© 2026 JONA Pattern"
        onRecover={async () => {
          await new Promise((r) => setTimeout(r, 1200));
          setAttempt((a) => a + 1);
        }}
        onGoToLogin={() => alert('Volver al login')}
      />
    );
  },
};
