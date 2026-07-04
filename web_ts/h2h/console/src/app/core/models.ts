// Modelos del dominio H2H (consola Jofrantoba Consulting TI).

export interface Paginated<T> {
  items: T[];
  pagination: { page: number; pageSize: number; total: number };
}

export interface Tenant {
  org_u_id: string;
  org_v_codigo: string;
  org_v_abreviatura: string;
  org_v_razonsocial: string;
  org_v_nombrecomercial: string;
  org_v_ambiente: string;
  subdominio: string;
  keycloak: {
    org_b_usa_keycloak: boolean;
    org_v_keycloak_realm: string;
    org_v_keycloak_client: string;
    org_v_claim_orgid: string;
  };
}

export interface AppUser {
  id: string;
  username: string;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export interface TenantContext {
  tenant: Tenant;
  user: AppUser;
}

export interface LoginResponse extends TenantContext {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export type PipelineStatus = 'done' | 'active' | 'warning' | 'error' | 'pending';
export interface PipelineStep {
  estado: string;
  label: string;
  cantidad: number;
  statusUi: PipelineStatus;
}
export type AlertSeverity = 'ERROR' | 'WARN' | 'INFO';
export interface DashboardAlert {
  severity: AlertSeverity;
  title: string;
  message: string;
  createdAt: string;
}
export interface DashboardSummary {
  fechaOperacion: string;
  kpis: {
    planillasHoy: number;
    montoEnviadoHoy: number;
    operacionesAprobadas: number;
    operacionesRechazadas: number;
    certificadosPorVencer: number;
  };
  pipeline: PipelineStep[];
  alertas: DashboardAlert[];
}

export interface HealthService {
  name: string;
  status: 'UP' | 'DEGRADED' | 'DOWN';
  latencyMs: number;
  message?: string;
}
export interface Health {
  status: 'UP' | 'DEGRADED' | 'DOWN';
  checkedAt: string;
  services: HealthService[];
}

/** Agrupación de producto BCP para menú/RBAC (3 vistas). */
export type ProductoGrupo = 'pagos_masivos' | 'transferencias' | 'factoring';

export interface Beneficiario {
  ben_u_id?: string;
  ben_n_id_tipodocumento_code: string;
  ben_v_numerodocumento: string;
  ben_v_nombre: string;
  ben_v_apellido_paterno?: string;
  ben_v_apellido_materno?: string;
  ben_v_email?: string;
}
export interface CuentaBancaria {
  entidadFinanciera: string;
  tipoCuenta: string;
  numeroCuenta: string | null;
  cuentaInterbancaria: string | null;
  moneda: string;
}
export interface Operacion {
  ope_u_id: string;
  ope_v_codigo_operacion: string;
  ope_v_idempotency_key: string;
  ope_v_sistema_origen: string;
  ope_v_referencia_origen: string;
  ope_n_id_tipooperacion_code: string;
  ope_n_id_estadooperacion_code: string;
  ope_n_id_moneda_code: string;
  ope_dec_montototal: number;
  ope_d_fecha_operacion: string;
  ope_d_fecha_proceso: string;
  ope_v_glosa: string;
  beneficiario: Beneficiario;
  cuenta: CuentaBancaria;
  ope_u_id_planilla_vigente: string | null;
  ope_n_intentos_envio: number;
}

export interface Planilla {
  pla_u_id: string;
  pla_n_id_entidadfin_code: string;
  pla_v_nombre_archivo: string;
  pla_n_id_producto_code: string;
  pla_n_id_formato_code: string;
  pla_n_id_modalidad_valid_code: string;
  pla_n_id_estadoplanilla_code: string;
  pla_v_secuencial: string;
  pla_d_fecha_archivo: string;
  pla_v_cuenta_cargo: string;
  pla_n_id_moneda_code: string;
  pla_dec_montototal: number;
  pla_n_checksum: string;
  pla_n_total_operaciones: number;
  pla_b_flujo_par: boolean;
  pla_d_fecha_envio: string | null;
  pla_n_reintentos: number;
  pla_v_url_claro: string;
  pla_v_url_cifrado: string;
}

export interface RespuestaBCP {
  prb_u_id: string;
  prb_u_id_planilla: string;
  prb_n_id_tiporespuesta_code: string;
  prb_v_nombre_archivo: string;
  prb_d_fecha_recepcion: string;
  prb_n_total_operaciones: number;
  prb_n_operaciones_ok: number;
  prb_n_operaciones_error: number;
  prb_n_id_formato_code: string;
}

export interface Certificado {
  certificadoId: string;
  scope: string;
  tipo: string;
  alias: string;
  uso: string;
  estado: string;
  algoritmo: string;
  longitud: number;
  fingerprint: string;
  fechaEmision: string;
  fechaVencimiento: string;
  diasParaVencer: number;
  custodiaPrivada: string;
  publicKeyUrl: string;
  bcpPublicKeyLoaded: boolean;
}

export interface AuditEvent {
  eventId: string;
  actor: string;
  action: string;
  entity: string;
  entityId: string;
  result: string;
  traceId: string;
  createdAt: string;
}

export type TipoDocumento = 'PLANILLA' | 'RESPUESTA';
/** Fila unificada de la bandeja global de documentos (planilla o respuesta). */
export interface Documento {
  id: string;
  tipoDocumento: TipoDocumento;
  producto: ProductoGrupo | null;
  productoCode: string | null;
  subtipo: string | null;
  nombre: string;
  formato: string;
  modalidad: string | null;
  estado: string;
  tipoRespuesta: string | null;
  cifrado: boolean;
  fecha: string;
  montoTotal: number | null;
  totalOperaciones: number | null;
  urlClaro: string | null;
  urlCifrado: string | null;
  planillaId: string | null;
}

/** Filtros de la bandeja global de documentos. */
export interface DocumentoFiltro {
  producto?: ProductoGrupo;
  subtipo?: string;
  tipoDocumento?: TipoDocumento;
  estado?: string;
  formato?: string;
  modalidad?: string;
  cifrado?: boolean;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface DocumentoDescarga {
  documentoId: string;
  variante: 'claro' | 'cifrado';
  url: string;
  nombre: string;
  contentType: string;
}

export interface DocumentoPreview {
  documentoId: string;
  tipoDocumento: TipoDocumento;
  nombre: string;
  formato: string;
  contentType: string;
  contenido: string;
}

export interface EstructuraArchivo {
  ear_v_codigo: string;
  ear_v_descripcion: string;
  ear_v_clase: string;
  producto: ProductoGrupo;
  formato: string;
  version: string;
}
