/** Contrato publico de JLogin. */
export interface InterJLogin {
  email?: string;
  password?: string;
  emailError?: string;
  passwordError?: string;
  alertMessage?: string;
  isLoading?: boolean;
}
