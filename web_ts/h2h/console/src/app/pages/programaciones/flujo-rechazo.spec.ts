import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { FLUJO_PARCIAL, FLUJO_TOTAL, type FlujoRechazoProducto } from './inter-programaciones';
import { ProgramacionesViewComponent } from './programaciones-view.component';

/**
 * Selector del flujo con el que el BANCO trata los errores del lote.
 *
 * <p>Lo que estas pruebas protegen es que <b>el flujo TOTAL siga siendo lo que pasa por defecto</b>.
 * El selector es un incremento: sin configuración, con el servicio de jobs caído, o en un producto
 * al que el BCP no le ofrece el Flujo PAR, la pantalla se comporta exactamente como antes de que
 * esto existiera. Si alguna de estas se pone roja, el incremento dejó de ser aditivo.</p>
 *
 * <p>La View aplica aquí la misma regla que el guard del backend —parcial exige producto soportado
 * <i>y</i> organización habilitada— no para sustituir su validación, que sigue mandando, sino para
 * no ofrecer una opción que volvería con un 422.</p>
 */
describe('ProgramacionesViewComponent: flujo de rechazo del banco', () => {
  /** Acceso a lo protegido: es una View JONA, su estado no es API pública. */
  type Interna = {
    nuevoIdProducto: { set: (v: string) => void; (): string };
    nuevoModoRechazo: { set: (v: string) => void; (): string };
    productosOpc: { set: (v: unknown[]) => void };
    onNuevoIdProducto: (e: Event) => void;
    onNuevoModoRechazo: (e: Event) => void;
    setFlujoPorProducto: (m: Record<string, FlujoRechazoProducto>) => void;
    modoRechazoSoportado: () => boolean;
    modoRechazoDisponible: () => boolean;
    modoRechazoApagado: () => boolean;
  };

  let vista: Interna;

  /** Catálogo mínimo: el formulario resuelve la abreviatura del producto desde estas opciones. */
  const PRODUCTOS = [
    { id: 1, codigo: 'BCP#TIPO_PRODUCTO#P', abreviatura: 'P', descripcion: 'Proveedores' },
    { id: 2, codigo: 'BCP#TIPO_PRODUCTO#CG', abreviatura: 'CG', descripcion: 'Cheque gerencia' },
    { id: 3, codigo: 'BCP#TIPO_PRODUCTO#T', abreviatura: 'T', descripcion: 'Transferencias' },
    { id: 4, codigo: 'BCP#TIPO_PRODUCTO#FA', abreviatura: 'FA', descripcion: 'Factoring' },
    { id: 5, codigo: 'BCP#TIPO_PRODUCTO#H', abreviatura: 'H', descripcion: 'Haberes' },
  ];

  function seleccion(valor: string): Event {
    return { target: { value: valor } } as unknown as Event;
  }

  function elegirProducto(id: number): void {
    vista.onNuevoIdProducto(seleccion(String(id)));
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
    const fixture = TestBed.createComponent(ProgramacionesViewComponent);
    vista = fixture.componentInstance as unknown as Interna;
    vista.productosOpc.set(PRODUCTOS);
  });

  // ── lo que garantiza que TOTAL siga funcionando ──────────────────────────

  it('sin configuracion el selector NO se ofrece y el plan sale en TOTAL', () => {
    // Es el estado de toda organizacion hasta que alguien active el Flujo PAR en el banco.
    vista.setFlujoPorProducto({});
    elegirProducto(1);

    expect(vista.modoRechazoSoportado()).toBe(true);
    expect(vista.modoRechazoDisponible()).toBe(false);
    expect(vista.nuevoModoRechazo()).toBe(FLUJO_TOTAL);
  });

  it('si el servicio de jobs no responde, tampoco se ofrece', () => {
    // La Page inyecta un mapa vacio ante error. Degradacion segura, no pantalla rota.
    elegirProducto(1);
    vista.setFlujoPorProducto({});

    expect(vista.modoRechazoDisponible()).toBe(false);
    expect(vista.nuevoModoRechazo()).toBe(FLUJO_TOTAL);
  });

  it('transferencias y factoring NO admiten el selector: ni soportado ni explicado', () => {
    // El BCP no les ofrece Flujo PAR: cualquier error rechaza el lote completo. El bloque
    // desaparece entero, no se muestra apagado, porque no hay nada que la empresa pueda activar.
    vista.setFlujoPorProducto({
      P: { habilitado: true, modoPorDefecto: FLUJO_PARCIAL },
      T: { habilitado: true, modoPorDefecto: FLUJO_PARCIAL },
    });

    elegirProducto(3);
    expect(vista.modoRechazoSoportado()).toBe(false);
    expect(vista.modoRechazoDisponible()).toBe(false);
    expect(vista.modoRechazoApagado()).toBe(false);

    elegirProducto(4);
    expect(vista.modoRechazoSoportado()).toBe(false);
    expect(vista.modoRechazoApagado()).toBe(false);
  });

  // ── cuando si se ofrece ──────────────────────────────────────────────────

  it('con el producto habilitado el selector nace con el defecto de la organizacion', () => {
    vista.setFlujoPorProducto({ P: { habilitado: true, modoPorDefecto: FLUJO_PARCIAL } });
    elegirProducto(1);

    expect(vista.modoRechazoDisponible()).toBe(true);
    expect(vista.nuevoModoRechazo()).toBe(FLUJO_PARCIAL);
  });

  it('habilitado con defecto TOTAL ofrece el selector pero no preselecciona parcial', () => {
    // Es la combinacion con la que nace la configuracion: se PUEDE elegir, pero automatico sigue
    // en TOTAL hasta que haya confianza.
    vista.setFlujoPorProducto({ P: { habilitado: true, modoPorDefecto: FLUJO_TOTAL } });
    elegirProducto(1);

    expect(vista.modoRechazoDisponible()).toBe(true);
    expect(vista.nuevoModoRechazo()).toBe(FLUJO_TOTAL);
  });

  it('un producto soportado pero apagado se EXPLICA en vez de ocultarse', () => {
    // Ocultarlo dejaria al operador sin saber que la opcion existe y que puede pedirla.
    vista.setFlujoPorProducto({ P: { habilitado: false, modoPorDefecto: FLUJO_TOTAL } });
    elegirProducto(1);

    expect(vista.modoRechazoSoportado()).toBe(true);
    expect(vista.modoRechazoDisponible()).toBe(false);
    expect(vista.modoRechazoApagado()).toBe(true);
  });

  // ── cambiar de producto ──────────────────────────────────────────────────

  it('cambiar de producto NO arrastra el flujo del anterior', () => {
    // Sin esto, elegir PARCIAL en proveedores y luego cambiar a haberes dejaria un PARCIAL que
    // nadie eligio para haberes — y que el guard del backend rechazaria con un 422.
    vista.setFlujoPorProducto({
      P: { habilitado: true, modoPorDefecto: FLUJO_PARCIAL },
      H: { habilitado: false, modoPorDefecto: FLUJO_TOTAL },
    });

    elegirProducto(1);
    expect(vista.nuevoModoRechazo()).toBe(FLUJO_PARCIAL);

    elegirProducto(5);
    expect(vista.modoRechazoDisponible()).toBe(false);
    expect(vista.nuevoModoRechazo()).toBe(FLUJO_TOTAL);
  });

  it('cheque de gerencia se configura por separado de abono a proveedores', () => {
    vista.setFlujoPorProducto({
      P: { habilitado: false, modoPorDefecto: FLUJO_TOTAL },
      CG: { habilitado: true, modoPorDefecto: FLUJO_PARCIAL },
    });

    elegirProducto(1);
    expect(vista.modoRechazoDisponible()).toBe(false);

    elegirProducto(2);
    expect(vista.modoRechazoDisponible()).toBe(true);
    expect(vista.nuevoModoRechazo()).toBe(FLUJO_PARCIAL);
  });

  it('el operador puede cambiar el flujo a mano sobre el defecto', () => {
    vista.setFlujoPorProducto({ P: { habilitado: true, modoPorDefecto: FLUJO_TOTAL } });
    elegirProducto(1);

    vista.onNuevoModoRechazo(seleccion(FLUJO_PARCIAL));
    expect(vista.nuevoModoRechazo()).toBe(FLUJO_PARCIAL);

    vista.onNuevoModoRechazo(seleccion(FLUJO_TOTAL));
    expect(vista.nuevoModoRechazo()).toBe(FLUJO_TOTAL);
  });
});
