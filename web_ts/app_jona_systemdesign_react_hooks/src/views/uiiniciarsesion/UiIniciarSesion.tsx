// UiIniciarSesion.tsx — Level 3: Organism / JONA Layer: Template
// UI designer's responsibility. Composes Molecules and Atoms.
// No external service calls.
import React, { useState } from 'react';
import { InterUiIniciarSesion } from './InterUiIniciarSesion';
import { FormFieldMolecule } from '../../molecules/FormFieldMolecule';
import { ButtonAtom } from '../../atoms/ButtonAtom';
import { CardMolecule, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../molecules/CardMolecule';
import { AlertMolecule } from '../../molecules/AlertMolecule';

// Template hook — state + default method implementations
export function useUiIniciarSesion(): InterUiIniciarSesion & {
  email: string;
  password: string;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  emailError: string;
  passwordError: string;
  alertMessage: string;
  isLoading: boolean;
  handlerLogin: (e: React.FormEvent) => void;
  handlerGoToCreateAccount: () => void;
  handlerGoToRecoverPassword: () => void;
} {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function isValidData(email: string, password: string): boolean {
    let valid = true;
    setEmailError(!email ? 'Email is required' : '');
    setPasswordError(!password ? 'Password is required' : '');
    if (!email || !password) valid = false;
    return valid;
  }

  function login(_email: string, _password: string): void {
    setAlertMessage('Template default — login called');
  }

  function goToCreateAccount(): void {
    console.log('Template — goToCreateAccount');
  }

  function goToRecoverPassword(): void {
    console.log('Template — goToRecoverPassword');
  }

  function handlerLogin(e: React.FormEvent): void {
    e.preventDefault();
    if (isValidData(email, password)) login(email, password);
  }

  return {
    email, password, setEmail, setPassword,
    emailError, passwordError, alertMessage, isLoading,
    setIsLoading,
    login, goToCreateAccount, goToRecoverPassword, isValidData,
    handlerLogin,
    handlerGoToCreateAccount: goToCreateAccount,
    handlerGoToRecoverPassword: goToRecoverPassword,
  } as ReturnType<typeof useUiIniciarSesion>;
}

// Visual component — all state/handlers injected via props
interface UiIniciarSesionProps {
  email: string;
  password: string;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  emailError: string;
  passwordError: string;
  alertMessage: string;
  isLoading: boolean;
  handlerLogin: (e: React.FormEvent) => void;
  handlerGoToCreateAccount: () => void;
  handlerGoToRecoverPassword: () => void;
}

export const UiIniciarSesion: React.FC<UiIniciarSesionProps> = ({
  email, password, setEmail, setPassword,
  emailError, passwordError, alertMessage, isLoading,
  handlerLogin, handlerGoToCreateAccount, handlerGoToRecoverPassword,
}) => {
  return (
    <div className="flex items-center justify-center min-h-full py-8 px-4">
      <CardMolecule className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>

        <CardContent>
          {alertMessage && (
            <AlertMolecule variant="destructive" title="Error" className="mb-4">
              {alertMessage}
            </AlertMolecule>
          )}
          <form className="space-y-4" onSubmit={handlerLogin} noValidate>
            <FormFieldMolecule
              id="txtEmail"
              label="Email"
              type="email"
              value={email}
              onChange={(value) => setEmail(value)}
              placeholder="you@example.com"
              errorMessage={emailError}
              required
            />
            <FormFieldMolecule
              id="txtPassword"
              label="Password"
              type="password"
              value={password}
              onChange={(value) => setPassword(value)}
              placeholder="••••••••"
              errorMessage={passwordError}
              required
            />
            <ButtonAtom type="submit" fullWidth loading={isLoading}>
              Sign in
            </ButtonAtom>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <ButtonAtom variant="ghost" fullWidth onClick={handlerGoToCreateAccount}>
            Create account
          </ButtonAtom>
          <ButtonAtom variant="link" fullWidth onClick={handlerGoToRecoverPassword}>
            Forgot password?
          </ButtonAtom>
        </CardFooter>
      </CardMolecule>
    </div>
  );
};
