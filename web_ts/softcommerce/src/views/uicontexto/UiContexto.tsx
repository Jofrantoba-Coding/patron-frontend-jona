// Layer: public entry. Wires the Impl hook to the pure View.
import type { InterAuthService } from '../../services/InterAuthService';
import type { InterGrantsService } from '../../services/InterGrantsService';
import { UICONTEXTO_DEFAULTS } from './InterUiContexto';
import { useUiContextoImpl } from './UiContextoImpl';
import { UiContextoView } from './UiContextoView';

/** `grants` takes the login snapshot (R-AUTH-11); without it the session holds none and the shell asks the server. */
export function UiContexto({ service, grants }: { service: InterAuthService; grants?: InterGrantsService }) {
  const impl = useUiContextoImpl(service, grants);
  return <UiContextoView {...UICONTEXTO_DEFAULTS} {...impl} />;
}
