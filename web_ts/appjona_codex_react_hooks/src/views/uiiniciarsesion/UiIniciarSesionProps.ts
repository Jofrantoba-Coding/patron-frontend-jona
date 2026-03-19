import type { FormEvent } from 'react';

export interface UiIniciarSesionProps {
  email: string;
  password: string;
  emailError: string;
  passwordError: string;
  submitError: string;
  isSubmitting: boolean;
  handlerEmailChange: (value: string) => void;
  handlerPasswordChange: (value: string) => void;
  handlerLogin: (event: FormEvent<HTMLFormElement>) => void;
  handlerGoToCreateAccount: () => void;
  handlerGoToRecoverPassword: () => void;
}
