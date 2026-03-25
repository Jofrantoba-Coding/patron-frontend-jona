import { useState, type FormEvent } from 'react';
import type { InterUiIniciarSesion } from './InterUiIniciarSesion';
import type { UiIniciarSesionProps } from './UiIniciarSesionProps';

export interface UiIniciarSesionTemplateModel
  extends InterUiIniciarSesion,
    UiIniciarSesionProps {
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setEmailError: (value: string) => void;
  setPasswordError: (value: string) => void;
  setSubmitError: (value: string) => void;
  setIsSubmitting: (value: boolean) => void;
}

export function useUiIniciarSesion(): UiIniciarSesionTemplateModel {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function isValidData(nextEmail: string, nextPassword: string): boolean {
    const trimmedEmail = nextEmail.trim();
    const trimmedPassword = nextPassword.trim();
    let valid = true;

    if (!trimmedEmail) {
      setEmailError('El email es obligatorio.');
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      setEmailError('El email debe tener un formato valido.');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!trimmedPassword) {
      setPasswordError('La contrasena es obligatoria.');
      valid = false;
    } else if (trimmedPassword.length < 6) {
      setPasswordError('La contrasena debe tener al menos 6 caracteres.');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  }

  function login(_email: string, _password: string): void {
    setSubmitError('El Template no puede autenticar; ese trabajo pertenece al Impl.');
  }

  function goToCreateAccount(): void {
    setSubmitError('La navegacion real a crear cuenta debe integrarse en UiIniciarSesionImpl.');
  }

  function goToRecoverPassword(): void {
    setSubmitError('La recuperacion de contrasena debe integrarse en UiIniciarSesionImpl.');
  }

  function handlerEmailChange(value: string): void {
    setEmail(value);
    if (emailError) {
      setEmailError('');
    }
    if (submitError) {
      setSubmitError('');
    }
  }

  function handlerPasswordChange(value: string): void {
    setPassword(value);
    if (passwordError) {
      setPasswordError('');
    }
    if (submitError) {
      setSubmitError('');
    }
  }

  function handlerLogin(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setSubmitError('');

    if (isValidData(email, password)) {
      login(email, password);
    }
  }

  function handlerGoToCreateAccount(): void {
    goToCreateAccount();
  }

  function handlerGoToRecoverPassword(): void {
    goToRecoverPassword();
  }

  return {
    email,
    password,
    emailError,
    passwordError,
    submitError,
    isSubmitting,
    setEmail,
    setPassword,
    setEmailError,
    setPasswordError,
    setSubmitError,
    setIsSubmitting,
    login,
    goToCreateAccount,
    goToRecoverPassword,
    isValidData,
    handlerEmailChange,
    handlerPasswordChange,
    handlerLogin,
    handlerGoToCreateAccount,
    handlerGoToRecoverPassword,
  };
}
