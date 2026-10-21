export interface Tenant {
  id: string;
  name: string;
}

export interface Credentials {
  usuario: string;
  clave: string;
}

export interface LoginUser {
  id_usuario: number;
  usuario: string;
  nombre: string;
}

export interface LoginResult {
  token: string;
  user: LoginUser;
}

export interface Empresa {
  id: string;
  name: string;
}

export interface PuntoVenta {
  id: string;
  name: string;
  id_empresa: string;
}

/** BdEmpresaParametro flags of a tenant (data only). */
export interface AppParams {
  INICIO_ACTIVIDADES: string;
  IS_FACTURADOR_SUNAT: boolean;
  ISBOTICA: boolean;
  DESPACHO_AUTOMATICO: boolean;
}

/**
 * Authentication and session-context lookups. Failures reject with `ApiError`.
 * Post-login calls take the tenant from the session; `login` takes it explicitly.
 */
export interface InterAuthService {
  /** Public tenant list for the login screen. */
  sessionOptions(): Promise<Tenant[]>;
  login(tenantId: string, credentials: Credentials): Promise<LoginResult>;
  empresas(): Promise<Empresa[]>;
  /** All puntos de venta, or only those of `idEmpresa` when given. */
  puntosVenta(idEmpresa?: string): Promise<PuntoVenta[]>;
  params(): Promise<AppParams>;
}
