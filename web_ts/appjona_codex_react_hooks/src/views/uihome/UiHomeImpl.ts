// Capa: Implementation
// Responsabilidad: orquestar el organismo principal y conectar storage + organismo hijo.
import { useEffect } from 'react';
import {
  readHomeGuideDismissed,
  writeHomeGuideDismissed,
} from '../../appStorage';
import { useUiIniciarSesionImpl } from '../uiiniciarsesion/UiIniciarSesionImpl';
import { useUiHome, type UiHomeViewModel } from './UiHome';

export function useUiHomeImpl(): UiHomeViewModel {
  const base = useUiHome();
  const loginVm = useUiIniciarSesionImpl();

  useEffect(() => {
    if (readHomeGuideDismissed()) {
      base.setPatternGuideVisible(false);
    }
  }, [base.setPatternGuideVisible]);

  function openPatternGuide(): void {
    writeHomeGuideDismissed(false);
    base.setPatternGuideVisible(true);
  }

  function closePatternGuide(): void {
    writeHomeGuideDismissed(true);
    base.setPatternGuideVisible(false);
  }

  return {
    ...base,
    openPatternGuide,
    closePatternGuide,
    handlerOpenPatternGuide: openPatternGuide,
    handlerClosePatternGuide: closePatternGuide,
    loginVm,
  };
}
