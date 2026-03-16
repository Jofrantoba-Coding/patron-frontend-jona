// UiHome.tsx — Level 3: Organism / JONA Layer: Template (visual)
// Composes BorderLayout (Design Template) + UiIniciarSesion (Organism).
// No service calls — UI designer's responsibility.
import React from 'react';
import BorderLayout from '../../uilayouts/BorderLayout';
import { UiIniciarSesion } from '../uiiniciarsesion/UiIniciarSesion';

interface UiHomeProps {
  email: string;
  password: string;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  emailError: string;
  passwordError: string;
  handlerLogin: (e: React.FormEvent) => void;
  handlerGoToCreateAccount: () => void;
  handlerGoToRecoverPassword: () => void;
}

export const UiHome: React.FC<UiHomeProps> = (props) => {
  return (
    <BorderLayout
      north={<span className="font-semibold text-lg">JONA System Design</span>}
      south={<span>© 2026 JONA Pattern — @jofrantoba</span>}
      center={<UiIniciarSesion {...props} />}
    />
  );
};
