import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import type { Operacion } from '../../core/models';
import { ESTADOS_OPERACION, OperacionesViewComponent } from './operaciones-view.component';

/**
 * El filtro de estado ofrece el catálogo entero, no lo que hay en pantalla.
 *
 * <h3>Qué pasaba</h3>
 *
 * <p>Las opciones salían de las filas cargadas: {@code new Set(master().map(o => o.estadoOperacionCodigo))}.
 * Es un filtro que solo deja filtrar por lo que ya se está viendo — y como el filtrado lo resuelve
 * el <b>backend</b> sobre el total, no el navegador sobre la página, los estados ausentes de la
 * página no aparecían <i>nunca</i>. Con casi todo en REGISTRADA, el desplegable se quedaba con esa
 * única opción y no había forma de llegar a las anuladas ni a las que el banco rechazó.</p>
 *
 * <p>Es un fallo mudo: el desplegable se ve perfectamente normal, solo que corto. Nadie lo lee como
 * «faltan opciones», se lee como «no hay operaciones en esos estados».</p>
 */
describe('OperacionesViewComponent: opciones del filtro de estado', () => {
  type Interna = {
    master: { set: (v: Operacion[]) => void };
    estados: () => readonly string[];
    setEstados: (codigos: readonly string[]) => void;
  };

  let vista: Interna;

  beforeEach(() => {
    TestBed.resetTestingModule();
    const fixture = TestBed.createComponent(OperacionesViewComponent);
    vista = fixture.componentInstance as unknown as Interna;
  });

  it('sin ninguna operación cargada YA ofrece todos los estados', () => {
    // El corazón de la regresión: antes esto daba una lista vacía y el filtro no servía de nada
    // hasta que llegaban datos —y aun entonces solo ofrecía los de la página—.
    vista.master.set([]);

    expect(vista.estados().length).toBe(ESTADOS_OPERACION.length);
    expect(vista.estados()).toContain('ANULADA');
    expect(vista.estados()).toContain('PAGO_RECHAZADO');
  });

  it('con TODO en REGISTRADA sigue ofreciendo los demás: es el caso que se reportó', () => {
    vista.master.set([
      { id: '1', estadoOperacionCodigo: 'REGISTRADA' },
      { id: '2', estadoOperacionCodigo: 'REGISTRADA' },
    ] as unknown as Operacion[]);

    expect(vista.estados()).toContain('VALIDADA');
    expect(vista.estados()).toContain('CONTABILIZADA');
  });

  it('el catálogo que llega por API sustituye a la lista de arranque', () => {
    vista.setEstados(['REGISTRADA', 'VALIDADA', 'NUEVO_ESTADO']);

    // Es el sentido de cargarlo: un estado añadido al catálogo aparece sin tocar el código.
    expect(vista.estados()).toContain('NUEVO_ESTADO');
    expect(vista.estados().length).toBe(3);
  });

  it('una respuesta VACÍA no deja el desplegable sin opciones', () => {
    // Sin esta guarda, un catálogo mal filtrado o una respuesta vacía reponen el fallo original
    // por otra puerta: un filtro que no deja filtrar por nada. Y ni siquiera parecería un error.
    vista.setEstados([]);

    expect(vista.estados()).toEqual(ESTADOS_OPERACION);
  });

  it('están los ocho del catálogo GLOBAL#ESTADO_OPERACION', () => {
    // Verificado contra tm_para_parametria: 117..124. Si el banco o el flujo añaden uno, este test
    // no lo detecta solo —no consulta la base—, pero deja escrito contra qué se comparó.
    expect(ESTADOS_OPERACION).toEqual([
      'REGISTRADA',
      'VALIDADA',
      'EN_PROCESO_PAGO',
      'PAGO_CONFIRMADO',
      'PAGO_RECHAZADO',
      'CONTABILIZADA',
      'ANULADA',
      'ERROR',
    ]);
  });

  it('son códigos CORTOS: el backend les antepone el prefijo del catálogo', () => {
    // Si aquí se colara el código completo, el DAO compondría
    // `GLOBAL#ESTADO_OPERACION#GLOBAL#ESTADO_OPERACION#ANULADA` y el filtro devolvería cero filas
    // sin ningún error: la pantalla diría que no hay operaciones anuladas.
    for (const estado of ESTADOS_OPERACION) {
      expect(estado).not.toContain('#');
      expect(estado).toBe(estado.toUpperCase());
    }
  });
});
