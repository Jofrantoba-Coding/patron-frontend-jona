// JChartImpl.ts — JONA Implementacion
//
// Motor de render PROPIO en SVG. La geometría la resuelve `core/chart` (TS puro
// y probado aparte); aquí solo se ata a las señales y a los eventos de puntero.
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { cn } from '../../core/cn';
import {
  barrasHorizontales,
  barrasVerticales,
  calcularGrafico,
  puntosSerie,
  rutaArea,
  rutaLinea,
  type PuntoXY,
} from '../../core/chart/geometria';
import { escalaBanda } from '../../core/chart/escalas';
import {
  JCHART_DEFAULTS,
  JCHART_LIMITE_SERIES,
  JCHART_MAX_SERIES,
  esApilado,
  esHorizontal,
  llevaLeyenda,
  type JChartPunto,
  type JChartSerie,
  type JChartTipo,
} from './InterJChart';
import {
  JCHART_COLOR_EJE,
  JCHART_COLOR_INK_MUTE,
  JCHART_COLOR_REJILLA,
  JCHART_COLOR_SUPERFICIE,
  JCHART_GROSOR_LINEA,
  JCHART_LEYENDA_CLASSES,
  JCHART_OPACIDAD_AREA,
  JCHART_OPACIDAD_ATENUADA,
  JCHART_RADIO_BARRA,
  JCHART_RADIO_MARCA,
  JCHART_RADIO_MARCA_HOVER,
  JCHART_RAIZ_CLASSES,
  JCHART_SEPARACION,
  JCHART_SVG_CLASSES,
  JCHART_TABLA_CLASSES,
  JCHART_TABLA_TD_CLASSES,
  JCHART_TABLA_TH_CLASSES,
  JCHART_VACIO_CLASSES,
  colorRanura,
} from './JChartStyles';

const NUM = new Intl.NumberFormat('es-PE', { maximumFractionDigits: 2 });
/** Miles y millones abreviados: en un eje, «1,2 M» se lee mejor que «1200000». */
const COMPACTO = new Intl.NumberFormat('es-PE', { notation: 'compact', maximumFractionDigits: 1 });

/**
 * JChart — gráfico del sistema de diseño, con render propio.
 *
 * <p>Las decisiones de forma están fijadas en el componente a propósito: paleta
 * por ranura, rejilla recesiva, leyenda solo con dos o más series y tabla de
 * datos siempre disponible. Son las que hacen que dos gráficos de dos pantallas
 * distintas se lean como el mismo sistema.</p>
 */
@Component({
  selector: 'j-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  templateUrl: './JChartView.html',
})
export class JChart {
  readonly tipo = input<JChartTipo>(JCHART_DEFAULTS.tipo);
  readonly series = input.required<JChartSerie[]>();
  readonly categorias = input<string[]>();
  readonly titulo = input<string>();
  readonly descripcion = input<string>();
  readonly tituloEjeY = input<string>();
  readonly unidad = input<string>();
  readonly moneda = input<string>();
  readonly alto = input<number>(JCHART_DEFAULTS.alto);
  readonly mostrarTabla = input<boolean>(JCHART_DEFAULTS.mostrarTabla);
  readonly textoVacio = input<string>(JCHART_DEFAULTS.textoVacio);
  readonly className = input<string>('');

  protected readonly svgClasses = JCHART_SVG_CLASSES;
  protected readonly vacioClasses = JCHART_VACIO_CLASSES;
  protected readonly tablaClasses = JCHART_TABLA_CLASSES;
  protected readonly tablaThClasses = JCHART_TABLA_TH_CLASSES;
  protected readonly tablaTdClasses = JCHART_TABLA_TD_CLASSES;
  protected readonly leyendaClasses = JCHART_LEYENDA_CLASSES;
  protected readonly colorRejilla = JCHART_COLOR_REJILLA;
  protected readonly colorEje = JCHART_COLOR_EJE;
  protected readonly colorInkMute = JCHART_COLOR_INK_MUTE;
  protected readonly colorSuperficie = JCHART_COLOR_SUPERFICIE;
  protected readonly grosorLinea = JCHART_GROSOR_LINEA;
  protected readonly radioMarca = JCHART_RADIO_MARCA;
  protected readonly radioMarcaHover = JCHART_RADIO_MARCA_HOVER;
  protected readonly radioBarra = JCHART_RADIO_BARRA;
  protected readonly separacion = JCHART_SEPARACION;

  private readonly contenedor = viewChild<ElementRef<HTMLElement>>('contenedor');
  /** Ancho real del contenedor. El alto lo fija el consumidor. */
  protected readonly ancho = signal(640);
  protected readonly indiceActivo = signal<number | null>(null);
  private observador: ResizeObserver | null = null;

  protected readonly raizClasses = computed(() => cn(JCHART_RAIZ_CLASSES, this.className()));
  protected readonly apilado = computed(() => esApilado(this.tipo()));
  protected readonly esBarras = computed(() => this.tipo() !== 'line' && this.tipo() !== 'area');
  /** Barras tumbadas: el eje de valores pasa a ser el X y las categorías van a la izquierda. */
  protected readonly horizontal = computed(() => esHorizontal(this.tipo()));
  protected readonly esArea = computed(() => this.tipo() === 'area');

  /** Se corta en 8 en vez de inventar un color nuevo para la novena. */
  protected readonly seriesVisibles = computed(() => {
    const s = this.series() ?? [];
    if (s.length > JCHART_MAX_SERIES) {
      console.warn(JCHART_LIMITE_SERIES, { recibidas: s.length });
      return s.slice(0, JCHART_MAX_SERIES);
    }
    return s;
  });

  protected readonly llevaLeyendaVista = computed(() => llevaLeyenda(this.seriesVisibles()));

  private readonly datos = computed(() =>
    this.seriesVisibles().map((s) => (s.datos ?? []).map((d) => valorDe(d)))
  );

  protected readonly nCategorias = computed(() =>
    Math.max(0, this.categorias()?.length ?? 0, ...this.datos().map((d) => d.length))
  );

  protected readonly vacio = computed(
    () => this.seriesVisibles().length === 0 || this.datos().every((d) => d.every((v) => v === null))
  );

  private readonly calculo = computed(() =>
    calcularGrafico({
      seriesDatos: this.datos(),
      ancho: this.ancho(),
      alto: this.alto(),
      apilado: this.apilado(),
      // Contar operaciones en medias unidades no significa nada.
      permitirDecimales: !!this.moneda(),
      horizontal: this.horizontal(),
      // Con barras tumbadas el rótulo de categoría va entero a la izquierda,
      // que es justo para lo que sirve esta forma: nombres largos legibles.
      margenIzquierdo: this.horizontal() ? this.margenCategorias() : undefined,
    })
  );

  /** Ancho reservado a los nombres de categoría, acotado para no comerse el dibujo. */
  private readonly margenCategorias = computed(() => {
    const largo = Math.max(0, ...(this.categorias() ?? []).map((c) => c.length));
    return Math.min(180, Math.max(64, largo * 7 + 16));
  });

  protected readonly area = computed(() => this.calculo().area);
  protected readonly ejeY = computed(() => this.calculo().escalaY);

  protected readonly barras = computed(() => {
    if (!this.esBarras()) return [];
    const comun = { seriesDatos: this.datos(), area: this.area(), apilado: this.apilado() };
    // Ambas devuelven el mismo `Barra`, así que el template pinta los mismos
    // <rect> sin ramificar: lo único que cambia son los ejes.
    return this.horizontal()
      ? barrasHorizontales({ ...comun, escalaX: this.ejeY() })
      : barrasVerticales({ ...comun, escalaY: this.ejeY() });
  });

  protected readonly seriesGeometria = computed(() => {
    if (this.esBarras()) return [];
    const area = this.area();
    const yBase = area.y + this.ejeY().posicion(0);
    return this.seriesVisibles().map((s, i) => {
      const puntos = puntosSerie({
        datos: this.datos()[i] ?? [],
        area,
        escalaY: this.ejeY(),
        categorias: this.nCategorias(),
      });
      return {
        id: s.id,
        indice: i,
        puntos,
        ruta: rutaLinea(puntos),
        rutaArea: rutaArea(puntos, yBase),
      };
    });
  });

  /**
   * Etiquetas de categoría que caben.
   *
   * <p>Con muchas categorías los rótulos se pisan; se muestran salteados en vez
   * de apilarse ilegibles. Un rótulo que no se lee no informa de nada.</p>
   */
  protected readonly categoriasVisibles = computed(() => {
    const n = this.nCategorias();
    const cats = this.categorias() ?? [];
    if (n === 0) return [];
    // En horizontal el reparto es vertical y cada rótulo ocupa una fila, no
    // una columna: el hueco disponible es otro.
    const porEtiqueta = this.horizontal() ? 18 : 56;
    const disponible = this.horizontal() ? this.area().alto : this.area().ancho;
    const cabe = Math.max(1, Math.floor(disponible / porEtiqueta));
    const salto = Math.max(1, Math.ceil(n / cabe));
    const out: { indice: number; etiqueta: string }[] = [];
    for (let i = 0; i < n; i += salto) out.push({ indice: i, etiqueta: cats[i] ?? String(i + 1) });
    return out;
  });

  protected readonly filasTabla = computed(() => {
    const cats = this.categorias() ?? [];
    const filas: { categoria: string; valores: string[] }[] = [];
    for (let i = 0; i < this.nCategorias(); i++) {
      filas.push({
        categoria: cats[i] ?? String(i + 1),
        valores: this.datos().map((d) => this.formatoValor(d[i] ?? null)),
      });
    }
    return filas;
  });

  /** Descripción para lectores de pantalla: qué hay dibujado, en una frase. */
  protected readonly resumenAccesible = computed(() => {
    const s = this.seriesVisibles();
    const partes = [this.titulo() ?? 'Gráfico', `${s.length} serie(s)`, `${this.nCategorias()} categorías`];
    return partes.join(', ') + '. Los datos exactos están en la tabla que acompaña al gráfico.';
  });

  protected readonly tooltipX = computed(() => {
    const i = this.indiceActivo();
    if (i === null) return 0;
    // Se acota al ancho para que no se salga por el borde derecho.
    return Math.min(Math.max(0, this.xCategoria(i) - 60), Math.max(0, this.ancho() - 160));
  });

  constructor() {
    // Se observa el CONTENEDOR y no la ventana: dentro de una rejilla o un panel
    // plegable la ventana no cambia y el gráfico se quedaría con el ancho viejo.
    queueMicrotask(() => {
      const el = this.contenedor()?.nativeElement;
      if (!el || typeof ResizeObserver === 'undefined') return;
      this.ancho.set(Math.max(240, el.clientWidth));
      this.observador = new ResizeObserver((entradas) => {
        const w = entradas[0]?.contentRect.width ?? 0;
        if (w > 0) this.ancho.set(Math.max(240, Math.round(w)));
      });
      this.observador.observe(el);
    });

    inject(DestroyRef).onDestroy(() => this.observador?.disconnect());
  }

  protected colorDe(indiceSerie: number): string {
    const s = this.seriesVisibles()[indiceSerie];
    return colorRanura(s?.ranura ?? indiceSerie + 1);
  }

  protected opacidadDe(indiceSerie: number): number {
    const hayDestacada = this.seriesVisibles().some((s) => s.destacada);
    if (!hayDestacada) return 1;
    return this.seriesVisibles()[indiceSerie]?.destacada ? 1 : JCHART_OPACIDAD_ATENUADA;
  }

  protected opacidadArea(indiceSerie: number): number {
    return JCHART_OPACIDAD_AREA * this.opacidadDe(indiceSerie);
  }

  /** Posición del eje de valores. En horizontal se mide en X. */
  protected yDe(valor: number): number {
    return this.horizontal()
      ? this.area().x + this.ejeY().posicion(valor)
      : this.area().y + this.ejeY().posicion(valor);
  }

  /** Posición de una categoría sobre el eje que le toque. */
  protected posCategoria(indice: number): number {
    const banda = escalaBanda({
      cantidad: this.nCategorias(),
      largo: this.horizontal() ? this.area().alto : this.area().ancho,
      aire: this.esBarras() ? 0.24 : 0,
    });
    return (this.horizontal() ? this.area().y : this.area().x) + banda.centro(indice);
  }

  protected xCategoria(indice: number): number {
    const banda = escalaBanda({ cantidad: this.nCategorias(), largo: this.area().ancho, aire: 0 });
    return this.area().x + banda.centro(indice);
  }

  protected etiquetaCategoria(indice: number): string {
    return this.categorias()?.[indice] ?? String(indice + 1);
  }

  protected valoresEn(indice: number) {
    return this.seriesVisibles().map((s, i) => ({
      id: s.id,
      nombre: s.nombre,
      indice: i,
      texto: this.formatoValor(this.datos()[i]?.[indice] ?? null),
    }));
  }

  protected formatoEje(valor: number): string {
    return Math.abs(valor) >= 10000 ? COMPACTO.format(valor) : NUM.format(valor);
  }

  protected formatoValor(valor: number | null): string {
    if (valor === null) return '—';
    const moneda = this.moneda() ? `${this.moneda()} ` : '';
    return `${moneda}${NUM.format(valor)}${this.unidad() ?? ''}`;
  }

  /** El puntero elige categoría por cercanía, no por acierto exacto sobre la marca. */
  protected onPuntero(event: PointerEvent): void {
    const svg = event.currentTarget as SVGSVGElement;
    const caja = svg.getBoundingClientRect();
    const escala = this.ancho() / (caja.width || 1);
    const escalaAlto = this.alto() / (caja.height || 1);
    const x = this.horizontal()
      ? (event.clientY - caja.top) * escalaAlto - this.area().y
      : (event.clientX - caja.left) * escala - this.area().x;
    const n = this.nCategorias();
    const largo = this.horizontal() ? this.area().alto : this.area().ancho;
    if (n === 0 || x < 0 || x > largo) {
      this.indiceActivo.set(null);
      return;
    }
    const paso = largo / n;
    this.indiceActivo.set(Math.min(n - 1, Math.max(0, Math.floor(x / paso))));
  }

  protected onSalir(): void {
    this.indiceActivo.set(null);
  }
}

const valorDe = (dato: number | null | JChartPunto | undefined): number | null => {
  if (dato === null || dato === undefined) return null;
  return typeof dato === 'number' ? dato : (dato.y ?? null);
};
