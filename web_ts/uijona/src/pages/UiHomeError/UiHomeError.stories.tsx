import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { UiHomeError } from './UiHomeError';
import { ButtonAtom } from '../../atoms/ButtonAtom/ButtonAtom';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';

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

export const Interactive: Story = {
  args: {
    onGoHome: fn(),
    onGoBack: fn(),
  },
  render: (args) => {
    const [code, setCode] = useState<number>(404);
    const configs: Record<number, { title: string; message: string; primaryLabel: string; secondaryLabel: string }> = {
      404: { title: 'Página no encontrada', message: 'La página que buscas no existe o fue movida.', primaryLabel: 'Ir al inicio', secondaryLabel: 'Volver' },
      500: { title: 'Error del servidor', message: 'Algo salió mal. Intenta de nuevo más tarde.', primaryLabel: 'Recargar', secondaryLabel: 'Ir al inicio' },
      403: { title: 'Acceso denegado', message: 'No tienes permisos para ver este recurso.', primaryLabel: 'Iniciar sesión', secondaryLabel: 'Volver' },
    };
    return (
      <PanelAtom variant="ghost" padding="none" style={{ position: 'relative' }}>
        <PanelAtom variant="ghost" padding="none" style={{ position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 10 }}>
          {[404, 500, 403].map((c) => (
            <ButtonAtom
              key={c}
              variant={code === c ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCode(c)}
            >
              {c}
            </ButtonAtom>
          ))}
        </PanelAtom>
        <UiHomeError
          errorCode={code}
          {...configs[code]}
          onGoHome={() => { args.onGoHome?.(); setCode(404); }}
          onGoBack={args.onGoBack}
        />
      </PanelAtom>
    );
  },
};
