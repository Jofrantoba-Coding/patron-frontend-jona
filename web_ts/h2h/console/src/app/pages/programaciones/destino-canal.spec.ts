import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import type { VentanaSemanal } from '../../core/models';
import { ProgramacionesViewComponent } from './programaciones-view.component';

/**
 * El canal de liquidación depende del tipo destino.
 *
 * <p>Una interbancaria SALE del banco: la liquida una cámara —CCE la compensación electrónica, BCR
 * el LBTR—, así que el canal es obligatorio y nunca puede ser INTERNO. Una transferencia a terceros
 * o entre cuentas propias se mueve DENTRO del BCP: su canal es INTERNO, o ninguno mientras no se
 * decide, y nunca una cámara.</p>
 *
 * <p>Esto ya lo impone la base con `ck_tt_prg_programacion_destino_canal`, y ese es justamente el
 * problema que se arregla aquí: hasta ahora el formulario ofrecía los tres canales para cualquier
 * destino, la combinación INTERBANCARIA + INTERNO llegaba al INSERT y el plan fallaba devolviendo
 * el texto del constraint de Postgres. Quien programa un envío leía SQL en pantalla, y el plan no
 * se creaba.</p>
 */
describe('ProgramacionesViewComponent: canal de liquidación según el destino', () => {
  type Interna = {
    nuevoTipoDestino: { set: (v: string) => void; (): string };
    nuevoCanal: { set: (v: string) => void; (): string };
    onNuevoTipoDestino: (e: Event) => void;
    canalesDisponibles: () => string[];
    canalObligatorio: () => boolean;
    opcionesCanal: () => { valor: string; etiqueta: string }[];
    motivoCanalIncompatible: () => string | null;
    // Lo mínimo para que `buildCrearPayload` llegue a la comprobación del canal.
    nuevoIdProducto: { set: (v: string) => void };
    nuevoIdMoneda: { set: (v: string) => void };
    nuevoFechaProceso: { set: (v: string) => void };
    nuevoFechaProgramado: { set: (v: string) => void };
    seleccion: { set: (v: Set<string>) => void };
    setVentana: (v: VentanaSemanal | null) => void;
    crearError: { set: (v: string) => void; (): string };
    buildCrearPayload: () => { tipoDestino?: string; canalLiquidacion?: string } | null;
  };

  let vista: Interna;

  /** Cambia el destino como lo hace el `<select>`, que es donde se limpia el canal. */
  function elegirDestino(destino: string): void {
    vista.onNuevoTipoDestino({ target: { value: destino } } as unknown as Event);
  }

  /** Un formulario por lo demás válido: producto, moneda, fecha y una operación marcada. */
  function formularioValido(): void {
    vista.nuevoIdProducto.set('340');
    vista.nuevoIdMoneda.set('69');
    vista.nuevoFechaProceso.set('2026-08-21');
    vista.nuevoFechaProgramado.set('');
    vista.seleccion.set(new Set(['6dc3620d-78a8-4eb8-b626-1aed1a2b0a71']));
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
    const fixture = TestBed.createComponent(ProgramacionesViewComponent);
    vista = fixture.componentInstance as unknown as Interna;
    // Sin días: la ventana solo aporta la zona, y aquí no se está probando el horario.
    vista.setVentana({ zonaHoraria: 'America/Lima', resuelta: true, dias: [] } as VentanaSemanal);
  });

  it('una interbancaria solo ofrece cámaras, y el canal es obligatorio', () => {
    elegirDestino('INTERBANCARIA');

    expect(vista.canalesDisponibles()).toEqual(['CCE', 'BCR']);
    expect(vista.canalObligatorio()).toBe(true);
  });

  it('lo intrabancario solo ofrece INTERNO, y se elige solo', () => {
    // Con una única opción, hacérsela marcar al operador es fricción sin decisión detrás.
    elegirDestino('TERCEROS');
    expect(vista.canalesDisponibles()).toEqual(['INTERNO']);
    expect(vista.nuevoCanal()).toBe('INTERNO');

    elegirDestino('CUENTA_PROPIA');
    expect(vista.nuevoCanal()).toBe('INTERNO');
  });

  it('cambiar el destino descarta el canal que ya no vale', () => {
    // El caso real: se arma un plan de terceros (INTERNO) y se cambia el destino a interbancaria.
    // Conservar INTERNO es exactamente la fila que la base rechaza.
    elegirDestino('TERCEROS');
    expect(vista.nuevoCanal()).toBe('INTERNO');

    elegirDestino('INTERBANCARIA');

    // Se vacía, no se elige por el operador: la cámara decide por dónde sale el dinero.
    expect(vista.nuevoCanal()).toBe('');
  });

  it('el selector SIEMPRE ofrece la opción vacía, también en interbancaria', () => {
    // El fallo que cierra este test: al quitar la opción vacía cuando el canal es obligatorio, el
    // `<select>` —enlazado con `[value]="nuevoCanal()"`— se quedaba sin ninguna opción que
    // representara el modelo en blanco y el navegador pintaba la primera, «CCE». La pantalla decía
    // CCE, el modelo seguía vacío, elegir CCE no disparaba `change` porque ya parecía elegido, y
    // guardar respondía «elija CCE o BCR» sobre un formulario que mostraba CCE. Un callejón sin
    // salida: el operador no podía crear el plan haciendo lo correcto.
    elegirDestino('INTERBANCARIA');

    expect(vista.opcionesCanal()[0].valor).toBe('');
    expect(vista.nuevoCanal()).toBe('');
    // Y la etiqueta empuja a elegir, que es lo que hay que hacer.
    expect(vista.opcionesCanal()[0].etiqueta).toContain('elija');
    expect(vista.opcionesCanal().map((o) => o.valor)).toEqual(['', 'CCE', 'BCR']);
  });

  it('elegir CCE en una interbancaria deja crear el plan', () => {
    // El camino que el operador siguió y no funcionaba. El orden importa y es el de la pantalla:
    // el destino primero —cambiarlo descarta las operaciones ya marcadas, a propósito, porque son
    // de otro destino— y las operaciones después.
    elegirDestino('INTERBANCARIA');
    formularioValido();
    vista.nuevoCanal.set('CCE');

    expect(vista.motivoCanalIncompatible()).toBeNull();
    expect(vista.buildCrearPayload()).toMatchObject({
      tipoDestino: 'INTERBANCARIA',
      canalLiquidacion: 'CCE',
    });
  });

  it('sin destino se ofrecen los tres: la cabecera puede ir sin destino', () => {
    elegirDestino('');

    expect(vista.canalesDisponibles()).toEqual(['CCE', 'BCR', 'INTERNO']);
    expect(vista.canalObligatorio()).toBe(false);
    expect(vista.motivoCanalIncompatible()).toBeNull();
  });

  it('INTERBANCARIA + INTERNO no llega a viajar, y el motivo se lee', () => {
    // La combinación del incidente. Se fuerza sin pasar por el select —es lo que ocurre si el
    // destino cambia después de haber elegido canal— para comprobar la última barrera.
    formularioValido();
    vista.nuevoTipoDestino.set('INTERBANCARIA');
    vista.nuevoCanal.set('INTERNO');

    expect(vista.buildCrearPayload()).toBeNull();
    expect(vista.crearError()).toContain('CCE');
    expect(vista.crearError()).not.toContain('constraint');
  });

  it('una interbancaria sin canal tampoco viaja: la base no admite cámara nula', () => {
    formularioValido();
    vista.nuevoTipoDestino.set('INTERBANCARIA');
    vista.nuevoCanal.set('');

    expect(vista.buildCrearPayload()).toBeNull();
    expect(vista.crearError()).toContain('cámara');
  });

  it('un plan de terceros por cámara tampoco viaja', () => {
    formularioValido();
    vista.nuevoTipoDestino.set('TERCEROS');
    vista.nuevoCanal.set('CCE');

    expect(vista.buildCrearPayload()).toBeNull();
    expect(vista.crearError()).toContain('INTERNO');
  });

  it('las combinaciones buenas sí viajan', () => {
    formularioValido();
    vista.nuevoTipoDestino.set('INTERBANCARIA');
    vista.nuevoCanal.set('CCE');
    expect(vista.buildCrearPayload()).toMatchObject({
      tipoDestino: 'INTERBANCARIA',
      canalLiquidacion: 'CCE',
    });

    vista.nuevoCanal.set('BCR');
    expect(vista.buildCrearPayload()?.canalLiquidacion).toBe('BCR');

    vista.nuevoTipoDestino.set('TERCEROS');
    vista.nuevoCanal.set('INTERNO');
    expect(vista.buildCrearPayload()?.canalLiquidacion).toBe('INTERNO');

    // Y terceros sin canal: la base admite NULL mientras no se decide.
    vista.nuevoCanal.set('');
    expect(vista.buildCrearPayload()).toMatchObject({ tipoDestino: 'TERCEROS' });
  });
});
