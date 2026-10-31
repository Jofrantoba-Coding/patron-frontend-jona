/** Contrato de UI, estilo modelo de vista: lo que la vista recibe. */
export interface InterUiLogin {
  title?: string;
  submitLabel?: string;
  rememberLabel?: string;
  email: string;
  password: string;
  remember: boolean;
  emailError?: string;
  passwordError?: string;
  error?: string;
  isSubmitting?: boolean;
  /** Los callbacks reciben primero el valor de negocio, no el evento del control. */
  onEmailChange?: (email: string) => void;
  onPasswordChange?: (password: string) => void;
  onRememberChange?: (remember: boolean) => void;
  onSubmit?: () => void;
}

/** Solo valores de presentación; los valores de los campos son estado y no tienen default. */
export const UILOGIN_DEFAULTS: Required<Pick<InterUiLogin, 'title' | 'submitLabel' | 'rememberLabel'>> = {
  title: 'Iniciar sesión',
  submitLabel: 'Ingresar',
  rememberLabel: 'Recordarme',
};
