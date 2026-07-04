/** Contrato publico de JRecoverPassword. */
export interface InterJRecoverPassword {
  email?: string;
  emailError?: string;
  alertMessage?: string;
  successMessage?: string;
  isLoading?: boolean;
}
