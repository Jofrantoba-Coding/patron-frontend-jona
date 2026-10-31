import { useState } from 'react';
import type { InterUiLogin } from './InterUiLogin';

export const MISSING_DATA_ERROR = 'Ingrese su correo y su contraseña.';

export function isValidData(email: string, password: string): boolean {
  return email !== '' && password !== '';
}

/** El modelo de vista más las operaciones que la Implementación necesita para reemplazar onSubmit. */
export interface UiLoginBaseModel extends InterUiLogin {
  setError: (error: string | undefined) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
}

/** Modelo base: estado y comportamiento por defecto, sin integración. */
export function useUiLoginBase(): UiLoginBaseModel {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Comportamiento por defecto: valida y no llama a ningún sistema.
  const onSubmit = () => setError(isValidData(email, password) ? undefined : MISSING_DATA_ERROR);

  return { email, password, error, isSubmitting, onSubmit, setError, setIsSubmitting,
           onEmailChange: setEmail, onPasswordChange: setPassword };
}
