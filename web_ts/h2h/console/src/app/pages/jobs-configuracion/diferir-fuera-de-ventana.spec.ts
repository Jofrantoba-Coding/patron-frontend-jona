import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import type { ConfiguracionJobs } from './inter-jobs-configuracion';
import { JobsConfiguracionViewComponent } from './jobs-configuracion-view.component';

/**
 * Interruptor del diferido: ¿agenda el job a la próxima apertura, o espera?
 *
 * <h3>Qué gobierna</h3>
 *
 * <p>Solo al job automático. Encendido, un lote que le toca fuera de ventana se agenda al siguiente
 * instante en que el canal abre —moviendo la fecha de proceso del plan y de sus operaciones—.
 * Apagado, no se programa nada y se espera.</p>
 *
 * <p>El defecto es <b>encendido</b> porque es la conducta que el sistema ya tenía. Leer un nodo
 * ausente como «apagado» dejaría de programar por una parametría que falta, que es un corte de
 * servicio por un dato de catálogo.</p>
 */
describe('JobsConfiguracionViewComponent: diferido fuera de ventana', () => {
  type Interna = {
    setConfig: (c: ConfiguracionJobs) => void;
    diferirFueraDeVentana: () => boolean;
    diferirHeredado: () => boolean;
    diferirDisponible: () => boolean;
  };

  let vista: Interna;

  function configCon(bloque: unknown): ConfiguracionJobs {
    return {
      interruptores: {},
      modoEnvio: { codigo: 'x', organizacion: null },
      cantidadProgramable: { codigo: 'x', organizacion: null },
      reintentos: { codigo: 'x', organizacion: null },
      diferirFueraDeVentana: bloque,
      horarios: { ventanaCanal: {}, subtipos: {} },
      generado: '',
    } as unknown as ConfiguracionJobs;
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
    const fixture = TestBed.createComponent(JobsConfiguracionViewComponent);
    vista = fixture.componentInstance as unknown as Interna;
  });

  it('la organización manda sobre la plataforma', () => {
    vista.setConfig(
      configCon({
        codigo: 'H2H#BCP#PROGRAMACION#DIFERIR_FUERA_DE_VENTANA',
        organizacion: { habilitado: false },
        plataforma: { habilitado: true },
      })
    );

    expect(vista.diferirFueraDeVentana()).toBe(false);
    expect(vista.diferirHeredado()).toBe(false);
  });

  it('sin valor propio se hereda el de plataforma, y se marca como heredado', () => {
    // El contraste importa: sin él, un «Sí» no dice si alguien lo eligió aquí o viene heredado,
    // y de eso depende qué pasa si cambia el defecto de plataforma.
    vista.setConfig(
      configCon({
        codigo: 'H2H#BCP#PROGRAMACION#DIFERIR_FUERA_DE_VENTANA',
        organizacion: null,
        plataforma: { habilitado: false },
      })
    );

    expect(vista.diferirFueraDeVentana()).toBe(false);
    expect(vista.diferirHeredado()).toBe(true);
  });

  it('sin ninguna configuración se difiere, que es la conducta previa', () => {
    vista.setConfig(
      configCon({
        codigo: 'H2H#BCP#PROGRAMACION#DIFERIR_FUERA_DE_VENTANA',
        organizacion: null,
      })
    );

    expect(vista.diferirFueraDeVentana()).toBe(true);
    expect(vista.diferirHeredado()).toBe(true);
  });

  it('un `false` explícito de la organización NO se confunde con ausencia', () => {
    // El riesgo real de este control: si se comprobara con un `??` o con un booleano laxo, el
    // `false` que alguien eligió a propósito se leería como «no configurado» y volveria a
    // encenderse solo. El operador apagaria el diferido y la pantalla seguiria diciendo «Sí».
    vista.setConfig(
      configCon({
        codigo: 'H2H#BCP#PROGRAMACION#DIFERIR_FUERA_DE_VENTANA',
        organizacion: { habilitado: false },
      })
    );

    expect(vista.diferirFueraDeVentana()).toBe(false);
    expect(vista.diferirHeredado()).toBe(false);
  });

  it('sin el bloque —backend anterior— el control no se pinta', () => {
    // Mostrar un interruptor que el backend no sabe guardar seria peor que no mostrarlo: el
    // operador creeria haber apagado algo.
    vista.setConfig(configCon(undefined));

    expect(vista.diferirDisponible()).toBe(false);
  });

  it('con el bloque presente el control se pinta', () => {
    vista.setConfig(
      configCon({
        codigo: 'H2H#BCP#PROGRAMACION#DIFERIR_FUERA_DE_VENTANA',
        organizacion: { habilitado: true },
      })
    );

    expect(vista.diferirDisponible()).toBe(true);
  });
});
