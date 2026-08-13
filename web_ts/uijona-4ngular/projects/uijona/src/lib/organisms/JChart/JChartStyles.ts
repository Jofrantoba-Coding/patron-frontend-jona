// JChartStyles.ts — JONA View (presentacion)
// Constantes visuales del gráfico. Detalle de implementación: no es API pública.

export const JCHART_RAIZ_CLASSES = 'jchart flex w-full min-w-0 flex-col gap-2';
export const JCHART_SVG_CLASSES = 'jchart-svg w-full select-none overflow-visible';
export const JCHART_VACIO_CLASSES =
  'flex w-full items-center justify-center rounded-md border border-dashed border-neutral-200 p-6 text-sm text-neutral-400';
export const JCHART_TABLA_CLASSES = 'w-full border-collapse text-sm';
export const JCHART_TABLA_TH_CLASSES =
  'border-b border-neutral-200 px-2 py-1.5 text-left text-xs font-semibold text-neutral-500';
export const JCHART_TABLA_TD_CLASSES = 'border-b border-neutral-100 px-2 py-1.5 tabular-nums';
export const JCHART_LEYENDA_CLASSES = 'flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1';

/** Grosores y radios. Marca fina: engordar la línea no añade información. */
export const JCHART_GROSOR_LINEA = 2;
export const JCHART_RADIO_MARCA = 4;
export const JCHART_RADIO_MARCA_HOVER = 6;
export const JCHART_RADIO_BARRA = 4;
/** Aire entre segmentos apilados y barras contiguas: sin él, dos series se leen como una. */
export const JCHART_SEPARACION = 2;
export const JCHART_OPACIDAD_AREA = 0.18;
/** Series no destacadas cuando una serie ES el mensaje. */
export const JCHART_OPACIDAD_ATENUADA = 0.28;

/**
 * Las ocho ranuras categóricas, como referencia a los tokens.
 *
 * <p>Se devuelven como `var(--jona-chart-N)` en vez de hex resueltos para que el
 * modo oscuro —que redefine esos mismos tokens— y un cambio de marca lleguen al
 * gráfico sin recompilar ni releer estilos.</p>
 */
export const colorRanura = (ranura: number): string =>
  `rgb(var(--jona-chart-${((ranura - 1) % 8) + 1}))`;

export const JCHART_COLOR_REJILLA = 'rgb(var(--jona-chart-grid))';
export const JCHART_COLOR_EJE = 'rgb(var(--jona-chart-axis))';
export const JCHART_COLOR_INK = 'rgb(var(--jona-chart-ink))';
export const JCHART_COLOR_INK_MUTE = 'rgb(var(--jona-chart-ink-mute))';
export const JCHART_COLOR_SUPERFICIE = 'rgb(var(--jona-chart-surface))';
