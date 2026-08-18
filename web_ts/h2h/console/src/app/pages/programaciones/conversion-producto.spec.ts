import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import type { VentanaSemanal } from '../../core/models';
import { ProgramacionesViewComponent } from './programaciones-view.component';

/**
 * Cuándo se ofrece convertir un plan de transferencias en pago masivo de proveedores.
 *
 * <p>Convertir no es cambiar una etiqueta: crea una operación nueva por cada transferencia,
 * <b>anula las originales</b> y revierte su asiento —el cargo pasa de la cuenta 4699 a la 4212—.
 * No hay botón de deshacer, así que lo que se protege aquí es que la opción no aparezca donde no
 * corresponde y que no quede pegada de un diálogo anterior.</p>
 *
 * <p>El backend convierte <b>todo o nada</b>: si una sola operación del plan no es transferencia a
 * terceros, rechaza el lote entero. Ofrecer la opción sobre un plan mixto sería ofrecer un botón
 * que solo puede fallar, y el operador no tendría forma de saber por qué.</p>
 */
describe('ProgramacionesViewComponent: conversión a pago masivo de proveedores', () => {
  type Interna = {
    setVentana: (v: VentanaSemanal | null) => void;
    setDetalle: (d: unknown) => void;
    abrirModalidad: (plan: unknown) => void;
    modalidadDestino: { set: (v: 'H2H' | 'H2W') => void };
    modalidadConversion: { set: (v: string) => void; (): string };
    conversionDisponible: () => boolean;
    // Formulario de creación
    nuevoModalidad: { set: (v: string) => void };
    nuevoConversion: { set: (v: string) => void; (): string };
    opsRows: { set: (v: unknown[]) => void };
    seleccion: { set: (v: Set<string>) => void };
    conversionNuevoDisponible: () => boolean;
    nuevoIdProducto: { set: (v: string) => void };
    nuevoIdMoneda: { set: (v: string) => void };
    nuevoFechaProceso: { set: (v: string) => void };
    buildCrearPayload: () => { conversion?: string } | null;
  };

  let vista: Interna;

  function ventana(zonaHoraria = 'America/Lima'): VentanaSemanal {
    return { zonaHoraria, resuelta: true, dias: [] };
  }

  /** Detalle del plan con las operaciones que lleva dentro. */
  function detalleCon(...tipos: string[]) {
    return {
      detalles: tipos.map((tipoOperacionCodigo, i) => ({
        id: `d${i}`,
        tipoOperacionCodigo,
      })),
    };
  }

  /** El plan se abre siempre hacia H2W: es el escenario donde la conversión tiene sentido. */
  function abrirHaciaPortal() {
    vista.abrirModalidad({ id: 'p1', codigo: 'PRG-1', fechaProceso: '', modalidadCodigo: 'H2H' });
    vista.modalidadDestino.set('H2W');
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
    const fixture = TestBed.createComponent(ProgramacionesViewComponent);
    vista = fixture.componentInstance as unknown as Interna;
    vista.setVentana(ventana());
  });

  it('se ofrece cuando TODAS las operaciones son transferencias a terceros', () => {
    vista.setDetalle(detalleCon('TRANSFERENCIA_TERCEROS', 'TRANSFERENCIA_TERCEROS'));
    abrirHaciaPortal();

    expect(vista.conversionDisponible()).toBe(true);
  });

  it('NO se ofrece si el plan mezcla productos', () => {
    // Aunque la mayoría sean convertibles: el backend rechaza el lote entero, así que mostrar la
    // opción solo llevaría a un error que no explica qué operación estorba.
    vista.setDetalle(detalleCon('TRANSFERENCIA_TERCEROS', 'PAGOMASIVO_ABONO_PROVEEDOR'));
    abrirHaciaPortal();

    expect(vista.conversionDisponible()).toBe(false);
  });

  it('NO se ofrece si ninguna operación es transferencia', () => {
    vista.setDetalle(detalleCon('PAGOMASIVO_HABERES_TRABAJADOR'));
    abrirHaciaPortal();

    expect(vista.conversionDisponible()).toBe(false);
  });

  it('NO se ofrece al volver a H2H', () => {
    // La conversión existe para poder subir el archivo al portal como planilla de proveedores.
    // Ofrecerla al volver al canal automático sería convertir sin ningún motivo.
    vista.setDetalle(detalleCon('TRANSFERENCIA_TERCEROS'));
    abrirHaciaPortal();
    vista.modalidadDestino.set('H2H');

    expect(vista.conversionDisponible()).toBe(false);
  });

  it('NO se ofrece sobre un plan sin operaciones cargadas', () => {
    // `every` sobre una lista vacía devuelve true: sin esta guarda, un plan cuyo detalle todavía
    // no ha llegado ofrecería convertir «todas» sus cero operaciones.
    vista.setDetalle(detalleCon());
    abrirHaciaPortal();

    expect(vista.conversionDisponible()).toBe(false);
  });

  it('lee el tipo aunque el alias venga en minúsculas', () => {
    // La query nativa devuelve los alias plegados por PostgreSQL; leer solo la forma camelCase
    // haría que la opción no apareciera nunca sin que nada lo delatara.
    vista.setDetalle({ detalles: [{ id: 'd0', tipooperacioncodigo: 'TRANSFERENCIA_TERCEROS' }] });
    abrirHaciaPortal();

    expect(vista.conversionDisponible()).toBe(true);
  });

  // ── Al crear el plan ─────────────────────────────────────────────────────

  /** Operaciones disponibles para seleccionar en el formulario de creación. */
  function opsDisponibles(...tipos: string[]) {
    return tipos.map((tipoOperacionCodigo, i) => ({
      id: `o${i}`,
      tipoOperacionCodigo,
    }));
  }

  function prepararCreacion(tipos: string[], seleccionados: string[], modalidad = 'H2W') {
    vista.opsRows.set(opsDisponibles(...tipos));
    vista.seleccion.set(new Set(seleccionados));
    vista.nuevoModalidad.set(modalidad);
  }

  it('al crear, se ofrece si TODAS las seleccionadas son transferencias', () => {
    prepararCreacion(['TRANSFERENCIA_TERCEROS', 'TRANSFERENCIA_TERCEROS'], ['o0', 'o1']);

    expect(vista.conversionNuevoDisponible()).toBe(true);
  });

  it('al crear, mira la SELECCIÓN y no el listado entero', () => {
    // Hay una operación no convertible en el listado, pero no está seleccionada: lo que entra al
    // plan es la selección, así que la opción debe seguir ofreciéndose.
    prepararCreacion(['TRANSFERENCIA_TERCEROS', 'PAGOMASIVO_HABERES_TRABAJADOR'], ['o0']);

    expect(vista.conversionNuevoDisponible()).toBe(true);
  });

  it('al crear, NO se ofrece si una SELECCIONADA no es transferencia', () => {
    prepararCreacion(['TRANSFERENCIA_TERCEROS', 'PAGOMASIVO_HABERES_TRABAJADOR'], ['o0', 'o1']);

    expect(vista.conversionNuevoDisponible()).toBe(false);
  });

  it('al crear, NO se ofrece sin selección ni fuera de H2W', () => {
    prepararCreacion(['TRANSFERENCIA_TERCEROS'], []);
    expect(vista.conversionNuevoDisponible()).toBe(false);

    prepararCreacion(['TRANSFERENCIA_TERCEROS'], ['o0'], 'H2H');
    expect(vista.conversionNuevoDisponible()).toBe(false);
  });

  it('una seleccionada que ya no está en el listado NO se da por convertible', () => {
    // Pasa al cambiar el filtro de lote con operaciones ya marcadas. No se puede comprobar su
    // tipo, y asumir que es convertible mandaría a anular algo que nadie ha verificado.
    prepararCreacion(['TRANSFERENCIA_TERCEROS'], ['o0', 'fantasma']);

    expect(vista.conversionNuevoDisponible()).toBe(false);
  });

  it('el payload NO lleva conversión si la opción no se ofrecía', () => {
    // El caso que importa: se elige convertir, cambia la selección a algo no convertible y se
    // confirma. Mandar la conversión ahí significaría anular operaciones por una elección que ya
    // no se está viendo en pantalla.
    prepararCreacion(['TRANSFERENCIA_TERCEROS', 'PAGOMASIVO_HABERES_TRABAJADOR'], ['o0']);
    vista.nuevoConversion.set('PAGO_MASIVO_PROVEEDORES');
    vista.nuevoIdProducto.set('338');
    vista.nuevoIdMoneda.set('69');
    vista.nuevoFechaProceso.set('2026-08-20');

    const conOpcion = vista.buildCrearPayload();
    expect(conOpcion?.conversion).toBe('PAGO_MASIVO_PROVEEDORES');

    vista.seleccion.set(new Set(['o0', 'o1'])); // ahora hay una no convertible dentro
    const sinOpcion = vista.buildCrearPayload();
    expect(sinOpcion?.conversion).toBeUndefined();
  });

  it('cada apertura del diálogo vuelve a MANTENER', () => {
    // Heredar la elección anterior es la forma de convertir un plan sin querer: el operador abre
    // el diálogo para cambiar una fecha y confirma sin mirar el selector.
    vista.setDetalle(detalleCon('TRANSFERENCIA_TERCEROS'));
    abrirHaciaPortal();
    vista.modalidadConversion.set('PAGO_MASIVO_PROVEEDORES');

    abrirHaciaPortal();

    expect(vista.modalidadConversion()).toBe('MANTENER');
  });
});
