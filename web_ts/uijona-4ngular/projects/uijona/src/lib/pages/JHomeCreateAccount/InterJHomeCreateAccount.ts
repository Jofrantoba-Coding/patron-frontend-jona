/** Contrato publico de JHomeCreateAccount. */
export interface InterJHomeCreateAccount {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  nameError?: string;
  emailError?: string;
  passwordError?: string;
  confirmPasswordError?: string;
  alertMessage?: string;
  isLoading?: boolean;
  appTitle?: string;
  footerText?: string;
}
