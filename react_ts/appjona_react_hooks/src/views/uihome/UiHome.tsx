// UiHome.tsx
// Componente visual plantilla — trabajo del maquetador
// Solo renderiza el layout con el formulario de login inyectado por props
import React from 'react';
import { UiIniciarSesion } from '../uiiniciarsesion/UiIniciarSesion';
import BorderLayout from '../../uilayouts/BorderLayout';
import Header from '../../uiutils/Header';
import Footer from '../../uiutils/Footer';

interface UiHomeProps {
  email: string;
  password: string;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  handlerLogin: (e: React.FormEvent) => void;
  handlerCrearCuenta: () => void;
  handlerRecuperarClave: () => void;
}

export const UiHome: React.FC<UiHomeProps> = (props) => {
  return (
    <BorderLayout
      north={<Header />}
      south={<Footer />}
      center={<UiIniciarSesion {...props} />}
    />
  );
};
