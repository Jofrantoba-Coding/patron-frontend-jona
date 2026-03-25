import type { UiIniciarSesionProps } from '../uiiniciarsesion/UiIniciarSesionProps';

export interface UiHomeProps {
  loginVm: UiIniciarSesionProps;
  isPatternGuideVisible: boolean;
  handlerOpenPatternGuide: () => void;
  handlerClosePatternGuide: () => void;
}
