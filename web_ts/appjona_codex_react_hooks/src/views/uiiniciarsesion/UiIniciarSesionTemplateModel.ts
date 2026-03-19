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
