import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, forkJoin, map, of, switchMap, type Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FILTRO_PERIODO_SOPORTADO } from './models';
import { horaDeParedAEpoch } from './zona-horaria';
import { API_BASE, H2H_BACKEND_BASE, H2H_SCHEDULERS_BASE } from './config';
import type {
  AuditEvent,
  PendientesPorEtapa,
  EntidadResumen,
  FiltroPanel,
  GrupoResumen,
  RelojesJobs,
  ResumenCanal,
  ResumenMontos,
  RespuestaFiltro,
  RespuestaRow,
  Beneficiario,
  BeneficiarioCuenta,
  BeneficiarioDetalle,
  BeneficiarioFiltro,
  Correlativo,
  CorrelativoFiltro,
  DashboardSummary,
  OperacionFiltro,
  EstructuraArchivo,
  Health,
  LoginResponse,
  Operacion,
  OperacionDetalle,
  Parametria,
  ParametriaFiltro,
  OrganizacionConfiguracion,
  OrganizacionDetalle,
  ApiResponseEnvelope,
  DtoConexionSftp,
  DtoDirectoriosSftp,
  DtoLlavePublicaBanco,
  DtoLlavesOrganizacion,
  DtoGenerarLlavesOrganizacion,
  LlavePendienteGenerada,
  Paginated,
  Planilla,
  PlanillaDetalleFull,
  PlanillaFiltro,
  PlanillaRow,
  ProductoGrupo,
  ConversionProducto,
  ProgramacionCrear,
  ProgramacionDetalleFull,
  ProgramacionFiltro,
  ProgramacionRow,
  RespuestaBCP,
  TenantContext,
  VentanaSemanal,
} from './models';
import type {
  ConfiguracionCalimaco,
  GuardarCalimaco,
  GuardarInterruptorCalimaco,
  ModoCalimaco,
  ParCalimaco,
} from '../pages/calimaco/inter-calimaco';
import { ENDPOINTS_CALIMACO, MODOS_CALIMACO } from '../pages/calimaco/inter-calimaco';
import type {
  CampoComparado,
  ComparacionCalimaco,
} from '../pages/calimaco/inter-conciliacion';
import type {
  CandidatoInforme,
  CandidatosInforme,
  CrearInforme,
  DetalleInforme,
  DetalleProgramacionInforme,
  ProgramacionInforme,
  ResultadoEjecucion,
} from '../pages/informes/inter-informes';
import { SessionService } from './session.service';

const guid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });

export interface PlanillaAction {
  planillaId: string;
  estadoAnterior: string;
  estadoActual: string;
  message: string;
  traceId: string;
}

const TIPOOP_GRUPO: Record<string, ProductoGrupo> = {
  PAGOMASIVO_ABONO_PROVEEDOR: 'pagos_masivos',
  PAGOMASIVO_CHEQUE_GERENCIA: 'pagos_masivos',
  PAGOMASIVO_CTS_TRABAJADOR: 'pagos_masivos',
  PAGOMASIVO_HABERES_TRABAJADOR: 'pagos_masivos',
  TRANSFERENCIA_CUENTA_PROPIA: 'transferencias',
  TRANSFERENCIA_TERCEROS: 'transferencias',
  TRANSFERENCIA_INTERBANCARIA: 'transferencias',
  FACTORING_E: 'factoring',
  FACTORING_TOTAL: 'factoring',
  FACTORING_PAGO_VENCIMIENTO: 'factoring',
  PAGO_HABER: 'pagos_masivos',
  PAGO_CTS: 'pagos_masivos',
  PAGO_PROVEEDOR: 'pagos_masivos',
  PAGO_CHEQUE_GERENCIA: 'pagos_masivos',
  RETIRO_INVITADO: 'pagos_masivos',
  PAGO_TRANSFERENCIA: 'transferencias',
  PAGO_FACTORING: 'factoring',
};

const tiposPorProducto = (producto: ProductoGrupo): string[] =>
  Object.entries(TIPOOP_GRUPO)
    .filter(([, grupo]) => grupo === producto)
    .map(([codigo]) => codigo);

type OperacionBackendRow = Record<string, unknown>;
type OperacionDetalleBackend = Partial<OperacionDetalle>;
type ParametriaBackendRow = Record<string, unknown>;
type BeneficiarioBackendRow = Record<string, unknown>;
type OrganizacionBackendRow = Record<string, unknown>;
type BeneficiarioDetalleBackend = {
  beneficiario?: Record<string, unknown>;
  cuentas?: BeneficiarioBackendRow[];
  operaciones?: OperacionBackendRow[];
};
type OrganizacionDetalleBackend = {
  organizacion?: Record<string, unknown>;
  configuraciones?: OrganizacionBackendRow[];
};

const pickOperacion = <T>(row: OperacionBackendRow, key: string): T =>
  (row[key] ?? row[key.toLowerCase()]) as T;

const pickParametria = <T>(row: ParametriaBackendRow, key: string): T =>
  (row[key] ?? row[key.toLowerCase()]) as T;

const pickBeneficiario = <T>(row: BeneficiarioBackendRow, key: string): T =>
  (row[key] ?? row[key.toLowerCase()]) as T;

const pickOrganizacion = <T>(row: OrganizacionBackendRow, key: string): T =>
  (row[key] ?? row[key.toLowerCase()]) as T;

const toNumber = (value: unknown, fallback = 0): number => {
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) ? parsed : fallback;
};

/**
 * Lectura insensible a mayúsculas de una fila del backend.
 *
 * <p>Los DAO nativos mapean con `getColumnName()` y PostgreSQL pliega a
 * minúsculas cualquier alias sin comillas, así que `nombreArchivo` llega como
 * `nombrearchivo`. Poner comillas en el alias no ayuda: la librería no usa
 * `getColumnLabel()`.</p>
 */
const pickRespuesta = <T>(row: Record<string, unknown>, key: string): T =>
  (row[key] ?? row[key.toLowerCase()]) as T;

const normalizeRespuestaRow = (row: Record<string, unknown>): RespuestaRow => ({
  id: pickRespuesta<string>(row, 'id'),
  idPlanilla: pickRespuesta<string>(row, 'idPlanilla'),
  idTipoRespuesta: pickRespuesta<number | null>(row, 'idTipoRespuesta') ?? null,
  tipoRespuestaCodigo: pickRespuesta<string>(row, 'tipoRespuestaCodigo') ?? '',
  tipoRespuestaFullCode: pickRespuesta<string | null>(row, 'tipoRespuestaFullCode') ?? null,
  nombreArchivo: pickRespuesta<string>(row, 'nombreArchivo') ?? '',
  fechaRecepcion: pickRespuesta<string | null>(row, 'fechaRecepcion') ?? null,
  totalOperaciones: Number(pickRespuesta<number>(row, 'totalOperaciones') ?? 0),
  operacionesOk: Number(pickRespuesta<number>(row, 'operacionesOk') ?? 0),
  operacionesError: Number(pickRespuesta<number>(row, 'operacionesError') ?? 0),
  formatoCodigo: pickRespuesta<string | null>(row, 'formatoCodigo') ?? null,
  urlClaro: pickRespuesta<string | null>(row, 'urlClaro') ?? null,
  urlCifrado: pickRespuesta<string | null>(row, 'urlCifrado') ?? null,
  archivoGenerado: pickRespuesta<string | null>(row, 'archivoGenerado') ?? null,
});

/**
 * Cuántas operaciones se aceptan sumar en el navegador.
 *
 * <p>Con 400 operaciones una sola petición y una pasada de suma no se notan.
 * Con decenas de miles sí, y además haría inútil la paginación del backend. Por
 * encima de este tope el panel dice que el total no está disponible en vez de
 * enseñar una cifra recortada.</p>
 */
const TOPE_SUMA_CLIENTE = 5000;

/** Entidad a la que va dirigido un cuerpo del panel. Decide los nombres de las fechas. */
type DestinoFiltro = 'operacion' | 'planilla' | 'programacion';

/** Extremos de un rango ya convertidos a epoch; `null` es "sin acotar por ese lado". */
interface RangoEpoch {
  desde: number | null;
  hasta: number | null;
}

/**
 * Nombre de los campos de fecha que espera cada entidad del backend.
 *
 * <p>Ver `baseFiltrada` para por qué en planillas los dos filtros apuntan a la misma
 * columna (`fechaArchivo*`) en lugar de usar `fechaEnvio*` para el instante.</p>
 */
const CAMPOS_FECHA_POR_DESTINO: Record<
  DestinoFiltro,
  { instante: { desde: string; hasta: string }; dia: { desde: string; hasta: string } }
> = {
  operacion: {
    instante: { desde: 'fechaDesde', hasta: 'fechaHasta' },
    dia: { desde: 'fechaProcesoDesde', hasta: 'fechaProcesoHasta' },
  },
  programacion: {
    instante: { desde: 'fechaProgramadoDesde', hasta: 'fechaProgramadoHasta' },
    dia: { desde: 'fechaProcesoDiaDesde', hasta: 'fechaProcesoDiaHasta' },
  },
  planilla: {
    instante: { desde: 'fechaArchivoDesde', hasta: 'fechaArchivoHasta' },
    dia: { desde: 'fechaArchivoDesde', hasta: 'fechaArchivoHasta' },
  },
};

/** Agrupa importes por moneda y, dentro de cada una, por tipo de operación. */
function agruparMontos(filas: OperacionBackendRow[], total: number): ResumenMontos {
  const porMoneda = new Map<string, { monto: number; ops: number; tipos: Map<string, { monto: number; ops: number }> }>();

  for (const fila of filas) {
    const moneda = String(pickOperacion<string>(fila, 'monedaCodigo') ?? '—');
    const tipo = String(pickOperacion<string>(fila, 'tipoOperacionCodigo') ?? '—');
    const monto = Number(pickOperacion<number>(fila, 'montoTotal') ?? 0);

    const entrada = porMoneda.get(moneda) ?? { monto: 0, ops: 0, tipos: new Map() };
    entrada.monto += monto;
    entrada.ops += 1;
    const t = entrada.tipos.get(tipo) ?? { monto: 0, ops: 0 };
    t.monto += monto;
    t.ops += 1;
    entrada.tipos.set(tipo, t);
    porMoneda.set(moneda, entrada);
  }

  return {
    completo: filas.length >= total,
    total,
    porMoneda: [...porMoneda.entries()]
      // De mayor a menor importe: lo que más dinero mueve va primero.
      .sort((a, b) => b[1].monto - a[1].monto)
      .map(([moneda, v]) => ({
        moneda,
        monto: v.monto,
        operaciones: v.ops,
        tipos: [...v.tipos.entries()]
          .sort((a, b) => b[1].monto - a[1].monto)
          .map(([tipo, t]) => ({ tipo, monto: t.monto, operaciones: t.ops })),
      })),
  };
}

const normalizeOperacion = (row: OperacionBackendRow): Operacion => ({
  id: pickOperacion<string>(row, 'id'),
  codigoOperacion: pickOperacion<string>(row, 'codigoOperacion'),
  idempotencyKey: pickOperacion<string>(row, 'idempotencyKey'),
  sistemaOrigen: pickOperacion<string>(row, 'sistemaOrigen'),
  referenciaOrigen: pickOperacion<string>(row, 'referenciaOrigen'),
  codigoExterno: pickOperacion<string | null>(row, 'codigoExterno'),
  idTipoOperacion: pickOperacion<number>(row, 'idTipoOperacion'),
  tipoOperacionFullCode: pickOperacion<string>(row, 'tipoOperacionFullCode'),
  tipoOperacionCodigo: pickOperacion<string>(row, 'tipoOperacionCodigo'),
  idEstadoOperacion: pickOperacion<number>(row, 'idEstadoOperacion'),
  estadoOperacionFullCode: pickOperacion<string>(row, 'estadoOperacionFullCode'),
  estadoOperacionCodigo: pickOperacion<string>(row, 'estadoOperacionCodigo'),
  idMoneda: pickOperacion<number>(row, 'idMoneda'),
  monedaFullCode: pickOperacion<string>(row, 'monedaFullCode'),
  monedaCodigo: pickOperacion<string>(row, 'monedaCodigo'),
  idBeneficiario: pickOperacion<string | null>(row, 'idBeneficiario'),
  idBeneficiarioCuenta: pickOperacion<string | null>(row, 'idBeneficiarioCuenta'),
  montoTotal: pickOperacion<number>(row, 'montoTotal'),
  fechaOperacion: pickOperacion<string>(row, 'fechaOperacion'),
  fechaProceso: pickOperacion<string | null>(row, 'fechaProceso'),
  glosa: pickOperacion<string | null>(row, 'glosa'),
  beneficiario: pickOperacion<Operacion['beneficiario']>(row, 'beneficiario'),
  beneficiarioCuenta: pickOperacion<Operacion['beneficiarioCuenta']>(row, 'beneficiarioCuenta'),
  idPlanillaVigente: pickOperacion<string | null>(row, 'idPlanillaVigente'),
  // `pickOperacion` lee tolerando el case: PostgreSQL pliega el alias a `idprogramacion`.
  idProgramacion: pickOperacion<string | null>(row, 'idProgramacion'),
  intentosEnvio: pickOperacion<number>(row, 'intentosEnvio'),
  idCarga: pickOperacion<string | null>(row, 'idCarga'),
  fechaCarga: pickOperacion<string | null>(row, 'fechaCarga'),
  idOrganizacion: pickOperacion<string>(row, 'idOrganizacion'),
  atributos: pickOperacion<unknown>(row, 'atributos'),
});

const normalizeParametria = (row: ParametriaBackendRow): Parametria => ({
  id: pickParametria<number>(row, 'id'),
  pk: pickParametria<string | null>(row, 'pk'),
  sk: pickParametria<string | null>(row, 'sk'),
  codigo: pickParametria<string>(row, 'codigo'),
  codigoPadre: pickParametria<string | null>(row, 'codigoPadre'),
  descripcion: pickParametria<string | null>(row, 'descripcion'),
  abreviatura: pickParametria<string | null>(row, 'abreviatura'),
  valor: pickParametria<unknown>(row, 'valor'),
  typeValor: pickParametria<string | null>(row, 'typeValor'),
  schemaJson: pickParametria<unknown>(row, 'schemaJson'),
  orden: pickParametria<number | null>(row, 'orden'),
  version: pickParametria<number | null>(row, 'version'),
  isPersistente: pickParametria<boolean>(row, 'isPersistente'),
  clase: pickParametria<string | null>(row, 'clase'),
});

const normalizeBeneficiario = (row: BeneficiarioBackendRow): Beneficiario => ({
  id: pickBeneficiario<string>(row, 'id'),
  idTipoBeneficiario: pickBeneficiario<number>(row, 'idTipoBeneficiario'),
  tipoBeneficiarioFullCode: pickBeneficiario<string>(row, 'tipoBeneficiarioFullCode'),
  tipoBeneficiarioCodigo: pickBeneficiario<string>(row, 'tipoBeneficiarioCodigo'),
  idTipoDocumento: pickBeneficiario<number>(row, 'idTipoDocumento'),
  tipoDocumentoFullCode: pickBeneficiario<string>(row, 'tipoDocumentoFullCode'),
  tipoDocumentoCodigo: pickBeneficiario<string>(row, 'tipoDocumentoCodigo'),
  numeroDocumento: pickBeneficiario<string>(row, 'numeroDocumento'),
  correlativoDoc: pickBeneficiario<string | null>(row, 'correlativoDoc'),
  titular: pickBeneficiario<string>(row, 'titular'),
  email: pickBeneficiario<string | null>(row, 'email'),
  telefono: pickBeneficiario<string | null>(row, 'telefono'),
  codigoExterno: pickBeneficiario<string | null>(row, 'codigoExterno'),
  isActivo: pickBeneficiario<boolean>(row, 'isActivo'),
  idOrganizacion: pickBeneficiario<string>(row, 'idOrganizacion'),
  totalCuentas: toNumber(pickBeneficiario<unknown>(row, 'totalCuentas')),
  totalOperaciones: toNumber(pickBeneficiario<unknown>(row, 'totalOperaciones')),
  atributos: pickBeneficiario<unknown>(row, 'atributos'),
  schemaJson: pickBeneficiario<unknown>(row, 'schemaJson'),
});

const normalizeBeneficiarioCuenta = (row: BeneficiarioBackendRow): BeneficiarioCuenta => ({
  id: pickBeneficiario<string>(row, 'id'),
  idBeneficiario: pickBeneficiario<string>(row, 'idBeneficiario'),
  idEntidadFin: pickBeneficiario<number | null>(row, 'idEntidadFin'),
  entidadFinFullCode: pickBeneficiario<string | null>(row, 'entidadFinFullCode'),
  entidadFinCodigo: pickBeneficiario<string | null>(row, 'entidadFinCodigo'),
  idTipoCuenta: pickBeneficiario<number>(row, 'idTipoCuenta'),
  tipoCuentaFullCode: pickBeneficiario<string>(row, 'tipoCuentaFullCode'),
  tipoCuentaCodigo: pickBeneficiario<string>(row, 'tipoCuentaCodigo'),
  idMoneda: pickBeneficiario<number>(row, 'idMoneda'),
  monedaFullCode: pickBeneficiario<string>(row, 'monedaFullCode'),
  monedaCodigo: pickBeneficiario<string>(row, 'monedaCodigo'),
  numeroCuenta: pickBeneficiario<string | null>(row, 'numeroCuenta'),
  cuentaInterbancaria: pickBeneficiario<string | null>(row, 'cuentaInterbancaria'),
  isCuentaPropia: pickBeneficiario<boolean>(row, 'isCuentaPropia'),
  isPrincipal: pickBeneficiario<boolean>(row, 'isPrincipal'),
  isActivo: pickBeneficiario<boolean>(row, 'isActivo'),
  idOrganizacion: pickBeneficiario<string>(row, 'idOrganizacion'),
  atributos: pickBeneficiario<unknown>(row, 'atributos'),
  schemaJson: pickBeneficiario<unknown>(row, 'schemaJson'),
});

const normalizeOperacionDetalle = (detalle: OperacionDetalleBackend): OperacionDetalle => ({
  operacion: detalle.operacion ?? {},
  beneficiario: detalle.beneficiario ?? {},
  beneficiarioCuenta: detalle.beneficiarioCuenta ?? {},
  operacionItems: detalle.operacionItems ?? [],
  operacionContables: detalle.operacionContables ?? [],
});

const normalizeBeneficiarioDetalle = (detalle: BeneficiarioDetalleBackend): BeneficiarioDetalle => ({
  beneficiario: detalle.beneficiario ?? {},
  cuentas: (detalle.cuentas ?? []).map(normalizeBeneficiarioCuenta),
  operaciones: (detalle.operaciones ?? []).map(normalizeOperacion),
});

const normalizeOrganizacionConfiguracion = (row: OrganizacionBackendRow): OrganizacionConfiguracion => ({
  id: pickOrganizacion<number>(row, 'id'),
  idOrganizacion: pickOrganizacion<string>(row, 'idOrganizacion'),
  pk: pickOrganizacion<string>(row, 'pk'),
  sk: pickOrganizacion<string | null>(row, 'sk'),
  codigo: pickOrganizacion<string>(row, 'codigo'),
  codigoPadre: pickOrganizacion<string | null>(row, 'codigoPadre'),
  descripcion: pickOrganizacion<string>(row, 'descripcion'),
  abreviatura: pickOrganizacion<string | null>(row, 'abreviatura'),
  valor: pickOrganizacion<unknown>(row, 'valor'),
  typeValor: pickOrganizacion<string | null>(row, 'typeValor'),
  schemaJson: pickOrganizacion<unknown>(row, 'schemaJson'),
  orden: pickOrganizacion<number | null>(row, 'orden'),
  version: pickOrganizacion<number | null>(row, 'version'),
  isPersistente: pickOrganizacion<boolean>(row, 'isPersistente'),
  clase: pickOrganizacion<string | null>(row, 'clase'),
  marcaTiempo: pickOrganizacion<string | null>(row, 'marcaTiempo'),
});

const normalizeOrganizacionDetalle = (detalle: OrganizacionDetalleBackend): OrganizacionDetalle => ({
  organizacion: detalle.organizacion ?? {},
  configuraciones: (detalle.configuraciones ?? []).map(normalizeOrganizacionConfiguracion),
});

type CorrelativoBackendRow = Record<string, unknown>;
const pickCorrelativo = <T>(row: CorrelativoBackendRow, key: string): T =>
  (row[key] ?? row[key.toLowerCase()]) as T;

const normalizeCorrelativo = (row: CorrelativoBackendRow): Correlativo => ({
  id: pickCorrelativo<string>(row, 'id'),
  idOrganizacion: pickCorrelativo<string>(row, 'idOrganizacion'),
  idTipoDocumento: toNumber(pickCorrelativo<unknown>(row, 'idTipoDocumento')),
  tipoCodigo: pickCorrelativo<string | null>(row, 'tipoCodigo'),
  tipoDescripcion: pickCorrelativo<string | null>(row, 'tipoDescripcion'),
  formato: pickCorrelativo<string>(row, 'formato'),
  longitud: pickCorrelativo<number | null>(row, 'longitud'),
  valorInicial: pickCorrelativo<number | null>(row, 'valorInicial'),
  valorActual: pickCorrelativo<number | null>(row, 'valorActual'),
  incremento: pickCorrelativo<number | null>(row, 'incremento'),
  valorMaximo: pickCorrelativo<number | null>(row, 'valorMaximo'),
  prefijo: pickCorrelativo<string | null>(row, 'prefijo'),
  sufijo: pickCorrelativo<string | null>(row, 'sufijo'),
  periodicidad: pickCorrelativo<string>(row, 'periodicidad'),
  periodoActual: pickCorrelativo<string | null>(row, 'periodoActual'),
  isActivo: Boolean(pickCorrelativo<unknown>(row, 'isActivo')),
  version: pickCorrelativo<number | null>(row, 'version'),
  marcaTiempo: pickCorrelativo<string | null>(row, 'marcaTiempo'),
});

const pickPlanilla = <T>(row: Record<string, unknown>, key: string): T =>
  (row[key] ?? row[key.toLowerCase()]) as T;

const normalizePlanillaRow = (row: Record<string, unknown>): PlanillaRow => ({
  id: pickPlanilla<string>(row, 'id'),
  nombreArchivo: pickPlanilla<string>(row, 'nombreArchivo'),
  secuencial: pickPlanilla<string>(row, 'secuencial'),
  fechaArchivo: pickPlanilla<string>(row, 'fechaArchivo'),
  cuentaCargo: pickPlanilla<string | null>(row, 'cuentaCargo'),
  montoTotal: toNumber(pickPlanilla<unknown>(row, 'montoTotal')),
  checksum: pickPlanilla<string | null>(row, 'checksum'),
  totalOperaciones: toNumber(pickPlanilla<unknown>(row, 'totalOperaciones')),
  idEntidadFin: pickPlanilla<number>(row, 'idEntidadFin'),
  entidadFinCodigo: pickPlanilla<string | null>(row, 'entidadFinCodigo'),
  idProducto: pickPlanilla<number>(row, 'idProducto'),
  productoCodigo: pickPlanilla<string | null>(row, 'productoCodigo'),
  productoFullCode: pickPlanilla<string | null>(row, 'productoFullCode'),
  idEstadoPlanilla: pickPlanilla<number>(row, 'idEstadoPlanilla'),
  estadoPlanillaCodigo: pickPlanilla<string>(row, 'estadoPlanillaCodigo'),
  estadoPlanillaFullCode: pickPlanilla<string | null>(row, 'estadoPlanillaFullCode'),
  idMoneda: pickPlanilla<number | null>(row, 'idMoneda'),
  monedaCodigo: pickPlanilla<string | null>(row, 'monedaCodigo'),
  isFlujoPar: pickPlanilla<boolean | null>(row, 'isFlujoPar'),
  fechaEnvio: pickPlanilla<string | null>(row, 'fechaEnvio'),
  reintentos: pickPlanilla<number | null>(row, 'reintentos'),
  modalidadCodigo: pickPlanilla<string | null>(row, 'modalidadCodigo'),
  modoProcesamiento: pickPlanilla<string | null>(row, 'modoProcesamiento'),
  idOrganizacion: pickPlanilla<string>(row, 'idOrganizacion'),
});

const pickProgramacion = <T>(row: Record<string, unknown>, key: string): T =>
  (row[key] ?? row[key.toLowerCase()]) as T;

const normalizeProgramacionRow = (row: Record<string, unknown>): ProgramacionRow => ({
  id: pickProgramacion<string>(row, 'id'),
  codigo: pickProgramacion<string>(row, 'codigo'),
  idProducto: pickProgramacion<number>(row, 'idProducto'),
  productoCodigo: pickProgramacion<string | null>(row, 'productoCodigo'),
  productoFullCode: pickProgramacion<string | null>(row, 'productoFullCode'),
  idMoneda: pickProgramacion<number>(row, 'idMoneda'),
  monedaCodigo: pickProgramacion<string | null>(row, 'monedaCodigo'),
  idEstado: pickProgramacion<number>(row, 'idEstado'),
  estadoCodigo: pickProgramacion<string>(row, 'estadoCodigo'),
  estadoFullCode: pickProgramacion<string | null>(row, 'estadoFullCode'),
  tipoDestino: pickProgramacion<string | null>(row, 'tipoDestino'),
  canalLiquidacion: pickProgramacion<string | null>(row, 'canalLiquidacion'),
  modoEnvio: pickProgramacion<string>(row, 'modoEnvio'),
  modalidadCodigo: pickProgramacion<string | null>(row, 'modalidadCodigo'),
  fechaProceso: pickProgramacion<string>(row, 'fechaProceso'),
  fechaProgramado: pickProgramacion<string | null>(row, 'fechaProgramado'),
  fechaEjecutado: pickProgramacion<string | null>(row, 'fechaEjecutado'),
  totalOperaciones: toNumber(pickProgramacion<unknown>(row, 'totalOperaciones')),
  montoTotal: toNumber(pickProgramacion<unknown>(row, 'montoTotal')),
  reintentos: pickProgramacion<number | null>(row, 'reintentos'),
  idPlanilla: pickProgramacion<string | null>(row, 'idPlanilla'),
  idOrganizacion: pickProgramacion<string>(row, 'idOrganizacion'),
});

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE);
  private readonly backendBase = inject(H2H_BACKEND_BASE);
  private readonly mantenimientosBase = this.backendBase.replace(/\/h2h\/v1\/?$/, '');
  private readonly schedulersBase = inject(H2H_SCHEDULERS_BASE);
  private readonly session = inject(SessionService);

  private headers(mutating = false): HttpHeaders {
    // BFF: sin Authorization. La sesión viaja por cookie (withCredentials, via
    // credentialsInterceptor) y el gateway hace TokenRelay a los backends.
    let h = new HttpHeaders().set('X-Correlation-Id', guid());
    const org = this.session.tenant()?.org_u_id;
    if (org) h = h.set('X-Organizacion-Id', org);
    if (mutating) h = h.set('X-Idempotency-Key', guid());
    return h;
  }

  private get<T>(path: string, params?: Record<string, string | number>): Observable<T> {
    let p = new HttpParams();
    for (const [k, v] of Object.entries(params ?? {})) p = p.set(k, String(v));
    return this.http.get<T>(`${this.base}${path}`, { headers: this.headers(), params: p });
  }
  private post<T>(path: string, body: unknown = {}): Observable<T> {
    return this.http.post<T>(`${this.base}${path}`, body, { headers: this.headers(true) });
  }
  private postBackend<T>(path: string, body: unknown = {}, params?: Record<string, string | number>): Observable<T> {
    let p = new HttpParams();
    for (const [k, v] of Object.entries(params ?? {})) p = p.set(k, String(v));
    return this.http.post<T>(`${this.backendBase}${path}`, body, { headers: this.headers(true), params: p });
  }
  /**
   * POST contra el servicio de JOBS (api-schedulers). Base propia porque es otro despliegue, no un
   * namespace de mantenimientos: `backendBase` apunta a `api/mantenimientos/h2h/v1` y esta ruta
   * no existiría ahí (el gateway devolvería 404, con un síntoma que no apunta al gateway).
   */
  private getSchedulers<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.schedulersBase}${path}`, { headers: this.headers() });
  }

  /**
   * Cuánto falta para el próximo disparo de cada job.
   *
   * <p>Los cron viven en el secreto de Vault del ambiente (`api-schedulers-dev` / `-prd`) y el
   * backend devuelve, además del tiempo restante, SU instante. La cuenta atrás se descuenta en
   * local a partir de ese instante y no del reloj del equipo: un navegador desajustado unos
   * minutos mostraría un tiempo que no se corresponde con ningún disparo real.</p>
   */
  relojesJobs(): Observable<RelojesJobs | null> {
    return this.getSchedulers<ApiResponseEnvelope<RelojesJobs>>(
      // La ruta va RELATIVA a schedulersBase, que ya trae `api/schedulers/h2h/v1`: con la ruta
      // absoluta el prefijo salia duplicado y el endpoint respondia 404 siempre.
      '/seguimiento/relojes'
    ).pipe(
      map((res) => (res?.data ?? null) as RelojesJobs | null),
      catchError(() => of(null))
    );
  }

  private postSchedulers<T>(path: string, body: unknown = {}): Observable<T> {
    return this.http.post<T>(`${this.schedulersBase}${path}`, body, { headers: this.headers(true) });
  }
  private postMantenimientos<T>(path: string, body: unknown = {}, params?: Record<string, string | number>): Observable<T> {
    let p = new HttpParams();
    for (const [k, v] of Object.entries(params ?? {})) p = p.set(k, String(v));
    return this.http.post<T>(`${this.mantenimientosBase}${path}`, body, { headers: this.headers(), params: p });
  }
  private patch<T>(path: string, body: unknown = {}): Observable<T> {
    return this.http.patch<T>(`${this.base}${path}`, body, { headers: this.headers(true) });
  }
  /** Mutacion (POST/PUT/DELETE) contra api/mantenimientos que devuelve texto plano. */
  private mutMantenimientos(method: 'POST' | 'PUT' | 'DELETE', path: string, body: unknown = {}): Observable<string> {
    return this.http.request(method, `${this.mantenimientosBase}${path}`, {
      headers: this.headers(),
      body,
      responseType: 'text',
    });
  }

  // ── Auth / contexto ──────────────────────────────────────────────────
  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.base}/mock/auth/login`, {
      username,
      password,
      tenantSubdomain: 'develtrex.jofrantoba.pe',
    });
  }
  meContext() {
    return this.get<TenantContext>('/v1/me/context');
  }

  // ── Dashboard ────────────────────────────────────────────────────────
  dashboardSummary() {
    return this.get<DashboardSummary>('/v1/dashboard/summary');
  }
  health() {
    return this.get<Health>('/v1/monitoring/health');
  }

  // ── Catálogos ────────────────────────────────────────────────────────
  catalogs() {
    return this.get<Record<string, string[]>>('/v1/catalogs');
  }
  parametrias(filtro: ParametriaFiltro = {}) {
    const body: Record<string, string | boolean> = {};
    if (filtro.codigo) body['codigo'] = filtro.codigo;
    if (filtro.codigoPadre) body['codigoPadre'] = filtro.codigoPadre;
    if (typeof filtro.persistente === 'boolean') body['persistente'] = filtro.persistente;
    if (typeof filtro.soloPadres === 'boolean') body['soloPadres'] = filtro.soloPadres;
    if (typeof filtro.soloHijos === 'boolean') body['soloHijos'] = filtro.soloHijos;
    return this.postMantenimientos<ParametriaBackendRow[]>('/parametrias/listar/all', body).pipe(
      map((items) => items.map(normalizeParametria))
    );
  }

  // ── Operaciones ──────────────────────────────────────────────────────
  operaciones(opts: { producto?: ProductoGrupo; subtipo?: string; page?: number; pageSize?: number; filters?: OperacionFiltro } = {}) {
    const { producto, subtipo, page = 1, pageSize = 2, filters } = opts;
    // `number` entró con el periodo: la API espera epoch en milisegundos.
    const body: Record<string, string | number | boolean | string[]> = {};
    const org = this.session.tenant()?.org_u_id;
    if (org) body['idOrganizacion'] = org;

    const filtros = filters ?? {};
    if (filtros.id) body['id'] = filtros.id;
    if (filtros.idCarga) body['idCarga'] = filtros.idCarga;
    if (filtros.idPlanillaVigente) body['idPlanillaVigente'] = filtros.idPlanillaVigente;
    if (filtros.idBeneficiario) body['idBeneficiario'] = filtros.idBeneficiario;
    if (filtros.codigoOperacion) body['codigoOperacion'] = filtros.codigoOperacion;
    if (filtros.referenciaOrigen) body['referenciaOrigen'] = filtros.referenciaOrigen;
    if (filtros.sistemaOrigen) body['sistemaOrigen'] = filtros.sistemaOrigen;
    if (filtros.tipoOperacion) body['tipoOperacion'] = filtros.tipoOperacion;
    else if (subtipo) body['tipoOperacion'] = subtipo;
    else if (filtros.tipoOperaciones?.length) body['tipoOperaciones'] = filtros.tipoOperaciones;
    else if (producto) body['tipoOperaciones'] = tiposPorProducto(producto);
    if (filtros.estadoOperacion) body['estadoOperacion'] = filtros.estadoOperacion;
    if (filtros.moneda) body['moneda'] = filtros.moneda;
    if (typeof filtros.sinPlanillaVigente === 'boolean') body['sinPlanillaVigente'] = filtros.sinPlanillaVigente;
    if (typeof filtros.sinProgramacion === 'boolean') body['sinProgramacion'] = filtros.sinProgramacion;
    if (filtros.modoEnvio) body['modoEnvio'] = filtros.modoEnvio;
    // Mismo criterio que el panel: la API espera epoch, y la hora de pared se
    // interpreta en la zona del negocio, no en la del navegador.
    const desde = horaDeParedAEpoch(filtros.fechaDesde ?? '');
    const hasta = horaDeParedAEpoch(filtros.fechaHasta ?? '');
    if (desde !== null) body['fechaDesde'] = desde;
    if (hasta !== null) body['fechaHasta'] = hasta;
    // Día de proceso en el banco: columna `date`, filtro independiente del anterior.
    const procDesde = horaDeParedAEpoch(filtros.fechaProcesoDesde ?? '');
    const procHasta = horaDeParedAEpoch(filtros.fechaProcesoHasta ?? '');
    if (procDesde !== null) body['fechaProcesoDesde'] = procDesde;
    if (procHasta !== null) body['fechaProcesoHasta'] = procHasta;

    const offSet = (page - 1) * pageSize;
    return forkJoin({
      items: this.postBackend<OperacionBackendRow[]>('/operaciones/listar/paginacion', body, { limit: pageSize, offSet }),
      total: this.postBackend<number>('/operaciones/contar', body),
    }).pipe(
      map(({ items, total }) => ({
        items: items.map(normalizeOperacion),
        pagination: { page, pageSize, total: Number(total ?? 0) },
      }))
    );
  }
  operacion(id: string) {
    return this.postBackend<OperacionBackendRow[]>('/operaciones/listar/all', { id }).pipe(
      map((items) => (items[0] ? normalizeOperacion(items[0]) : undefined))
    );
  }
  operacionDetalle(id: string) {
    return this.postBackend<OperacionDetalleBackend>('/operaciones/detalle', { id }).pipe(map(normalizeOperacionDetalle));
  }
  crearOperacionManual(body: unknown) {
    return this.post<Operacion>('/v1/operaciones/manual', body);
  }
  anularOperacion(id: string, motivo: string) {
    return this.patch<Operacion>(`/v1/operaciones/${id}/anular`, { motivo });
  }

  /**
   * ANULA una operación: decide que este pago no se hará nunca y DESHACE su asiento contable.
   *
   * Es terminal y no se desanda: si el pago vuelve a hacer falta, se registra una operación nueva.
   *
   * En una sola transacción el backend (1) la saca del plan si estaba reservada en uno —detalle a
   * `EXCLUIDO`, reserva liberada y totales del plan corregidos—, (2) deshace el asiento: las líneas
   * ya asentadas (`APLICADO`) pasan a `REVERSADO` y se les genera su CONTRAPARTIDA (`REVERSA`, con
   * la naturaleza invertida), y las que nunca se asentaron pasan a `ANULADO` **sin** contrapartida
   * —contraponer algo que no se posteó inflaría el mayor con un cargo y un abono inexistentes—, y
   * (3) deja la operación en `ANULADA` sin reservas, con el motivo en sus atributos.
   *
   * El `motivo` es obligatorio (400 si falta). Devuelve 422 si el hecho ya está consumado: estado
   * `PAGO_CONFIRMADO` o `CONTABILIZADA`, o la operación ya incluida en una planilla cuyo archivo
   * pudo llegar al banco (ahí la vía es `/planillas/anular`). Idempotente (`yaEstaba = true`).
   *
   * En `data.contable.mensaje` viene el resultado de la reversa, que es lo que el operador necesita
   * leer: cuántas líneas se contrapusieron y cuántas se anularon.
   */
  anularOperacionBackend(idOperacion: string, motivo: string): Observable<Record<string, unknown>> {
    return this.postBackend<ApiResponseEnvelope<Record<string, unknown>>>(
      '/operaciones/anular',
      this.buildEnvelope({ idOperacion, motivo })
    ).pipe(map((res) => (res?.data ?? {}) as Record<string, unknown>));
  }

  /**
   * Convierte transferencias a terceros en pagos masivos — abono a proveedores.
   *
   * <p>Por cada transferencia crea una operación de abono equivalente y deja la original
   * **anulada**, revirtiendo su asiento: el debe pasa de la cuenta `4699` a la `4212`. No es una
   * reclasificación cosmética y **no tiene vuelta atrás** desde la consola.</p>
   *
   * <p>Es **todo o nada**: si una sola operación del lote no admite conversión, el backend
   * responde 422 sin convertir ninguna, enumerando cuáles estorban y por qué. Por eso se manda la
   * lista entera en una petición en vez de una por operación — así el error habla del lote.</p>
   *
   * <p>Devuelve 422 también si alguna pertenece a un plan de envío: esa conversión va por
   * `/programaciones/modalidad`, que además repunta los detalles del plan y le cambia el producto.
   * `fechaProceso` es opcional; sin ella cada operación conserva la suya.</p>
   */
  convertirOperacionesAPagoMasivoProveedores(
    operaciones: string[],
    fechaProceso?: string
  ): Observable<Record<string, unknown>> {
    const data: Record<string, unknown> = { operaciones };
    if (fechaProceso) data['fechaProceso'] = fechaProceso;
    return this.postBackend<ApiResponseEnvelope<Record<string, unknown>>>(
      '/operaciones/convertir/pagomasivo-proveedores',
      this.buildEnvelope(data)
    ).pipe(map((res) => (res?.data ?? {}) as Record<string, unknown>));
  }

  // ── Planillas ────────────────────────────────────────────────────────
  planillas(opts: { producto?: ProductoGrupo; subtipo?: string; page?: number; pageSize?: number } = {}) {
    const { producto, subtipo, page = 1, pageSize = 20 } = opts;
    const params: Record<string, string | number> = { page, pageSize };
    if (producto) params['producto'] = producto;
    if (subtipo) params['subtipo'] = subtipo;
    return this.get<Paginated<Planilla>>('/v1/planillas', params);
  }
  planilla(id: string) {
    return this.get<Planilla>(`/v1/planillas/${id}`);
  }

  // ── Planillas (backend real: api/mantenimientos/h2h/v1/planillas) ─────
  planillasBackend(opts: { page?: number; pageSize?: number; filters?: PlanillaFiltro } = {}) {
    const { page = 1, pageSize = 10, filters } = opts;
    const body: Record<string, string | number | boolean> = {};
    const org = this.session.tenant()?.org_u_id;
    if (org) body['idOrganizacion'] = org;
    const f = filters ?? {};
    if (f.id) body['id'] = f.id;
    if (f.idEntidadFin) body['idEntidadFin'] = f.idEntidadFin;
    if (f.idProducto) body['idProducto'] = f.idProducto;
    if (f.idEstadoPlanilla) body['idEstadoPlanilla'] = f.idEstadoPlanilla;
    if (f.estadoPlanilla) body['estadoPlanilla'] = f.estadoPlanilla;
    if (f.idMoneda) body['idMoneda'] = f.idMoneda;
    if (f.moneda) body['moneda'] = f.moneda;
    if (f.secuencial) body['secuencial'] = f.secuencial;
    if (f.nombreArchivo) body['nombreArchivo'] = f.nombreArchivo;
    if (typeof f.isFlujoPar === 'boolean') body['isFlujoPar'] = f.isFlujoPar;
    const pDesde = horaDeParedAEpoch(f.fechaDesde ?? '');
    const pHasta = horaDeParedAEpoch(f.fechaHasta ?? '');
    if (pDesde !== null) body['fechaEnvioDesde'] = pDesde;
    if (pHasta !== null) body['fechaEnvioHasta'] = pHasta;
    const arcDesde = horaDeParedAEpoch(f.fechaArchivoDesde ?? '');
    const arcHasta = horaDeParedAEpoch(f.fechaArchivoHasta ?? '');
    if (arcDesde !== null) body['fechaArchivoDesde'] = arcDesde;
    if (arcHasta !== null) body['fechaArchivoHasta'] = arcHasta;

    const offSet = (page - 1) * pageSize;
    return forkJoin({
      items: this.postBackend<Record<string, unknown>[]>('/planillas/listar/paginacion', body, { limit: pageSize, offSet }),
      total: this.postBackend<number>('/planillas/contar', body),
    }).pipe(
      map(({ items, total }) => ({
        items: (items ?? []).map(normalizePlanillaRow),
        pagination: { page, pageSize, total: Number(total ?? 0) },
      }))
    );
  }
  planillaDetalleBackend(id: string) {
    return this.postBackend<PlanillaDetalleFull>('/planillas/detalle', { id }).pipe(
      map((d) => ({
        planilla: d?.planilla ?? {},
        detalles: d?.detalles ?? [],
        respuestas: d?.respuestas ?? [],
      }))
    );
  }

  /**
   * Etapa de VALIDACIÓN: valida la planilla en el backend, genera el TXT y lo materializa en
   * files-s1. Devuelve `{ idPlanilla, urlClaro, estado }` de `data`.
   */
  planillaValidarBackend(idPlanilla: string): Observable<Record<string, unknown>> {
    return this.postBackend<ApiResponseEnvelope<Record<string, unknown>>>(
      '/planillas/validar',
      this.buildEnvelope({ idPlanilla })
    ).pipe(map((res) => (res?.data ?? {}) as Record<string, unknown>));
  }
  /** Etapa CIFRADO: descarga el claro, cifra/firma con las llaves de Vault y avanza a CIFRADA. */
  planillaCifrarBackend(idPlanilla: string): Observable<Record<string, unknown>> {
    return this.postBackend<ApiResponseEnvelope<Record<string, unknown>>>(
      '/planillas/cifrar',
      this.buildEnvelope({ idPlanilla })
    ).pipe(map((res) => (res?.data ?? {}) as Record<string, unknown>));
  }
  /** Etapa ENVÍO: descarga el cifrado y lo sube por SFTP al buzón IN/ de BCP; avanza a ENVIADA. */
  planillaEnviarBackend(idPlanilla: string): Observable<Record<string, unknown>> {
    return this.postBackend<ApiResponseEnvelope<Record<string, unknown>>>(
      '/planillas/enviar',
      this.buildEnvelope({ idPlanilla })
    ).pipe(map((res) => (res?.data ?? {}) as Record<string, unknown>));
  }

  // ── H2W · el archivo lo sube el operador al portal web del banco ──────
  //
  // Estas tres etapas sustituyen al ENVÍO por SFTP y a la lectura del buzón. El backend
  // rechaza `/planillas/enviar` sobre una planilla H2W (guarda contra el doble pago), así
  // que la consola tampoco debe ofrecerlo: ver `siguientePaso` en inter-planillas.

  /**
   * Descarga el archivo para subirlo al portal. `tipo` es `claro` (TXT) o `cifrado` (.gpg):
   * no está confirmado cuál acepta el portal, así que se ofrecen los dos y queda registrado
   * cuál se llevó el operador. Deja la planilla en PENDIENTE_ENVIO.
   */
  planillaDescargarPortal(idPlanilla: string, tipo: 'claro' | 'cifrado') {
    return this.postBackend<ApiResponseEnvelope<Record<string, unknown>>>(
      '/planillas/portal/descargar',
      this.buildEnvelope({ idPlanilla, tipoArchivo: tipo })
    ).pipe(map((res) => (res?.data ?? {}) as Record<string, unknown>));
  }

  /** Confirma la subida al portal con la constancia que devuelve el banco; avanza a ENVIADA. */
  planillaConfirmarSubidaPortal(idPlanilla: string, constancia: string) {
    return this.postBackend<ApiResponseEnvelope<Record<string, unknown>>>(
      '/planillas/portal/confirmar',
      this.buildEnvelope({ idPlanilla, constancia })
    ).pipe(map((res) => (res?.data ?? {}) as Record<string, unknown>));
  }

  /**
   * Cierra la planilla con el resultado que el operador vio en el portal.
   *
   * <p>O `resultado` global, o `detalles` uno a uno. El estado final (PROCESADA /
   * PROCESADA_PARCIAL / RECHAZADA) lo calcula el backend a partir de los veredictos: no se
   * declara desde aquí, para no poder cerrar en verde algo con rechazos dentro.</p>
   */
  planillaCerrarPortal(
    idPlanilla: string,
    veredicto: { resultado?: string; detalles?: { secuencial: number; resultado: string; codigoDevolucion?: string; observacion?: string }[] }
  ) {
    return this.postBackend<ApiResponseEnvelope<Record<string, unknown>>>(
      '/planillas/portal/cerrar',
      this.buildEnvelope({ idPlanilla, ...veredicto })
    ).pipe(map((res) => (res?.data ?? {}) as Record<string, unknown>));
  }

  /** Cambia el canal de salida de un plan (H2H ⇄ H2W). Vía de contingencia. */
  /**
   * Cambia el canal de salida del plan, opcionalmente reprogramándolo.
   *
   * <p>`fechaProceso` (`yyyy-MM-dd`) no es un extra: a H2W se pasa un plan cuando el camino
   * automático falló, o sea con su fecha ya vencida, y el TXT la lleva en el nombre y en la
   * cabecera. El backend la propaga al plan y a sus operaciones —la plantilla lee de ambos— y
   * rechaza pasar a H2W con la fecha vencida si no se manda una nueva.</p>
   */
  cambiarModalidadProgramacion(
    idProgramacion: string,
    modalidad: 'H2H' | 'H2W',
    fechaProceso?: string,
    conversion?: ConversionProducto
  ) {
    const body: Record<string, unknown> = { id: idProgramacion, modalidad };
    // Solo si viene: sin ella el plan conserva su fecha y no se reescriben las operaciones.
    if (fechaProceso) body['fechaProceso'] = fechaProceso;
    // `MANTENER` es el default del backend, asi que no se manda: el cuerpo solo lleva lo que pide
    // un cambio real, y una conversion nunca viaja por descuido.
    if (conversion && conversion !== 'MANTENER') body['conversion'] = conversion;
    return this.postBackend<Record<string, unknown>>('/programaciones/modalidad', body);
  }

  /**
   * Explorador de buzones SFTP (seguimiento). Sin `ruta` devuelve el mapa de buzones configurados
   * SIN abrir sesión SFTP; con `ruta` hace el `ls` remoto en un ciclo. El backend acota la ruta al
   * árbol de la organización.
   */
  sftpExplorar(
    ruta?: string,
    banco?: string,
    ventana?: { fecha?: string; horaInicio?: string; horaFin?: string }
  ): Observable<Record<string, unknown>> {
    const data: Record<string, unknown> = {};
    if (ruta) data['ruta'] = ruta;
    if (banco) data['banco'] = banco;
    // Ventana de los depósitos del IN. Si no va, el backend asume el día de hoy completo.
    if (ventana?.fecha) data['fecha'] = ventana.fecha;
    if (ventana?.horaInicio) data['horaInicio'] = ventana.horaInicio;
    if (ventana?.horaFin) data['horaFin'] = ventana.horaFin;
    // postBackend (no postMantenimientos): el controller vive bajo api/mantenimientos/h2h/v1/…,
    // igual que sftpListar. mantenimientosBase quita el /h2h/v1 y la ruta no existiría.
    return this.postBackend<ApiResponseEnvelope<Record<string, unknown>>>(
      '/organizacion/sftp/explorar',
      this.buildEnvelope(data)
    ).pipe(map((res) => (res?.data ?? {}) as Record<string, unknown>));
  }

  /**
   * Etapa RESPUESTA_RECIBIDA: recoge del buzón OUT las respuestas de la planilla (`-VAL`, `-RES`,
   * `-RES2`, `-PAR`) en UN ciclo SFTP, las descifra, las materializa en files-s1, las registra y
   * avanza el estado. Idempotente: reejecutarla no duplica respuestas.
   */
  planillaRecibirRespuestasBackend(idPlanilla: string): Observable<Record<string, unknown>> {
    return this.postBackend<ApiResponseEnvelope<Record<string, unknown>>>(
      '/planillas/recibir-respuestas',
      this.buildEnvelope({ idPlanilla })
    ).pipe(map((res) => (res?.data ?? {}) as Record<string, unknown>));
  }

  /**
   * Etapa final (fase 8): aplica la DECISIÓN sobre la respuesta del banco. El estado destino no
   * lo elige el frontend — lo determina el veredicto:
   *
   * - `-VAL` sin respuestas de procesamiento ⇒ `RECHAZADA`, operaciones liberadas.
   * - `-RES`/`-RES2` todas Procesada ⇒ `PROCESADA`; todas rechazadas ⇒ `RECHAZADA`;
   *   mezcla ⇒ `PROCESADA_PARCIAL` (solo las rechazadas se liberan).
   * - Con operaciones en estado no final (`Enviada` de una interbancaria vía BCR) la
   *   conciliación se guarda pero la planilla NO se cierra: `cerrada = false`.
   *
   * Idempotente: sobre una planilla ya cerrada devuelve `decision = 'YA_DECIDIDA'`.
   */
  planillaDecidirBackend(idPlanilla: string): Observable<Record<string, unknown>> {
    return this.postBackend<ApiResponseEnvelope<Record<string, unknown>>>(
      '/planillas/decidir',
      this.buildEnvelope({ idPlanilla })
    ).pipe(map((res) => (res?.data ?? {}) as Record<string, unknown>));
  }

  /**
   * ANULA una planilla generada que se decide no enviar: queda en `ANULADA` —estado propio, no
   * `ERROR`— y sus operaciones se liberan de sus dos reservas para poder programarse de nuevo.
   *
   * El `motivo` es obligatorio: es la única constancia de por qué no se envió (400 si falta).
   *
   * Solo antes de que el archivo salga. Devuelve 422 si la planilla está `ENVIADA` o
   * `RESPUESTA_RECIBIDA`, si ya fue cerrada por otra vía, o si consta un PUT del archivo en la
   * bitácora SFTP aunque el estado no lo refleje: liberar operaciones que el banco recibió
   * duplicaría pagos. Idempotente (`yaEstaba = true` si ya estaba anulada).
   */
  planillaAnularBackend(idPlanilla: string, motivo: string): Observable<Record<string, unknown>> {
    return this.postBackend<ApiResponseEnvelope<Record<string, unknown>>>(
      '/planillas/anular',
      this.buildEnvelope({ idPlanilla, motivo })
    ).pipe(map((res) => (res?.data ?? {}) as Record<string, unknown>));
  }

  /**
   * Detalle de una respuesta del banco. El listado que viene en el detalle de la planilla usa la
   * proyección BASE (sin `contenidoTxt` ni `atributos`), así que el contenido del `-VAL`/`-RES` se
   * pide aquí, bajo demanda, cuando el operador abre la vista previa o descarga.
   *
   * Contrato legado (sin envelope): el controller de respuestas devuelve el ObjectNode directo.
   */
  /**
   * Listado real de respuestas del banco, con su total.
   *
   * <p>Reemplaza al mock `respuestas()`. Se normaliza clave a clave porque el
   * DAO nativo mapea con `getColumnName()` y PostgreSQL pliega a minúsculas
   * todo alias sin comillas: `nombreArchivo` llega como `nombrearchivo`.</p>
   */
  respuestasBackend(opts: { page?: number; pageSize?: number; filters?: RespuestaFiltro } = {}) {
    const { page = 1, pageSize = 10, filters } = opts;
    const body: Record<string, string | number | boolean> = {};
    const org = this.session.tenant()?.org_u_id;
    if (org) body['idOrganizacion'] = org;
    const f = filters ?? {};
    if (f.id) body['id'] = f.id;
    if (f.idPlanilla) body['idPlanilla'] = f.idPlanilla;
    if (f.tipoRespuesta) body['tipoRespuesta'] = f.tipoRespuesta;
    if (f.nombreArchivo) body['nombreArchivo'] = f.nombreArchivo;
    const pDesde = horaDeParedAEpoch(f.fechaDesde ?? '');
    const pHasta = horaDeParedAEpoch(f.fechaHasta ?? '');
    if (pDesde !== null) body['fechaRecepcionDesde'] = pDesde;
    if (pHasta !== null) body['fechaRecepcionHasta'] = pHasta;

    const offSet = (page - 1) * pageSize;
    return forkJoin({
      items: this.postBackend<Record<string, unknown>[]>('/respuestas/listar/paginacion', body, {
        limit: pageSize,
        offSet,
      }),
      total: this.postBackend<number>('/respuestas/contar', body),
    }).pipe(
      map(({ items, total }) => ({
        items: (items ?? []).map(normalizeRespuestaRow),
        pagination: { page, pageSize, total: Number(total ?? 0) },
      }))
    );
  }

  /** Respuestas asociadas a una planilla concreta. */
  respuestasPorPlanillaBackend(idPlanilla: string) {
    return this.postBackend<Record<string, unknown>[]>('/respuestas/por-planilla', { idPlanilla }).pipe(
      map((items) => (items ?? []).map(normalizeRespuestaRow))
    );
  }

  respuestaDetalleBackend(idRespuesta: string): Observable<Record<string, unknown>> {
    return this.postBackend<Record<string, unknown>>('/respuestas/detalle', { id: idRespuesta }).pipe(
      map((res) => res ?? {})
    );
  }

  /**
   * Descarga un archivo invocando DIRECTAMENTE el endpoint de la API de files con el path que la
   * planilla ya persiste (`urlClaro`/`urlCifrado` = `api/files/s1/download/completefile/<id>`), sin
   * ningún wrapper ni endpoint intermedio propio.
   *
   * files-s1 es un resource server (valida JWT en `api/files/s1/download/**`), por lo que la llamada
   * pasa por el gateway (única vía con auth: cookie BFF → TokenRelay → Bearer). El `credentialsInterceptor`
   * añade `withCredentials` porque la URL empieza por el gateway. Devuelve el Blob (descarga o preview).
   */
  descargarArchivoFiles(pathFiles: string): Observable<Blob> {
    const base = environment.gatewayBaseUrl.replace(/\/$/, '');
    const path = pathFiles.replace(/^\//, '');
    return this.http.get(`${base}/${path}`, { headers: this.headers(), responseType: 'blob' });
  }
  generarPlanilla(body: unknown) {
    return this.post<Planilla>('/v1/planillas/generar', body);
  }
  planillaAccion(id: string, accion: 'validar' | 'cifrar' | 'enviar' | 'reintentar-envio' | 'cancelar') {
    return this.post<PlanillaAction>(`/v1/planillas/${id}/${accion}`, { motivo: 'Acción desde consola' });
  }
  planillaPreview(id: string) {
    return this.get<{ planillaId: string; formato: string; contentType: string; contenido: string; checksum: string }>(
      `/v1/planillas/${id}/preview`
    );
  }

  // ── Programación de envíos ───────────────────────────────────────────
  programacionesBackend(opts: { page?: number; pageSize?: number; filters?: ProgramacionFiltro } = {}) {
    const { page = 1, pageSize = 10, filters } = opts;
    const body: Record<string, string | number | boolean> = {};
    const org = this.session.tenant()?.org_u_id;
    if (org) body['idOrganizacion'] = org;
    const f = filters ?? {};
    if (f.id) body['id'] = f.id;
    if (f.idProducto) body['idProducto'] = f.idProducto;
    if (f.idMoneda) body['idMoneda'] = f.idMoneda;
    if (f.idEstado) body['idEstado'] = f.idEstado;
    if (f.estado) body['estado'] = f.estado;
    if (f.moneda) body['moneda'] = f.moneda;
    if (f.tipoDestino) body['tipoDestino'] = f.tipoDestino;
    if (f.canalLiquidacion) body['canalLiquidacion'] = f.canalLiquidacion;
    if (f.modoEnvio) body['modoEnvio'] = f.modoEnvio;
    if (f.codigo) body['codigo'] = f.codigo;
    if (f.fechaProceso) body['fechaProceso'] = f.fechaProceso;
    // Periodo sobre el momento PROGRAMADO del plan. `fechaProceso` es otra cosa:
    // el día en que el banco procesa, sin hora.
    const prgDesde = horaDeParedAEpoch(f.fechaDesde ?? '');
    const prgHasta = horaDeParedAEpoch(f.fechaHasta ?? '');
    if (prgDesde !== null) body['fechaProgramadoDesde'] = prgDesde;
    if (prgHasta !== null) body['fechaProgramadoHasta'] = prgHasta;
    // OJO con el nombre: `FilterProgramacion` los llama `fechaProcesoDia*`, NO
    // `fechaProceso*` como `FilterOperacion`. Se enviaron mal y el filtro no hacía nada:
    // el backend ignora en silencio la clave que no conoce y responde 200 con todo.
    const dpDesde = horaDeParedAEpoch(f.fechaProcesoDiaDesde ?? '');
    const dpHasta = horaDeParedAEpoch(f.fechaProcesoDiaHasta ?? '');
    if (dpDesde !== null) body['fechaProcesoDiaDesde'] = dpDesde;
    if (dpHasta !== null) body['fechaProcesoDiaHasta'] = dpHasta;
    const offSet = (page - 1) * pageSize;
    return forkJoin({
      items: this.postBackend<Record<string, unknown>[]>('/programaciones/listar/paginacion', body, { limit: pageSize, offSet }),
      total: this.postBackend<number>('/programaciones/contar', body),
    }).pipe(
      map(({ items, total }) => ({
        items: (items ?? []).map(normalizeProgramacionRow),
        pagination: { page, pageSize, total: Number(total ?? 0) },
      }))
    );
  }
  programacionDetalleBackend(id: string) {
    return this.postBackend<ProgramacionDetalleFull>('/programaciones/detalle', { id }).pipe(
      map((d) => ({ programacion: d?.programacion ?? {}, detalles: d?.detalles ?? [] }))
    );
  }
  /**
   * Ventana de atención del canal, derivada en el backend a partir de la configuración horaria.
   *
   * <p>No se codifican los días ni las horas aquí: el mismo validador que responde este endpoint es
   * el que rechaza al crear, así que una copia en el navegador se desincronizaría y ofrecería días
   * que el backend no acepta.</p>
   */
  ventanaCanalProgramacion(producto?: string) {
    const org = this.session.tenant()?.org_u_id;
    const body: Record<string, unknown> = { idOrganizacion: org };
    // Cada producto tiene su rama horaria. Sin `producto` el backend responde la de transferencias
    // —lo que hacía antes—, y el formulario mostraría un horario distinto del que se le va a
    // aplicar al validar un plan de pagos masivos.
    if (producto) body['producto'] = producto;
    return this.postBackend<VentanaSemanal>('/programaciones/ventana', body);
  }
  /**
   * Trabajo pendiente por etapa del flujo, para los badges del menú.
   *
   * <p>"Pendiente" es siempre <em>requiere una acción humana</em>, no "existe":
   * una planilla ya enviada no es trabajo, y una operación ya programada
   * tampoco. Por eso cada etapa filtra por el estado que espera intervención y
   * no por el total de la tabla.</p>
   *
   * <p>Va en una sola llamada agregada —seis `contar` en paralelo— porque se
   * dispara al montar la consola y encadenarlas retrasaría la primera pintura.
   * Si alguna falla se devuelve 0 para esa etapa: un badge que no aparece es
   * preferible a una consola que no carga.</p>
   */
  pendientesPorEtapa(filtro: FiltroPanel = {}): Observable<PendientesPorEtapa> {
    // Un cuerpo por entidad: los nombres de los campos de fecha no coinciden entre
    // ellas y el backend ignora en silencio los que no reconoce. Ver `baseFiltrada`.
    const baseOperacion = this.baseFiltrada(filtro, 'operacion');
    const baseProgramacion = this.baseFiltrada(filtro, 'programacion');
    const basePlanilla = this.baseFiltrada(filtro, 'planilla');
    const contar = (
      path: string,
      base: Record<string, string | number | boolean>,
      extra: Record<string, string | number | boolean>
    ) =>
      this.postBackend<number>(path, { ...base, ...extra }).pipe(
        map((n) => Number(n ?? 0)),
        catchError(() => of(0))
      );

    return forkJoin({
      // Operaciones ingestadas que todavía no entraron en ninguna planilla.
      operaciones: contar('/operaciones/contar', baseOperacion, { sinPlanillaVigente: true }),
      // Planes de envío abiertos: aún admiten operaciones y nadie los ha generado.
      programaciones: contar('/programaciones/contar', baseProgramacion, { estado: 'ABIERTA' }),
      // Planillas a medio camino del envío; cada estado espera un paso distinto
      // (validar, cifrar, enviar) pero todos son el mismo pendiente para el menú.
      generadas: contar('/planillas/contar', basePlanilla, { estadoPlanilla: 'GENERADA' }),
      validadas: contar('/planillas/contar', basePlanilla, { estadoPlanilla: 'VALIDADA' }),
      cifradas: contar('/planillas/contar', basePlanilla, { estadoPlanilla: 'CIFRADA' }),
      // Respuesta del banco recibida y sin decidir: es el pendiente más urgente
      // de todos, porque la respuesta caduca en el buzón.
      respuestas: contar('/planillas/contar', basePlanilla, { estadoPlanilla: 'RESPUESTA_RECIBIDA' }),
    }).pipe(
      map((r) => ({
        operaciones: r.operaciones,
        programaciones: r.programaciones,
        planillas: r.generadas + r.validadas + r.cifradas,
        respuestas: r.respuestas,
      }))
    );
  }

  /**
   * Resumen del canal para el panel de control, con datos reales.
   *
   * <p>El panel vivía del mock (`dashboardSummary`), que ofrecía cosas que la
   * API real no sabe calcular —monto enviado del día, certificados por vencer—.
   * Aquí solo se pide lo que el backend puede responder hoy: conteos por
   * estado. No hay endpoint de agregación de importes, así que el panel no
   * finge tenerlos.</p>
   *
   * <p>Son conteos en paralelo y no una consulta agregada porque no existe tal
   * endpoint; se limita a los estados con lectura operativa, no a los doce del
   * catálogo, para no convertir la carga del panel en veinte peticiones.</p>
   */
  resumenCanal(filtro: FiltroPanel = {}): Observable<ResumenCanal> {
    const base = this.baseFiltrada(filtro, 'operacion');
    const contar = (path: string, extra: Record<string, string | number | boolean>) =>
      this.postBackend<number>(path, { ...base, ...extra }).pipe(
        map((n) => Number(n ?? 0)),
        catchError(() => of(0))
      );
    const ops = (estadoOperacion: string) => contar('/operaciones/contar', { estadoOperacion });
    // Las planillas se agrupan por PRODUCTO (BCP#TIPO_PRODUCTO#*), no por tipo
    // de operación: son taxonomías distintas. Por eso el filtro de tipo no se
    // les pasa; la moneda sí, que es la misma en las dos.
    const basePlanilla: Record<string, string | number | boolean> = this.baseFiltrada(
      filtro,
      'planilla'
    );
    delete basePlanilla['tipoOperacion'];
    const pla = (estadoPlanilla: string) =>
      this.postBackend<number>('/planillas/contar', { ...basePlanilla, estadoPlanilla }).pipe(
        map((n) => Number(n ?? 0)),
        catchError(() => of(0))
      );

    return forkJoin({
      opsRegistradas: ops('REGISTRADA'),
      opsEnProceso: ops('EN_PROCESO_PAGO'),
      opsConfirmadas: ops('PAGO_CONFIRMADO'),
      opsRechazadas: ops('PAGO_RECHAZADO'),
      opsError: ops('ERROR'),
      plaEnviadas: pla('ENVIADA'),
      plaProcesadas: pla('PROCESADA'),
      plaParciales: pla('PROCESADA_PARCIAL'),
      plaRechazadas: pla('RECHAZADA'),
      plaError: pla('ERROR'),
      plaErrorCifrado: pla('ERROR_CIFRADO'),
    });
  }

  /**
   * Importes en curso, por moneda y por tipo de operación.
   *
   * <p><b>Se calcula en el navegador y eso tiene un límite.</b> El backend no
   * expone ninguna agregación de importes —no hay endpoint de totales ni un
   * `sum()` en los DAO—, así que la única vía sin tocar backend es traer las
   * operaciones y sumarlas aquí.</p>
   *
   * <p>Por eso primero se cuenta y, si hay más operaciones de las que se pueden
   * traer de una vez, NO se devuelve una suma: se marca `completo: false` y la
   * pantalla dice que el dato no está disponible. Una cifra de dinero
   * silenciosamente parcial es peor que ninguna cifra — quien la lea la tomará
   * por el total y decidirá con ella.</p>
   */
  /**
   * Resumen agregado de una entidad: cantidades e importes por estado y moneda.
   *
   * <p>Una sola petición por dashboard. El motor hace el `group by` y la suma, que es
   * quien puede hacerla sobre todo el conjunto sin traerlo: la vía anterior —traer el
   * listado y sumar aquí— tenía un tope por encima del cual el panel dejaba de dar la
   * cifra, y con cuatro dashboards eso habría sido la norma y no la excepción.</p>
   *
   * <p>El backend acepta el mismo cuerpo de filtros que `/contar` y `/listar`, así que se
   * reutiliza `baseFiltrada` con el destino de la entidad. Las claves llegan en MINÚSCULAS
   * porque PostgreSQL pliega los alias sin comillas; de ahí la lectura tolerante.</p>
   */
  resumenPorEstado(entidad: EntidadResumen, filtro: FiltroPanel = {}): Observable<GrupoResumen[]> {
    const destino: DestinoFiltro =
      entidad === 'operaciones' ? 'operacion' : entidad === 'planillas' ? 'planilla' : 'programacion';
    // Respuestas no tiene columnas de fecha propias en el panel: hereda el destino de
    // programaciones solo para los campos comunes, y sus fechas se ignoran sin ruido.
    const base = this.baseFiltrada(filtro, entidad === 'respuestas' ? 'operacion' : destino);

    return this.postBackend<Record<string, unknown>[]>(`/${entidad}/resumen`, base).pipe(
      map((filas) => (filas ?? []).map((f) => this.aGrupoResumen(f))),
      catchError(() => of([] as GrupoResumen[]))
    );
  }

  /** Normaliza una fila del `group by`, que llega con las claves en minúsculas. */
  private aGrupoResumen(fila: Record<string, unknown>): GrupoResumen {
    const leer = (clave: string): unknown => fila[clave] ?? fila[clave.toLowerCase()];
    const numeroONulo = (valor: unknown): number | null =>
      valor === null || valor === undefined ? null : Number(valor);

    return {
      clave: String(leer('estado') ?? leer('tipo') ?? '—'),
      moneda: leer('moneda') === undefined || leer('moneda') === null ? null : String(leer('moneda')),
      cantidad: Number(leer('cantidad') ?? 0),
      operaciones: numeroONulo(leer('operaciones')),
      monto: numeroONulo(leer('monto')),
      operacionesOk: numeroONulo(leer('operacionesOk')),
      operacionesError: numeroONulo(leer('operacionesError')),
    };
  }

  resumenMontos(filtro: FiltroPanel = {}): Observable<ResumenMontos> {
    const base = this.baseFiltrada(filtro, 'operacion');

    return this.postBackend<number>('/operaciones/contar', base).pipe(
      map((n) => Number(n ?? 0)),
      switchMap((total) => {
        if (total === 0) {
          return of({ completo: true, total: 0, porMoneda: [] } as ResumenMontos);
        }
        if (total > TOPE_SUMA_CLIENTE) {
          return of({ completo: false, total, porMoneda: [] } as ResumenMontos);
        }
        return this.postBackend<OperacionBackendRow[]>('/operaciones/listar/paginacion', base, {
          limit: total,
          offSet: 0,
        }).pipe(
          map((filas) => agruparMontos(filas ?? [], total)),
          catchError(() => of({ completo: false, total, porMoneda: [] } as ResumenMontos))
        );
      }),
      catchError(() => of({ completo: false, total: 0, porMoneda: [] } as ResumenMontos))
    );
  }

  /**
   * Cuerpo base de las consultas del panel, con el filtro aplicado.
   *
   * <p><b>Los nombres de los campos de fecha dependen de la entidad</b>, y por eso hay
   * que decir a dónde va el cuerpo. Cada `Filter*` del backend nombra sus fechas segun
   * lo que significan en su tabla, y no coinciden entre sí:</p>
   *
   * <pre>
   *                  instante (ts*)              dia (d*)
   *   operacion      fechaDesde/Hasta            fechaProcesoDesde/Hasta
   *   programacion   fechaProgramadoDesde/Hasta  fechaProcesoDiaDesde/Hasta
   *   planilla       fechaEnvioDesde/Hasta       fechaArchivoDesde/Hasta
   * </pre>
   *
   * <p>Mandar un mismo cuerpo con `fechaDesde` a los tres —que es lo que se hacia—
   * NO da error: el backend ignora en silencio los campos que no conoce y responde
   * 200 con el total SIN filtrar. El panel quedaba entonces con las operaciones
   * acotadas al periodo y las planillas y programaciones contando todo el historico,
   * sin nada en pantalla que lo delatara.</p>
   *
   * <p>En planillas los dos filtros van a `fechaArchivo*` a proposito, y no a
   * `fechaEnvio*` pese a ser este el analogo exacto del instante: `pla_d_fecha_envio`
   * esta NULL mientras la planilla no sale, de modo que filtrar por ahi esconderia
   * justo las que el panel cuenta como pendientes (GENERADA/VALIDADA/CIFRADA) y las
   * tarjetas se irian a cero al elegir cualquier periodo.</p>
   *
   * <p>La zona horaria NO se manda: la pone el controller (`ZONA_CANAL`). Mandarla
   * desde aqui solo añadiria una forma de que el navegador y el canal discrepen.</p>
   */
  private baseFiltrada(
    filtro: FiltroPanel,
    destino: DestinoFiltro
  ): Record<string, string | number | boolean> {
    const org = this.session.tenant()?.org_u_id;
    const base: Record<string, string | number | boolean> = org ? { idOrganizacion: org } : {};
    if (filtro.moneda) base['moneda'] = filtro.moneda;
    if (filtro.tipoOperacion) base['tipoOperacion'] = filtro.tipoOperacion;

    // El periodo solo se manda cuando la API sabe aplicarlo. Enviarlo antes no
    // daría error —los campos desconocidos se ignoran en silencio— y ese es
    // justo el problema: devolvería el total sin filtrar como si fuera del
    // periodo pedido. Si hay que desplegar contra una API anterior, basta con
    // poner FILTRO_PERIODO_SOPORTADO en false.
    if (!FILTRO_PERIODO_SOPORTADO) {
      return base;
    }

    // La API espera epoch en milisegundos, no la hora de pared: el DSL de filtros
    // separa por ':' y una hora ISO se partiría. La conversión usa la zona del
    // NEGOCIO y no la del navegador, para que el mismo texto en pantalla signifique
    // el mismo instante se mire desde donde se mire.
    const campos = CAMPOS_FECHA_POR_DESTINO[destino];
    const periodo: RangoEpoch = {
      desde: horaDeParedAEpoch(filtro.fechaDesde ?? ''),
      hasta: horaDeParedAEpoch(filtro.fechaHasta ?? ''),
    };
    const dia: RangoEpoch = {
      desde: horaDeParedAEpoch(filtro.fechaProcesoDesde ?? ''),
      hasta: horaDeParedAEpoch(filtro.fechaProcesoHasta ?? ''),
    };

    if (campos.instante.desde === campos.dia.desde) {
      // Planillas: los dos filtros caen en la misma columna, asi que se cruzan en vez
      // de pisarse. Aplicar los dos significa la interseccion de los dos rangos.
      this.ponerRango(base, campos.dia, this.intersecar(periodo, dia));
      return base;
    }
    this.ponerRango(base, campos.instante, periodo);
    this.ponerRango(base, campos.dia, dia);
    return base;
  }

  /** Rango mas estrecho que cumple los dos: el `desde` mayor y el `hasta` menor. */
  private intersecar(a: RangoEpoch, b: RangoEpoch): RangoEpoch {
    const mayor = (x: number | null, y: number | null) =>
      x === null ? y : y === null ? x : Math.max(x, y);
    const menor = (x: number | null, y: number | null) =>
      x === null ? y : y === null ? x : Math.min(x, y);
    return { desde: mayor(a.desde, b.desde), hasta: menor(a.hasta, b.hasta) };
  }

  /** Añade al cuerpo los extremos que tengan valor, con los nombres de la entidad. */
  private ponerRango(
    base: Record<string, string | number | boolean>,
    campos: { desde: string; hasta: string },
    rango: RangoEpoch
  ): void {
    if (rango.desde !== null) base[campos.desde] = rango.desde;
    if (rango.hasta !== null) base[campos.hasta] = rango.hasta;
  }

  crearProgramacion(payload: ProgramacionCrear) {
    const org = this.session.tenant()?.org_u_id;
    return this.postBackend<ProgramacionDetalleFull>('/programaciones/crear', { idOrganizacion: org, ...payload });
  }
  agregarOperacionesProgramacion(id: string, operaciones: string[], cargas: string[] = []) {
    return this.postBackend<ProgramacionDetalleFull>('/programaciones/operaciones/agregar', { id, operaciones, cargas });
  }
  quitarOperacionesProgramacion(id: string, operaciones: string[]) {
    return this.postBackend<ProgramacionDetalleFull>('/programaciones/operaciones/quitar', { id, operaciones });
  }
  cambiarEstadoProgramacion(id: string, estado: string) {
    return this.postBackend<ProgramacionDetalleFull>('/programaciones/estado', { id, estado });
  }
  generarProgramacion(id: string) {
    return this.postBackend<ProgramacionDetalleFull>('/programaciones/generar', { id });
  }
  trazabilidadOperacion(idOperacion: string) {
    return this.postBackend<Record<string, unknown>[]>('/programaciones/trazabilidad', { idOperacion });
  }

  // ── Respuestas ───────────────────────────────────────────────────────
  respuestas() {
    return this.get<Paginated<RespuestaBCP>>('/v1/respuestas');
  }
  procesarRespuesta(id: string) {
    return this.post<unknown>(`/v1/respuestas/${id}/procesar`, { dryRun: false });
  }

  // ── Beneficiarios ────────────────────────────────────────────────────
  beneficiarios(opts: { page?: number; pageSize?: number; filters?: BeneficiarioFiltro } = {}) {
    const { page = 1, pageSize = 5, filters = {} } = opts;
    const body: Record<string, string | boolean> = {};
    const org = this.session.tenant()?.org_u_id;
    if (org) body['idOrganizacion'] = org;
    if (filters.tipoDocumento) body['tipoDocumento'] = filters.tipoDocumento;
    if (filters.numeroDocumento) body['numeroDocumento'] = filters.numeroDocumento;
    if (filters.titular) body['titular'] = filters.titular;
    if (filters.codigoExterno) body['codigoExterno'] = filters.codigoExterno;
    if (typeof filters.isActivo === 'boolean') body['isActivo'] = filters.isActivo;

    const offSet = (page - 1) * pageSize;
    return forkJoin({
      items: this.postBackend<BeneficiarioBackendRow[]>('/beneficiarios/listar/paginacion', body, { limit: pageSize, offSet }),
      total: this.postBackend<number>('/beneficiarios/contar', body),
    }).pipe(
      map(({ items, total }) => ({
        items: items.map(normalizeBeneficiario),
        pagination: { page, pageSize, total: Number(total ?? 0) },
      }))
    );
  }
  beneficiarioDetalle(id: string) {
    return this.postBackend<BeneficiarioDetalleBackend>('/beneficiarios/detalle', { id }).pipe(map(normalizeBeneficiarioDetalle));
  }

  // -- Organizacion ------------------------------------------------------
  /**
   * Detalle de la organización (endpoint ALMIL `/organizacion/detalle`): el envelope trae
   * en `data` tanto `{ organizacion, configuraciones }`. Exige tenant.realm no vacío.
   */
  organizacionDetalle(): Observable<OrganizacionDetalle> {
    const idOrganizacion = this.session.tenant()?.org_u_id ?? '';
    return this.postBackend<ApiResponseEnvelope<OrganizacionDetalleBackend>>(
      '/organizacion/detalle',
      this.buildEnvelope({ id: idOrganizacion })
    ).pipe(map((res) => normalizeOrganizacionDetalle((res?.data ?? {}) as OrganizacionDetalleBackend)));
  }

  /**
   * Identidad de la organización (objeto plano de `data.organizacion`:
   * razonsocial/numerodocumento/codigo…). Se usa para mostrar razón social + RUC de forma
   * informativa (el backend igual los re-deriva del token).
   */
  organizacionIdentidad(): Observable<Record<string, unknown>> {
    const idOrganizacion = this.session.tenant()?.org_u_id ?? '';
    return this.postBackend<ApiResponseEnvelope<OrganizacionDetalleBackend>>(
      '/organizacion/detalle',
      this.buildEnvelope({ id: idOrganizacion })
    ).pipe(map((res) => (res?.data?.organizacion ?? {}) as Record<string, unknown>));
  }

  // -- Llaves de cifrado (envelope ALMIL) --------------------------------
  /** Envelope estándar ALMIL con tenant/contexto derivados de la sesión. */
  // ── Schedulers (jobs H2H) ────────────────────────────────────────────────────────────
  //
  // Seguimiento y configuración de los tres jobs (programación / ciclo SFTP / decisión).

  /**
   * Panorama completo: instancia, pool, los tres jobs con su interruptor y última corrida por
   * organización, lo atascado y el resumen. Una llamada pinta la pantalla entera — igual que
   * `sftpExplorar` trae los ocho buzones en un ciclo.
   */
  schedulersPanorama(opciones?: {
    idOrganizacion?: string;
    minutosColgada?: number;
    dias?: number;
  }): Observable<Record<string, unknown>> {
    return this.postSchedulers<ApiResponseEnvelope<Record<string, unknown>>>(
      '/seguimiento/panorama',
      this.buildEnvelope(opciones ?? {})
    ).pipe(map((res) => (res?.data ?? {}) as Record<string, unknown>));
  }

  /** Organizaciones activas, para el selector. Se pide una vez; el panorama se refresca solo. */
  schedulersOrganizaciones(): Observable<Record<string, unknown>> {
    return this.postSchedulers<ApiResponseEnvelope<Record<string, unknown>>>(
      '/seguimiento/organizaciones',
      this.buildEnvelope({})
    ).pipe(map((res) => (res?.data ?? {}) as Record<string, unknown>));
  }

  /** Histórico paginado de corridas. El total viene con la página, para poder paginar de verdad. */
  schedulersCorridas(
    filtro: Record<string, unknown> = {},
    limit = 50,
    offSet = 0
  ): Observable<Record<string, unknown>> {
    return this.postSchedulers<ApiResponseEnvelope<Record<string, unknown>>>(
      '/corridas/listar/paginacion',
      this.buildEnvelope({ filtro, limit, offSet })
    ).pipe(map((res) => (res?.data ?? {}) as Record<string, unknown>));
  }

  /** Detalle de una corrida, con su `metadata` (qué estaba procesando). */
  schedulersCorridaDetalle(idCorrida: string): Observable<Record<string, unknown>> {
    return this.postSchedulers<ApiResponseEnvelope<Record<string, unknown>>>(
      '/corridas/detalle',
      this.buildEnvelope({ idCorrida })
    ).pipe(map((res) => (res?.data ?? {}) as Record<string, unknown>));
  }

  /**
   * Dispara un job sin esperar al cron. Responde 202: reparte y devuelve, porque un ciclo SFTP
   * puede tardar minutos. El resultado se consulta después en el panorama.
   *
   * @param idOrganizacion ausente = todas las activas, igual que hace el cron
   */
  schedulersEjecutar(job: string, idOrganizacion?: string): Observable<Record<string, unknown>> {
    return this.postSchedulers<ApiResponseEnvelope<Record<string, unknown>>>(
      '/jobs/ejecutar',
      this.buildEnvelope(idOrganizacion ? { job, idOrganizacion } : { job })
    ).pipe(map((res) => (res?.data ?? {}) as Record<string, unknown>));
  }

  /** Configuración que gobierna los jobs del tenant: interruptores, modo, cantidad, horarios. */
  schedulersConfigLeer(idOrganizacion?: string): Observable<Record<string, unknown>> {
    return this.postSchedulers<ApiResponseEnvelope<Record<string, unknown>>>(
      '/configuracion/leer',
      this.buildEnvelope(idOrganizacion ? { idOrganizacion } : {})
    ).pipe(map((res) => (res?.data ?? {}) as Record<string, unknown>));
  }

  /**
   * Enciende o apaga un job. Surte efecto en el tick siguiente, sin reiniciar nada.
   *
   * La respuesta trae `efectivo`, que puede NO coincidir con lo pedido: un `forzarApagado` de
   * plataforma vence al encendido de la organización. Píntalo desde ahí, no desde lo enviado.
   */
  schedulersInterruptor(
    job: string,
    habilitado: boolean,
    motivo?: string,
    idOrganizacion?: string
  ): Observable<Record<string, unknown>> {
    return this.postSchedulers<ApiResponseEnvelope<Record<string, unknown>>>(
      '/configuracion/interruptor',
      this.buildEnvelope({ job, habilitado, motivo, idOrganizacion })
    ).pipe(map((res) => (res?.data ?? {}) as Record<string, unknown>));
  }

  /**
   * Guarda un nodo de configuración del tenant. El backend acota los códigos admitidos a los
   * cuatro que gobiernan el despacho y valida la forma del valor: un 422 aquí es una regla del
   * dominio, no un fallo de transporte.
   */
  schedulersConfigGuardar(
    codigo: string,
    valor: unknown,
    idOrganizacion?: string
  ): Observable<Record<string, unknown>> {
    return this.postSchedulers<ApiResponseEnvelope<Record<string, unknown>>>(
      '/configuracion/guardar',
      this.buildEnvelope({ codigo, valor, idOrganizacion })
    ).pipe(map((res) => (res?.data ?? {}) as Record<string, unknown>));
  }

  private buildEnvelope<T>(data: T): Record<string, unknown> {
    const t = this.session.tenant();
    const user = this.session.user();
    return {
      requestId: guid(),
      tenant: {
        organizacionId: t?.org_u_id ?? '',
        realm: t?.keycloak?.org_v_keycloak_realm || t?.org_v_codigo || '',
        codigo: t?.org_v_codigo ?? undefined,
      },
      contexto: { canal: 'consola', usuario: user?.email ?? '', ipOrigen: '' },
      data,
    };
  }

  /** Lista las configuraciones de la organización y filtra las de encriptación. */
  encriptacionListar(): Observable<OrganizacionConfiguracion[]> {
    const idOrganizacion = this.session.tenant()?.org_u_id ?? '';
    return this.postBackend<ApiResponseEnvelope<OrganizacionDetalleBackend['configuraciones']>>(
      '/organizacion/encriptacion/listar',
      this.buildEnvelope({ id: idOrganizacion })
    ).pipe(
      map((res) =>
        (res?.data ?? [])
          .map((r) => normalizeOrganizacionConfiguracion(r as Record<string, unknown>))
          .filter((c) => (c.codigo ?? '').includes('ENCRIPTACION'))
      )
    );
  }

  guardarLlavePublicaBanco(data: DtoLlavePublicaBanco): Observable<unknown> {
    return this.postBackend<ApiResponseEnvelope<unknown>>(
      '/organizacion/encriptacion/banco/llave-publica',
      this.buildEnvelope(data)
    ).pipe(map((r) => r.data));
  }

  guardarLlavesOrganizacion(data: DtoLlavesOrganizacion): Observable<unknown> {
    return this.postBackend<ApiResponseEnvelope<unknown>>(
      '/organizacion/encriptacion/organizacion/llaves',
      this.buildEnvelope(data)
    ).pipe(map((r) => r.data));
  }

  /** Genera automáticamente el par de la organización (llave pendiente). */
  generarLlavesOrganizacion(data: DtoGenerarLlavesOrganizacion): Observable<LlavePendienteGenerada> {
    return this.postBackend<ApiResponseEnvelope<LlavePendienteGenerada>>(
      '/organizacion/encriptacion/organizacion/generar',
      this.buildEnvelope(data)
    ).pipe(map((r) => r.data));
  }

  /** Activa la llave pendiente de la organización (produce la rotación). */
  activarLlavesOrganizacion(banco: string): Observable<unknown> {
    return this.postBackend<ApiResponseEnvelope<unknown>>(
      '/organizacion/encriptacion/organizacion/activar',
      this.buildEnvelope({ banco })
    ).pipe(map((r) => r.data));
  }

  /** Descarta la llave pendiente de la organización. */
  descartarLlavesOrganizacion(banco: string): Observable<unknown> {
    return this.postBackend<ApiResponseEnvelope<unknown>>(
      '/organizacion/encriptacion/organizacion/descartar',
      this.buildEnvelope({ banco })
    ).pipe(map((r) => r.data));
  }

  /** Vuelve a una firma anterior de la llave pública del banco (por etiqueta). */
  revertirLlavePublicaBanco(banco: string, etiqueta: string): Observable<unknown> {
    return this.postBackend<ApiResponseEnvelope<unknown>>(
      '/organizacion/encriptacion/banco/revertir',
      this.buildEnvelope({ banco, etiqueta })
    ).pipe(map((r) => r.data));
  }

  /** Vuelve a una firma anterior de las llaves de la organización (por etiqueta). */
  revertirLlavesOrganizacion(banco: string, etiqueta: string): Observable<unknown> {
    return this.postBackend<ApiResponseEnvelope<unknown>>(
      '/organizacion/encriptacion/organizacion/revertir',
      this.buildEnvelope({ banco, etiqueta })
    ).pipe(map((r) => r.data));
  }

  // -- Configuración SFTP (envelope ALMIL) -------------------------------
  /** Lista las configuraciones de la organización y filtra las de SFTP (ORG#SFTP#…). */
  sftpListar(): Observable<OrganizacionConfiguracion[]> {
    const idOrganizacion = this.session.tenant()?.org_u_id ?? '';
    return this.postBackend<ApiResponseEnvelope<OrganizacionDetalleBackend['configuraciones']>>(
      '/organizacion/sftp/listar',
      this.buildEnvelope({ id: idOrganizacion })
    ).pipe(
      map((res) =>
        (res?.data ?? [])
          .map((r) => normalizeOrganizacionConfiguracion(r as Record<string, unknown>))
          .filter((c) => (c.codigo ?? '').toUpperCase().includes('SFTP'))
      )
    );
  }

  /** Configura/actualiza los datos de conexión SFTP del banco (escribe host/puerto/usuario/password en Vault). */
  guardarSftpConexion(data: DtoConexionSftp): Observable<unknown> {
    return this.postBackend<ApiResponseEnvelope<unknown>>(
      '/organizacion/sftp/conexion',
      this.buildEnvelope(data)
    ).pipe(map((r) => r.data));
  }

  /** Configura/actualiza los directorios (buzones IN/OUT) SFTP de una familia de producto. */
  guardarSftpDirectorios(data: DtoDirectoriosSftp): Observable<unknown> {
    return this.postBackend<ApiResponseEnvelope<unknown>>(
      '/organizacion/sftp/directorios',
      this.buildEnvelope(data)
    ).pipe(map((r) => r.data));
  }

  // -- Integración Calimaco (sistema de origen) --------------------------
  /**
   * Configuración vigente de la integración con Calimaco.
   *
   * <p>El backend no devuelve la contraseña — manda `tienePassword` en su lugar — así que la
   * pantalla no puede rellenarla ni reenviarla por accidente.</p>
   */
  calimacoLeer(): Observable<ConfiguracionCalimaco> {
    return this.postBackend<ApiResponseEnvelope<ConfiguracionCalimaco>>(
      '/organizacion/calimaco/leer',
      this.buildEnvelope({})
    ).pipe(map((r) => normalizeConfiguracionCalimaco(r?.data)));
  }

  /** Guarda los endpoints: el nodo de conexión en tm_orcon y las cuatro credenciales en Vault. */
  calimacoGuardar(data: GuardarCalimaco): Observable<unknown> {
    return this.postBackend<ApiResponseEnvelope<unknown>>(
      '/organizacion/calimaco/guardar',
      this.buildEnvelope(data)
    ).pipe(map((r) => r.data));
  }

  /**
   * Enciende o apaga el aviso de la organización, y fija su modo. **No toca Vault.**
   *
   * <p>Endpoint aparte de `calimacoGuardar` a propósito: aquel reescribe los cuatro secretos, y
   * cambiar el modo no tiene por qué tocar ninguna credencial. Devuelve el estado que quedó, releído
   * del nodo, así que la pantalla puede pintar lo que hay y no lo que pidió.</p>
   */
  calimacoGuardarInterruptor(
    data: GuardarInterruptorCalimaco
  ): Observable<{ habilitado: boolean; modo: ModoCalimaco }> {
    return this.postBackend<ApiResponseEnvelope<{ habilitado: boolean; modo: ModoCalimaco }>>(
      '/organizacion/calimaco/interruptor',
      this.buildEnvelope(data)
    ).pipe(map((r) => r.data));
  }

  // -- Conciliacion de una operacion con Calimaco ------------------------
  /**
   * Compara la operacion con el pago que Calimaco dice tener. **No cambia nada.**
   *
   * <p>Se puede pulsar cuantas veces se quiera: es de solo lectura.</p>
   */
  calimacoComparar(idOperacion: string): Observable<ComparacionCalimaco> {
    return this.postBackend<ApiResponseEnvelope<ComparacionCalimaco>>(
      '/operacion/calimaco/comparar',
      this.buildEnvelope({ idOperacion })
    ).pipe(map((r) => normalizeComparacionCalimaco(r?.data)));
  }

  /**
   * Marca el pago en Calimaco y, si lo confirma, deja la operacion en PAGO_INFORMADO.
   *
   * <p>Irreversible. El backend **vuelve a comparar** antes de mandar y no se fia de que esta
   * pantalla diga que ya cuadraba: entre mirar la tabla y pulsar el boton pueden pasar minutos.</p>
   */
  calimacoInformar(idOperacion: string): Observable<ComparacionCalimaco> {
    return this.postBackend<ApiResponseEnvelope<ComparacionCalimaco>>(
      '/operacion/calimaco/informar',
      this.buildEnvelope({ idOperacion })
    ).pipe(map((r) => normalizeComparacionCalimaco(r?.data)));
  }

  // -- Programaciones de informe al origen -------------------------------
  /**
   * Operaciones que SE PUEDEN programar.
   *
   * <p>Solo las que están en PAGO_CONFIRMADO, tienen código externo del origen y no están ya en otra
   * tanda viva. No se ofrece lo que luego se va a rechazar.</p>
   */
  informeCandidatos(grupo?: string | null, moneda?: string | null): Observable<CandidatosInforme> {
    return this.postBackend<ApiResponseEnvelope<CandidatosInforme>>(
      '/informes/candidatos',
      this.buildEnvelope({ grupo: grupo ?? undefined, moneda: moneda ?? undefined })
    ).pipe(map((r) => normalizeCandidatosInforme(r?.data)));
  }

  /** Crea la tanda. El backend revalida cada operación contra la base. */
  informeCrear(data: CrearInforme): Observable<{ id: string; codigo: string }> {
    return this.postBackend<ApiResponseEnvelope<{ id: string; codigo: string }>>(
      '/informes/crear',
      this.buildEnvelope(data)
    ).pipe(map((r) => r.data));
  }

  informeListar(limit = 50, offSet = 0): Observable<ProgramacionInforme[]> {
    return this.postBackend<ApiResponseEnvelope<ProgramacionInforme[]>>(
      '/informes/listar',
      this.buildEnvelope({}),
      { limit, offSet }
    ).pipe(map((r) => (r?.data ?? []).map(normalizeProgramacionInforme)));
  }

  informeContar(): Observable<number> {
    return this.postBackend<ApiResponseEnvelope<number>>(
      '/informes/contar',
      this.buildEnvelope({})
    ).pipe(map((r) => Number(r?.data ?? 0)));
  }

  informeDetalle(id: string): Observable<DetalleProgramacionInforme> {
    return this.postBackend<ApiResponseEnvelope<DetalleProgramacionInforme>>(
      '/informes/detalle',
      this.buildEnvelope({ id })
    ).pipe(
      map((r) => ({
        cabecera: normalizeProgramacionInforme(
          (r?.data?.cabecera ?? {}) as ProgramacionInforme
        ),
        detalles: (r?.data?.detalles ?? []) as DetalleInforme[],
      }))
    );
  }

  /** La descarta sin ejecutar y libera sus operaciones para volver a programarlas. */
  informeCancelar(id: string, motivo: string): Observable<unknown> {
    return this.postBackend<ApiResponseEnvelope<unknown>>(
      '/informes/cancelar',
      this.buildEnvelope({ id, motivo })
    ).pipe(map((r) => r.data));
  }

  /**
   * Recorre la tanda informando cada operación.
   *
   * <p><b>Irreversible en modo REAL.</b> El backend compara cada operación otra vez y relee el pago
   * después de mandarlo: solo avanza lo que el origen confirma.</p>
   */
  informeEjecutar(id: string): Observable<ResultadoEjecucion> {
    return this.postBackend<ApiResponseEnvelope<ResultadoEjecucion>>(
      '/informes/ejecutar',
      this.buildEnvelope({ id })
    ).pipe(
      map((r) => ({
        informadas: Number(r?.data?.informadas ?? 0),
        fallidas: Number(r?.data?.fallidas ?? 0),
        total: Number(r?.data?.total ?? 0),
      }))
    );
  }

  // -- Correlativos ------------------------------------------------------
  correlativos(filtro: CorrelativoFiltro = {}) {
    const body: Record<string, unknown> = {};
    const org = filtro.idOrganizacion ?? this.session.tenant()?.org_u_id;
    if (org) body['idOrganizacion'] = org;
    if (filtro.idTipoDocumento) body['idTipoDocumento'] = filtro.idTipoDocumento;
    if (filtro.formato) body['formato'] = filtro.formato;
    if (filtro.periodicidad) body['periodicidad'] = filtro.periodicidad;
    if (typeof filtro.isActivo === 'boolean') body['isActivo'] = filtro.isActivo;
    return this.postMantenimientos<CorrelativoBackendRow[]>('/correlativo/listar/all', body).pipe(
      map((items) => items.map(normalizeCorrelativo))
    );
  }
  correlativoGuardar(body: Partial<Correlativo>) {
    return this.mutMantenimientos('POST', '/correlativo/save', body);
  }
  correlativoActualizar(body: Partial<Correlativo>) {
    return this.mutMantenimientos('PUT', '/correlativo/update', body);
  }
  correlativoEliminar(id: string) {
    return this.mutMantenimientos('DELETE', '/correlativo/delete', { id });
  }

  // ── Estructuras de archivo ───────────────────────────────────────────
  estructuras(producto?: ProductoGrupo) {
    return this.get<{ items: EstructuraArchivo[] }>('/v1/estructuras', producto ? { producto } : undefined);
  }

  // Los certificados salieron de la consola: su pantalla duplicaba Llaves de
  // cifrado con datos del mock. La gestión real vive en
  // `api/mantenimientos/h2h/v1/organizacion/encriptacion`.

  // ── Identidad / RBAC ─────────────────────────────────────────────────
  identityUsers() {
    return this.get<{ items: { id: string; username: string; name: string; email: string; roles: string[]; enabled: boolean }[] }>(
      '/v1/identity/users'
    );
  }
  identityRoles() {
    return this.get<{ items: { role: string; description: string }[] }>('/v1/identity/roles');
  }

  // ── Auditoría ────────────────────────────────────────────────────────
  audit() {
    return this.get<Paginated<AuditEvent>>('/v1/audit/events');
  }
}

/**
 * Rellena lo que el backend pueda no traer.
 *
 * <p>Una organización recién dada de alta no tiene secreto todavía, y sin esto la pantalla
 * reventaría al leer `secreto.cabeceras` de un `undefined` en vez de pintar un formulario en
 * blanco, que es lo correcto para ese estado.</p>
 *
 * <p>El modo se valida contra la lista conocida: un valor raro en la base debe caer a OFFLINE —el
 * lado seguro— y no colarse hasta el selector.</p>
 */
function normalizeConfiguracionCalimaco(raw: unknown): ConfiguracionCalimaco {
  const d = (raw ?? {}) as Record<string, unknown>;
  const plataforma = (d['plataforma'] ?? {}) as Record<string, unknown>;
  const modo = String(d['modo'] ?? '').toUpperCase() as ModoCalimaco;
  const porNombre = new Map<string, Record<string, unknown>>();
  if (Array.isArray(d['endpoints'])) {
    for (const e of d['endpoints'] as Array<Record<string, unknown>>) {
      porNombre.set(String(e['nombre'] ?? '').toUpperCase(), e);
    }
  }
  return {
    habilitado: d['habilitado'] === true,
    modo: MODOS_CALIMACO.includes(modo) ? modo : 'OFFLINE',
    estadoOrigen: (d['estadoOrigen'] as string | null) ?? null,
    estadoDestino: (d['estadoDestino'] as string | null) ?? null,
    timeoutSegundos: Number(d['timeoutSegundos'] ?? 30) || 30,
    plataforma: {
      habilitado: plataforma['habilitado'] === true,
      // Ausente se lee como candado echado: es el valor que no puede hacer dano si el backend
      // cambia la forma de la respuesta.
      forzarApagado: plataforma['forzarApagado'] !== false,
      motivo: (plataforma['motivo'] as string | null) ?? null,
    },
    // Los cuatro siempre, en el orden del flujo: uno que el backend no devuelva es justo el que
    // hay que poder configurar, asi que se devuelve vacio en vez de desaparecer.
    endpoints: ENDPOINTS_CALIMACO.map((nombre) => {
      const e = porNombre.get(nombre) ?? {};
      return {
        nombre,
        secretRef: e['secretRef'] as string | undefined,
        metodo: e['metodo'] as string | undefined,
        url: e['url'] as string | undefined,
        contentType: e['contentType'] as string | undefined,
        tienePassword: e['tienePassword'] === true,
        cabeceras: pares(e['cabeceras']),
        parametros: pares(e['parametros']),
      };
    }),
  };
}

/** Lista de pares nombre/valor, tolerante con lo que no lo sea. */
function pares(raw: unknown): ParCalimaco[] {
  if (!Array.isArray(raw)) return [];
  return (raw as Array<Record<string, unknown>>).map((p) => ({
    nombre: String(p['nombre'] ?? ''),
    valor: String(p['valor'] ?? ''),
  }));
}

/**
 * Rellena lo que el backend pueda no traer.
 *
 * <p>`puedeInformar` se lee como FALSO ante cualquier duda: es el valor que gobierna un boton
 * irreversible, y un backend que cambie la forma de la respuesta no debe poder habilitarlo por
 * omision.</p>
 */
function normalizeComparacionCalimaco(raw: unknown): ComparacionCalimaco {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    coincide: d['coincide'] === true,
    puedeInformar: d['puedeInformar'] === true,
    motivos: Array.isArray(d['motivos']) ? (d['motivos'] as unknown[]).map((m) => String(m)) : [],
    campos: Array.isArray(d['campos'])
      ? (d['campos'] as Array<Record<string, unknown>>).map(
          (c): CampoComparado => ({
            campo: String(c['campo'] ?? ''),
            nuestro: (c['nuestro'] as string | null) ?? null,
            suyo: (c['suyo'] as string | null) ?? null,
            coincide: c['coincide'] === true,
            critico: c['critico'] === true,
          })
        )
      : [],
    modo: (d['modo'] as string | null) ?? null,
    envioPermitido: d['envioPermitido'] === true,
    identificador: (d['identificador'] as string | null) ?? null,
    estadoCalimaco: (d['estadoCalimaco'] as string | null) ?? null,
    estadoOperacion: (d['estadoOperacion'] as string | null) ?? null,
    estadoDestinoCalimaco: (d['estadoDestinoCalimaco'] as string | null) ?? null,
    informado: d['informado'] === true,
    simulada: d['simulada'] === true,
    aplicada: d['aplicada'] === true,
    puedeEnviar: d['puedeEnviar'] === true,
    yaAplicado: d['yaAplicado'] === true,
    verificado: d['verificado'] === true,
    sinEnviar: d['sinEnviar'] === true,
    estadoCalimacoDespues: (d['estadoCalimacoDespues'] as string | null) ?? null,
  };
}

/**
 * Rellena lo que el backend pueda no traer.
 *
 * <p>Los contadores se leen como numeros SIEMPRE: la pantalla los pinta y compara, y un `undefined`
 * ahi acabaria en un «NaN de 5 informadas».</p>
 */
function normalizeProgramacionInforme(raw: unknown): ProgramacionInforme {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: String(d['id'] ?? ''),
    codigo: String(d['codigo'] ?? ''),
    sistema: (d['sistema'] as string | null) ?? null,
    estado: String(d['estado'] ?? ''),
    modoEnvio: (d['modoEnvio'] as string | null) ?? null,
    modoIntegracion: (d['modoIntegracion'] as string | null) ?? null,
    fechaProceso: (d['fechaProceso'] as string | null) ?? null,
    programado: (d['programado'] as string | null) ?? null,
    ejecutado: (d['ejecutado'] as string | null) ?? null,
    totalOperaciones: Number(d['totalOperaciones'] ?? 0),
    informadas: Number(d['informadas'] ?? 0),
    fallidas: Number(d['fallidas'] ?? 0),
    montoTotal: (d['montoTotal'] as number | string | null) ?? null,
    usuario: (d['usuario'] as string | null) ?? null,
    usuarioEjecucion: (d['usuarioEjecucion'] as string | null) ?? null,
    motivo: (d['motivo'] as string | null) ?? null,
    criterio: (d['criterio'] as Record<string, unknown> | null) ?? null,
  };
}

function normalizeCandidatosInforme(raw: unknown): CandidatosInforme {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    items: Array.isArray(d['items']) ? (d['items'] as CandidatoInforme[]) : [],
    total: Number(d['total'] ?? 0),
    montoTotal: (d['montoTotal'] as number | string | null) ?? null,
    truncado: d['truncado'] === true,
  };
}
