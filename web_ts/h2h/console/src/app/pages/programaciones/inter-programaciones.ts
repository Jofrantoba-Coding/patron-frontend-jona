import type { ProgramacionDetalleFull, ProgramacionFiltro, ProgramacionRow } from '../../core/models';

/**
 * Siguiente paso de un plan de envío, para leerlo desde el listado.
 *
 * <p>Mismo criterio que en Planillas: la bandeja dice qué HACER, no cómo se
 * llama el estado. Y separa lo que espera al operador de lo que espera al
 * banco, para que la lista no parezca más cargada de lo que está.</p>
 */
export const SIGUIENTE_PASO_PROGRAMACION: Record<string, string> = {
  ABIERTA: 'Añadir operaciones o generar',
  PROGRAMADA: 'Generar planilla',
  GENERADA: 'Planilla creada · seguir en Planillas',
  ENVIADA: 'Esperando al banco',
  RESPONDIDA: 'Cerrada',
  ERROR: 'Revisar error',
  CANCELADA: 'Cancelada',
};

export const siguientePasoProgramacion = (estado: string | null | undefined): string =>
  SIGUIENTE_PASO_PROGRAMACION[String(estado ?? '')] ?? '—';

/**
 * Productos que admiten elegir el flujo, y el subtipo con que se nombra su nodo de configuración.
 *
 * <p>Espeja `ResolutorModoRechazo.NODO_POR_PRODUCTO` del backend, <b>menos transferencias y
 * factoring</b>: el BCP no les ofrece el Flujo PAR y en ellos cualquier error rechaza el lote
 * completo. Que la clave sea la abreviatura del producto (`para_v_abreviatura`) no es casual: es
 * el mismo discriminador que usa el backend, así que la pantalla y el guard no pueden discrepar.</p>
 *
 * <p>`CG` está listo aunque hoy los generadores de proveedores declaren ambos el producto `P`.
 * Mientras eso siga así, un plan de cheque programado como `P` resuelve con el nodo de abono.</p>
 */
export const SUBTIPO_CON_FLUJO_PAR: Record<string, string> = {
  P: 'ABONO_PROVEEDOR',
  CG: 'CHEQUE_GERENCIA',
  H: 'HABERES',
  C: 'CTS',
};

/** Lo que la organización tiene configurado para un producto, ya aplanado por abreviatura. */
export interface FlujoRechazoProducto {
  /**
   * Si la organización PUEDE elegir parcial en este producto.
   *
   * <p>No es una preferencia: espeja un hecho del convenio con el BCP, que exige solicitud formal
   * para activar el Flujo PAR. Por eso el selector no se ofrece cuando está en `false` — mostrar
   * una opción que el backend va a rechazar con un 422 es peor que no mostrarla.</p>
   */
  habilitado: boolean;
  /** `TOTAL` | `PARCIAL`. Con qué valor nace el selector. */
  modoPorDefecto: string;
}

export const FLUJO_TOTAL = 'TOTAL';
export const FLUJO_PARCIAL = 'PARCIAL';

/** Contrato de la página de programación de envíos (listado + filtros + detalle + acciones). */
export interface ProgramacionesPageContract {
  rows: ProgramacionRow[];
  page: number;
  pageSize: number;
  total: number;
  filtros: ProgramacionFiltro;
  detalle: ProgramacionDetalleFull | null;
  detalleLoading: string | null;
}
