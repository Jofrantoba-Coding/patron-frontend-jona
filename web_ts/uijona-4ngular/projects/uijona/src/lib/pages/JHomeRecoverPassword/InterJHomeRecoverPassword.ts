/** Contrato publico de JHomeRecoverPassword. */
export interface InterJHomeRecoverPassword {
  email?: string;
  emailError?: string;
  alertMessage?: string;
  successMessage?: string;
  isLoading?: boolean;
  appTitle?: string;
  footerText?: string;
}
