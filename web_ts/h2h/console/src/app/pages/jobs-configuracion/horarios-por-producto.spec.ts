import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import type { ConfiguracionJobs } from './inter-jobs-configuracion';
import { JobsConfiguracionViewComponent } from './jobs-configuracion-view.component';

/**
 * Agrupación de los subtipos horarios por producto.
 *
 * <h3>Por qué agrupar no es cosmética</h3>
 *
 * <p>La pantalla administra ahora dos ramas —transferencias y pagos masivos— y cada producto se
 * valida contra <b>la suya</b>. Siete subtipos en una lista plana no dicen a cuál pertenece cada
 * uno, y de eso depende que quien busque «el horario de pagos masivos» no acabe editando el de
 * transferencias.</p>
 *
 * <p>La clave del `Record` es `<PRODUCTO>#<SUBTIPO>` a propósito: hoy los nombres no colisionan
 * entre productos, pero apoyarse en eso haría que el día que dos compartan nombre uno pisara al
 * otro sin ruido.</p>
 */
describe('JobsConfiguracionViewComponent: horarios agrupados por producto', () => {
  type Interna = {
    setConfig: (c: ConfiguracionJobs) => void;
    horarios: () => { clave: string; producto: string; subtipo: string; codigo: string }[];
    horariosPorProducto: () => { producto: string; etiqueta: string; subtipos: unknown[] }[];
  };

  let vista: Interna;

  /** Respuesta del backend con las dos ramas, tal como la arma ProcessConfiguracionJobs. */
  function configCon(...nodos: { clave: string; producto: string; subtipo: string }[]): ConfiguracionJobs {
    const subtipos: Record<string, never> = {};
    for (const n of nodos) {
      (subtipos as Record<string, unknown>)[n.clave] = {
        codigo: `H2H#BCP#HORARIO#${n.producto}#${n.subtipo}`,
        producto: n.producto,
        subtipo: n.subtipo,
        organizacion: { habilitado: false },
        banco: {},
      };
    }
    return {
      interruptores: {},
      modoEnvio: { codigo: 'x', organizacion: null },
      cantidadProgramable: { codigo: 'x', organizacion: null },
      reintentos: { codigo: 'x', organizacion: null },
      horarios: { ventanaCanal: {}, subtipos },
      generado: '',
    } as unknown as ConfiguracionJobs;
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
    const fixture = TestBed.createComponent(JobsConfiguracionViewComponent);
    vista = fixture.componentInstance as unknown as Interna;
  });

  it('separa los subtipos en sus dos productos', () => {
    vista.setConfig(
      configCon(
        { clave: 'TRANSFERENCIAS#TERCEROS', producto: 'TRANSFERENCIAS', subtipo: 'TERCEROS' },
        { clave: 'PAGOS_MASIVOS#ABONO_PROVEEDOR', producto: 'PAGOS_MASIVOS', subtipo: 'ABONO_PROVEEDOR' },
        { clave: 'PAGOS_MASIVOS#CTS', producto: 'PAGOS_MASIVOS', subtipo: 'CTS' }
      )
    );

    const grupos = vista.horariosPorProducto();

    expect(grupos.length).toBe(2);
    expect(grupos[0].producto).toBe('TRANSFERENCIAS');
    expect(grupos[0].subtipos.length).toBe(1);
    expect(grupos[1].producto).toBe('PAGOS_MASIVOS');
    expect(grupos[1].subtipos.length).toBe(2);
  });

  it('transferencias va primero, sin depender del orden del backend', () => {
    // El backend itera un mapa; el orden de sus claves no es contrato. Fijarlo aquí evita que la
    // tabla se reordene sola entre peticiones.
    vista.setConfig(
      configCon(
        { clave: 'PAGOS_MASIVOS#HABERES', producto: 'PAGOS_MASIVOS', subtipo: 'HABERES' },
        { clave: 'TRANSFERENCIAS#TERCEROS', producto: 'TRANSFERENCIAS', subtipo: 'TERCEROS' }
      )
    );

    expect(vista.horariosPorProducto().map((g) => g.producto))
      .toEqual(['TRANSFERENCIAS', 'PAGOS_MASIVOS']);
  });

  it('un producto que nadie previó va al final pero NO se pierde', () => {
    // Factoring, el día que tenga rama horaria. Descartarlo lo dejaría inconfigurable sin que nada
    // lo delatara: la pantalla simplemente no lo mostraría.
    vista.setConfig(
      configCon(
        { clave: 'FACTORING#TOTAL', producto: 'FACTORING', subtipo: 'TOTAL' },
        { clave: 'TRANSFERENCIAS#TERCEROS', producto: 'TRANSFERENCIAS', subtipo: 'TERCEROS' }
      )
    );

    const grupos = vista.horariosPorProducto();

    expect(grupos.map((g) => g.producto)).toEqual(['TRANSFERENCIAS', 'FACTORING']);
    // Sin etiqueta conocida se muestra el código, no una cadena vacía.
    expect(grupos[1].etiqueta).toBe('FACTORING');
  });

  it('los subtipos salen ordenados dentro de su producto', () => {
    vista.setConfig(
      configCon(
        { clave: 'PAGOS_MASIVOS#HABERES', producto: 'PAGOS_MASIVOS', subtipo: 'HABERES' },
        { clave: 'PAGOS_MASIVOS#ABONO_PROVEEDOR', producto: 'PAGOS_MASIVOS', subtipo: 'ABONO_PROVEEDOR' },
        { clave: 'PAGOS_MASIVOS#CTS', producto: 'PAGOS_MASIVOS', subtipo: 'CTS' }
      )
    );

    expect(
      (vista.horariosPorProducto()[0].subtipos as { subtipo: string }[]).map((s) => s.subtipo)
    ).toEqual(['ABONO_PROVEEDOR', 'CTS', 'HABERES']);
  });

  it('un backend anterior, sin producto, sigue funcionando como transferencias', () => {
    // Compatibilidad hacia atrás: antes la respuesta traía el subtipo suelto como clave y ningún
    // campo `producto`. Sin este respaldo la pantalla se quedaría en blanco contra ese backend.
    vista.setConfig({
      interruptores: {},
      modoEnvio: { codigo: 'x', organizacion: null },
      cantidadProgramable: { codigo: 'x', organizacion: null },
      reintentos: { codigo: 'x', organizacion: null },
      horarios: {
        ventanaCanal: {},
        subtipos: {
          TERCEROS: {
            codigo: 'H2H#BCP#HORARIO#TRANSFERENCIAS#TERCEROS',
            organizacion: {},
            banco: {},
          },
        },
      },
      generado: '',
    } as unknown as ConfiguracionJobs);

    const grupos = vista.horariosPorProducto();

    expect(grupos.length).toBe(1);
    expect(grupos[0].producto).toBe('TRANSFERENCIAS');
    expect(vista.horarios()[0].subtipo).toBe('TERCEROS');
  });
});
