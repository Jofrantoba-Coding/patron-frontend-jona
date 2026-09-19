import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import type { Operacion } from '../../core/models';
import { ProgramacionesViewComponent } from './programaciones-view.component';

/**
 * El modo de envío del plan también decide QUÉ operaciones se buscan.
 *
 * <h3>Qué pasaba</h3>
 *
 * <p>La búsqueda mandaba `modoEnvio: 'MANUAL'` como literal. El combo de modo existía y se usaba
 * para el plan, pero la lista de candidatas lo ignoraba: elegir AUTOMATICO daba una lista de
 * operaciones MANUAL, y una organización sellada en AUTOMATICO —que es el caso normal— no veía
 * <b>ninguna</b> operación nunca, sin ningún mensaje que lo explicara.</p>
 *
 * <h3>Por qué el backend no lo impedía</h3>
 *
 * <p>`problemaDeProgramable` comprueba tres cosas: que la operación no tenga plan, que no tenga
 * planilla vigente y que esté en REGISTRADA. <b>No mira el modo.</b> Así que el literal no
 * reflejaba una regla del dominio: era una restricción que solo existía en esta pantalla.</p>
 *
 * <h3>Lo que sigue protegiendo la reserva</h3>
 *
 * <p>Que el operador pueda armar un plan con operaciones AUTOMATICO no reabre el doble despacho:
 * al crearse el plan la operación queda con `ope_u_id_programacion`, y el job exige esa reserva en
 * NULL. Si el job se la lleva entre la búsqueda y el guardado, el alta falla con «ya está asignada
 * al plan X», que es un error explicable y no un pago repetido.</p>
 */
describe('ProgramacionesViewComponent: el modo del plan filtra las candidatas', () => {
  /** Acceso a lo protegido: es una View JONA, su estado no es API pública. */
  type Interna = {
    nuevoModo: { set: (v: string) => void; (): string };
    nuevoModalidad: { set: (v: string) => void; (): string };
    onNuevoModo: (e: Event) => void;
    onNuevaModalidad: (e: Event) => void;
    criteriosDeBusqueda: () => Record<string, unknown>;
    opsRows: { set: (v: Operacion[]) => void; (): Operacion[] };
    seleccion: { set: (v: Set<string>) => void; (): Set<string> };
    loteFiltro: { set: (v: string) => void; (): string };
  };

  let vista: Interna;

  const seleccion = (valor: string): Event =>
    ({ target: { value: valor } }) as unknown as Event;

  /** Deja la pantalla como tras una búsqueda con algo ya marcado. */
  const conBusquedaHecha = (): void => {
    vista.opsRows.set([{ id: 'op-1' }, { id: 'op-2' }] as unknown as Operacion[]);
    vista.seleccion.set(new Set(['op-1']));
    vista.loteFiltro.set('CARGA-7');
  };

  beforeEach(() => {
    TestBed.resetTestingModule();
    const fixture = TestBed.createComponent(ProgramacionesViewComponent);
    vista = fixture.componentInstance as unknown as Interna;
  });

  it('con el combo en AUTOMATICO se buscan las operaciones AUTOMATICO', () => {
    vista.nuevoModo.set('AUTOMATICO');

    expect(vista.criteriosDeBusqueda()['modoEnvio']).toBe('AUTOMATICO');
  });

  it('con el combo en MANUAL se buscan las MANUAL: el comportamiento de antes sigue disponible', () => {
    vista.nuevoModo.set('MANUAL');

    expect(vista.criteriosDeBusqueda()['modoEnvio']).toBe('MANUAL');
  });

  /**
   * Los otros tres criterios no cambian: juntos describen «se puede programar ahora», y son los
   * mismos que comprueba el backend antes de aceptar la operación en el plan.
   */
  it('los criterios de programabilidad siguen intactos', () => {
    const criterios = vista.criteriosDeBusqueda();

    expect(criterios['estadoOperacion']).toBe('REGISTRADA');
    expect(criterios['sinPlanillaVigente']).toBe(true);
    expect(criterios['sinProgramacion']).toBe(true);
  });

  /**
   * El modo pasa a ser criterio de BÚSQUEDA, así que se limpia igual que producto, moneda y
   * destino. Sin esto la selección sobreviviría invisible —fuera de la lista nueva— y el plan se
   * llevaría operaciones del OTRO modo, que es peor que llevarse las de otro destino: son las que
   * el job cree suyas.
   */
  it('cambiar el modo invalida la lista y lo ya marcado', () => {
    conBusquedaHecha();

    vista.onNuevoModo(seleccion('AUTOMATICO'));

    expect(vista.nuevoModo()).toBe('AUTOMATICO');
    expect(vista.opsRows().length).toBe(0);
    expect(vista.seleccion().size).toBe(0);
    expect(vista.loteFiltro()).toBe('');
  });

  /** H2W fuerza MANUAL, y forzarlo cambia el criterio: la lista de antes deja de valer. */
  it('elegir H2W fuerza MANUAL y también invalida la búsqueda', () => {
    vista.nuevoModo.set('AUTOMATICO');
    conBusquedaHecha();

    vista.onNuevaModalidad(seleccion('H2W'));

    expect(vista.nuevoModo()).toBe('MANUAL');
    expect(vista.opsRows().length).toBe(0);
    expect(vista.seleccion().size).toBe(0);
  });

  /** Volver a H2H no fuerza nada: el operador pudo haber elegido MANUAL a propósito. */
  it('volver a H2H no toca el modo ni borra lo buscado', () => {
    vista.nuevoModo.set('MANUAL');
    conBusquedaHecha();

    vista.onNuevaModalidad(seleccion('H2H'));

    expect(vista.nuevoModo()).toBe('MANUAL');
    expect(vista.opsRows().length).toBe(2);
  });
});
