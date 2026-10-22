// Layer: Interface. Public contract of login step 1: shapes and defaults only, no logic.

export interface TenantOption {
  value: string;
  label: string;
}

export interface InterUiLogin {
  title?: string;
  submitLabel?: string;
  tenantOptions: TenantOption[];
  tenantId: string;
  usuario: string;
  clave: string;
  tenantError?: string;
  usuarioError?: string;
  claveError?: string;
  /** Server or account-rejection message. */
  submitError?: string;
  /** Support reference of a server error. */
  submitErrorTraceId?: string;
  isLoadingTenants?: boolean;
  isSubmitting?: boolean;
  /** Callbacks are value-first: the business value, no DOM event. */
  onTenantChange?: (tenantId: string) => void;
  onUsuarioChange?: (usuario: string) => void;
  onClaveChange?: (clave: string) => void;
  onSubmit?: () => void;
}

/** Presentation defaults only; field values and flags are state and never defaulted. */
export const UILOGIN_DEFAULTS: Required<Pick<InterUiLogin, 'title' | 'submitLabel'>> = {
  title: 'Iniciar sesión',
  submitLabel: 'Ingresar',
};
