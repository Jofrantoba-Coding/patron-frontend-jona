// UiHomeSessionView.tsx — Level 5: Page / JONA Layer: View_Orchestrator
// Instantiates Implementation and injects it into the visual Template.
// Registered as route /homesesion in App.tsx.
import React from 'react';
import { UiHomeSession } from './UiHomeSession';
import { useUiHomeSessionImpl } from './UiHomeSessionImpl';

export const UiHomeSessionView: React.FC = () => {
  const impl = useUiHomeSessionImpl();
  return <UiHomeSession {...impl} />;
};
