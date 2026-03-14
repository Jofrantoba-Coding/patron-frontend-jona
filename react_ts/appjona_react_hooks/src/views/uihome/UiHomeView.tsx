// UiHomeView.tsx
// Orchestrator: instantiates the impl hook and injects it into the visual component
import React from 'react';
import { UiHome } from './UiHome';
import { useUiHomeImpl } from './UiHomeImpl';

export const UiHomeView: React.FC = () => {
  const impl = useUiHomeImpl();

  return <UiHome {...impl} />;
};
