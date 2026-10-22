// Layer: Interface. Public contract of the session header: shapes and defaults only, no logic.

export interface InterShellHeader {
  logoutLabel?: string;
  userLabel?: string;
  empresaLabel?: string;
  puntoVentaLabel?: string;
  periodLabel?: string;
  userName: string;
  empresaName: string;
  puntoVentaName: string;
  /** Read-only, already formatted `dd/MM/yyyy – dd/MM/yyyy`. */
  period: string;
  onLogout?: () => void;
}

/** Presentation defaults only; the session values are state and never defaulted. */
export const SHELLHEADER_DEFAULTS: Required<
  Pick<InterShellHeader, 'logoutLabel' | 'userLabel' | 'empresaLabel' | 'puntoVentaLabel' | 'periodLabel'>
> = {
  logoutLabel: 'Cerrar sesión',
  userLabel: 'Usuario',
  empresaLabel: 'Empresa',
  puntoVentaLabel: 'Punto de venta',
  periodLabel: 'Período',
};
