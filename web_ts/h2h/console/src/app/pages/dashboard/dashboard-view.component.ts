// dashboard-view.component.ts — JONA View del panel de control.
// Derivación pura sobre los conteos reales; la Page inyecta los datos.
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
import { FILTRO_PERIODO_SOPORTADO } from '../../core/models';
import type {
  FiltroPanel,
  MontoPorMoneda,
  PendientesPorEtapa,
  ResumenCanal,
  ResumenMontos,
} from '../../core/models';
import { NavPanelesComponent } from '../../shared/nav-paneles/nav-paneles';
import { RelojCanalComponent } from '../../shared/reloj-canal/reloj-canal';
import { RelojesJobsComponent } from '../../shared/relojes-jobs/relojes-jobs';

const NUM = new Intl.NumberFormat('es-PE');

/**
 * Las cuatro etapas, con la acción que espera cada una.
 *
 * <p>El texto dice qué hay que HACER, no cómo se llama el estado: "12 planillas
 * en estado GENERADA" obliga a traducir; "12 esperando validación" ya es la
 * instrucción.</p>
 */
const ETAPAS = [
  { clave: 'operaciones' as const, orden: 1, etapa: 'Operaciones', accion: 'sin programar', ruta: 'operaciones' },
  { clave: 'programaciones' as const, orden: 2, etapa: 'Programaciones', accion: 'abiertas, sin generar', ruta: 'programaciones' },
  { clave: 'planillas' as const, orden: 3, etapa: 'Planillas', accion: 'en preparación, sin enviar', ruta: 'planillas' },
  { clave: 'respuestas' as const, orden: 4, etapa: 'Respuestas', accion: 'recibidas, sin decidir', ruta: 'respuestas' },
];

type Tono = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'app-dashboard-view',
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
    RelojCanalComponent,
    RelojesJobsComponent,
  ],
  templateUrl: './dashboard-view.component.html',
})
export class DashboardViewComponent {
  protected readonly pendientes = signal<PendientesPorEtapa | null>(null);
  protected readonly resumen = signal<ResumenCanal | null>(null);
  protected readonly montos = signal<ResumenMontos | null>(null);

  protected readonly filtroMoneda = signal<string>('');
  protected readonly filtroTipo = signal<string>('');
  protected readonly filtroDesde = signal<string>('');
  protected readonly filtroHasta = signal<string>('');
  // Día de proceso en el banco. Va aparte del periodo de registro a propósito: son dos
  // preguntas distintas y el canal suele hacer la segunda ("qué se procesa mañana").
  protected readonly filtroProcDesde = signal<string>('');
  protected readonly filtroProcHasta = signal<string>('');

  /** Se expone al template para deshabilitar los controles de periodo. */
  protected readonly periodoSoportado = FILTRO_PERIODO_SOPORTADO;

  /**
   * Opciones de los desplegables.
   *
   * <p>Se toman de una lectura SIN filtrar que se hace una sola vez al entrar.
   * Si salieran de los datos ya filtrados, elegir PEN dejaría "PEN" como única
   * opción y no habría forma de volver atrás desde el propio control.</p>
   */
  protected readonly monedasDisponibles = signal<string[]>([]);
  protected readonly tiposDisponibles = signal<string[]>([]);

  protected readonly hayFiltro = computed(
    () =>
      !!this.filtroMoneda() ||
      !!this.filtroTipo() ||
      !!this.filtroDesde() ||
      !!this.filtroHasta() ||
      !!this.filtroProcDesde() ||
      !!this.filtroProcHasta()
  );

  protected readonly filtro = computed<FiltroPanel>(() => ({
    moneda: this.filtroMoneda() || undefined,
    tipoOperacion: this.filtroTipo() || undefined,
    fechaDesde: this.filtroDesde() || undefined,
    fechaHasta: this.filtroHasta() || undefined,
    fechaProcesoDesde: this.filtroProcDesde() || undefined,
    fechaProcesoHasta: this.filtroProcHasta() || undefined,
  }));

  /** Guarda las opciones la primera vez, antes de que ningún filtro las recorte. */
  protected registrarOpciones(m: ResumenMontos): void {
    if (this.monedasDisponibles().length > 0) return;
    this.monedasDisponibles.set(m.porMoneda.map((x) => x.moneda));
    this.tiposDisponibles.set([
      ...new Set(m.porMoneda.flatMap((x) => x.tipos.map((t) => t.tipo))),
    ]);
  }

  protected onMoneda(event: Event): void {
    this.filtroMoneda.set((event.target as HTMLSelectElement).value);
    this.recargar();
  }

  protected onTipo(event: Event): void {
    this.filtroTipo.set((event.target as HTMLSelectElement).value);
    this.recargar();
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
    this.filtroMoneda.set('');
    this.filtroTipo.set('');
    this.filtroDesde.set('');
    this.filtroHasta.set('');
    this.filtroProcDesde.set('');
    this.filtroProcHasta.set('');
    this.recargar();
  }

  /** La Page la sobrescribe: es quien tiene el servicio. */
  protected recargar(): void {}

  protected readonly num = (value: number) => NUM.format(value);

  protected readonly etapasPendientes = computed(() =>
    ETAPAS.map((e) => ({ ...e, cantidad: this.pendientes()?.[e.clave] ?? 0 }))
  );

  /** Recorrido de la operación, en el orden real de su máquina de estados. */
  protected readonly flujoOperaciones = computed(() => {
    const r = this.resumen();
    if (!r) return [];
    return [
      { estado: 'REGISTRADA', label: 'Registradas', cantidad: r.opsRegistradas, tono: 'neutral' as Tono, barra: 'bg-neutral-400' },
      { estado: 'EN_PROCESO_PAGO', label: 'En proceso de pago', cantidad: r.opsEnProceso, tono: 'primary' as Tono, barra: 'bg-primary-500' },
      { estado: 'PAGO_CONFIRMADO', label: 'Pago confirmado', cantidad: r.opsConfirmadas, tono: 'success' as Tono, barra: 'bg-success-500' },
      { estado: 'PAGO_RECHAZADO', label: 'Pago rechazado', cantidad: r.opsRechazadas, tono: 'danger' as Tono, barra: 'bg-danger-500' },
      { estado: 'ERROR', label: 'Con error', cantidad: r.opsError, tono: 'danger' as Tono, barra: 'bg-danger-500' },
    ];
  });

  protected readonly totalOperaciones = computed(() =>
    this.flujoOperaciones().reduce((suma, f) => suma + f.cantidad, 0)
  );

  protected readonly categoriasOperaciones = computed(() =>
    this.flujoOperaciones().map((f) => f.label)
  );

  /**
   * Una sola serie: el reparto de las operaciones por estado.
   *
   * <p>No se abre una serie por estado —serían cinco colores para una sola
   * magnitud—. El color categórico distingue SERIES, y aquí solo hay una: la
   * cantidad de operaciones. Las categorías se distinguen por su posición y su
   * rótulo, que es como se lee una comparación de magnitud.</p>
   */
  protected readonly serieOperaciones = computed<JChartSerie[]>(() => [
    {
      id: 'operaciones',
      nombre: 'Operaciones',
      datos: this.flujoOperaciones().map((f) => f.cantidad),
    },
  ]);

  protected readonly estadoPlanillas = computed(() => {
    const r = this.resumen();
    if (!r) return [];
    return [
      { label: 'Enviadas', cantidad: r.plaEnviadas, color: 'text-primary-600' },
      { label: 'Procesadas', cantidad: r.plaProcesadas, color: 'text-success-600' },
      { label: 'Parciales', cantidad: r.plaParciales, color: 'text-warning-600' },
      { label: 'Rechazadas', cantidad: r.plaRechazadas, color: 'text-danger-600' },
    ];
  });

  protected readonly totalPlanillasBanco = computed(() =>
    this.estadoPlanillas().reduce((suma, p) => suma + p.cantidad, 0)
  );

  /**
   * Avisos derivados, no una lista fija.
   *
   * <p>Solo aparecen cuando hay algo que los justifique y desaparecen solos al
   * resolverse. Un panel con avisos permanentes enseña a ignorarlos.</p>
   */
  protected readonly avisos = computed(() => {
    const r = this.resumen();
    const p = this.pendientes();
    const lista: { titulo: string; detalle: string; variante: 'danger' | 'warning' | 'info' }[] = [];
    if (!r) return lista;

    const conError = r.plaError + r.plaErrorCifrado;
    if (conError > 0) {
      lista.push({
        titulo: `${conError} planilla(s) con error`,
        detalle: 'No avanzarán solas: hay que revisarlas y decidir si se reintentan o se anulan.',
        variante: 'danger',
      });
    }
    if (r.opsRechazadas > 0) {
      lista.push({
        titulo: `${r.opsRechazadas} operación(es) con pago rechazado`,
        detalle: 'El banco las devolvió. Corrige los datos del beneficiario antes de volver a programarlas.',
        variante: 'danger',
      });
    }
    if ((p?.respuestas ?? 0) > 0) {
      lista.push({
        titulo: `${p?.respuestas} respuesta(s) del banco sin decidir`,
        detalle: 'Las respuestas caducan en el buzón del banco: conviene resolverlas hoy.',
        variante: 'warning',
      });
    }
    if (r.plaParciales > 0) {
      lista.push({
        titulo: `${r.plaParciales} planilla(s) procesadas parcialmente`,
        detalle: 'Parte de las líneas se pagó y parte no. Revisa cuáles quedaron fuera.',
        variante: 'warning',
      });
    }
    return lista;
  });

  /** Formatea un importe en su moneda. Sin decimales: en un panel, los céntimos son ruido. */
  protected importe(valor: number, moneda: string): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: moneda === 'USD' ? 'USD' : 'PEN',
      maximumFractionDigits: 0,
    }).format(valor);
  }

  /**
   * `GLOBAL#TIPO_OPERACION#TRANSFERENCIA_TERCEROS` → `Transferencia terceros`.
   *
   * <p>El código completo del catálogo no es una etiqueta: nadie lee un eje con
   * almohadillas y mayúsculas sostenidas.</p>
   */
  protected etiquetaTipo(codigo: string): string {
    const hoja = codigo.split('#').pop() ?? codigo;
    const texto = hoja.replace(/_/g, ' ').toLowerCase();
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  protected categoriasMontos(mon: MontoPorMoneda): string[] {
    return mon.tipos.map((t) => this.etiquetaTipo(t.tipo));
  }

  /** Una sola serie: el importe. Los tipos son categorías, no series. */
  protected serieMontos(mon: MontoPorMoneda) {
    return [{ id: 'monto', nombre: 'Importe', datos: mon.tipos.map((t) => t.monto) }];
  }

  /** El alto crece con el nº de tipos: barras tumbadas necesitan una franja cada una. */
  protected alturaMontos(mon: MontoPorMoneda): number {
    return Math.max(140, 56 + mon.tipos.length * 34);
  }

  protected porcentaje(cantidad: number, total: number): number {
    return total > 0 ? Math.round((cantidad / total) * 100) : 0;
  }

  /** La Page la sobrescribe para navegar. */
  protected irAEtapa(_ruta: string): void {}
}
