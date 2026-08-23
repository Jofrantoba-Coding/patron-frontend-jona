import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { CalimacoViewComponent } from './calimaco-view.component';
import type {
  EnvioCalimacoConfig,
  EstrategiaEnvioCalimaco,
  GuardarEnvioCalimaco,
} from './inter-calimaco';

/**
 * En cuántas peticiones se avisa del pago: de una en una o por lotes.
 *
 * <h3>Por qué es un panel aparte del de búsqueda</h3>
 *
 * <p>Son dos preguntas con riesgos de distinta naturaleza. La búsqueda decide <b>qué se
 * encuentra</b>: equivocarse ahí deja pagos sin informar. El envío decide <b>en cuántas llamadas
 * irreversibles</b> se avisa: equivocarse aquí no esconde nada, pero un lote que no quepa no falla
 * «un poco» —falla entero y se lleva el aviso de todas las operaciones que iba dentro—.</p>
 *
 * <h3>Qué se protege aquí</h3>
 *
 * <p>Que el defecto siga siendo una llamada por operación —lo que ya se hacía—, que el tamaño se
 * valide <b>aunque ahora mismo no se use</b>, y que la pantalla diga el número de llamadas en vez
 * de un «es más barato» que no ayuda a elegir el tamaño.</p>
 */
describe('CalimacoViewComponent: cómo se avisa del pago', () => {
  type Interna = {
    setEnvio: (c: EnvioCalimacoConfig) => void;
    estrategiaEnvio: { (): EstrategiaEnvioCalimaco; set: (v: EstrategiaEnvioCalimaco) => void };
    tamanoLote: { (): number; set: (v: number) => void };
    envioCambiado: () => boolean;
    motivoNoGuardarEnvio: () => string | null;
    efectoEnvio: () => string;
    onEstrategiaEnvio: (e: Event) => void;
    onTamanoLote: (e: Event) => void;
    onGuardarEnvio: () => void;
    guardarEnvio: (v: GuardarEnvioCalimaco) => void;
  };

  let vista: Interna;
  let guardado: GuardarEnvioCalimaco | null;

  function config(parcial: Partial<EnvioCalimacoConfig> = {}): EnvioCalimacoConfig {
    return {
      estrategia: 'OPERACION',
      tamanoLote: 100,
      tieneNodo: true,
      maximoTamanoLote: 500,
      plataforma: { estrategia: 'OPERACION', tamanoLote: 100 },
      ...parcial,
    };
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
    const fixture = TestBed.createComponent(CalimacoViewComponent);
    vista = fixture.componentInstance as unknown as Interna;
    guardado = null;
    vista.guardarEnvio = (v) => {
      guardado = v;
    };
  });

  it('el formulario arranca en lo que está guardado', () => {
    vista.setEnvio(config({ estrategia: 'LOTE', tamanoLote: 50 }));

    expect(vista.estrategiaEnvio()).toBe('LOTE');
    expect(vista.tamanoLote()).toBe(50);
    expect(vista.envioCambiado()).toBe(false);
  });

  it('sin cambios no se escribe nada', () => {
    vista.setEnvio(config());

    vista.onGuardarEnvio();

    expect(guardado).toBeNull();
  });

  it('pasar a lote habilita el guardado y viaja con su tamaño', () => {
    vista.setEnvio(config());

    vista.onEstrategiaEnvio({ target: { value: 'LOTE' } } as unknown as Event);

    expect(vista.envioCambiado()).toBe(true);
    vista.onGuardarEnvio();
    expect(guardado).toEqual({ estrategia: 'LOTE', tamanoLote: 100 });
  });

  it('un tamaño fuera de rango se frena aquí, no en el 422', () => {
    // El backend lo rechaza en vez de recortarlo, para que pantalla y base no digan cosas
    // distintas. Explicarlo antes ahorra el viaje.
    vista.setEnvio(config());
    vista.tamanoLote.set(5000);

    expect(vista.motivoNoGuardarEnvio()).toContain('entre 1 y 500');
    vista.onGuardarEnvio();
    expect(guardado).toBeNull();
  });

  it('el tamaño se valida aunque se esté avisando por operación', () => {
    // Guardar un número imposible «porque ahora no se usa» es dejarlo puesto para el día que
    // alguien cambie la estrategia y no mire este campo.
    vista.setEnvio(config({ estrategia: 'OPERACION' }));
    vista.tamanoLote.set(0);

    expect(vista.motivoNoGuardarEnvio()).not.toBeNull();
  });

  it('el efecto se dice en llamadas, que es lo que hay que decidir', () => {
    vista.setEnvio(config());
    expect(vista.efectoEnvio()).toContain('50 llamadas');

    vista.onEstrategiaEnvio({ target: { value: 'LOTE' } } as unknown as Event);
    vista.onTamanoLote({ target: { value: '100' } } as unknown as Event);
    expect(vista.efectoEnvio()).toContain('1 llamada(s)');

    // Y con un lote más pequeño que la tanda, la cuenta sube: 50 en trozos de 20 son 3.
    vista.onTamanoLote({ target: { value: '20' } } as unknown as Event);
    expect(vista.efectoEnvio()).toContain('3 llamada(s)');
  });

  it('se distingue tener configuración propia de heredar el defecto', () => {
    // Sin esto, una organización sin nodo parece haber elegido a mano lo que en realidad hereda.
    vista.setEnvio(config({ tieneNodo: false }));
    expect(vista.envioCambiado()).toBe(false);

    vista.onEstrategiaEnvio({ target: { value: 'LOTE' } } as unknown as Event);
    expect(vista.envioCambiado()).toBe(true);
  });
});
