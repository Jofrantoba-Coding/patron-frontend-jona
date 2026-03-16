// UiIniciarSesion.tsx — Level 3: Organism / JONA Layer: Template
// UI designer's responsibility.
// Composes Molecules and Atoms. No external service calls.
import React, { useState } from 'react';
import { InterUiIniciarSesion } from './InterUiIniciarSesion';
import { FormFieldMolecule } from '../../molecules/FormFieldMolecule';
import { ButtonAtom } from '../../atoms/ButtonAtom';

// Template hook — provides state and default method implementations
export function useUiIniciarSesion(): InterUiIniciarSesion & {
  email: string;
  password: string;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  emailError: string;
  passwordError: string;
  handlerLogin: (e: React.FormEvent) => void;
  handlerGoToCreateAccount: () => void;
  handlerGoToRecoverPassword: () => void;
} {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  function isValidData(email: string, password: string): boolean {
    let valid = true;
    if (!email) { setEmailError('Email is required'); valid = false; }
    else setEmailError('');
    if (!password) { setPasswordError('Password is required'); valid = false; }
    else setPasswordError('');
    return valid;
  }

  function login(email: string, password: string): void {
    console.log('Template — login (default):', email, password);
    window.alert('Template default login');
  }

  function goToCreateAccount(): void {
    console.log('Template — goToCreateAccount (default)');
  }

  function goToRecoverPassword(): void {
    console.log('Template — goToRecoverPassword (default)');
  }

  function handlerLogin(e: React.FormEvent): void {
    e.preventDefault();
    if (isValidData(email, password)) login(email, password);
  }

  function handlerGoToCreateAccount(): void { goToCreateAccount(); }
  function handlerGoToRecoverPassword(): void { goToRecoverPassword(); }

  return {
    email, password, setEmail, setPassword,
    emailError, passwordError,
    login, goToCreateAccount, goToRecoverPassword, isValidData,
    handlerLogin, handlerGoToCreateAccount, handlerGoToRecoverPassword,
  };
}

// Visual component — receives all state/handlers via props (injected by View_Orchestrator)
interface UiIniciarSesionProps {
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

export const UiIniciarSesion: React.FC<UiIniciarSesionProps> = ({
  email, password, setEmail, setPassword,
  emailError, passwordError,
  handlerLogin, handlerGoToCreateAccount, handlerGoToRecoverPassword,
}) => {
  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white rounded-token-lg shadow-md">
      <h2 className="text-xl font-semibold text-neutral-900 mb-6">Sign In</h2>
      <form className="space-y-4" onSubmit={handlerLogin} noValidate>
        <FormFieldMolecule
          id="txtEmail"
          label="Email"
          value={email}
          onChange={setEmail}
          type="email"
          placeholder="you@example.com"
          errorMessage={emailError}
        />
        <FormFieldMolecule
          id="txtPassword"
          label="Password"
          value={password}
          onChange={setPassword}
          type="password"
          placeholder="••••••••"
          errorMessage={passwordError}
        />
        <ButtonAtom label="Login" type="submit" fullWidth />
        <div className="flex gap-2">
          <ButtonAtom label="Create account" variant="secondary" onClick={handlerGoToCreateAccount} fullWidth />
          <ButtonAtom label="Recover password" variant="secondary" onClick={handlerGoToRecoverPassword} fullWidth />
        </div>
      </form>
    </div>
  );
};
