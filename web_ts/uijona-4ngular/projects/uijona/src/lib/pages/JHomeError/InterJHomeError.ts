/** Contrato publico de JHomeError. */
export interface InterJHomeError {
  errorCode?: string | number;
  title?: string;
  message?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  appTitle?: string;
  footerText?: string;
}
