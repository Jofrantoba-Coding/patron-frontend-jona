import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { CalimacoViewComponent } from './calimaco-view.component';
import type {
  ConsultaCalimacoConfig,
  EstrategiaConsultaCalimaco,
  GuardarConsultaCalimaco,
} from './inter-calimaco';

/**
 * Con qué alcance se busca el pago en Calimaco: por operación o por fechas.
 *
 * <h3>Por qué esto se configura y no se decide en el código</h3>
 *
 * <p>Las dos formas no dan lo mismo. Por operación se pregunta por el identificador de cada una
 * —sin rango, sin estado y sin banco de por medio— y encuentra el pago aunque sea antiguo. Por
 * fechas se barre una ventana de una vez, más barato, pero el reporte filtra además por estado de
 * partida y por banco: lo que quede fuera el job lo ve como <b>ausente</b> y no lo informa.</p>
 *
 * <p>Eso es exactamente lo que estuvo pasando: el job barría siempre, los pagos del origen eran
 * anteriores a la ventana y la corrida terminaba con «3 de 3 candidatas no aparecen en el barrido»
 * sin informar nada. Este panel es lo que permite cambiarlo sin tocar la base.</p>
 *
 * <h3>Qué se protege aquí</h3>
 *
 * <p>Que el panel no escriba lo que nadie cambió, que no deje guardar una ventana que el backend va
 * a rechazar, y que se distinga <b>tener configuración propia</b> de <b>heredar el defecto</b> —sin
 * eso, una organización sin nodo parece haber elegido a mano lo que en realidad hereda—.</p>
 */
describe('CalimacoViewComponent: cómo se busca el pago', () => {
  type Interna = {
    setConsulta: (c: ConsultaCalimacoConfig) => void;
    estrategia: { (): EstrategiaConsultaCalimaco; set: (v: EstrategiaConsultaCalimaco) => void };
    diasVentana: { (): number; set: (v: number) => void };
    consultaCambiada: () => boolean;
    motivoNoGuardarConsulta: () => string | null;
    efectoConsulta: () => string;
    onEstrategia: (e: Event) => void;
    onDiasVentana: (e: Event) => void;
    onGuardarConsulta: () => void;
    guardarConsulta: (v: GuardarConsultaCalimaco) => void;
  };

  let vista: Interna;
  let guardado: GuardarConsultaCalimaco | null;

  function config(parcial: Partial<ConsultaCalimacoConfig> = {}): ConsultaCalimacoConfig {
    return {
      estrategia: 'OPERACION',
      diasVentana: 7,
      tieneNodo: true,
      maximoDiasVentana: 90,
      plataforma: { estrategia: 'OPERACION', diasVentana: 7 },
      ...parcial,
    };
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
    const fixture = TestBed.createComponent(CalimacoViewComponent);
    vista = fixture.componentInstance as unknown as Interna;
    guardado = null;
    vista.guardarConsulta = (v) => {
      guardado = v;
    };
  });

  it('el formulario arranca en lo que está guardado', () => {
    vista.setConsulta(config({ estrategia: 'FECHAS', diasVentana: 30 }));

    expect(vista.estrategia()).toBe('FECHAS');
    expect(vista.diasVentana()).toBe(30);
    expect(vista.consultaCambiada()).toBe(false);
  });

  it('sin cambios no se escribe nada', () => {
    // Un botón que siempre invita a guardar hace dudar de si el cambio anterior cuajó, y aquí cada
    // guardado deja rastro en el log porque altera lo que el job encuentra.
    vista.setConsulta(config());

    vista.onGuardarConsulta();

    expect(guardado).toBeNull();
  });

  it('cambiar la estrategia sí habilita el guardado, y viaja entera', () => {
    vista.setConsulta(config());

    vista.onEstrategia({ target: { value: 'FECHAS' } } as unknown as Event);

    expect(vista.consultaCambiada()).toBe(true);
    vista.onGuardarConsulta();
    expect(guardado).toEqual({ estrategia: 'FECHAS', diasVentana: 7 });
  });

  it('una ventana fuera de rango se frena aquí, no en el 422', () => {
    // El backend la rechaza en vez de recortarla —para que pantalla y base no digan cosas
    // distintas— así que el motivo se explica antes de gastar el viaje.
    vista.setConsulta(config({ estrategia: 'FECHAS', diasVentana: 7 }));
    vista.diasVentana.set(400);

    expect(vista.motivoNoGuardarConsulta()).toContain('90');
    vista.onGuardarConsulta();
    expect(guardado).toBeNull();
  });

  it('cero días tampoco vale', () => {
    vista.setConsulta(config({ estrategia: 'FECHAS' }));
    vista.diasVentana.set(0);

    expect(vista.motivoNoGuardarConsulta()).not.toBeNull();
  });

  it('con OPERACION la ventana no estorba aunque tenga un valor raro', () => {
    // No hay ventana que ajustar en esa estrategia: bloquear el guardado por un campo que no se va
    // a usar sería impedir volver a «por operación», que es justo la salida cuando algo no aparece.
    vista.setConsulta(config({ estrategia: 'FECHAS', diasVentana: 7 }));
    vista.diasVentana.set(999);
    vista.onEstrategia({ target: { value: 'OPERACION' } } as unknown as Event);

    expect(vista.motivoNoGuardarConsulta()).toBeNull();
  });

  it('el efecto habla del job, no de la llamada', () => {
    // Lo que alguien viene a decidir aquí es qué se va a informar; «una consulta por moneda» no
    // responde a eso.
    vista.setConsulta(config({ estrategia: 'FECHAS', diasVentana: 15 }));
    expect(vista.efectoConsulta()).toContain('15');
    expect(vista.efectoConsulta()).toContain('ausente');

    vista.onEstrategia({ target: { value: 'OPERACION' } } as unknown as Event);
    expect(vista.efectoConsulta()).toContain('cada operación');
  });

  it('se distingue heredar de haber elegido', () => {
    // `tieneNodo` es la diferencia entre «esta organización decidió esto» y «esto le viene de
    // plataforma y cambiará si cambia el defecto».
    vista.setConsulta(config({
      tieneNodo: false,
      estrategia: 'OPERACION',
      plataforma: { estrategia: 'OPERACION', diasVentana: 7 },
    }));

    expect(vista.estrategia()).toBe('OPERACION');
    expect(vista.consultaCambiada()).toBe(false);
  });

  it('los días se leen como número, no como texto', () => {
    // Con el valor del input sin convertir, la comparación con lo guardado sería '30' !== 30 y el
    // panel diría que hay cambios sin haberlos.
    vista.setConsulta(config({ estrategia: 'FECHAS', diasVentana: 30 }));

    vista.onDiasVentana({ target: { value: '30' } } as unknown as Event);

    expect(vista.diasVentana()).toBe(30);
    expect(vista.consultaCambiada()).toBe(false);
  });
});
