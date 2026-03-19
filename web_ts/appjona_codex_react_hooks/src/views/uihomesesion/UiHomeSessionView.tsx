// Capa: View Orchestrator
// Responsabilidad: exponer la página autenticada como punto de entrada de ruta.
import { UiHomeSession } from './UiHomeSession';
import { useUiHomeSessionImpl } from './UiHomeSessionImpl';

export function UiHomeSessionView() {
  const impl = useUiHomeSessionImpl();
  return <UiHomeSession {...impl} />;
}
