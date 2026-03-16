// UiHomeImpl.ts — Level 3: Organism / JONA Layer: Implementation
// Integrator's responsibility. Composes UiIniciarSesionImpl.
import { useEffect } from 'react';
import { useUiIniciarSesionImpl } from '../uiiniciarsesion/UiIniciarSesionImpl';

export function useUiHomeImpl() {
  const loginImpl = useUiIniciarSesionImpl();

  useEffect(() => {
    onMount();
  }, []);

  function onMount(): void {
    console.log('UiHomeImpl mounted');
  }

  return { ...loginImpl, onMount };
}
