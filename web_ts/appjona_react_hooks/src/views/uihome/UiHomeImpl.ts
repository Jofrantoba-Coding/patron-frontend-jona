// UiHomeImpl.ts
// Implementation hook — integrator's responsibility
// Methods only, no UI code
import { useEffect } from 'react';
import { useUiIniciarSesionImpl } from '../uiiniciarsesion/UiIniciarSesionImpl';
import { InterUiHome } from './InterUiHome';

export function useUiHomeImpl(): InterUiHome & ReturnType<typeof useUiIniciarSesionImpl> {
  const loginImpl = useUiIniciarSesionImpl();

  useEffect(() => {
    onMount();
  }, []);

  function onMount(): void {
    console.log('UiHomeImpl mounted (implementation)');
  }

  return {
    ...loginImpl,
    onMount,
  };
}
