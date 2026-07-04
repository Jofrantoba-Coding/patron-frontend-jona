/** Contrato publico de JHomeLogin. */
export interface InterJHomeLogin {
  email?: string;
  password?: string;
  emailError?: string;
  passwordError?: string;
  alertMessage?: string;
  isLoading?: boolean;
  appTitle?: string;
  footerText?: string;
}
