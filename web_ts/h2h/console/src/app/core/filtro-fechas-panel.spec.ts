import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ApiService } from './api.service';
import { API_BASE, H2H_BACKEND_BASE, H2H_SCHEDULERS_BASE } from './config';
import type { FiltroPanel } from './models';

/**
 * Los filtros de fecha del panel, traducidos al nombre que espera cada entidad.
 *
 * <p>Lo que se fija aqui es una trampa concreta, no una preferencia de estilo: el backend
 * NO da error ante un campo que no conoce, responde 200 con el total sin filtrar. Mandar
 * `fechaDesde` a `/planillas/contar` —que espera `fechaEnvio*` o `fechaArchivo*`— dejaba
 * el panel con las operaciones acotadas al periodo y las planillas contando todo el
 * historico, sin nada en pantalla que lo delatara. Una prueba que solo mirase el codigo
 * de respuesta no habria visto nada.</p>
 */
describe('baseFiltrada: nombres de fecha por entidad', () => {
  /** Epoch de un dia concreto, para poder afirmar sobre valores y no solo sobre claves. */
  const DIA_12 = Date.UTC(2026, 7, 12, 5, 0, 0); // 2026-08-12 00:00 en Lima
  const DIA_13 = Date.UTC(2026, 7, 13, 5, 0, 0);

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        { provide: API_BASE, useValue: '/api' },
        { provide: H2H_BACKEND_BASE, useValue: '/h2h/v1' },
        { provide: H2H_SCHEDULERS_BASE, useValue: '/sch' },
      ],
    });
  });

  /** `baseFiltrada` es privado a proposito; se entra por indice para no ampliar la API. */
  function cuerpo(filtro: FiltroPanel, destino: 'operacion' | 'planilla' | 'programacion') {
    const api = TestBed.inject(ApiService) as unknown as {
      baseFiltrada: (f: FiltroPanel, d: string) => Record<string, string | number | boolean>;
    };
    return api.baseFiltrada(filtro, destino);
  }

  const PERIODO_Y_DIA: FiltroPanel = {
    fechaDesde: '2026-08-12T00:00',
    fechaHasta: '2026-08-13T00:00',
    fechaProcesoDesde: '2026-08-12',
    fechaProcesoHasta: '2026-08-13',
  };

  it('operaciones: periodo en fechaDesde/Hasta y dia en fechaProceso*', () => {
    const b = cuerpo(PERIODO_Y_DIA, 'operacion');

    expect(b['fechaDesde']).toBe(DIA_12);
    expect(b['fechaHasta']).toBe(DIA_13);
    expect(b['fechaProcesoDesde']).toBe(DIA_12);
    expect(b['fechaProcesoHasta']).toBe(DIA_13);
  });

  it('programaciones: periodo en fechaProgramado* y dia en fechaProcesoDia*', () => {
    const b = cuerpo(PERIODO_Y_DIA, 'programacion');

    expect(b['fechaProgramadoDesde']).toBe(DIA_12);
    expect(b['fechaProcesoDiaDesde']).toBe(DIA_12);
    // El nombre de operaciones NO debe viajar: seria ignorado en silencio.
    expect(b['fechaDesde']).toBeUndefined();
    expect(b['fechaProcesoDesde']).toBeUndefined();
  });

  it('planillas: todo va a fechaArchivo*, nunca a fechaEnvio*', () => {
    const b = cuerpo(PERIODO_Y_DIA, 'planilla');

    expect(b['fechaArchivoDesde']).toBe(DIA_12);
    expect(b['fechaArchivoHasta']).toBe(DIA_13);
    // fechaEnvio esta NULL mientras la planilla no sale: filtrar por ahi esconderia
    // justo las pendientes que el panel cuenta.
    expect(b['fechaEnvioDesde']).toBeUndefined();
    expect(b['fechaEnvioHasta']).toBeUndefined();
    expect(b['fechaDesde']).toBeUndefined();
  });

  it('planillas: los dos filtros se CRUZAN en la misma columna, no se pisan', () => {
    // Periodo 12→13 y dia de proceso 13→13: lo que cumple ambos es el 13.
    const b = cuerpo(
      {
        fechaDesde: '2026-08-12T00:00',
        fechaHasta: '2026-08-13T00:00',
        fechaProcesoDesde: '2026-08-13',
        fechaProcesoHasta: '2026-08-13',
      },
      'planilla'
    );

    expect(b['fechaArchivoDesde']).toBe(DIA_13);
    expect(b['fechaArchivoHasta']).toBe(DIA_13);
  });

  it('un solo extremo no arrastra al otro', () => {
    const b = cuerpo({ fechaDesde: '2026-08-12T00:00' }, 'operacion');

    expect(b['fechaDesde']).toBe(DIA_12);
    expect(b['fechaHasta']).toBeUndefined();
    expect(b['fechaProcesoDesde']).toBeUndefined();
  });

  it('sin fechas no viaja ninguna clave de fecha', () => {
    for (const destino of ['operacion', 'planilla', 'programacion'] as const) {
      const b = cuerpo({ moneda: 'PEN' }, destino);
      const claves = Object.keys(b).filter((k) => k.toLowerCase().includes('fecha'));

      expect(claves, `destino ${destino}`).toEqual([]);
      expect(b['moneda']).toBe('PEN');
    }
  });

  it('una fecha incompleta se descarta en vez de viajar a medias', () => {
    const b = cuerpo({ fechaDesde: '2026-08' }, 'operacion');

    expect(b['fechaDesde']).toBeUndefined();
  });
});

/**
 * Los listados de cada pagina mandan sus fechas por su cuenta, sin pasar por
 * `baseFiltrada`, asi que tienen su propia forma de equivocarse con los nombres.
 *
 * <p>Se afirma sobre la PETICION que sale, no sobre el estado del componente: el error
 * que se persigue es exactamente uno que no rompe nada visible —la clave viaja, el
 * backend responde 200 y devuelve el listado sin filtrar—, asi que el unico sitio donde
 * se ve es el cuerpo enviado.</p>
 */
describe('listados por pagina: nombres que el backend acepta de verdad', () => {
  const DIA_12 = Date.UTC(2026, 7, 12, 5, 0, 0);

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE, useValue: '/api' },
        { provide: H2H_BACKEND_BASE, useValue: '/h2h/v1' },
        { provide: H2H_SCHEDULERS_BASE, useValue: '/sch' },
      ],
    });
  });

  it('programaciones: el dia de proceso viaja como fechaProcesoDia*, no fechaProceso*', () => {
    const api = TestBed.inject(ApiService);
    const http = TestBed.inject(HttpTestingController);

    api
      .programacionesBackend({
        filters: { fechaProcesoDiaDesde: '2026-08-12', fechaProcesoDiaHasta: '2026-08-12' },
      })
      .subscribe();

    const req = http.match((r) => r.url.includes('/programaciones/listar/paginacion'))[0];
    const body = req.request.body as Record<string, unknown>;

    expect(body['fechaProcesoDiaDesde']).toBe(DIA_12);
    expect(body['fechaProcesoDiaHasta']).toBe(DIA_12);
    // `FilterProgramacion` NO tiene estos: se enviaban asi y el filtro no hacia nada.
    expect(body['fechaProcesoDesde']).toBeUndefined();
    expect(body['fechaProcesoHasta']).toBeUndefined();
  });

  it('programaciones: el periodo viaja como fechaProgramado*', () => {
    const api = TestBed.inject(ApiService);
    const http = TestBed.inject(HttpTestingController);

    api
      .programacionesBackend({ filters: { fechaDesde: '2026-08-12T00:00' } })
      .subscribe();

    const body = http.match((r) => r.url.includes('/programaciones/listar/paginacion'))[0].request
      .body as Record<string, unknown>;

    expect(body['fechaProgramadoDesde']).toBe(DIA_12);
    expect(body['fechaDesde']).toBeUndefined();
  });
});
