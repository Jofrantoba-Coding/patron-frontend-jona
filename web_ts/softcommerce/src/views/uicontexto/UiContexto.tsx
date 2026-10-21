// Layer: public entry. Wires the Impl hook to the pure View.
import type { InterAuthService } from '../../services/InterAuthService';
import { UICONTEXTO_DEFAULTS } from './InterUiContexto';
import { useUiContextoImpl } from './UiContextoImpl';
import { UiContextoView } from './UiContextoView';

export function UiContexto({ service }: { service: InterAuthService }) {
  const impl = useUiContextoImpl(service);
  return <UiContextoView {...UICONTEXTO_DEFAULTS} {...impl} />;
}
