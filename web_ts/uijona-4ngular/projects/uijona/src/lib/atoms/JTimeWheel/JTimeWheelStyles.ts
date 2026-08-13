// JTimeWheelStyles.ts — JONA View (presentacion)
// Detalle de implementacion visual: no forma parte de la API publica.

export const JTIMEWHEEL_RAIZ_CLASSES =
  'jtimewheel relative flex select-none items-stretch justify-center gap-1 rounded-lg border border-neutral-200 bg-white px-2';

/** Banda central que marca el valor elegido. Va detras de las columnas y no captura el puntero. */
export const JTIMEWHEEL_BANDA_CLASSES =
  'pointer-events-none absolute inset-x-1 z-0 rounded-md border-y border-primary-200 bg-primary-50/70';

export const JTIMEWHEEL_COLUMNA_CLASSES =
  'jtimewheel-col relative z-10 flex-1 overflow-y-auto scroll-smooth text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset rounded-md';

export const JTIMEWHEEL_ITEM_BASE =
  'flex items-center justify-center text-sm tabular-nums transition-colors';

export const JTIMEWHEEL_ITEM_ACTIVO = 'font-bold text-neutral-900';

/** Los valores lejanos se atenúan: da la sensación de profundidad de una rueda física. */
export const JTIMEWHEEL_ITEM_CERCA = 'text-neutral-500';
export const JTIMEWHEEL_ITEM_LEJOS = 'text-neutral-300';

export const JTIMEWHEEL_SEPARADOR_CLASSES =
  'z-10 flex items-center justify-center text-sm font-bold text-neutral-400';

export const JTIMEWHEEL_DESHABILITADO_CLASSES = 'pointer-events-none opacity-50';
