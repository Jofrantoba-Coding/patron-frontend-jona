// InterJSkeletonPresets.ts — JONA Contrato
// Composiciones de JSkeleton ya armadas para los esqueletos de carga mas
// habituales. No tienen estado ni eventos: solo describen la forma a simular.

/** Contrato publico de `<j-skeleton-user-row>` — avatar + dos lineas. */
export type InterJSkeletonUserRow = Record<string, never>;

/** Contrato publico de `<j-skeleton-card>` — cabecera, cuerpo y pie. */
export type InterJSkeletonCard = Record<string, never>;

/** Contrato publico de `<j-skeleton-table-rows>`. */
export interface InterJSkeletonTableRows {
  /** Filas a simular. */
  rows?: number;
  /** Columnas a simular. */
  cols?: number;
}

/** Contrato publico de `<j-skeleton-form>`. */
export interface InterJSkeletonForm {
  /** Campos a simular. */
  fields?: number;
}

export const JSKELETON_TABLE_ROWS_DEFAULTS = {
  rows: 4,
  cols: 4,
} as const satisfies Required<InterJSkeletonTableRows>;

export const JSKELETON_FORM_DEFAULTS = {
  fields: 3,
} as const satisfies Required<InterJSkeletonForm>;
