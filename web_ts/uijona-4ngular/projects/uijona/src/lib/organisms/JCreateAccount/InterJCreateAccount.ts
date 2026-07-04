/** Contrato publico de JCreateAccount. */
export interface InterJCreateAccount {
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
}
