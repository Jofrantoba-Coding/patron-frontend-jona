// UiHomeSessionView.tsx
// Orchestrator: injects navigate into the implementation class
import { useNavigate } from 'react-router-dom';
import { UiHomeSessionImpl } from './UiHomeSessionImpl';

export const UiHomeSessionView = () => {
  const navigate = useNavigate();
  return <UiHomeSessionImpl navigate={navigate} />;
};
