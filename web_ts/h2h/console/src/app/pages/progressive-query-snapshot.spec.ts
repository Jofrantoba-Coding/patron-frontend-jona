import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiService } from '../core/api.service';
import { SessionService } from '../core/session.service';
import { OperacionesPage } from './operaciones/operaciones';
import { PlanillasPage } from './planillas/planillas';
import { RespuestasPage } from './respuestas/respuestas';

const paged = (page: number, pageSize: number, total = pageSize * 2) => ({
  items: [{ id: 'row-' + page }],
  pagination: { page, pageSize, total },
});

describe('progressive pages: immutable applied query', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('operaciones appends with the applied filters after the draft changes', () => {
    const api = { operaciones: vi.fn().mockReturnValue(of(paged(1, 50))) };
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useValue: api },
        { provide: ActivatedRoute, useValue: { data: of({}) } },
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: SessionService, useValue: { can: () => true } },
      ],
    });
    const fixture = TestBed.createComponent(OperacionesPage);
    const page = fixture.componentInstance as unknown as {
      filtroCodigoOperacion: { set: (value: string) => void };
      load: () => void;
      cargarMas: () => void;
    };
    page.filtroCodigoOperacion.set('aplicado');
    page.load();

    page.filtroCodigoOperacion.set('borrador');
    api.operaciones.mockReturnValueOnce(of(paged(2, 50)));
    page.cargarMas();

    expect(api.operaciones.mock.calls.at(-1)?.[0]).toMatchObject({
      page: 2,
      pageSize: 50,
      filters: { codigoOperacion: 'aplicado' },
    });
    fixture.destroy();
  });

  it('planillas appends with the applied filters after the draft changes', () => {
    const api = { planillasBackend: vi.fn().mockReturnValue(of(paged(1, 10))) };
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useValue: api }],
    });
    const fixture = TestBed.createComponent(PlanillasPage);
    const page = fixture.componentInstance as unknown as {
      filtroNombre: { set: (value: string) => void };
      load: () => void;
      cargarMas: () => void;
    };
    page.filtroNombre.set('aplicado');
    page.load();

    page.filtroNombre.set('borrador');
    api.planillasBackend.mockReturnValueOnce(of(paged(2, 10)));
    page.cargarMas();

    expect(api.planillasBackend.mock.calls.at(-1)?.[0]).toMatchObject({
      page: 2,
      pageSize: 10,
      filters: { nombreArchivo: 'aplicado' },
    });
    fixture.destroy();
  });

  it('respuestas appends with the applied filters after the draft changes', () => {
    const api = {
      respuestasBackend: vi.fn().mockReturnValue(of(paged(1, 20))),
      respuestaDetalleBackend: vi.fn(),
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useValue: api },
        { provide: Router, useValue: { navigate: vi.fn() } },
      ],
    });
    const fixture = TestBed.createComponent(RespuestasPage);
    const page = fixture.componentInstance as unknown as {
      filtroNombre: { set: (value: string) => void };
      onAplicarFiltros: () => void;
      cargarMas: () => void;
    };
    page.filtroNombre.set('aplicado');
    page.onAplicarFiltros();

    page.filtroNombre.set('borrador');
    api.respuestasBackend.mockReturnValueOnce(of(paged(2, 20)));
    page.cargarMas();

    expect(api.respuestasBackend.mock.calls.at(-1)?.[0]).toMatchObject({
      page: 2,
      pageSize: 20,
      filters: { nombreArchivo: 'aplicado' },
    });
    fixture.destroy();
  });
});