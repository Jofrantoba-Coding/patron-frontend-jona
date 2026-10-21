import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Subject, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiService } from '../../core/api.service';
import type { RespuestaRow } from '../../core/models';
import { RespuestasPage } from './respuestas';

describe('RespuestasPage: bandeja y evidencia', () => {
  const row = (id = 'res-1'): RespuestaRow => ({
    id, idPlanilla: 'pla-1', idTipoRespuesta: 1, tipoRespuestaCodigo: 'RES',
    tipoRespuestaFullCode: 'BCP#TIPO_RESPUESTA#RES', nombreArchivo: 'respuesta.txt',
    fechaRecepcion: '2026-09-21T10:00:00Z', totalOperaciones: 2, operacionesOk: 2,
    operacionesError: 0, formatoCodigo: 'TXT', urlClaro: null, urlCifrado: null,
    archivoGenerado: null,
  });
  const result = (items: RespuestaRow[]) => ({
    items, pagination: { page: 1, pageSize: 20, total: items.length },
  });
  type Interna = {
    rows: { (): RespuestaRow[]; set: (v: RespuestaRow[]) => void };
    filtroNombre: { set: (v: string) => void };
    cargando: () => boolean; errorCarga: () => string | null;
    detalleSeleccionado: () => RespuestaRow | null;
    detalleError: () => string | null; contenidoDetalle: () => string;
    onPagina: (p: number) => void; onAplicarFiltros: () => void; reintentarCarga: () => void;
    verRespuesta: (r: RespuestaRow) => void; reintentarDetalle: () => void;
    cerrarDetalle: () => void; verPlanilla: (id: string) => void;
  };
  let api: { respuestasBackend: ReturnType<typeof vi.fn>; respuestaDetalleBackend: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    TestBed.resetTestingModule();
    api = { respuestasBackend: vi.fn(), respuestaDetalleBackend: vi.fn() };
    router = { navigate: vi.fn() };
    TestBed.configureTestingModule({ providers: [
      { provide: ApiService, useValue: api }, { provide: Router, useValue: router },
    ] });
  });

  function crear(source = of(result([]))) {
    api.respuestasBackend.mockReturnValueOnce(source);
    const fixture = TestBed.createComponent(RespuestasPage);
    return { vista: fixture.componentInstance as unknown as Interna, fixture };
  }

  it('solo publica la lista mas reciente', () => {
    const first = new Subject<ReturnType<typeof result>>();
    const second = new Subject<ReturnType<typeof result>>();
    const { vista, fixture } = crear(first);
    api.respuestasBackend.mockReturnValueOnce(second);
    vista.onPagina(2);
    expect(first.observed).toBe(false);
    first.next(result([row('vieja')]));
    second.next(result([row('nueva')]));
    second.complete();
    expect(vista.rows().map((item) => item.id)).toEqual(['nueva']);
    expect(vista.cargando()).toBe(false);
    fixture.destroy();
  });

  it('conserva datos, muestra error y reintenta', () => {
    const { vista, fixture } = crear(throwError(() => ({ error: { message: 'BCP no disponible' } })));
    vista.rows.set([row('previa')]);
    api.respuestasBackend.mockReturnValueOnce(of(result([row('recuperada')])));
    expect(vista.errorCarga()).toContain('BCP no disponible');
    expect(vista.rows()[0].id).toBe('previa');
    vista.reintentarCarga();
    expect(vista.errorCarga()).toBeNull();
    expect(vista.rows()[0].id).toBe('recuperada');
    fixture.destroy();
  });

  it('reintenta con el filtro aplicado y no con el borrador aún no aplicado', () => {
    const { vista, fixture } = crear();
    api.respuestasBackend.mockReturnValueOnce(throwError(() => new Error('fallo')));
    vista.filtroNombre.set('aplicado');
    vista.onAplicarFiltros();

    vista.filtroNombre.set('borrador');
    api.respuestasBackend.mockReturnValueOnce(of(result([])));
    vista.reintentarCarga();

    const ultima = api.respuestasBackend.mock.calls.at(-1)?.[0];
    expect(ultima.filters.nombreArchivo).toBe('aplicado');
    fixture.destroy();
  });
  it('abre evidencia textual y enlaza la planilla', () => {
    const { vista, fixture } = crear();
    api.respuestaDetalleBackend.mockReturnValueOnce(of({ contenidoTxt: '<img src=x onerror=alert(1)>' }));
    vista.verRespuesta(row());
    expect(vista.contenidoDetalle()).toBe('<img src=x onerror=alert(1)>');
    vista.verPlanilla('pla-1');
    expect(router.navigate).toHaveBeenCalledWith(['/planillas'], { queryParams: { id: 'pla-1' } });
    fixture.destroy();
  });

  it('reintenta el detalle y cancela al cerrar o destruir', () => {
    const first = new Subject<Record<string, unknown>>();
    const last = new Subject<Record<string, unknown>>();
    const { vista, fixture } = crear();
    api.respuestaDetalleBackend
      .mockReturnValueOnce(first)
      .mockReturnValueOnce(throwError(() => new Error('fallo')))
      .mockReturnValueOnce(last);
    vista.verRespuesta(row());
    vista.cerrarDetalle();
    expect(first.observed).toBe(false);
    expect(vista.detalleSeleccionado()).toBeNull();
    vista.verRespuesta(row());
    expect(vista.detalleError()).toContain('contenido');
    vista.reintentarDetalle();
    fixture.destroy();
    expect(last.observed).toBe(false);
  });
});