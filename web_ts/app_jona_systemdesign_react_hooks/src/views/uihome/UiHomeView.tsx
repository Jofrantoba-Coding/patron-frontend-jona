// UiHomeView.tsx — Level 5: Page / JONA Layer: View_Orchestrator
// Instantiates Implementation and injects it into the visual Template.
// Registered as route /login in App.tsx.
import React from 'react';
import { UiHome } from './UiHome';
import { useUiHomeImpl } from './UiHomeImpl';

export const UiHomeView: React.FC = () => {
  const impl = useUiHomeImpl();
  return <UiHome {...impl} />;
};
