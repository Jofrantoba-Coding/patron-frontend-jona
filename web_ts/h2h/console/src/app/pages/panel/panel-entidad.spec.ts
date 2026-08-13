import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import type { GrupoResumen } from '../../core/models';
import { PanelEntidadViewComponent } from './panel-entidad-view.component';

/**
 * Derivacion de cifras del panel por entidad.
 *
 * <p>El backend devuelve una fila por estado Y moneda. Lo que se fija aqui es como se
 * pliegan esas filas, que es donde una suma de mas pasa desapercibida: una cantidad
 * equivocada no rompe nada, solo enseña otro numero. En particular que el DINERO nunca se
 * agregue entre monedas —sumar soles con dolares da una cifra que no significa nada pero
 * se lee igual de bien— y que la cantidad si se sume, porque contar unidades a traves de
 * monedas si tiene sentido.</p>
 */
describe('PanelEntidadViewComponent: plegado de los grupos del backend', () => {
  function grupo(parcial: Partial<GrupoResumen>): GrupoResumen {
    return {
      clave: 'REGISTRADA',
      moneda: 'PEN',
      cantidad: 0,
      operaciones: null,
      monto: null,
      operacionesOk: null,
      operacionesError: null,
      ...parcial,
    };
  }

  /** Instancia la View sola (sin la Page) y le inyecta los grupos. */
  function vista(grupos: GrupoResumen[], entidad: 'operaciones' | 'planillas' = 'operaciones') {
    TestBed.resetTestingModule();
    const fixture = TestBed.createComponent(PanelEntidadViewComponent);
    const c = fixture.componentInstance as unknown as {
      grupos: { set: (g: GrupoResumen[]) => void };
      gruposRespuesta: { set: (g: GrupoResumen[]) => void };
      entidad: { set: (e: string) => void };
      porEstado: () => { estado: string; cantidad: number; operaciones: number }[];
      importesPorMoneda: () => { moneda: string; monto: number; cantidad: number }[];
      total: () => number;
      totalOperaciones: () => number;
      conciliacion: () => { ok: number; error: number; operaciones: number; archivos: number; sinClasificar: number };
      porcentaje: (n: number) => number;
    };
    c.entidad.set(entidad);
    c.grupos.set(grupos);
    return c;
  }

  it('suma las CANTIDADES a traves de monedas, que es contar unidades', () => {
    const c = vista([
      grupo({ clave: 'REGISTRADA', moneda: 'PEN', cantidad: 202, monto: 202 }),
      grupo({ clave: 'REGISTRADA', moneda: 'USD', cantidad: 200, monto: 200 }),
    ]);

    expect(c.porEstado()).toHaveLength(1);
    expect(c.porEstado()[0]).toMatchObject({ estado: 'REGISTRADA', cantidad: 402 });
    expect(c.total()).toBe(402);
  });

  it('NO suma el dinero entre monedas: una tarjeta por divisa', () => {
    const c = vista([
      grupo({ clave: 'REGISTRADA', moneda: 'PEN', cantidad: 202, monto: 202 }),
      grupo({ clave: 'ENVIADA', moneda: 'PEN', cantidad: 10, monto: 50 }),
      grupo({ clave: 'REGISTRADA', moneda: 'USD', cantidad: 200, monto: 200 }),
    ]);
    const importes = c.importesPorMoneda();

    expect(importes).toHaveLength(2);
    expect(importes.find((i) => i.moneda === 'PEN')?.monto).toBe(252);
    expect(importes.find((i) => i.moneda === 'USD')?.monto).toBe(200);
    // Ninguna cifra combinada: 452 no debe existir en ningun sitio.
    expect(importes.some((i) => i.monto === 452)).toBe(false);
  });

  it('distingue el numero de contenedores del de operaciones que llevan dentro', () => {
    // 1 planilla con 402 operaciones: leerlo como "1" seria enteder mal el canal.
    const c = vista(
      [grupo({ clave: 'CIFRADA', moneda: 'PEN', cantidad: 1, operaciones: 402, monto: 402 })],
      'planillas'
    );

    expect(c.total()).toBe(1);
    expect(c.totalOperaciones()).toBe(402);
  });

  it('ordena los estados por volumen, para que lo gordo se lea primero', () => {
    const c = vista([
      grupo({ clave: 'ENVIADA', cantidad: 5 }),
      grupo({ clave: 'REGISTRADA', cantidad: 100 }),
      grupo({ clave: 'ERROR', cantidad: 20 }),
    ]);

    expect(c.porEstado().map((e) => e.estado)).toEqual(['REGISTRADA', 'ERROR', 'ENVIADA']);
  });

  it('un grupo sin importe no inventa una moneda', () => {
    // Respuestas no traen monto: no deben aparecer tarjetas de dinero vacias.
    const c = vista([grupo({ clave: 'VAL', moneda: null, cantidad: 3, monto: null })]);

    expect(c.importesPorMoneda()).toEqual([]);
    expect(c.total()).toBe(3);
  });

  it('el reparto no divide por cero cuando no hay nada', () => {
    const c = vista([]);

    expect(c.total()).toBe(0);
    expect(c.porcentaje(0)).toBe(0);
  });

  it('la conciliacion separa lo que el banco aun no ha clasificado', () => {
    const c = vista([grupo({ clave: 'CIFRADA', cantidad: 1, operaciones: 402, monto: 402 })], 'planillas');
    (c as unknown as { gruposRespuesta: { set: (g: GrupoResumen[]) => void } }).gruposRespuesta.set([
      grupo({ clave: 'RES', moneda: null, cantidad: 2, operaciones: 400, operacionesOk: 380, operacionesError: 15 }),
    ]);

    const conc = c.conciliacion();
    expect(conc.ok).toBe(380);
    expect(conc.error).toBe(15);
    // 400 informadas - 380 ok - 15 error: 5 que el banco no ha resuelto en ningun sentido.
    expect(conc.sinClasificar).toBe(5);
  });

  it('sinClasificar nunca es negativo aunque los totales del banco no cuadren', () => {
    const c = vista([grupo({ cantidad: 1 })], 'planillas');
    (c as unknown as { gruposRespuesta: { set: (g: GrupoResumen[]) => void } }).gruposRespuesta.set([
      grupo({ clave: 'PAR', operaciones: 10, operacionesOk: 8, operacionesError: 5 }),
    ]);

    expect(c.conciliacion().sinClasificar).toBe(0);
  });
});
