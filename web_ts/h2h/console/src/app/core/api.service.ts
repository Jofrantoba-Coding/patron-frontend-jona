import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { API_BASE } from './config';
import type {
  AuditEvent,
  Beneficiario,
  Certificado,
  DashboardSummary,
  Documento,
  DocumentoDescarga,
  DocumentoFiltro,
  DocumentoPreview,
  EstructuraArchivo,
  Health,
  LoginResponse,
  Operacion,
  Paginated,
  Planilla,
  ProductoGrupo,
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

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE);
  private readonly session = inject(SessionService);

  private headers(mutating = false): HttpHeaders {
    let h = new HttpHeaders()
      .set('Authorization', `Bearer ${this.session.token() ?? 'mock.jwt.token'}`)
      .set('X-Correlation-Id', guid());
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
  private patch<T>(path: string, body: unknown = {}): Observable<T> {
    return this.http.patch<T>(`${this.base}${path}`, body, { headers: this.headers(true) });
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

  // ── Operaciones ──────────────────────────────────────────────────────
  operaciones(opts: { producto?: ProductoGrupo; subtipo?: string; page?: number; pageSize?: number } = {}) {
    const { producto, subtipo, page = 1, pageSize = 20 } = opts;
    const params: Record<string, string | number> = { page, pageSize };
    if (producto) params['producto'] = producto;
    if (subtipo) params['subtipo'] = subtipo;
    return this.get<Paginated<Operacion>>('/v1/operaciones', params);
  }
  operacion(id: string) {
    return this.get<Operacion>(`/v1/operaciones/${id}`);
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
  beneficiarios(page = 1, pageSize = 50) {
    return this.get<Paginated<Beneficiario>>('/v1/beneficiarios', { page, pageSize });
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
