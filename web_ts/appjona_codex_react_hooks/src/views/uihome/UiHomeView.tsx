// Capa: View Orchestrator
// Responsabilidad: registrar la vista pública y conectar su implementación.
import { UiHome } from './UiHome';
import { useUiHomeImpl } from './UiHomeImpl';

export function UiHomeView() {
  const impl = useUiHomeImpl();
  return <UiHome {...impl} />;
}
