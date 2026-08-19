import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import type { VentanaSemanal } from '../../core/models';
import { RelojCanalViewComponent } from './reloj-canal-view.component';
import { PRODUCTOS_RELOJ, PRODUCTO_RELOJ_POR_DEFECTO } from './inter-reloj-canal';

/**
 * El reloj mira la ventana de UN producto, y por defecto la de transferencias.
 *
 * <h3>De dónde viene</h3>
 *
 * <p>El reloj decía «Canal cerrado · Reabre miércoles 07:00» un martes a las 16:56, con la
 * organización operando hasta las 22:45. No preguntaba por ningún producto, y `/programaciones/ventana`
 * sin `producto` responde la ventana del CANAL, que llega con `habilitado: false`. Como la vista
 * filtra los subtipos por ese campo, la lista salía vacía y no había ningún corte vigente que
 * mostrar: no era «cerrado ahora», era <b>cerrado siempre</b>, a cualquier hora y con cualquier
 * dato.</p>
 *
 * <h3>Qué se protege</h3>
 *
 * <p>Que el reloj siga pidiendo un producto —si vuelve a preguntar sin él, vuelve el «cerrado
 * siempre»— y que un subtipo deshabilitado no cuente como corte vigente, que es la regla que hacía
 * visible el fallo.</p>
 */
describe('RelojCanalViewComponent: la ventana es de un producto', () => {
  type Interna = {
    producto: { (): string; set: (v: string) => void };
    nombreProducto: () => string;
    onProducto: (e: Event) => void;
    refrescar: () => void;
    ventana: { (): VentanaSemanal | null; set: (v: VentanaSemanal | null) => void };
    ahora: { set: (d: Date) => void };
    lectura: () => { urgencia: string; titular: string; detalle: string };
    subtiposHoy: () => unknown[];
  };

  let vista: Interna;
  let refrescos: number;

  /** Un martes a las 16:56 en Lima, que es cuando se reportó el fallo. */
  const MARTES_16_56 = new Date(2026, 7, 18, 16, 56, 0);

  function dia(diaSemana: number, desde: string | null, hasta: string | null) {
    return hasta && desde
      ? { diaSemana, nombre: 'día', opera: true, desde, hasta }
      : { diaSemana, nombre: 'día', opera: false };
  }

  /** Los `dias` que devuelve el backend van de HOY a +6, así que el primero es el martes. */
  const SEMANA_DESDE_MARTES = [2, 3, 4, 5, 6, 7, 1].map((d) =>
    d === 7 ? dia(d, null, null) : dia(d, '07:00:00', '20:15:00')
  );

  function ventana(subtipos: Array<{ subtipo: string; habilitado: boolean; hasta: string }>): VentanaSemanal {
    return {
      zonaHoraria: 'America/Lima',
      resuelta: true,
      dias: SEMANA_DESDE_MARTES,
      subtipos: subtipos.map((s) => ({
        subtipo: s.subtipo,
        habilitado: s.habilitado,
        intrabancaria: true,
        ventanaPropia: true,
        origenVentana: 'ORGANIZACION',
        dias: [2, 3, 4, 5, 6, 7, 1].map((d) => dia(d, '03:30:00', s.hasta)),
      })),
    } as unknown as VentanaSemanal;
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
    const fixture = TestBed.createComponent(RelojCanalViewComponent);
    vista = fixture.componentInstance as unknown as Interna;
    refrescos = 0;
    vista.refrescar = () => {
      refrescos += 1;
    };
    vista.ahora.set(MARTES_16_56);
  });

  it('arranca en transferencias', () => {
    // Es la rama con más subtipos y la única con un cut-off interbancario a media mañana: donde la
    // cuenta atrás importa más.
    expect(vista.producto()).toBe(PRODUCTO_RELOJ_POR_DEFECTO);
    expect(vista.producto()).toBe('T');
    expect(vista.nombreProducto()).toBe('Transferencias');
  });

  it('no ofrece factoring: no tiene rama horaria y solo podría decir «cerrado»', () => {
    // La API cae a la ventana del canal para un producto sin rama, y esa llega con habilitado=false.
    expect(PRODUCTOS_RELOJ.map((p) => p.codigo)).not.toContain('FA');
    expect(PRODUCTOS_RELOJ.map((p) => p.codigo)).toEqual(['T', 'P', 'H', 'C', 'CG']);
  });

  it('cambiar de producto vuelve a pedir la ventana y descarta la anterior', () => {
    // Sin descartarla, el reloj seguiría contando hacia el corte del producto viejo mientras llega la
    // respuesta: 22:45 en pantalla cuando ya se preguntó por algo que cierra a las 12:15.
    vista.ventana.set(ventana([{ subtipo: 'TERCEROS', habilitado: true, hasta: '22:45:00' }]));
    expect(vista.lectura().urgencia).toBe('abierto');

    vista.onProducto({ target: { value: 'P' } } as unknown as Event);

    expect(vista.producto()).toBe('P');
    expect(vista.ventana()).toBeNull();
    expect(refrescos).toBe(1);
    expect(vista.lectura().urgencia).toBe('sinDato');
  });

  it('un subtipo habilitado que cierra más tarde manda: no dice «cerrado»', () => {
    // El caso real: martes 16:56, TERCEROS habilitado hasta 22:45.
    vista.ventana.set(ventana([{ subtipo: 'TERCEROS', habilitado: true, hasta: '22:45:00' }]));

    expect(vista.subtiposHoy()).toHaveLength(1);
    expect(vista.lectura().urgencia).toBe('abierto');
    expect(vista.lectura().titular).toContain('5 h 49 min');
    expect(vista.lectura().detalle).toContain('22:45');
  });

  it('con TODOS los subtipos deshabilitados sí dice cerrado — y era el estado que llegaba siempre', () => {
    // Es exactamente lo que respondía la llamada sin producto: la ventana del canal viene con
    // habilitado=false. El reloj no estaba mintiendo; le estaban dando un dato que solo admite una
    // lectura. Aquí queda fijado que ese filtro es el que decide.
    vista.ventana.set(ventana([{ subtipo: 'CANAL', habilitado: false, hasta: '22:45:00' }]));

    expect(vista.subtiposHoy()).toHaveLength(0);
    expect(vista.lectura().urgencia).toBe('cerrado');
    expect(vista.lectura().titular).toBe('Canal cerrado');
    // El «reabre» sale de `dias`, que va de hoy a +6: el siguiente es el miércoles.
    expect(vista.lectura().detalle).toBe('Reabre día 07:00');
  });
});
