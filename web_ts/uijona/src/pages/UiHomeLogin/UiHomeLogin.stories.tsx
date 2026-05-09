import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
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
