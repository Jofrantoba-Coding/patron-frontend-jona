// UiHomeSessionView.tsx
// Orquesta: instancia el hook impl e inyecta en el componente visual
import React from 'react';
import { UiHomeSession } from './UiHomeSession';
import { useUiHomeSessionImpl } from './UiHomeSessionImpl';

export const UiHomeSessionView: React.FC = () => {
  const impl = useUiHomeSessionImpl();

  return <UiHomeSession {...impl} />;
};
