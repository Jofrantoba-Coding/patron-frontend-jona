import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import type { Operacion } from '../../core/models';
// `OpcionCatalogo` lo declara la propia vista: es la forma de una opcion de `<select>`, no un modelo
// del backend.
import { ProgramacionesViewComponent, type OpcionCatalogo } from './programaciones-view.component';

/**
 * El «Tipo destino» del plan estrecha las operaciones que se ofrecen.
 *
 * <p>El producto de BCP no distingue el destino: `T` es «Transferencias» y las tres variantes
 * —interbancaria, terceros, cuenta propia— caen dentro. Quien las separa es el `tipoDestino`, que
 * antes solo viajaba como cabecera del plan y no participaba en la búsqueda: elegir INTERBANCARIA
 * listaba igualmente las de terceros.</p>
 *
 * <p>Lo que se protege es silencioso: `prg_v_tipo_destino` es columna de cabecera y el backend no la
 * contrasta con el detalle, así que un plan declarado INTERBANCARIA con una operación de terceros
 * dentro se crea sin protestar. El error sale en el TXT, en la sección equivocada, con el
 * correlativo ya gastado.</p>
 */
describe('ProgramacionesViewComponent: el tipo destino filtra las operaciones', () => {
  type Interna = {
    productosOpc: { set: (v: OpcionCatalogo[]) => void };
    nuevoIdProducto: { set: (v: string) => void };
    nuevoTipoDestino: { set: (v: string) => void; (): string };
    onNuevoTipoDestino: (e: Event) => void;
    tipoOperacionDestino: () => string | undefined;
    opsRows: { set: (v: Operacion[]) => void; (): Operacion[] };
    seleccion: { set: (v: Set<string>) => void; (): Set<string> };
    loteFiltro: { set: (v: string) => void; (): string };
  };

  let vista: Interna;

  /** Las abreviaturas son las de `BCP#TIPO_PRODUCTO`: `T` transferencias, `P` proveedores. */
  const CATALOGO: OpcionCatalogo[] = [
    { id: 1, codigo: 'BCP#TIPO_PRODUCTO#T', abreviatura: 'T', label: 'Transferencias' },
    { id: 2, codigo: 'BCP#TIPO_PRODUCTO#P', abreviatura: 'P', label: 'Pago a proveedores' },
  ] as unknown as OpcionCatalogo[];

  /** Elige producto y destino como lo haría el formulario. */
  function elegir(idProducto: string, destino: string): void {
    vista.nuevoIdProducto.set(idProducto);
    vista.nuevoTipoDestino.set(destino);
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
    const fixture = TestBed.createComponent(ProgramacionesViewComponent);
    vista = fixture.componentInstance as unknown as Interna;
    vista.productosOpc.set(CATALOGO);
  });

  it('cada destino impone su tipo de operación exacto', () => {
    // Son los códigos de `GLOBAL#TIPO_OPERACION`: el filtro de la API compara contra el tipo de
    // negocio de la operación, no contra el mapeo `BCP#MAPEO#*`.
    elegir('1', 'INTERBANCARIA');
    expect(vista.tipoOperacionDestino()).toBe('TRANSFERENCIA_INTERBANCARIA');
    elegir('1', 'TERCEROS');
    expect(vista.tipoOperacionDestino()).toBe('TRANSFERENCIA_TERCEROS');
    elegir('1', 'CUENTA_PROPIA');
    expect(vista.tipoOperacionDestino()).toBe('TRANSFERENCIA_CUENTA_PROPIA');
  });

  it('sin destino elegido no estrecha nada: el grupo entero', () => {
    // El destino es opcional en el formulario («—»). Sin él la búsqueda debe seguir ofreciendo las
    // tres variantes, que es el comportamiento de siempre.
    elegir('1', '');
    expect(vista.tipoOperacionDestino()).toBeUndefined();
  });

  it('en un producto que no es transferencias el destino no filtra', () => {
    // Ahí el campo significa otra cosa —el job lo llena con el subtipo de su rama horaria— y
    // estrechar por él dejaría la lista vacía sin explicar por qué.
    elegir('2', 'INTERBANCARIA');
    expect(vista.tipoOperacionDestino()).toBeUndefined();
  });

  it('cambiar el destino descarta lo ya marcado', () => {
    // Este es el riesgo gemelo: sin limpiar, la selección sobrevive INVISIBLE —fuera de la lista
    // nueva— y el plan se lleva operaciones del destino anterior. Producto y moneda ya lo hacían.
    elegir('1', 'INTERBANCARIA');
    vista.opsRows.set([{ id: 'op-1' }, { id: 'op-2' }] as unknown as Operacion[]);
    vista.seleccion.set(new Set(['op-1']));
    vista.loteFiltro.set('LOTE-1');

    vista.onNuevoTipoDestino({ target: { value: 'TERCEROS' } } as unknown as Event);

    expect(vista.nuevoTipoDestino()).toBe('TERCEROS');
    expect(vista.opsRows()).toEqual([]);
    expect(vista.seleccion().size).toBe(0);
    expect(vista.loteFiltro()).toBe('');
  });
});
