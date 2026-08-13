// InterJChart.ts — JONA Contrato
//
// Contrato AGNÓSTICO DEL MOTOR. Aquí no se importa Highcharts ni ninguna otra
// librería de gráficos: si mañana se cambia el motor, este archivo no se toca y
// ningún consumidor se entera. Es la misma regla que rige al resto del sistema
// —el contrato no conoce la implementación—, aplicada al vendor.

/**
 * Formas soportadas, elegidas por el TRABAJO que hace el lector, no por el
 * catálogo del motor.
 *
 * <p>No hay tarta ni dona a propósito: comparar ángulos es peor que comparar
 * longitudes, y para parte-de-todo la barra apilada gana siempre. Para una sola
 * proporción contra un límite, un medidor; para un único número, una cifra
 * grande, no un gráfico de una barra.</p>
 */
export type JChartTipo =
  /** Tendencia en el tiempo. */
  | 'line'
  /** Tendencia de una sola serie (el relleno sugiere acumulación). */
  | 'area'
  /** Magnitud por categoría, barras verticales. */
  | 'column'
  /** Magnitud por categoría, barras horizontales: mejor con nombres largos o muchas categorías. */
  | 'bar'
  /** Parte-de-todo por categoría. */
  | 'column-stacked'
  | 'bar-stacked';

export interface JChartPunto {
  /** Categoría o marca de tiempo ISO. */
  x: string | number;
  y: number | null;
}

export interface JChartSerie {
  /** Identidad estable de la serie. El color se ata a esto, nunca a su posición en el ranking. */
  id: string;
  nombre: string;
  datos: (number | null)[] | JChartPunto[];
  /**
   * Ranura de color (1-8). Si se omite se asigna por orden de aparición.
   * Fijarla explícitamente evita que al filtrar series las supervivientes
   * cambien de color.
   */
  ranura?: number;
  /** Resalta esta serie y atenúa el resto: para cuando una serie ES el mensaje. */
  destacada?: boolean;
}

/** Contrato publico de JChart. */
export interface InterJChart {
  tipo?: JChartTipo;
  series: JChartSerie[];
  /** Etiquetas del eje de categorías. Con series de puntos {x,y} no hace falta. */
  categorias?: string[];
  /** Título del gráfico. Con una sola serie hace de leyenda: por eso no se pinta leyenda. */
  titulo?: string;
  descripcion?: string;
  /** Rótulo del eje de valores. El de categorías rara vez aporta algo. */
  tituloEjeY?: string;
  /** Sufijo de unidad para los valores (`%`, ` ops`). */
  unidad?: string;
  /** Alto en píxeles. El ancho siempre es el del contenedor. */
  alto?: number;
  /** Prefijo de moneda para formatear los valores (`S/`, `US$`). */
  moneda?: string;
  /** Muestra la tabla de datos bajo el gráfico. Ver la nota de accesibilidad. */
  mostrarTabla?: boolean;
  /** Texto cuando no hay series o todas vienen vacías. */
  textoVacio?: string;
}

export const JCHART_DEFAULTS = {
  tipo: 'column',
  alto: 320,
  mostrarTabla: false,
  textoVacio: 'Sin datos para el periodo seleccionado.',
} as const satisfies Required<Pick<InterJChart, 'tipo' | 'alto' | 'mostrarTabla' | 'textoVacio'>>;

/** Documentación de cada forma: para qué sirve y cuándo NO usarla. */
export const JCHART_TIPOS: Record<JChartTipo, string> = {
  line: 'Tendencia en el tiempo, varias series. Con una sola, valora `area`.',
  area: 'Tendencia de una serie. Con varias, el solapamiento esconde datos: usa `line`.',
  column: 'Magnitud por categoría. Hasta ~12 categorías con nombres cortos.',
  bar: 'Magnitud por categoría en horizontal. Mejor con nombres largos o muchas categorías.',
  'column-stacked': 'Parte-de-todo por categoría, en vertical.',
  'bar-stacked': 'Parte-de-todo por categoría, en horizontal.',
};

/** Nº máximo de series con color propio. Ver `JCHART_LIMITE_SERIES`. */
export const JCHART_MAX_SERIES = 8;

/**
 * Por qué el tope es 8 y qué hacer al pasarse.
 *
 * <p>La paleta categórica tiene ocho ranuras validadas. Una novena serie no
 * genera un color nuevo —sería indistinguible de alguno de los ocho, sobre todo
 * con daltonismo—: hay que agrupar la cola en «Otros», pasar a múltiplos
 * pequeños o cambiar de forma. El componente avisa en consola y pinta solo las
 * ocho primeras en vez de inventar color.</p>
 */
export const JCHART_LIMITE_SERIES =
  'JChart: más de 8 series. La paleta tiene 8 ranuras validadas y una novena sería ' +
  'indistinguible. Agrupa la cola en «Otros», usa múltiplos pequeños o una tabla.';

/** ¿Lleva leyenda? Con una sola serie, el título ya la nombra. */
export const llevaLeyenda = (series: JChartSerie[]): boolean => series.length >= 2;

/**
 * ¿Se pueden etiquetar los puntos directamente?
 *
 * <p>Con pocas series el rótulo junto a la marca ahorra el viaje a la leyenda.
 * Con muchas, los rótulos se pisan y estorban más de lo que ayudan.</p>
 */
export const admiteEtiquetasDirectas = (series: JChartSerie[]): boolean =>
  series.length > 0 && series.length <= 4;

export const esApilado = (tipo: JChartTipo): boolean => tipo.endsWith('-stacked');

export const esHorizontal = (tipo: JChartTipo): boolean => tipo.startsWith('bar');
