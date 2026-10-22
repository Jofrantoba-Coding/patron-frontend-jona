// Layer: public entry. Wires the Impl hook to the pure View.
import type { InterAuthService } from '../../services/InterAuthService';
import { UILOGIN_DEFAULTS } from './InterUiLogin';
import { useUiLoginImpl } from './UiLoginImpl';
import { UiLoginView } from './UiLoginView';

export function UiLogin({ service }: { service: InterAuthService }) {
  const impl = useUiLoginImpl(service);
  return <UiLoginView {...UILOGIN_DEFAULTS} {...impl} />;
}
