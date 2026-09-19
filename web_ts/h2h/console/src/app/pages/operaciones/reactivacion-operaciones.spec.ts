import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import type { OperacionDetalle } from '../../core/models';
import { OperacionesViewComponent } from './operaciones-view.component';

/**
 * El rescate de una operación detenida en ERROR: vuelve al pool, y con qué modo de envío.
 *
 * <h3>Qué problema resuelve</h3>
 *
 * <p>Cuando una operación agota su tope de reintentos, la decisión la deja en `ERROR`. Eso la saca
 * del barrido automático y <b>también</b> del camino manual: ni el job ni una persona la pueden
 * volver a mover. Es lo que pide la política `MARCAR_REVISION` —que alguien la mire— pero sin una
 * vía de vuelta, esa revisión no puede terminar en nada. Esta pantalla es la vía de vuelta.</p>
 *
 * <h3>Por qué SOLO desde ERROR</h3>
 *
 * <p>Los demás estados no son «operación detenida esperando una decisión», son hechos: el banco
 * pagó, el banco devolvió, alguien anuló. Reactivar desde cualquiera de ellos no reanuda un
 * trámite: crea un segundo pago o contradice lo que el banco ya informó. Por eso el bloqueo se
 * escribe al revés de lo habitual —se niega todo salvo `ERROR`— y un estado nuevo del catálogo
 * queda negado por defecto en vez de abrir una puerta que nadie decidió abrir.</p>
 *
 * <p>Como con anular, esto es una comprobación <b>optimista</b> que solo evita el viaje obvio: la
 * autoridad sigue siendo el backend y su 422 se muestra tal cual llegue.</p>
 */
describe('OperacionesViewComponent: rescate de una operación en ERROR', () => {
  type Interna = {
    opDetalle: { set: (v: OperacionDetalle | null) => void };
    bloqueoReactivar: () => string | null;
    reactivarMotivo: { set: (v: string) => void };
    reactivarModo: { set: (v: string) => void };
    reactivarValido: () => boolean;
  };

  let vista: Interna;

  const conEstado = (estadoOperacionCodigo: string, extra: Record<string, unknown> = {}) =>
    ({ operacion: { id: 'op-1', estadoOperacionCodigo, ...extra } }) as unknown as OperacionDetalle;

  beforeEach(() => {
    TestBed.resetTestingModule();
    const fixture = TestBed.createComponent(OperacionesViewComponent);
    vista = fixture.componentInstance as unknown as Interna;
  });

  it('desde ERROR sí se puede rescatar', () => {
    vista.opDetalle.set(conEstado('ERROR'));

    expect(vista.bloqueoReactivar()).toBeNull();
  });

  it('desde REGISTRADA no hay nada que rescatar, y lo dice', () => {
    vista.opDetalle.set(conEstado('REGISTRADA'));

    expect(vista.bloqueoReactivar()).toContain('REGISTRADA');
  });

  it('desde los hechos del banco se niega', () => {
    for (const estado of ['PAGO_CONFIRMADO', 'PAGO_RECHAZADO', 'PAGO_INFORMADO', 'ANULADA']) {
      vista.opDetalle.set(conEstado(estado));
      expect(vista.bloqueoReactivar(), estado).not.toBeNull();
    }
  });

  /** Fail-closed: un estado que esta pantalla no conoce no abre la puerta por descuido. */
  it('un estado desconocido queda negado', () => {
    vista.opDetalle.set(conEstado('UN_ESTADO_NUEVO'));

    expect(vista.bloqueoReactivar()).not.toBeNull();
  });

  /**
   * Una operación en ERROR con la reserva puesta SÍ se rescata: es el caso que motivó la puerta.
   *
   * <p>Quedó excluida del archivo (detalle no vigente) mientras su planilla salía y cerraba bien,
   * así que su reserva apunta a una planilla ya cerrada y no la suelta nadie. Bloquear aquí la
   * encerraría para siempre, porque las dos reservas es justo lo que la hace invisible al job y a
   * la programación manual. El backend las limpia al reactivar.</p>
   *
   * <p>Y no hay riesgo de pago doble, que es lo que protegen las guardas de anular y de cancelar
   * el plan: a `ERROR` solo se llega porque nadie pagó la operación.</p>
   */
  it('con la reserva todavía puesta SÍ se rescata: es el caso que motiva la puerta', () => {
    vista.opDetalle.set(conEstado('ERROR', { idPlanillaVigente: 'pla-99', idProgramacion: 'prg-7' }));

    expect(vista.bloqueoReactivar()).toBeNull();
  });

  it('sin operación abierta no bloquea ni habilita nada', () => {
    vista.opDetalle.set(null);

    expect(vista.bloqueoReactivar()).toBeNull();
  });

  /**
   * Las dos mitades de la decisión son obligatorias: con qué modo vuelve y por qué. Ninguna tiene
   * defecto — elegir el modo por el operador sería decidir en su nombre si el dato que hizo fallar
   * la operación ya está corregido.
   */
  it('no se confirma sin motivo ni sin modo', () => {
    vista.reactivarMotivo.set('');
    vista.reactivarModo.set('');
    expect(vista.reactivarValido()).toBe(false);

    vista.reactivarMotivo.set('Cuenta del beneficiario corregida');
    expect(vista.reactivarValido()).toBe(false);

    vista.reactivarModo.set('AUTOMATICO');
    expect(vista.reactivarValido()).toBe(true);
  });

  it('un motivo en blanco no cuenta como motivo', () => {
    vista.reactivarModo.set('MANUAL');
    vista.reactivarMotivo.set('    ');

    expect(vista.reactivarValido()).toBe(false);
  });
});
