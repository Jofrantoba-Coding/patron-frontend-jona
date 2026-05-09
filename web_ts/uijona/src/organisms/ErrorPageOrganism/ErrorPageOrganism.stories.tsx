import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ErrorPageOrganism } from './ErrorPageOrganism';

const meta: Meta<typeof ErrorPageOrganism> = {
  title: 'Organisms/ErrorPageOrganism',
  component: ErrorPageOrganism,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { onGoHome: fn(), onGoBack: fn() },
};
export default meta;
type Story = StoryObj<typeof ErrorPageOrganism>;

export const NotFound: Story = {
  args: {
    errorCode: '404',
    title: 'Página no encontrada',
    message: 'La página que buscas no existe o fue movida.',
    primaryLabel: 'Ir al inicio',
    secondaryLabel: 'Volver',
  },
};

export const ServerError: Story = {
  args: {
    errorCode: '500',
    title: 'Error del servidor',
    message: 'Algo salió mal en nuestros servidores. Intenta de nuevo más tarde.',
    primaryLabel: 'Recargar página',
    secondaryLabel: 'Ir al inicio',
  },
};

export const Forbidden: Story = {
  args: {
    errorCode: '403',
    title: 'Acceso denegado',
    message: 'No tienes permisos para ver este recurso.',
    primaryLabel: 'Iniciar sesión',
    secondaryLabel: 'Volver',
  },
};
