// UiHomeImpl.ts
// Hook de implementación — trabajo del integrador
// Solo métodos, sin código de interfaz gráfica
import { useEffect } from 'react';
import { useUiIniciarSesionImpl } from '../uiiniciarsesion/UiIniciarSesionImpl';
import { InterUiHome } from './InterUiHome';

export function useUiHomeImpl(): InterUiHome & ReturnType<typeof useUiIniciarSesionImpl> {
  const loginImpl = useUiIniciarSesionImpl();

  useEffect(() => {
    onMount();
  }, []);

  function onMount(): void {
    console.log('UiHomeImpl montado (implementación)');
  }

  return {
    ...loginImpl,
    onMount,
  };
}
