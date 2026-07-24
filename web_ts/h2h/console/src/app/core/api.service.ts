import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { forkJoin, map, type Observable } from 'rxjs';
import { API_BASE, H2H_BACKEND_BASE } from './config';
import type {
  AuditEvent,
  Beneficiario,
  BeneficiarioCuenta,
  BeneficiarioDetalle,
  BeneficiarioFiltro,
  Certificado,
  Correlativo,
  CorrelativoFiltro,
  DashboardSummary,
  Documento,
  DocumentoDescarga,
  DocumentoFiltro,
  DocumentoPreview,
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
  ProgramacionCrear,
  ProgramacionDetalleFull,
  ProgramacionFiltro,
  ProgramacionRow,
  RespuestaBCP,
  TenantContext,
} from './models';
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
    const body: Record<string, string | boolean | string[]> = {};
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

  // ── Documentos (bandeja global) ──────────────────────────────────────
  documentos(filtro: DocumentoFiltro = {}, page = 1, pageSize = 50) {
    const params: Record<string, string | number> = { page, pageSize };
    for (const [k, v] of Object.entries(filtro)) if (v !== undefined && v !== '') params[k] = String(v);
    return this.get<Paginated<Documento>>('/v1/documentos', params);
  }
  documento(id: string) {
    return this.get<Documento>(`/v1/documentos/${id}`);
  }
  previewDocumento(id: string) {
    return this.get<DocumentoPreview>(`/v1/documentos/${id}/preview`);
  }
  descargarDocumento(id: string, variante: 'claro' | 'cifrado' = 'claro') {
    return this.get<DocumentoDescarga>(`/v1/documentos/${id}/download`, { variante });
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

  // ── Certificados ─────────────────────────────────────────────────────
  certificados() {
    return this.get<{ items: Certificado[] }>('/v1/certificados');
  }
  rotarCertificado(id: string, nuevoAlias: string) {
    return this.patch<Certificado>(`/v1/certificados/${id}/rotar`, { nuevoAlias });
  }

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
