import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import type { PlanillaRow } from '../../core/models';
import { ETAPAS, ETAPAS_H2W, PlanillasViewComponent } from './planillas-view.component';

/**
 * El stepper del detalle depende del canal.
 *
 * <p>Antes era una lista fija con las etapas del SFTP, y sobre una planilla del portal contaba dos
 * mentiras a la vez: enseñaba un paso «CIFRADA» que en ese canal ya no ocurre, y no reconocía
 * `PENDIENTE_ENVIO` —que no está en la lista de SFTP—, de modo que {@code etapaActual()} daba −1 y
 * el stepper se pintaba entero como pendiente, por detrás incluso de GENERADA. Y eso pasaba
 * justo en el momento en que la planilla espera a que una persona la suba al portal, que es
 * cuando más se mira esa pantalla.</p>
 */
describe('PlanillasViewComponent: el stepper depende del canal', () => {
  type Interna = {
    detalleSeleccionado: { set: (v: Partial<PlanillaRow> | null) => void };
    detalle: { set: (v: unknown) => void };
    etapas: () => readonly string[];
    etapaActual: () => number;
    esH2w: () => boolean;
  };

  let vista: Interna;

  /** Coloca una planilla abierta con su canal y su estado. */
  function abrir(modalidadCodigo: string, estadoPlanillaCodigo: string): void {
    vista.detalleSeleccionado.set({ id: 'p1', modalidadCodigo } as Partial<PlanillaRow>);
    vista.detalle.set({ planilla: { estadoPlanillaCodigo }, detalles: [], respuestas: [] });
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
    const fixture = TestBed.createComponent(PlanillasViewComponent);
    vista = fixture.componentInstance as unknown as Interna;
  });

  it('H2W no enseña el paso de cifrado', () => {
    abrir('H2W', 'VALIDADA');

    expect(vista.esH2w()).toBe(true);
    expect(vista.etapas()).not.toContain('CIFRADA');
    expect(ETAPAS_H2W).not.toContain('CIFRADA');
  });

  it('H2H SÍ lo enseña: por SFTP el archivo sale cifrado', () => {
    abrir('H2H', 'VALIDADA');

    expect(vista.etapas()).toContain('CIFRADA');
    expect(vista.etapas()).toEqual(ETAPAS);
  });

  it('PENDIENTE_ENVIO es un paso real en H2W, no un −1', () => {
    // El fallo que se corrige: sin estar en la lista, el indice era −1 y el stepper "rebobinaba"
    // por detras de GENERADA, dando a entender que no se habia hecho nada.
    abrir('H2W', 'PENDIENTE_ENVIO');

    expect(vista.etapaActual()).toBeGreaterThan(0);
    expect(vista.etapas()[vista.etapaActual()]).toBe('PENDIENTE_ENVIO');
  });

  it('H2W tampoco espera respuesta en el buzón', () => {
    // En este canal no llega nada solo: el resultado lo declara el operador. Dejar el paso
    // sugeriria que hay algo que esperar.
    abrir('H2W', 'ENVIADA');

    expect(vista.etapas()).not.toContain('RESPUESTA_RECIBIDA');
  });

  it('una H2W que YA se cifró se ancla en VALIDADA, no en −1', () => {
    // Compatibilidad con lo que quedó a medias: planillas que pasaron por el cifrado antes de que
    // se sacara del flujo. CIFRADA no está en el pipeline H2W, y sin este anclaje volveria el −1.
    abrir('H2W', 'CIFRADA');

    expect(vista.etapaActual()).toBe(ETAPAS_H2W.indexOf('VALIDADA'));
  });

  it('los terminales siguen cayendo en el último paso, en los dos canales', () => {
    abrir('H2W', 'RECHAZADA');
    expect(vista.etapaActual()).toBe(ETAPAS_H2W.length - 1);

    abrir('H2H', 'RECHAZADA');
    expect(vista.etapaActual()).toBe(ETAPAS.length - 1);
  });
});
