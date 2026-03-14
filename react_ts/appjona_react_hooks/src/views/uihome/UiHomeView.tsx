// UiHomeView.tsx
// Orquesta: instancia el hook impl e inyecta en el componente visual
import React from 'react';
import { UiHome } from './UiHome';
import { useUiHomeImpl } from './UiHomeImpl';

export const UiHomeView: React.FC = () => {
  const impl = useUiHomeImpl();

  return <UiHome {...impl} />;
};
