import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import type { Operacion } from '../../core/models';
import { OperacionesViewComponent } from './operaciones-view.component';

/**
 * Selección de operaciones para convertir a pago masivo de proveedores.
 *
 * <p>Convertir crea una operación por transferencia y <b>anula la original</b>, revirtiendo su
 * asiento. No hay deshacer, y además es <b>todo o nada</b>: una sola operación no convertible hace
 * que el backend rechace el lote entero con un 422.</p>
 *
 * <p>De ahí que lo que se protege aquí sea que no se pueda marcar lo que no procede. Si se
 * pudiera, el operador armaría un lote de veinte y descubriría al confirmar que una estorba, sin
 * saber cuál. Las guardas son espejo de las del backend; la autoridad sigue siendo él.</p>
 */
describe('OperacionesViewComponent: conversión a pago masivo de proveedores', () => {
  type Interna = {
    master: { set: (v: Operacion[]) => void };
    modoConversion: { (): boolean; set: (v: boolean) => void };
    seleccionConversion: { (): Set<string>; set: (v: Set<string>) => void };
    seleccionConversionCount: () => number;
    motivoNoConvertible: (op: Operacion) => string | null;
    convertibles: () => Operacion[];
    toggleConversion: (id: string) => void;
    toggleTodasConvertibles: () => void;
    toggleModoConversion: () => void;
    seleccionadasParaConvertir: () => Operacion[];
    monedasEnConversion: () => string[];
    onRowClick: (e: { row: unknown; index: number }) => void;
    abrirOpDetalle: (id: string) => void;
    columns: () => { key: string }[];
  };

  let vista: Interna;

  /** Una transferencia libre: el caso convertible. */
  function transferencia(over: Partial<Operacion> = {}): Operacion {
    return {
      id: 'op-1',
      codigoOperacion: 'OP-20260815-AAA',
      tipoOperacionCodigo: 'TRANSFERENCIA_TERCEROS',
      estadoOperacionCodigo: 'REGISTRADA',
      monedaCodigo: 'PEN',
      montoTotal: 1,
      idPlanillaVigente: null,
      ...over,
    } as unknown as Operacion;
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
    const fixture = TestBed.createComponent(OperacionesViewComponent);
    vista = fixture.componentInstance as unknown as Interna;
  });

  // ── Qué se puede convertir ────────────────────────────────────────────────

  it('una transferencia REGISTRADA y libre es convertible', () => {
    expect(vista.motivoNoConvertible(transferencia())).toBeNull();
    expect(vista.motivoNoConvertible(transferencia({ estadoOperacionCodigo: 'VALIDADA' }))).toBeNull();
  });

  it('lo que no es transferencia a terceros NO lo es', () => {
    const otra = transferencia({ tipoOperacionCodigo: 'PAGOMASIVO_ABONO_PROVEEDOR' });

    expect(vista.motivoNoConvertible(otra)).toContain('no es una transferencia');
  });

  it('un estado terminal NO lo es', () => {
    // Convertir algo ya pagado o anulado contradiría un hecho registrado.
    expect(vista.motivoNoConvertible(transferencia({ estadoOperacionCodigo: 'PAGO_CONFIRMADO' })))
      .toContain('ya no admite conversión');
    expect(vista.motivoNoConvertible(transferencia({ estadoOperacionCodigo: 'ANULADA' })))
      .toContain('ya no admite conversión');
  });

  it('con planilla vigente NO lo es, y el motivo dice cuál', () => {
    // Ya viajó al banco con el layout de transferencia: convertirla crearía un segundo pago al
    // mismo beneficiario. Es la guarda que evita pagar dos veces.
    const enPlanilla = transferencia({ idPlanillaVigente: 'pla-9' } as Partial<Operacion>);

    expect(vista.motivoNoConvertible(enPlanilla)).toContain('pla-9');
  });

  it('si pertenece a un plan, remite al plan y no la convierte aquí', () => {
    // Convertirla por esta vía dejaría al plan apuntando a una operación anulada y con su producto
    // sin cambiar: el archivo saldría con el layout de transferencias.
    const enPlan = { ...transferencia(), idProgramacion: 'prg-7' } as unknown as Operacion;

    expect(vista.motivoNoConvertible(enPlan)).toContain('plan');
  });

  // ── La selección ──────────────────────────────────────────────────────────

  it('NO deja marcar una operación no convertible', () => {
    // Es lo que evita armar un lote que el backend va a rechazar entero.
    vista.master.set([transferencia({ id: 'op-1', estadoOperacionCodigo: 'PAGO_CONFIRMADO' })]);

    vista.toggleConversion('op-1');

    expect(vista.seleccionConversionCount()).toBe(0);
  });

  it('marca y desmarca una convertible', () => {
    vista.master.set([transferencia({ id: 'op-1' })]);

    vista.toggleConversion('op-1');
    expect(vista.seleccionConversionCount()).toBe(1);

    vista.toggleConversion('op-1');
    expect(vista.seleccionConversionCount()).toBe(0);
  });

  it('«marcar convertibles» ignora las que no lo son', () => {
    vista.master.set([
      transferencia({ id: 'op-1' }),
      transferencia({ id: 'op-2', tipoOperacionCodigo: 'PAGOMASIVO_HABERES_TRABAJADOR' }),
      transferencia({ id: 'op-3' }),
    ]);

    vista.toggleTodasConvertibles();

    expect(vista.convertibles().length).toBe(2);
    expect(vista.seleccionConversionCount()).toBe(2);
    expect(vista.seleccionadasParaConvertir().map((op) => op.id)).toEqual(['op-1', 'op-3']);
  });

  it('«marcar convertibles» dos veces desmarca', () => {
    vista.master.set([transferencia({ id: 'op-1' }), transferencia({ id: 'op-2' })]);

    vista.toggleTodasConvertibles();
    vista.toggleTodasConvertibles();

    expect(vista.seleccionConversionCount()).toBe(0);
  });

  it('salir del modo LIMPIA la selección', () => {
    // Dejarla viva la reaplicaría sobre otra página o otro filtro sin que se vea en pantalla: así
    // se convierte algo que no se estaba mirando.
    vista.master.set([transferencia({ id: 'op-1' })]);
    vista.toggleModoConversion();
    vista.toggleConversion('op-1');
    expect(vista.seleccionConversionCount()).toBe(1);

    vista.toggleModoConversion();

    expect(vista.modoConversion()).toBe(false);
    expect(vista.seleccionConversionCount()).toBe(0);
  });

  // ── El clic de fila cambia de significado ────────────────────────────────

  it('en modo conversión el clic MARCA en vez de abrir el detalle', () => {
    // Abrir el detalle en cada clic obligaría a cerrarlo para seguir marcando; con un lote de
    // veinte operaciones eso es inusable.
    let detalleAbierto = false;
    vista.abrirOpDetalle = () => {
      detalleAbierto = true;
    };
    vista.master.set([transferencia({ id: 'op-1' })]);
    vista.toggleModoConversion();

    vista.onRowClick({ row: { id: 'op-1' }, index: 0 });

    expect(detalleAbierto).toBe(false);
    expect(vista.seleccionConversionCount()).toBe(1);
  });

  it('fuera del modo el clic sigue abriendo el detalle', () => {
    let abierta = '';
    vista.abrirOpDetalle = (id: string) => {
      abierta = id;
    };
    vista.master.set([transferencia({ id: 'op-1' })]);

    vista.onRowClick({ row: { id: 'op-1' }, index: 0 });

    expect(abierta).toBe('op-1');
    expect(vista.seleccionConversionCount()).toBe(0);
  });

  // ── Detalles de la confirmación ──────────────────────────────────────────

  it('la columna de marca solo aparece en modo conversión', () => {
    const sinModo = vista.columns().length;
    vista.toggleModoConversion();

    expect(vista.columns().length).toBe(sinModo + 1);
  });

  it('avisa cuando la selección mezcla monedas', () => {
    // La conversión funciona igual, pero una planilla de proveedores es de UNA moneda: sin el
    // aviso, el operador convierte veinte y descubre después que necesita dos planes.
    vista.master.set([
      transferencia({ id: 'op-1', monedaCodigo: 'PEN' }),
      transferencia({ id: 'op-2', monedaCodigo: 'USD' }),
    ]);
    vista.toggleTodasConvertibles();

    expect(vista.monedasEnConversion().sort()).toEqual(['PEN', 'USD']);
  });
});
