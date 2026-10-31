import type { InterAuthService, LoginResult } from '../services/InterAuthService';
import { UILOGIN_DEFAULTS } from './InterUiLogin';
import { useUiLoginImpl } from './UiLoginImpl';
import { UiLoginView } from './UiLoginView';

export interface UiLoginProps {
  service: InterAuthService;
  onAuthenticated: (result: LoginResult) => void;
}

/** Entrada: recibe el servicio, lo pasa a la Implementación y aplica los DEFAULTS. */
export function UiLogin({ service, onAuthenticated }: UiLoginProps) {
  const impl = useUiLoginImpl(service, onAuthenticated);
  return <UiLoginView {...UILOGIN_DEFAULTS} {...impl} />;
}
