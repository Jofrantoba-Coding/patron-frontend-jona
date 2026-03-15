// UiHome.tsx
// Visual template component — UI designer's responsibility
// Renders the layout with the login form injected via props
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
  handlerGoToCreateAccount: () => void;
  handlerGoToRecoverPassword: () => void;
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
