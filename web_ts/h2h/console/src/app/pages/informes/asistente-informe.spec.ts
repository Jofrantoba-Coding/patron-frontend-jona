import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { InformesViewComponent } from './informes-view.component';
import type { DetalleProgramacionInforme } from './inter-informes';

/**
 * El asistente de informe al origen: cuatro pasos, y una ventana que es opcional de verdad.
 *
 * <p>Antes esta pantalla era un detalle con un botón «Ejecutar» al final. El problema no era feo
 * sino peligroso: no había forma de ver el veredicto de cada operación <b>antes</b> de pulsar, y en
 * modo REAL esa llamada cambia el estado de un pago ajeno y no se deshace. Los pasos separan
 * revisar de ejecutar.</p>
 *
 * <p>Lo otro que se fija aquí es que la <b>ventana de fechas no viaje sola</b>. Sin ventana, cada
 * operación pregunta a Calimaco por su identificador y encuentra el pago aunque sea de hace
 * semanas; con ventana se reproduce lo que ve el job, que barre por rango. Mandarla sin que nadie
 * la pidiera estrecharía la consulta sin que se note.</p>
 */
describe('InformesViewComponent: el asistente por pasos', () => {
  type Interna = {
    paso: { set: (v: number) => void; (): number };
    irAlPaso: (n: number) => void;
    setDetalle: (d: DetalleProgramacionInforme | null) => void;
    pasoInicial: (d: DetalleProgramacionInforme) => number;
    estrategia: { set: (v: string) => void; (): string };
    ventanaDesde: { set: (v: string) => void; (): string };
    ventanaHasta: { set: (v: string) => void; (): string };
    onEstrategia: (e: Event) => void;
    setConsultaConfigurada: (c: { estrategia: string; diasVentana: number }) => void;
    estrategiaCambiada: () => boolean;
    ventanaPedida: () => { desde: string; hasta: string } | null;
    setComparacion: (id: string, c: unknown) => void;
    comparacionDe: (id: string) => unknown;
    resumenComparacion: () => { hechas: number; cuadran: number; yaAplicados: number };
  };

  let vista: Interna;

  function tanda(cabecera: Partial<DetalleProgramacionInforme['cabecera']>) {
    return {
      cabecera: {
        id: 'p1',
        codigo: 'INF-000003',
        estado: 'PROGRAMADA',
        totalOperaciones: 2,
        informadas: 0,
        fallidas: 0,
        ...cabecera,
      },
      detalles: [],
    } as unknown as DetalleProgramacionInforme;
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
    const fixture = TestBed.createComponent(InformesViewComponent);
    vista = fixture.componentInstance as unknown as Interna;
  });

  it('una tanda sin ejecutar se abre en REVISAR', () => {
    vista.setDetalle(tanda({}));

    expect(vista.paso()).toBe(2);
  });

  it('una tanda ya ejecutada se abre en el CIERRE', () => {
    // Lo que interesa de una tanda cerrada es el desenlace. Abrirla en revisar obligaría a pasar
    // por dos pantallas para leer un resultado, y además invita a volver a ejecutar.
    vista.setDetalle(tanda({ ejecutado: '2026-08-21 07:30:00', informadas: 2 }));

    expect(vista.paso()).toBe(4);
  });

  it('una tanda con fallidas también se abre en el cierre', () => {
    vista.setDetalle(tanda({ fallidas: 1 }));

    expect(vista.paso()).toBe(4);
  });

  it('cerrar el asistente lo deja limpio', () => {
    // Heredar las comparaciones de la tanda anterior sería enseñar el veredicto de OTRAS
    // operaciones junto a las de esta, y nada en pantalla diría que son de otra.
    vista.setDetalle(tanda({}));
    vista.setComparacion('op-1', { coincide: true, motivos: [], campos: [] });
    expect(vista.resumenComparacion().hechas).toBe(1);

    vista.setDetalle(null);

    expect(vista.resumenComparacion().hechas).toBe(0);
    expect(vista.comparacionDe('op-1')).toBeNull();
    expect(vista.paso()).toBe(2);
  });

  it('consultando POR OPERACION no viaja ninguna fecha', () => {
    // El caso por defecto y el que más encuentra: se pregunta por el identificador, sin rango. Unas
    // fechas escritas antes no pueden colarse en la petición y estrechar lo que se consulta.
    vista.ventanaDesde.set('2026-08-14 00:00:00');
    vista.ventanaHasta.set('2026-08-21 00:00:00');
    vista.estrategia.set('OPERACION');

    expect(vista.ventanaPedida()).toBeNull();
  });

  it('POR FECHAS con la ventana a medias tampoco viaja', () => {
    // Media ventana no es una ventana: el backend la completaría con su defecto, pero mandarla así
    // sugiere en pantalla que se aplicó lo que se ve escrito.
    vista.estrategia.set('FECHAS');
    vista.ventanaDesde.set('2026-08-14 00:00:00');
    vista.ventanaHasta.set('');

    expect(vista.ventanaPedida()).toBeNull();
  });

  it('elegir POR FECHAS propone la ventana hacia atrás', () => {
    // El caso que trae a alguien aquí es una operación cuyo pago en el origen es de días atrás; una
    // ventana de «hoy» —la que arma el job— no lo alcanza, y proponerla vacía obliga a adivinar el
    // formato que espera el reporte.
    vista.onEstrategia({ target: { value: 'FECHAS' } } as unknown as Event);

    const pedida = vista.ventanaPedida();
    expect(pedida).not.toBeNull();
    expect(pedida!.desde).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    expect(pedida!.desde < pedida!.hasta).toBe(true);
  });

  it('volver a POR OPERACION no borra lo escrito, solo deja de mandarlo', () => {
    vista.onEstrategia({ target: { value: 'FECHAS' } } as unknown as Event);
    const desde = vista.ventanaDesde();

    vista.onEstrategia({ target: { value: 'OPERACION' } } as unknown as Event);

    expect(vista.ventanaPedida()).toBeNull();
    expect(vista.ventanaDesde()).toBe(desde);
  });

  it('el asistente arranca con la estrategia configurada de la organización', () => {
    // Si arrancara siempre por operación, una organización configurada en FECHAS revisaría con un
    // alcance y el backend ejecutaría con otro.
    vista.setConsultaConfigurada({ estrategia: 'FECHAS', diasVentana: 3 });

    expect(vista.estrategia()).toBe('FECHAS');
    expect(vista.ventanaPedida()).not.toBeNull();
    expect(vista.estrategiaCambiada()).toBe(false);
  });

  it('cambiarla a mano se avisa: no es lo que la organización tiene puesto', () => {
    vista.setConsultaConfigurada({ estrategia: 'FECHAS', diasVentana: 3 });

    vista.onEstrategia({ target: { value: 'OPERACION' } } as unknown as Event);

    expect(vista.estrategiaCambiada()).toBe(true);
  });

  it('el resumen cuenta lo comparado, no lo que hay en la tanda', () => {
    vista.setComparacion('op-1', { coincide: true, motivos: [], campos: [] });
    vista.setComparacion('op-2', { coincide: false, motivos: ['El importe no coincide.'], campos: [] });
    vista.setComparacion('op-3', { coincide: true, yaAplicado: true, motivos: [], campos: [] });

    const resumen = vista.resumenComparacion();
    expect(resumen.hechas).toBe(3);
    expect(resumen.cuadran).toBe(2);
    expect(resumen.yaAplicados).toBe(1);
  });

  it('se puede navegar entre pasos sin tocar la tanda', () => {
    vista.setDetalle(tanda({}));
    vista.irAlPaso(3);
    expect(vista.paso()).toBe(3);
    vista.irAlPaso(2);
    expect(vista.paso()).toBe(2);
  });
});
