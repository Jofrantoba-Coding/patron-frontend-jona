// UiHome.tsx
import React from 'react';
import { UiIniciarSesion } from '../uiiniciarsesion/UiIniciarSesion';
import { useUiIniciarSesionImpl } from '../uiiniciarsesion/UiIniciarSesionImpl';
import BorderLayout from '../../uilayouts/BorderLayout';
import Header from '../../uiutils/Header';
import Footer from '../../uiutils/Footer';

export const UiHome: React.FC = () => {
  // El hook de implementación provee los métodos sobreescritos
  const impl = useUiIniciarSesionImpl();

  return (
    <BorderLayout
      north={<Header />}
      south={<Footer />}
      center={<UiIniciarSesion {...impl} />}
    />
  );
};
