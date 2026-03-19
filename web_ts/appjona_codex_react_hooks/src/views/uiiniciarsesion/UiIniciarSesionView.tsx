// Capa: View Orchestrator
// Responsabilidad: instanciar la implementación y entregarla al componente visual.
import { UiIniciarSesion } from './UiIniciarSesion';
import { useUiIniciarSesionImpl } from './UiIniciarSesionImpl';

export function UiIniciarSesionView() {
  const impl = useUiIniciarSesionImpl();
  return <UiIniciarSesion {...impl} />;
}
