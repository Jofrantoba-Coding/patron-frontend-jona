import type { LoginResult } from '../../../entities/session';
import type { InterAuthService } from '../model/InterAuthService';
import { UILOGIN_DEFAULTS } from '../model/InterUiLogin';
import { useUiLoginImpl } from '../model/UiLoginImpl';
import { UiLoginView } from './UiLoginView';

export interface UiLoginProps {
  /** El puerto: la entrada recibe el servicio; quién lo implementa lo decide app. */
  service: InterAuthService;
  onAuthenticated: (result: LoginResult) => void;
}

/** Entrada: compone la Implementación y la vista, y aplica los DEFAULTS. */
export function UiLogin({ service, onAuthenticated }: UiLoginProps) {
  const impl = useUiLoginImpl(service, onAuthenticated);
  return <UiLoginView {...UILOGIN_DEFAULTS} {...impl} />;
}
