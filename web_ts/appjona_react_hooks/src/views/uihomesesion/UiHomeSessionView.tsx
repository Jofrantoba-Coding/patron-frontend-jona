// UiHomeSessionView.tsx
// Orchestrator: instantiates the impl hook and injects it into the visual component
import React from 'react';
import { UiHomeSession } from './UiHomeSession';
import { useUiHomeSessionImpl } from './UiHomeSessionImpl';

export const UiHomeSessionView: React.FC = () => {
  const impl = useUiHomeSessionImpl();

  return <UiHomeSession {...impl} />;
};
