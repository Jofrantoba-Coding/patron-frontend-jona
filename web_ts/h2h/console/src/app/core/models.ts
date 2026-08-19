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

/**
 * Las cuatro etapas del canal H2H, en el orden real del proceso.
 *
 * <p>Cada una es una capa con su propia máquina de estados: la operación nace en
 * la ingesta, se agrupa en una programación, se materializa en una planilla y
 * termina con la respuesta del banco. Vive en `core` y no en el layout porque la
 * usan tanto el menú como los servicios que cuentan el trabajo pendiente.</p>
 */
export type EtapaCanal = 'operaciones' | 'programaciones' | 'planillas' | 'respuestas';

/** Trabajo que requiere acción humana en cada etapa. */
export type PendientesPorEtapa = Partial<Record<EtapaCanal, number>>;

/**
 * Conteos reales del canal para el panel de control.
 *
 * <p>Solo lo que la API sabe responder hoy. No hay agregación de importes en el
 * backend, así que el panel no muestra montos: prefiero una pantalla que diga
 * menos a una que muestre una cifra inventada por el mock.</p>
 */
export interface ResumenCanal {
  opsRegistradas: number;
  opsEnProceso: number;
  opsConfirmadas: number;
  opsRechazadas: number;
  opsError: number;
  plaEnviadas: number;
  plaProcesadas: number;
  plaParciales: number;
  plaRechazadas: number;
  plaError: number;
  plaErrorCifrado: number;
}

/**
 * Filtros del panel de control. Solo los que el backend acepta de verdad.
 *
 * <p>Las fechas viajan como hora de pared (`yyyy-MM-ddTHH:mm`) y se convierten a
 * epoch al armar la petición, con la zona del negocio: ver `core/zona-horaria.ts`.</p>
 */
export interface FiltroPanel {
  moneda?: string;
  /** Código del tipo de operación. No aplica a las planillas: ver `ResumenCanal`. */
  tipoOperacion?: string;
  /** Inicio del periodo, ISO con hora (`yyyy-MM-ddTHH:mm`). Ver `FILTRO_PERIODO_SOPORTADO`. */
  fechaDesde?: string;
  /** Fin del periodo, ISO con hora. */
  fechaHasta?: string;
  /**
   * Día inicial de proceso en el banco, ISO sin hora (`yyyy-MM-dd`).
   *
   * <p>Es un filtro DISTINTO del periodo de arriba y responde otra pregunta: aquél
   * acota el instante en que la operación se registró (`ope_d_fecha_operacion`,
   * `timestamptz`), éste acota el día en que el banco la procesa
   * (`ope_d_fecha_proceso`, columna `date`). En un panel de canal la segunda suele ser
   * la pregunta natural —"cuánto dinero se mueve mañana"—, y las dos pueden estar
   * puestas a la vez.</p>
   */
  fechaProcesoDesde?: string;
  /** Día final de proceso en el banco, ISO sin hora. */
  fechaProcesoHasta?: string;
}

/**
 * ¿El backend sabe ya filtrar por periodo?
 *
 * <p>Activo desde jofrantoba-model-jpa 2.0.6, que añadió operadores temporales
 * con enlace tipado al DSL, y desde que `FilterOperacion` acepta el periodo.</p>
 *
 * <p>Se conserva el interruptor porque el backend <em>ignora en silencio</em> los
 * campos que no conoce: devuelve 200 y el total sin filtrar. Si alguna vez hay que
 * desplegar la consola contra una API anterior, ponerlo en `false` evita que el
 * panel muestre cifras de todo el histórico como si fueran del periodo elegido.</p>
 */
export const FILTRO_PERIODO_SOPORTADO = true;

/**
 * Un grupo del resumen agregado que devuelve el backend (`/{entidad}/resumen`).
 *
 * <p>Es UNA fila de un `group by`: la combinación estado (o tipo) × moneda, con sus
 * cantidades e importe ya sumados por el motor. Sustituye a la vía anterior —traer el
 * listado entero y sumar en el navegador—, que tenía tope y por encima de él dejaba de
 * dar la cifra.</p>
 *
 * <p>`monto` y `moneda` son nulos en respuestas: `tt_prb_respuesta` no tiene columna de
 * importe porque el banco no lo informa. Ahí lo que se mira es la conciliación
 * (`operacionesOk` / `operacionesError`).</p>
 */
export interface GrupoResumen {
  /** Estado de la entidad o, en respuestas, el tipo (VAL/RES/RES2/PAR). */
  clave: string;
  moneda: string | null;
  /** Filas de la propia entidad: operaciones, planes, archivos o respuestas. */
  cantidad: number;
  /** Operaciones que lleva dentro. Un plan o una planilla son contenedores. */
  operaciones: number | null;
  monto: number | null;
  operacionesOk: number | null;
  operacionesError: number | null;
}

/**
 * Un reloj de job: cuánto falta para que se dispare.
 *
 * <p>`proxima` y `faltaMs` son nulos cuando el cron no se puede interpretar o no tiene una
 * ocurrencia futura. En ese caso NO se pinta una cuenta atrás en cero —que se leería como
 * "está a punto de dispararse", justo lo contrario de lo que ocurre— sino el motivo.</p>
 */
export interface RelojJob {
  clave: string;
  nombre: string;
  descripcion: string;
  cron: string;
  habilitado: boolean;
  proxima: string | null;
  faltaMs: number | null;
  /** El disparo siguiente al próximo: permite reiniciar la cuenta atrás al llegar a cero. */
  siguiente?: string | null;
  /** Distancia entre disparos, para seguir rodando si la pestaña estuvo dormida varios ciclos. */
  periodoMs?: number | null;
  error?: string;
  nota?: string;
}

/**
 * Estado de los relojes de los schedulers.
 *
 * <p>`ahora` es el instante del SERVIDOR: la consola mide con él su desfase y descuenta en
 * local, para no depender del reloj del equipo del operador. `zona` es aquella en la que se
 * evalúan los cron (la del canal), y `environment` dice de qué secreto salieron.</p>
 */
export interface RelojesJobs {
  ahora: string;
  zona: string;
  environment: string;
  habilitado: boolean;
  relojes: RelojJob[];
}

/** Entidades que saben responder un resumen agregado. */
export type EntidadResumen = 'operaciones' | 'programaciones' | 'planillas' | 'respuestas';

/** Importes agrupados por tipo de operación dentro de una moneda. */
export interface MontoPorTipo {
  tipo: string;
  monto: number;
  operaciones: number;
}

export interface MontoPorMoneda {
  moneda: string;
  monto: number;
  operaciones: number;
  tipos: MontoPorTipo[];
}

/**
 * Importes en curso.
 *
 * <p>`completo: false` significa que la suma NO se pudo calcular entera (hay
 * más operaciones de las que se pueden traer de una vez). En ese caso no se
 * muestra ninguna cifra: un importe parcial presentado como total es peor que
 * la ausencia del dato.</p>
 */
export interface ResumenMontos {
  completo: boolean;
  /** Operaciones consideradas, venga o no la suma. */
  total: number;
  porMoneda: MontoPorMoneda[];
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
  /** Plan de envío que la tiene reservada. Con valor, la conversión va por el plan, no por aquí. */
  idProgramacion?: string | null;
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

/** Envelope de respuesta estándar ALMIL (status/code/message/data/errors/traceId). */
export interface ApiResponseEnvelope<T> {
  status: string;
  code: string;
  message: string;
  data: T;
  errors?: unknown[];
  traceId?: string;
  timestamp?: string;
}

/** Configuración de la llave pública de un banco (material en base64). Motor único: GPG/PGP. */
export interface DtoLlavePublicaBanco {
  banco: string;
  llavePublicaBase64: string;
  alertaDias?: number;
}

/** Configuración de las llaves de la organización frente a un banco (material en base64). Motor único: GPG/PGP. */
export interface DtoLlavesOrganizacion {
  banco: string;
  llavePrivadaBase64: string;
  llavePublicaBase64: string;
  frase?: string;
  alertaDias?: number;
}

/** Configuración de los datos de conexión SFTP de un banco (todos sensibles → Vault). */
export interface DtoConexionSftp {
  banco: string;
  host: string;
  puerto: string;
  usuario: string;
  password: string;
  reintentos?: number;
  timeoutSegundos?: number;
}

/** Configuración de los directorios (buzones IN/OUT) SFTP de una familia de producto. */
export interface DtoDirectoriosSftp {
  banco: string;
  familia: string;
  directorioIn: string;
  directorioOut: string;
}

/** Payload para GENERAR automáticamente el par de llaves de la organización (Guía 1 BCP). */
export interface DtoGenerarLlavesOrganizacion {
  banco: string;
  expiraAnios?: number;
  alertaDias?: number;
}

/** Respuesta de la generación: metadata de la llave pendiente + pública armored + frase (respaldo). */
export interface LlavePendienteGenerada {
  fingerprint?: string | null;
  fingerprintSubclave?: string | null;
  algoritmo?: string | null;
  formato?: string | null;
  vigencia?: { origen?: string | null; desde?: string | null; hasta?: string | null; finRotacion?: string | null; alertaDias?: number | null };
  generadaEn?: string | null;
  sha256Seed?: string | null;
  llavePublicaArmored?: string;
  llavePrivadaArmored?: string;
  frasePlano?: string;
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

/**
 * Respuesta del banco, tal y como la devuelve el backend real
 * (`api/mantenimientos/h2h/v1/respuestas`).
 *
 * <p>Sustituye a `RespuestaBCP`, que reproducía los nombres crudos de columna
 * (`prb_u_id`) porque venía del mock. Los alias son los del DAO; recuérdese que
 * PostgreSQL los pliega a minúsculas, de ahí la normalización al leerlos.</p>
 */
export interface RespuestaRow {
  id: string;
  idPlanilla: string;
  idTipoRespuesta: number | null;
  /** `RES` (aceptada), `VAL` (rechazo de estructura), `RES2` (resultado final), `PAR` (parcial). */
  tipoRespuestaCodigo: string;
  tipoRespuestaFullCode: string | null;
  nombreArchivo: string;
  fechaRecepcion: string | null;
  totalOperaciones: number;
  operacionesOk: number;
  operacionesError: number;
  formatoCodigo: string | null;
  urlClaro: string | null;
  urlCifrado: string | null;
  archivoGenerado: string | null;
}

/** Filtros aceptados por `/respuestas/listar/*` y `/respuestas/contar`. */
export interface RespuestaFiltro {
  /**
   * Periodo como hora de pared (`yyyy-MM-ddTHH:mm`); se convierte a epoch al
   * armar la petición con la zona del negocio. Filtra por la fecha de RECEPCIÓN de la respuesta.
   */
  fechaDesde?: string;
  fechaHasta?: string;

  id?: string;
  idPlanilla?: string;
  tipoRespuesta?: string;
  nombreArchivo?: string;
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
  /** Canal de salida: `H2H` (SFTP) o `H2W` (el operador la sube al portal del banco). */
  modalidadCodigo?: string | null;
  /**
   * Quién empuja las etapas: `AUTOMATICO` (el ciclo SFTP) o `MANUAL` (el operador, de punta a
   * punta). Una MANUAL en GENERADA no está "en curso": está esperando a una persona.
   */
  modoProcesamiento?: string | null;
  idOrganizacion?: string;
}

export interface PlanillaFiltro {
  /**
   * Rango sobre la FECHA DEL ARCHIVO (columna `date`). Filtro distinto del de
   * envío: éste sí incluye planillas que aún no han salido al banco.
   */
  fechaArchivoDesde?: string;
  fechaArchivoHasta?: string;
  /**
   * Periodo como hora de pared (`yyyy-MM-ddTHH:mm`); se convierte a epoch al
   * armar la petición con la zona del negocio. Filtra por la fecha de ENVÍO (una planilla aún no enviada queda fuera, por eso la etiqueta lo dice).
   */
  fechaDesde?: string;
  fechaHasta?: string;

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
  /** `true` = todavía no está reservada por ninguna programación de envío. */
  sinProgramacion?: boolean;
  /**
   * `AUTOMATICO` | `MANUAL`: con qué modo quedó sellada la operación en la ingesta.
   *
   * <p>La pantalla de programación manual debe pedir `MANUAL`, que es el complemento de lo que toma
   * el job. Los dos caminos tienen que ver conjuntos **disjuntos**: si ambos vieran la misma
   * operación, la reserva evitaría el doble despacho, pero quién la envía dejaría de ser
   * determinista (HAB-08 §6.7).</p>
   */
  modoEnvio?: string;
  /**
   * Rango sobre el DÍA DE PROCESO en el banco (columna `date`, sin hora). Se manda como epoch y el
   * backend resuelve el DÍA en hora de Lima. Es un filtro DISTINTO del de registro.
   */
  fechaProcesoDesde?: string;
  fechaProcesoHasta?: string;
  /**
   * Periodo sobre la fecha de la operación, como hora de pared
   * (`yyyy-MM-ddTHH:mm`). Se convierte a epoch al armar la petición usando la
   * zona del negocio: ver `core/zona-horaria.ts`.
   */
  fechaDesde?: string;
  fechaHasta?: string;
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
  /** Canal de salida del lote: `H2H` (SFTP) o `H2W` (portal web del banco). */
  modalidadCodigo?: string | null;
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
  /** Rango sobre el DÍA DE PROCESO del plan (columna `date`), distinto del momento programado. */
  fechaProcesoDiaDesde?: string;
  fechaProcesoDiaHasta?: string;
  /**
   * Periodo como hora de pared (`yyyy-MM-ddTHH:mm`); se convierte a epoch al
   * armar la petición con la zona del negocio. Filtra por el momento PROGRAMADO del plan.
   */
  fechaDesde?: string;
  fechaHasta?: string;

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
/** Un día de la semana del canal, ya resuelto por el backend (margen restado incluido). */
export interface DiaVentana {
  /** 1 = lunes … 7 = domingo, como `DayOfWeek.getValue()`. */
  diaSemana: number;
  nombre: string;
  opera: boolean;
  /** `HH:mm:ss`. Solo cuando `opera`. */
  desde?: string;
  hasta?: string;
}

/**
 * Ventana de atención del canal para los siete días.
 *
 * <p>`resuelta` en false significa que no se pudo leer la configuración horaria — distinto de «no
 * opera ningún día». Con la diferencia borrada, el formulario bloquearía el calendario entero sin
 * poder explicar por qué.</p>
 */
export interface VentanaSemanal {
  zonaHoraria?: string;
  resuelta: boolean;
  dias: DiaVentana[];
  /** Desglose por subtipo: ver `SubtipoVentana`. */
  subtipos?: SubtipoVentana[];
}

/**
 * Ventana de un subtipo concreto (TERCEROS, CUENTA_PROPIA, INTERBANCARIA).
 *
 * <p>Existe porque `dias` consolida tomando el cierre más TARDÍO, y eso esconde a los subtipos más
 * restringidos: una INTERBANCARIA cierra a las 12:15 por el cut-off de la BCR, no a las 20:15 de las
 * intrabancarias. El formulario elige producto y moneda —no subtipo, que se deriva de las
 * operaciones—, así que la diferencia se muestra en lugar de suponerla.</p>
 */
export interface SubtipoVentana {
  subtipo: string;
  habilitado: boolean;
  intrabancaria: boolean;
  /** `false` = hereda el calendario del canal, así que cambiarlo mueve también este subtipo. */
  ventanaPropia: boolean;
  dias: DiaVentana[];
}

/**
 * Qué producto sale del plan cuando las operaciones son transferencias a terceros.
 *
 * <p>`MANTENER` las deja como están. `PAGO_MASIVO_PROVEEDORES` crea una operación de abono a
 * proveedores por cada transferencia y **anula la original**, revirtiendo su asiento: el archivo
 * ya no es el mismo producto, y la contabilidad tampoco (el debe pasa de 4699 a 4212).</p>
 *
 * <p>No tiene vuelta atrás: deshacerlo sería otra conversión, no un botón.</p>
 */
export type ConversionProducto = 'MANTENER' | 'PAGO_MASIVO_PROVEEDORES';

export interface ProgramacionCrear {
  idProducto: number;
  idMoneda: number;
  fechaProceso: string;
  tipoDestino?: string;
  canalLiquidacion?: string;
  modoEnvio?: string;
  /**
   * Canal de salida: `H2H` (sale por SFTP) o `H2W` (el operador lo sube al portal del banco).
   * Sin valor, el backend lo crea como H2H. `H2W` obliga a `modoEnvio = MANUAL`.
   */
  modalidad?: string;
  fechaProgramado?: string;
  codigo?: string;
  operaciones?: string[];
  cargas?: string[];
  programacion?: Record<string, unknown>;
  /** Conversión de producto al meter las operaciones al plan. Sin valor, no convierte nada. */
  conversion?: ConversionProducto;
}
