import { useState } from 'react';
import type { UiIniciarSesionProps } from '../uiiniciarsesion/UiIniciarSesionProps';
import type { InterUiHome } from './InterUiHome';

export interface UiHomeTemplateModel extends InterUiHome {
  isPatternGuideVisible: boolean;
  setPatternGuideVisible: (value: boolean) => void;
  handlerOpenPatternGuide: () => void;
  handlerClosePatternGuide: () => void;
}

export interface UiHomeViewModel extends UiHomeTemplateModel {
  loginVm: UiIniciarSesionProps;
}

export function useUiHome(): UiHomeTemplateModel {
  const [isPatternGuideVisible, setPatternGuideVisible] = useState(true);

  function openPatternGuide(): void {
    setPatternGuideVisible(true);
  }

  function closePatternGuide(): void {
    setPatternGuideVisible(false);
  }

  return {
    isPatternGuideVisible,
    setPatternGuideVisible,
    openPatternGuide,
    closePatternGuide,
    handlerOpenPatternGuide: openPatternGuide,
    handlerClosePatternGuide: closePatternGuide,
  };
}
