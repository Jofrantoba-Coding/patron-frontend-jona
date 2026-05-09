import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { UiHomeError } from './UiHomeError';

const meta: Meta<typeof UiHomeError> = {
  title: 'Pages/UiHomeError',
  component: UiHomeError,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    onGoHome: fn(),
    onGoBack: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof UiHomeError>;

export const NotFound: Story = {};

export const ServerError: Story = {
  args: {
    errorCode: 500,
    title: 'Error interno',
    message: 'La aplicacion no pudo completar la solicitud.',
    primaryLabel: 'Ir al inicio',
    secondaryLabel: 'Reintentar',
  },
};
