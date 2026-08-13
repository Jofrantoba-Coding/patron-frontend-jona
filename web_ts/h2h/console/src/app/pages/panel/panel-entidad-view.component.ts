// panel-entidad-view.component.ts — JONA View de un panel por entidad.
// Derivación pura sobre los grupos que ya vienen agregados del backend; la Page los trae.
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  JAlert,
  JCard,
  JCardContent,
  JCardDescription,
  JCardHeader,
  JCardTitle,
  JChart,
  JDatePicker,
  JSectionHeading,
  type JChartSerie,
} from 'uijona-4ngular';
import { NavPanelesComponent } from '../../shared/nav-paneles/nav-paneles';
import type { EntidadResumen, FiltroPanel, GrupoResumen } from '../../core/models';

const NUM = new Intl.NumberFormat('es-PE');

/**
 * Cómo se lee cada entidad.
 *
 * <p>Las cuatro comparten la forma —estados, cantidades, importes— pero no el vocabulario:
 * en operaciones una fila ES una operación, mientras que un plan o una planilla son
 * CONTENEDORES y tienen dos cifras distintas ("cuántos archivos" y "cuántas operaciones
 * llevan dentro"). Meterlas en la misma palabra invita a leer 1 planilla donde hay 402
 * operaciones.</p>
 */
export const VOCABULARIO: Record<
  EntidadResumen,
  { titulo: string; descripcion: string; unidad: string; unidadPlural: string; contiene: boolean; conMonto: boolean }
> = {
  operaciones: {
    titulo: 'Operaciones',
    descripcion: 'Qué hay cargado en el canal y en qué punto de su recorrido está.',
    unidad: 'operación',
    unidadPlural: 'operaciones',
    contiene: false,
    conMonto: true,
  },
  programaciones: {
    titulo: 'Programaciones',
    descripcion: 'Planes de envío por estado, con las operaciones que tienen reservadas.',
    unidad: 'plan',
    unidadPlural: 'planes',
    contiene: true,
    conMonto: true,
  },
  planillas: {
    titulo: 'Planillas',
    descripcion: 'Archivos hacia el banco por estado, con su carga de operaciones.',
    unidad: 'planilla',
    unidadPlural: 'planillas',
    contiene: true,
    conMonto: true,
  },
  respuestas: {
    titulo: 'Respuestas',
    descripcion: 'Lo que el banco devolvió, por tipo de archivo.',
    unidad: 'respuesta',
    unidadPlural: 'respuestas',
    contiene: true,
    // El banco no informa importe en la respuesta: aquí se mira conciliación, no dinero.
    conMonto: false,
  },
};

/** Importe de una moneda, ya sumado por el motor. */
export interface TotalMoneda {
  moneda: string;
  monto: number;
  cantidad: number;
}

@Component({
  selector: 'app-panel-entidad-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NavPanelesComponent,
    JSectionHeading,
    JAlert,
    JCard,
    JCardHeader,
    JCardTitle,
    JCardDescription,
    JCardContent,
    JChart,
    JDatePicker,
  ],
  templateUrl: './panel-entidad-view.component.html',
})
export class PanelEntidadViewComponent {
  protected readonly entidad = signal<EntidadResumen>('operaciones');
  protected readonly grupos = signal<GrupoResumen[]>([]);
  protected readonly cargando = signal<boolean>(true);

  /** Conciliación del banco. Solo el panel de planillas la pinta, debajo de lo suyo. */
  protected readonly gruposRespuesta = signal<GrupoResumen[]>([]);

  protected readonly filtroDesde = signal<string>('');
  protected readonly filtroHasta = signal<string>('');
  protected readonly filtroProcDesde = signal<string>('');
  protected readonly filtroProcHasta = signal<string>('');

  protected readonly voc = computed(() => VOCABULARIO[this.entidad()]);

  protected readonly hayFiltro = computed(
    () =>
      !!this.filtroDesde() ||
      !!this.filtroHasta() ||
      !!this.filtroProcDesde() ||
      !!this.filtroProcHasta()
  );

  protected readonly filtro = computed<FiltroPanel>(() => ({
    fechaDesde: this.filtroDesde() || undefined,
    fechaHasta: this.filtroHasta() || undefined,
    fechaProcesoDesde: this.filtroProcDesde() || undefined,
    fechaProcesoHasta: this.filtroProcHasta() || undefined,
  }));

  /**
   * Estados con sus cifras, sumando las monedas.
   *
   * <p>El backend devuelve una fila por estado Y moneda; para "cuántas hay en cada estado"
   * las monedas se suman, que es una cuenta de unidades y no de dinero. El dinero NO se
   * agrega aquí: vive en `importesPorMoneda`, separado por divisa.</p>
   */
  protected readonly porEstado = computed(() => {
    const acumulado = new Map<string, { cantidad: number; operaciones: number }>();
    for (const g of this.grupos()) {
      const previo = acumulado.get(g.clave) ?? { cantidad: 0, operaciones: 0 };
      acumulado.set(g.clave, {
        cantidad: previo.cantidad + g.cantidad,
        operaciones: previo.operaciones + (g.operaciones ?? 0),
      });
    }
    return [...acumulado.entries()]
      .map(([estado, cifras]) => ({ estado, ...cifras }))
      .sort((a, b) => b.cantidad - a.cantidad);
  });

  protected readonly total = computed(() =>
    this.porEstado().reduce((suma, e) => suma + e.cantidad, 0)
  );

  protected readonly totalOperaciones = computed(() =>
    this.porEstado().reduce((suma, e) => suma + e.operaciones, 0)
  );

  /**
   * Importes por moneda. Una tarjeta por divisa, nunca las dos en un mismo eje: PEN y USD
   * son unidades distintas y juntarlas invita a compararlas como si 1 fuera 1.
   */
  protected readonly importesPorMoneda = computed<TotalMoneda[]>(() => {
    const acumulado = new Map<string, TotalMoneda>();
    for (const g of this.grupos()) {
      if (g.monto === null || !g.moneda) continue;
      const previo = acumulado.get(g.moneda) ?? { moneda: g.moneda, monto: 0, cantidad: 0 };
      acumulado.set(g.moneda, {
        moneda: g.moneda,
        monto: previo.monto + g.monto,
        cantidad: previo.cantidad + g.cantidad,
      });
    }
    return [...acumulado.values()].sort((a, b) => a.moneda.localeCompare(b.moneda));
  });

  /** Desglose por estado dentro de una moneda, para el gráfico de importes. */
  protected estadosDe(moneda: string) {
    return this.grupos()
      .filter((g) => g.moneda === moneda && g.monto !== null)
      .sort((a, b) => (b.monto ?? 0) - (a.monto ?? 0));
  }

  protected categoriasImporte(moneda: string): string[] {
    return this.estadosDe(moneda).map((g) => g.clave);
  }

  protected serieImporte(moneda: string): JChartSerie[] {
    return [
      {
        id: `monto-${moneda}`,
        nombre: `Importe ${moneda}`,
        datos: this.estadosDe(moneda).map((g) => g.monto ?? 0),
      },
    ];
  }

  protected alturaImporte(moneda: string): number {
    // 34 px por barra, con un suelo para que un solo estado no quede raquítico.
    return Math.max(160, this.estadosDe(moneda).length * 34 + 60);
  }

  protected readonly categoriasEstado = computed(() => this.porEstado().map((e) => e.estado));

  protected readonly serieEstado = computed<JChartSerie[]>(() => [
    {
      id: 'cantidad',
      nombre: this.voc().titulo,
      datos: this.porEstado().map((e) => e.cantidad),
    },
  ]);

  /** Conciliación agregada de las respuestas del banco. */
  protected readonly conciliacion = computed(() => {
    let ok = 0;
    let error = 0;
    let operaciones = 0;
    let archivos = 0;
    for (const g of this.gruposRespuesta()) {
      ok += g.operacionesOk ?? 0;
      error += g.operacionesError ?? 0;
      operaciones += g.operaciones ?? 0;
      archivos += g.cantidad;
    }
    // Lo que el banco aún no ha clasificado en ninguno de los dos lados.
    return { ok, error, operaciones, archivos, sinClasificar: Math.max(0, operaciones - ok - error) };
  });

  protected readonly num = (valor: number) => NUM.format(valor);

  protected importe(monto: number, moneda: string): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: moneda === 'USD' ? 'USD' : 'PEN',
      minimumFractionDigits: 2,
    }).format(monto);
  }

  /** Porcentaje sobre el total, para la barra de reparto. 0 cuando no hay nada. */
  protected porcentaje(cantidad: number): number {
    const total = this.total();
    return total === 0 ? 0 : Math.round((cantidad / total) * 100);
  }

  // JDatePicker emite el valor ISO ya formado, no un Event del DOM.
  protected onDesde(valor: string): void {
    this.filtroDesde.set(valor);
    this.recargar();
  }
  protected onHasta(valor: string): void {
    this.filtroHasta.set(valor);
    this.recargar();
  }
  protected onProcDesde(valor: string): void {
    this.filtroProcDesde.set(valor);
    this.recargar();
  }
  protected onProcHasta(valor: string): void {
    this.filtroProcHasta.set(valor);
    this.recargar();
  }

  protected limpiarFiltros(): void {
    this.filtroDesde.set('');
    this.filtroHasta.set('');
    this.filtroProcDesde.set('');
    this.filtroProcHasta.set('');
    this.recargar();
  }

  /** La Page la sobrescribe: es quien tiene el servicio. */
  protected recargar(): void {}
}
