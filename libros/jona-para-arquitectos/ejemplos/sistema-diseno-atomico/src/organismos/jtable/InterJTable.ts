// Contrato de UI de la tabla: un organismo genérico. No conoce productos ni pedidos:
// recibe filas de cualquier tipo y cómo dibujar cada celda.
import type { ReactNode } from 'react';

export interface JTableColumn<Row> {
  id: string;
  header: string;
  cell: (row: Row) => ReactNode;
  /** Alineación: `end` para números e importes. */
  align?: 'start' | 'end';
}

export interface JTableAction<Row> {
  id: string;
  /** Texto visible del botón, igual en todas las filas: «Editar». */
  label: string;
  /** Nombre accesible por fila: «Editar Teclado». */
  accessibleLabel: (row: Row) => string;
  onAction: (row: Row) => void;
}

export interface InterJTable<Row> {
  /** Título de la tabla para las tecnologías de asistencia. */
  caption: string;
  columns: readonly JTableColumn<Row>[];
  rows: readonly Row[];
  rowKey: (row: Row) => string;
  actions?: readonly JTableAction<Row>[];
  /** Mientras carga, la tabla se marca como ocupada y muestra el mensaje de carga. */
  busy?: boolean;
  emptyMessage?: string;
  busyMessage?: string;
}

/** Solo textos de presentación; las filas y `busy` son estado y no tienen default. */
export const JTABLE_DEFAULTS = {
  emptyMessage: 'No hay elementos',
  busyMessage: 'Cargando…',
} as const satisfies Required<Pick<InterJTable<unknown>, 'emptyMessage' | 'busyMessage'>>;
