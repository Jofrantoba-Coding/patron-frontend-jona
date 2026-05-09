import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
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
