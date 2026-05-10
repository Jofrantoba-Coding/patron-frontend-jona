import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
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

export const Interactive: Story = {
  render: () => {
    const [errorCode, setErrorCode] = useState<'404' | '500' | '403'>('404');
    const errors = {
      '404': { title: 'Página no encontrada', message: 'La página que buscas no existe o fue movida.', primaryLabel: 'Ir al inicio', secondaryLabel: 'Volver' },
      '500': { title: 'Error del servidor', message: 'Algo salió mal. Por favor intenta de nuevo más tarde.', primaryLabel: 'Recargar', secondaryLabel: 'Ir al inicio' },
      '403': { title: 'Acceso denegado', message: 'No tienes permisos para ver este recurso.', primaryLabel: 'Iniciar sesión', secondaryLabel: 'Volver' },
    };
    return (
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 10 }}>
          {(['404', '500', '403'] as const).map((code) => (
            <button
              key={code}
              onClick={() => setErrorCode(code)}
              style={{ borderRadius: '6px', border: '1px solid #d4d4d4', padding: '4px 12px', fontSize: '13px', cursor: 'pointer', background: errorCode === code ? '#171717' : '#fff', color: errorCode === code ? '#fff' : '#404040' }}
            >
              {code}
            </button>
          ))}
        </div>
        <ErrorPageOrganism
          errorCode={errorCode}
          {...errors[errorCode]}
          onGoHome={() => setErrorCode('404')}
          onGoBack={() => alert('Volver')}
        />
      </div>
    );
  },
};
