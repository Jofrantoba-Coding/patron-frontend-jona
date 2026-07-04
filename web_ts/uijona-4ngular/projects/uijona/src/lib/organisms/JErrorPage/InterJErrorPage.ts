/** Contrato publico de JErrorPage. */
export interface InterJErrorPage {
  errorCode?: string | number;
  title?: string;
  message?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
}
