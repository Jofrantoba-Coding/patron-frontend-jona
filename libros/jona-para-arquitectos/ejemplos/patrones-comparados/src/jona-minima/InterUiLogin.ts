/** Contrato de UI, estilo modelo de vista: lo que la vista recibe. */
export interface InterUiLogin {
  title?: string;
  submitLabel?: string;
  email: string;
  password: string;
  error?: string;
  isSubmitting?: boolean;
  /** Los callbacks reciben primero el valor de negocio, no el evento del control. */
  onEmailChange?: (email: string) => void;
  onPasswordChange?: (password: string) => void;
  onSubmit?: () => void;
}

/** Solo valores de presentación; los valores de los campos son estado y no tienen default. */
export const UILOGIN_DEFAULTS: Required<Pick<InterUiLogin, 'title' | 'submitLabel'>> = {
  title: 'Iniciar sesión',
  submitLabel: 'Ingresar',
};
