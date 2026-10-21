import { TestBed } from '@angular/core/testing';
import { Subject, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiService } from '../../core/api.service';
import type { PlanillaDetalleFull, PlanillaRow } from '../../core/models';
import { PlanillasPage } from './planillas';

describe('PlanillasPage: carga segura del detalle', () => {
  const planilla = (id: string) => ({
    id, nombreArchivo: id + '.txt', productoCodigo: 'T', estadoPlanillaCodigo: 'GENERADA',
    monedaCodigo: 'PEN', montoTotal: 10, modalidadCodigo: 'H2H',
  }) as PlanillaRow;
  const detalle = (id: string) => ({
    planilla: { id }, detalles: [], respuestas: [],
  }) as unknown as PlanillaDetalleFull;
  type Interna = {
    detalle: () => PlanillaDetalleFull | null; detalleSeleccionado: () => PlanillaRow | null;
    detalleLoading: () => string | null; detalleError: () => string | null;
    openDetalle: (p: PlanillaRow) => void; reintentarDetalle: () => void; closeDetalle: () => void;
  };
  let api: { planillaDetalleBackend: ReturnType<typeof vi.fn>; planillasBackend: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    TestBed.resetTestingModule();
    api = {
      planillaDetalleBackend: vi.fn(),
      planillasBackend: vi.fn().mockReturnValue(of({ items: [], pagination: { page: 1, pageSize: 10, total: 0 } })),
    };
    TestBed.configureTestingModule({ providers: [{ provide: ApiService, useValue: api }] });
  });

  function crear() {
    const fixture = TestBed.createComponent(PlanillasPage);
    return { vista: fixture.componentInstance as unknown as Interna, fixture };
  }

  it('cancela el detalle anterior y no muestra la planilla equivocada', () => {
    const first = new Subject<PlanillaDetalleFull>();
    const second = new Subject<PlanillaDetalleFull>();
    api.planillaDetalleBackend.mockReturnValueOnce(first).mockReturnValueOnce(second);
    const { vista, fixture } = crear();
    vista.openDetalle(planilla('p-1'));
    vista.openDetalle(planilla('p-2'));
    expect(first.observed).toBe(false);
    first.next(detalle('p-1'));
    second.next(detalle('p-2'));
    second.complete();
    expect(vista.detalleSeleccionado()?.id).toBe('p-2');
    expect((vista.detalle()?.planilla as unknown as { id: string }).id).toBe('p-2');
    expect(vista.detalleLoading()).toBeNull();
    fixture.destroy();
  });

  it('mantiene contexto del error y reintenta el mismo detalle', () => {
    api.planillaDetalleBackend
      .mockReturnValueOnce(throwError(() => ({ error: { message: 'Detalle no disponible' } })))
      .mockReturnValueOnce(of(detalle('p-1')));
    const { vista, fixture } = crear();
    vista.openDetalle(planilla('p-1'));
    expect(vista.detalleSeleccionado()?.id).toBe('p-1');
    expect(vista.detalle()).toBeNull();
    expect(vista.detalleError()).toContain('Detalle no disponible');
    vista.reintentarDetalle();
    expect(api.planillaDetalleBackend).toHaveBeenCalledTimes(2);
    expect(vista.detalleError()).toBeNull();
    expect(vista.detalle()).not.toBeNull();
    fixture.destroy();
  });

  it('cancela la carga al cerrar y al destruir', () => {
    const first = new Subject<PlanillaDetalleFull>();
    const second = new Subject<PlanillaDetalleFull>();
    api.planillaDetalleBackend.mockReturnValueOnce(first).mockReturnValueOnce(second);
    const { vista, fixture } = crear();
    vista.openDetalle(planilla('p-1'));
    vista.closeDetalle();
    expect(first.observed).toBe(false);
    expect(vista.detalleSeleccionado()).toBeNull();
    vista.openDetalle(planilla('p-2'));
    fixture.destroy();
    expect(second.observed).toBe(false);
  });
});