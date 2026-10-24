// Layer: public entry. Wires the Impl hook to the pure View.
import type { Permissions } from '../../domain/permissions';
import { UISOCIOACCIONES_DEFAULTS } from './InterUiSocioAcciones';
import { useUiSocioAccionesImpl } from './UiSocioAccionesImpl';
import { UiSocioAccionesView } from './UiSocioAccionesView';

/** `miAccionSocio`: the two global lists of socio and price actions, edited together and saved atomically (R-MST-16, R-MOCK-26). */
export function UiSocioAcciones(_props: { permissions?: Permissions }) {
  const impl = useUiSocioAccionesImpl();
  return <UiSocioAccionesView {...UISOCIOACCIONES_DEFAULTS} {...impl} />;
}
