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
  id: string;
  idTipoBeneficiario?: number;
  tipoBeneficiarioFullCode?: string;
  tipoBeneficiarioCodigo?: string;
  idTipoDocumento?: number;
  tipoDocumentoFullCode?: string;
  tipoDocumentoCodigo: string;
  numeroDocumento: string;
  correlativoDoc?: string | null;
  titular: string;
  email?: string | null;
  telefono?: string | null;
  codigoExterno?: string | null;
  isActivo?: boolean;
  idOrganizacion?: string;
  totalCuentas?: number;
  totalOperaciones?: number;
  atributos?: unknown;
  schemaJson?: unknown;
}
export interface BeneficiarioCuenta {
  id: string;
  idBeneficiario: string;
  idEntidadFin?: number | null;
  entidadFinFullCode?: string | null;
  entidadFinCodigo?: string | null;
  idTipoCuenta?: number;
  tipoCuentaFullCode?: string;
  tipoCuentaCodigo: string;
  idMoneda?: number;
  monedaFullCode?: string;
  monedaCodigo: string;
  numeroCuenta?: string | null;
  cuentaInterbancaria?: string | null;
  isCuentaPropia?: boolean;
  isPrincipal?: boolean;
  isActivo?: boolean;
  idOrganizacion?: string;
  atributos?: unknown;
  schemaJson?: unknown;
}
export interface BeneficiarioFiltro {
  tipoDocumento?: string;
  numeroDocumento?: string;
  titular?: string;
  codigoExterno?: string;
  isActivo?: boolean;
}
export interface CuentaBancaria {
  entidadFinanciera: string;
  tipoCuenta: string;
  numeroCuenta: string | null;
  cuentaInterbancaria: string | null;
  moneda: string;
}
export interface OperacionBeneficiario {
  id?: string | null;
  tipoDocumentoCodigo: string;
  numeroDocumento: string;
  titular: string;
  email?: string | null;
}
export interface OperacionBeneficiarioCuenta {
  id?: string | null;
  entidadFinCodigo: string;
  tipoCuentaCodigo: string;
  numeroCuenta: string | null;
  cuentaInterbancaria: string | null;
  monedaCodigo: string;
}
export interface Operacion {
  id: string;
  codigoOperacion: string;
  idempotencyKey: string;
  sistemaOrigen: string;
  referenciaOrigen: string;
  codigoExterno?: string | null;
  idTipoOperacion: number;
  tipoOperacionFullCode: string;
  tipoOperacionCodigo: string;
  idEstadoOperacion: number;
  estadoOperacionFullCode: string;
  estadoOperacionCodigo: string;
  idMoneda: number;
  monedaFullCode: string;
  monedaCodigo: string;
  idBeneficiario?: string | null;
  idBeneficiarioCuenta?: string | null;
  montoTotal: number;
  fechaOperacion: string;
  fechaProceso: string | null;
  glosa: string | null;
  beneficiario: OperacionBeneficiario;
  beneficiarioCuenta: OperacionBeneficiarioCuenta;
  idPlanillaVigente: string | null;
  intentosEnvio: number;
  idCarga?: string | null;
  fechaCarga?: string | null;
  idOrganizacion?: string;
  atributos?: unknown;
}

export type OperacionDetalleRegistro = Record<string, unknown>;

export interface OperacionDetalle {
  operacion: OperacionDetalleRegistro;
  beneficiario: OperacionDetalleRegistro;
  beneficiarioCuenta: OperacionDetalleRegistro;
  operacionItems: OperacionDetalleRegistro[];
  operacionContables: OperacionDetalleRegistro[];
}

export interface BeneficiarioDetalle {
  beneficiario: OperacionDetalleRegistro;
  cuentas: BeneficiarioCuenta[];
  operaciones: Operacion[];
}

export interface Organizacion {
  id: string;
  codigo: string;
  abreviatura: string;
  razonSocial: string;
  nombreComercial?: string | null;
  idTipoDocumento?: number | null;
  tipoDocumentoFullCode?: string | null;
  tipoDocumentoCodigo?: string | null;
  numeroDocumento?: string | null;
  ambiente: string;
  secretoAlgoritmo?: string | null;
  secretoRotado?: string | null;
  isUsaKeycloak?: boolean;
  keycloakRealm?: string | null;
  keycloakClient?: string | null;
  claimOrgid?: string | null;
  isActivo?: boolean;
  atributos?: unknown;
  schemaJson?: unknown;
}

export interface OrganizacionConfiguracion {
  id: number;
  idOrganizacion: string;
  pk: string;
  sk?: string | null;
  codigo: string;
  codigoPadre?: string | null;
  descripcion: string;
  abreviatura?: string | null;
  valor?: unknown;
  typeValor?: string | null;
  schemaJson?: unknown;
  orden?: number | null;
  version?: number | null;
  isPersistente?: boolean;
  clase?: string | null;
  marcaTiempo?: string | null;
}

export interface OrganizacionDetalle {
  organizacion: OperacionDetalleRegistro;
  configuraciones: OrganizacionConfiguracion[];
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

// Backend real (api/mantenimientos/h2h/v1/planillas) — consulta de solo lectura.
export interface PlanillaRow {
  id: string;
  nombreArchivo: string;
  secuencial: string;
  fechaArchivo: string;
  cuentaCargo?: string | null;
  montoTotal: number;
  checksum?: string | null;
  totalOperaciones: number;
  idEntidadFin?: number;
  entidadFinCodigo?: string | null;
  idProducto?: number;
  productoCodigo?: string | null;
  productoFullCode?: string | null;
  idEstadoPlanilla?: number;
  estadoPlanillaCodigo: string;
  estadoPlanillaFullCode?: string | null;
  idMoneda?: number | null;
  monedaCodigo?: string | null;
  isFlujoPar?: boolean | null;
  fechaEnvio?: string | null;
  reintentos?: number | null;
  idOrganizacion?: string;
}

export interface PlanillaFiltro {
  id?: string;
  idEntidadFin?: number;
  idProducto?: number;
  idEstadoPlanilla?: number;
  estadoPlanilla?: string;
  idMoneda?: number;
  moneda?: string;
  secuencial?: string;
  nombreArchivo?: string;
  isFlujoPar?: boolean;
}

/** Detalle completo de una planilla: cabecera, registros (etapas por operación) y respuestas del banco. */
export interface PlanillaDetalleFull {
  planilla: OperacionDetalleRegistro;
  detalles: OperacionDetalleRegistro[];
  respuestas: OperacionDetalleRegistro[];
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

export interface OperacionFiltro {
  id?: string;
  idCarga?: string;
  idPlanillaVigente?: string;
  idBeneficiario?: string;
  codigoOperacion?: string;
  referenciaOrigen?: string;
  sistemaOrigen?: string;
  tipoOperacion?: string;
  tipoOperaciones?: string[];
  estadoOperacion?: string;
  moneda?: string;
  sinPlanillaVigente?: boolean;
}

export interface Parametria {
  id: number;
  pk?: string | null;
  sk?: string | null;
  codigo: string;
  codigoPadre?: string | null;
  descripcion?: string | null;
  abreviatura?: string | null;
  valor?: unknown;
  typeValor?: string | null;
  schemaJson?: unknown;
  orden?: number | null;
  version?: number | null;
  isPersistente?: boolean;
  clase?: string | null;
}

export interface ParametriaFiltro {
  codigo?: string;
  codigoPadre?: string;
  persistente?: boolean;
  soloPadres?: boolean;
  soloHijos?: boolean;
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

export interface Correlativo {
  id: string;
  idOrganizacion: string;
  idTipoDocumento: number;
  tipoCodigo: string | null;
  tipoDescripcion: string | null;
  formato: string;
  longitud: number | null;
  valorInicial: number | null;
  valorActual: number | null;
  incremento: number | null;
  valorMaximo: number | null;
  prefijo: string | null;
  sufijo: string | null;
  periodicidad: string;
  periodoActual: string | null;
  isActivo: boolean;
  version: number | null;
  marcaTiempo: string | null;
}

export interface CorrelativoFiltro {
  idOrganizacion?: string;
  idTipoDocumento?: number;
  formato?: string;
  periodicidad?: string;
  isActivo?: boolean;
}

// ── Programación de envíos H2H ──────────────────────────────────────────
export interface ProgramacionRow {
  id: string;
  codigo: string;
  idProducto?: number;
  productoCodigo?: string | null;
  productoFullCode?: string | null;
  idMoneda?: number;
  monedaCodigo?: string | null;
  idEstado?: number;
  estadoCodigo: string;
  estadoFullCode?: string | null;
  tipoDestino?: string | null;
  canalLiquidacion?: string | null;
  modoEnvio: string;
  fechaProceso: string;
  fechaProgramado?: string | null;
  fechaEjecutado?: string | null;
  totalOperaciones: number;
  montoTotal: number;
  reintentos?: number | null;
  idPlanilla?: string | null;
  idOrganizacion?: string;
}

export interface ProgramacionFiltro {
  id?: string;
  idProducto?: number;
  idMoneda?: number;
  idEstado?: number;
  estado?: string;
  moneda?: string;
  tipoDestino?: string;
  canalLiquidacion?: string;
  modoEnvio?: string;
  codigo?: string;
  fechaProceso?: string;
}

/** Detalle de un plan: cabecera + operaciones planificadas. */
export interface ProgramacionDetalleFull {
  programacion: OperacionDetalleRegistro;
  detalles: OperacionDetalleRegistro[];
}

/** Payload para crear un plan de envío. */
export interface ProgramacionCrear {
  idProducto: number;
  idMoneda: number;
  fechaProceso: string;
  tipoDestino?: string;
  canalLiquidacion?: string;
  modoEnvio?: string;
  fechaProgramado?: string;
  codigo?: string;
  operaciones?: string[];
  cargas?: string[];
  programacion?: Record<string, unknown>;
}
