import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { JBadge, JButton, JCard, JCardContent, JCardHeader, JCardTitle, JDialog, JSectionHeading } from 'uijona-4ngular';
import {
  CANCELABLES,
  EJECUTABLES,
  ESTADO_EXIGIDO,
  ETIQUETA_GRUPO,
  GRUPOS_INFORME,
  type CandidatoInforme,
  type CandidatosInforme,
  type CrearInforme,
  type DetalleProgramacionInforme,
  type GrupoInforme,
  type ProgramacionInforme,
  type ResultadoEjecucion,
  ESTRATEGIAS_CONSULTA,
  ETIQUETA_ESTRATEGIA,
  type ComparacionTanda,
  type ConsultaConfigurada,
  type EstrategiaConsulta,
} from './inter-informes';
import type { CampoComparado, ComparacionCalimaco } from '../calimaco/inter-conciliacion';

const NUM = new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2 });

/**
 * Programaciones de informe al sistema de origen.
 *
 * <h3>La regla que gobierna la pantalla</h3>
 *
 * <p>Solo se pueden programar operaciones en <b>{@link ESTADO_EXIGIDO}</b>. No se ofrece nada más:
 * el backend no lo devuelve entre los candidatos, y aunque lo devolviera lo rechazaría al crear. Esta
 * pantalla no filtra por su cuenta — pinta lo que el backend declara programable, porque tener dos
 * definiciones de «programable» es cómo acaban divergiendo.</p>
 *
 * <h3>Por qué la selección es explícita</h3>
 *
 * <p>No hay «programar todo lo confirmado» de un clic. La tanda acaba mandando una llamada
 * irreversible por cada operación, y alguien tiene que haber mirado la lista. El resumen de lo
 * seleccionado —cuántas y por cuánto— está a la vista del botón por la misma razón.</p>
 */
@Component({
  selector: 'app-informes-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JCard, JCardHeader, JCardTitle, JCardContent, JBadge, JButton, JDialog],
  templateUrl: './informes-view.component.html',
})
export class InformesViewComponent {
  protected readonly GRUPOS = GRUPOS_INFORME;
  protected readonly ETIQUETA_GRUPO = ETIQUETA_GRUPO;
  protected readonly ESTADO_EXIGIDO = ESTADO_EXIGIDO;

  // ── listado ──────────────────────────────────────────────────────────────
  protected readonly programaciones = signal<ProgramacionInforme[]>([]);
  protected readonly cargando = signal(false);
  protected readonly aviso = signal<string | null>(null);
  protected readonly error = signal<string | null>(null);

  // ── armado de una tanda nueva ────────────────────────────────────────────
  protected readonly crearAbierto = signal(false);
  protected readonly candidatos = signal<CandidatosInforme | null>(null);
  protected readonly buscando = signal(false);
  protected readonly grupo = signal<GrupoInforme | ''>('');
  protected readonly moneda = signal<string>('');
  protected readonly seleccion = signal<Set<string>>(new Set());
  protected readonly creando = signal(false);
  protected readonly motivo = signal('');

  // ── detalle ──────────────────────────────────────────────────────────────
  protected readonly detalle = signal<DetalleProgramacionInforme | null>(null);
  protected readonly detalleCargando = signal<string | null>(null);
  protected readonly ejecutando = signal(false);
  protected readonly cancelando = signal(false);

  // ── El asistente ──────────────────────────────────────────────────────────
  //
  // Cuatro pasos, y el 1 vive en el diálogo de armar la tanda. Los tres de aquí son los que antes
  // estaban amontonados en una sola pantalla: se veía el detalle, un botón «Ejecutar» y nada que
  // dijera qué iba a pasar con cada operación hasta después de pulsarlo. Separar «revisar» de
  // «ejecutar» es lo que permite mirar la comparación ANTES de una llamada que en REAL no se
  // deshace.
  protected readonly PASOS = [
    { n: 1, titulo: 'Elegir' },
    { n: 2, titulo: 'Revisar' },
    { n: 3, titulo: 'Ejecutar' },
    { n: 4, titulo: 'Cierre' },
  ];

  /** 2 revisar · 3 ejecutar · 4 cierre. El 1 es el diálogo de armado. */
  protected readonly paso = signal<number>(2);

  /** La comparación de cada operación de la tanda, por `idOperacion`. */
  protected readonly comparaciones = signal<Record<string, ComparacionCalimaco>>({});
  protected readonly comparandoTodas = signal(false);
  protected readonly errorComparar = signal<string | null>(null);

  /** Con qué alcance se hizo la comparación que se está viendo, y qué trajo. */
  protected readonly ultimaComparacion = signal<ComparacionTanda | null>(null);

  /** La fila cuyo detalle campo a campo está abierto. Una a la vez: la tabla es ancha. */
  protected readonly filaAbierta = signal<string | null>(null);

  protected alternarFila(idOperacion: string): void {
    this.filaAbierta.update((actual) => (actual === idOperacion ? null : idOperacion));
  }

  /** Los campos comparados de una fila, para pintarlos uno debajo de otro. */
  protected camposDe(idOperacion: string): CampoComparado[] {
    const comparacion = this.comparaciones()[idOperacion];
    return (comparacion?.campos ?? []) as CampoComparado[];
  }

  /** Resultado de la ejecución, para el paso de cierre. */
  protected readonly resultado = signal<ResultadoEjecucion | null>(null);

  // ── Con qué alcance se pregunta ───────────────────────────────────────────
  //
  // Las dos formas NO dan lo mismo, y por eso se elige aquí y no solo en la configuración:
  //
  //   OPERACION  una consulta por cada identificador. Sin rango, sin estado y sin banco: encuentra
  //              el pago aunque sea de hace semanas. Cuesta N llamadas.
  //   FECHAS     un barrido por moneda. Una llamada, pero el reporte filtra además por estado de
  //              partida y por banco — es lo que ve el job, y lo que explica que dé «ausente».
  //
  // Arranca en lo que tenga configurado la organización (CALIMACO#API#CONSULTA) y se puede cambiar
  // para una revisión o una ejecución concretas: comparar por las dos es la forma de entender por
  // qué el job no informa algo que a mano sí cuadra.
  protected readonly ESTRATEGIAS = ESTRATEGIAS_CONSULTA;
  protected readonly ETIQUETA_ESTRATEGIA = ETIQUETA_ESTRATEGIA;

  protected readonly estrategia = signal<EstrategiaConsulta>('OPERACION');
  protected readonly consultaConfigurada = signal<ConsultaConfigurada | null>(null);
  protected readonly ventanaDesde = signal('');
  protected readonly ventanaHasta = signal('');

  /** La configurada llega de la API; solo se adopta si el operador no ha elegido otra cosa. */
  protected setConsultaConfigurada(config: ConsultaConfigurada): void {
    this.consultaConfigurada.set(config);
    this.estrategia.set(config.estrategia);
    if (config.estrategia === 'FECHAS' && !this.ventanaDesde()) {
      this.proponerVentana(config.diasVentana);
    }
  }

  protected onEstrategia(evento: Event): void {
    const valor = (evento.target as HTMLSelectElement).value as EstrategiaConsulta;
    this.estrategia.set(valor);
    if (valor === 'FECHAS' && !this.ventanaDesde()) {
      this.proponerVentana(this.consultaConfigurada()?.diasVentana ?? 7);
    }
  }

  /**
   * Propone la ventana hacia atrás.
   *
   * <p>No es un capricho: el caso que trae a alguien a mirar esto a mano es una operación cuyo pago
   * en el origen es de días atrás, y la ventana que arma el job —anclada a NUESTRAS fechas— no lo
   * alcanza. Proponerla vacía obligaría a adivinar el formato.</p>
   */
  private proponerVentana(dias: number): void {
    this.ventanaDesde.set(this.selloDeReloj(-Math.abs(dias || 7)));
    this.ventanaHasta.set(this.selloDeReloj(0));
  }

  protected onVentanaDesde(evento: Event): void {
    this.ventanaDesde.set((evento.target as HTMLInputElement).value);
  }

  protected onVentanaHasta(evento: Event): void {
    this.ventanaHasta.set((evento.target as HTMLInputElement).value);
  }

  /** ¿La estrategia elegida difiere de la configurada? Se dice, para que no parezca lo normal. */
  protected readonly estrategiaCambiada = computed(() => {
    const config = this.consultaConfigurada();
    return !!config && config.estrategia !== this.estrategia();
  });

  /** `yyyy-MM-dd HH:mm:ss` desplazado N días, que es el formato que espera su reporte. */
  private selloDeReloj(dias: number): string {
    const d = new Date();
    d.setDate(d.getDate() + dias);
    const dos = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`
      + ` ${dos(d.getHours())}:${dos(d.getMinutes())}:${dos(d.getSeconds())}`;
  }

  /** La ventana solo viaja con FECHAS y completa: media ventana no es una ventana. */
  protected ventanaPedida(): { desde: string; hasta: string } | null {
    if (this.estrategia() !== 'FECHAS') return null;
    const desde = this.ventanaDesde().trim();
    const hasta = this.ventanaHasta().trim();
    return desde && hasta ? { desde, hasta } : null;
  }

  protected irAlPaso(n: number): void {
    this.paso.set(n);
  }

  /** La comparación ya hecha de una fila, si la hay. */
  protected comparacionDe(idOperacion: string): ComparacionCalimaco | null {
    return this.comparaciones()[idOperacion] ?? null;
  }

  /** Cuántas de las comparadas cuadran. Es el resumen que decide si merece la pena ejecutar. */
  protected readonly resumenComparacion = computed(() => {
    const hechas = Object.values(this.comparaciones());
    return {
      hechas: hechas.length,
      cuadran: hechas.filter((c) => c.coincide).length,
      yaAplicados: hechas.filter((c) => c.yaAplicado).length,
    };
  });

  protected setProgramaciones(lista: ProgramacionInforme[]): void {
    this.programaciones.set(lista);
    this.cargando.set(false);
  }

  protected setCandidatos(datos: CandidatosInforme): void {
    this.candidatos.set(datos);
    this.buscando.set(false);
    // La selección se limpia al cambiar la búsqueda: mantener marcadas operaciones que ya no están
    // en la lista mandaría al backend ids que el operador no está viendo.
    this.seleccion.set(new Set());
  }

  /**
   * En qué paso se abre una tanda.
   *
   * <p>Una que ya se ejecutó se abre en el cierre —lo que interesa es el desenlace, no volver a
   * revisar— y una que no, en revisar. Abrir siempre en el paso 2 obligaría a pasar por dos
   * pantallas para leer un resultado.</p>
   */
  protected pasoInicial(datos: DetalleProgramacionInforme): number {
    const cabecera = datos.cabecera;
    const ejecutada = !!cabecera.ejecutado || cabecera.informadas > 0 || cabecera.fallidas > 0;
    return ejecutada ? 4 : 2;
  }

  protected setDetalle(datos: DetalleProgramacionInforme | null): void {
    this.detalle.set(datos);
    this.detalleCargando.set(null);
    this.ejecutando.set(false);
    this.cancelando.set(false);
    if (datos) {
      this.paso.set(this.pasoInicial(datos));
      // La comparación es de OTRA tanda: enseñarla junto a estas operaciones sería mentir.
      this.comparaciones.set({});
      this.ultimaComparacion.set(null);
      this.filaAbierta.set(null);
    } else {
      // Cerrar el asistente lo deja limpio: heredar las comparaciones de la tanda anterior sería
      // enseñar el veredicto de otras operaciones junto a las de esta.
      this.comparaciones.set({});
      this.resultado.set(null);
      this.errorComparar.set(null);
      this.paso.set(2);
    }
  }

  /** La Page la sobrescribe: compara cada operación de la tanda SIN informar nada. */
  protected compararTodas(): void {}

  protected setComparacion(idOperacion: string, comparacion: ComparacionCalimaco): void {
    this.comparaciones.update((previas) => ({ ...previas, [idOperacion]: comparacion }));
  }

  // ── selección ────────────────────────────────────────────────────────────
  protected seleccionada(id: string): boolean {
    return this.seleccion().has(id);
  }

  protected alternar(id: string): void {
    this.seleccion.update((actual) => {
      const copia = new Set(actual);
      if (!copia.delete(id)) {
        copia.add(id);
      }
      return copia;
    });
  }

  protected todasSeleccionadas = computed(() => {
    const items = this.candidatos()?.items ?? [];
    return items.length > 0 && items.every((o) => this.seleccion().has(o.id));
  });

  /**
   * Marca o desmarca lo que está a la vista.
   *
   * <p>Solo lo listado, nunca «todo lo que existe»: si la búsqueda vino truncada, hay candidatos que
   * el operador no ha visto, y seleccionar a ciegas es justo lo que esta pantalla evita.</p>
   */
  protected alternarTodas(): void {
    const items = this.candidatos()?.items ?? [];
    this.seleccion.set(this.todasSeleccionadas() ? new Set() : new Set(items.map((o) => o.id)));
  }

  protected readonly seleccionadas = computed(() => this.seleccion().size);

  protected readonly montoSeleccionado = computed(() => {
    const items = this.candidatos()?.items ?? [];
    let total = 0;
    for (const o of items) {
      if (this.seleccion().has(o.id)) {
        total += Number(o.monto ?? 0);
      }
    }
    return total;
  });

  /** Monedas distintas en lo seleccionado. Ver {@link avisoMonedas}. */
  protected readonly monedasSeleccionadas = computed(() => {
    const monedas = new Set<string>();
    for (const o of this.candidatos()?.items ?? []) {
      if (this.seleccion().has(o.id) && o.moneda) {
        monedas.add(o.moneda);
      }
    }
    return [...monedas];
  });

  /**
   * Avisa si se mezclan monedas, sin impedirlo.
   *
   * <p>El total de la tanda deja de significar algo cuando suma soles con dólares. No se bloquea
   * porque informar al origen no mueve dinero —solo cambia un estado— y una tanda mixta es legítima;
   * lo que no vale es que el número de arriba engañe.</p>
   */
  protected readonly avisoMonedas = computed<string | null>(() => {
    const monedas = this.monedasSeleccionadas();
    return monedas.length > 1
      ? `Hay ${monedas.length} monedas mezcladas (${monedas.join(', ')}): el total sumado no`
        + ' significa nada.'
      : null;
  });

  protected readonly motivoNoCrear = computed<string | null>(() => {
    if (this.seleccionadas() === 0) return 'Seleccione al menos una operación.';
    return null;
  });

  protected formato(valor: number | string | null | undefined): string {
    const numero = Number(valor ?? 0);
    return Number.isFinite(numero) ? NUM.format(numero) : '—';
  }

  // ── acciones sobre una tanda ─────────────────────────────────────────────
  /**
   * Por qué NO se puede ejecutar, o `null`.
   *
   * <p>Comprobación optimista: la autoridad es el backend. Devuelve texto y no un booleano porque el
   * bloqueo hay que explicarlo — «no veo el botón» no dice nada.</p>
   */
  protected readonly bloqueoEjecutar = computed<string | null>(() => {
    const c = this.detalle()?.cabecera;
    if (!c) return null;
    if (c.estado === 'CANCELADA') return 'la programación está cancelada.';
    if (c.estado === 'INFORMADA') return 'ya se informó por completo.';
    if (!EJECUTABLES.includes(c.estado)) return `su estado es ${c.estado}.`;
    if (c.totalOperaciones === 0) return 'no tiene operaciones.';
    return null;
  });

  protected readonly bloqueoCancelar = computed<string | null>(() => {
    const c = this.detalle()?.cabecera;
    if (!c) return null;
    if (c.ejecutado) {
      // Cancelar algo ya enviado no deshace el aviso, y dejarlo como CANCELADA mentiría sobre lo
      // que ocurrió en el origen.
      return 'ya se ejecutó: cancelarla no desharía los avisos que salieron.';
    }
    if (!CANCELABLES.includes(c.estado)) return `su estado es ${c.estado}.`;
    return null;
  });

  /** Lo que va a pasar de verdad al ejecutar, cruzando el modo con el estado. */
  protected readonly efectoEjecutar = computed<string>(() => {
    const c = this.detalle()?.cabecera;
    if (!c) return '';
    const modo = c.modoIntegracion ?? 'OFFLINE';
    if (modo === 'REAL') {
      return 'En REAL cada operación que cuadre se marcará como pagada en el origen. Es'
        + ' irreversible.';
    }
    return `En ${modo} se recorre todo el flujo —comparación incluida— pero no sale ningún cambio de`
      + ' estado, así que ninguna operación avanzará.';
  });

  /** Filas del detalle que aún no se han informado. Lo que queda por hacer. */
  protected readonly pendientes = computed(
    () => (this.detalle()?.detalles ?? []).filter(
      (d) => d.estado !== 'INFORMADO' && d.estado !== 'SIN_ENVIAR'
    ).length
  );

  protected onGrupo(evento: Event): void {
    this.grupo.set((evento.target as HTMLSelectElement).value as GrupoInforme | '');
  }

  protected onMoneda(evento: Event): void {
    this.moneda.set((evento.target as HTMLSelectElement).value);
  }

  protected onMotivo(evento: Event): void {
    this.motivo.set((evento.target as HTMLInputElement).value);
  }

  protected abrirCrear(): void {
    this.crearAbierto.set(true);
    this.candidatos.set(null);
    this.seleccion.set(new Set());
    this.motivo.set('');
    this.buscarCandidatos();
  }

  protected cerrarCrear(): void {
    this.crearAbierto.set(false);
    this.candidatos.set(null);
    this.seleccion.set(new Set());
  }

  protected onCrear(): void {
    if (this.motivoNoCrear()) return;
    const valor: CrearInforme = {
      operaciones: [...this.seleccion()],
      grupo: this.grupo() || null,
      moneda: this.moneda() || null,
      motivo: this.motivo().trim() || null,
    };
    this.crear(valor);
  }

  protected candidatoTexto(o: CandidatoInforme): string {
    return [o.codigoOperacion, o.titular, o.cuenta].filter(Boolean).join(' · ');
  }

  /** La Page sobrescribe estos hooks. */
  protected recargar(): void {}
  protected buscarCandidatos(): void {}
  protected crear(_valor: CrearInforme): void {}
  protected abrirDetalle(_id: string): void {}
  protected cerrarDetalle(): void {
    this.setDetalle(null);
  }
  protected ejecutar(): void {}
  protected cancelar(): void {}
}
