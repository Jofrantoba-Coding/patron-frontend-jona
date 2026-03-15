// UiIniciarSesionView.tsx
// Orchestrator: injects navigate into the implementation class
import { useNavigate } from 'react-router-dom';
import { UiIniciarSesionImpl } from './UiIniciarSesionImpl';

export const UiIniciarSesionView = () => {
  const navigate = useNavigate();
  return <UiIniciarSesionImpl navigate={navigate} />;
};
