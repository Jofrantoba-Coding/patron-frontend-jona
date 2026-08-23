import type { ComparacionCalimaco } from '../calimaco/inter-conciliacion';

/**
 * Contratos de las programaciones de informe al sistema de origen.
 *
 * <p>Una programación es una **tanda** de operaciones que se van a informar juntas. Existe para que
 * la trazabilidad sea la misma la pida una persona o la pida el scheduler, y para poder responder
 * «qué se informó el martes, con qué criterio y quién lo pidió».</p>
 *
 * <p>Endpoints en `api/mantenimientos/h2h/v1/informes/*`.</p>
 */

/** Los dos grupos que se pueden programar. */
export const GRUPOS_INFORME = ['transferencias', 'pagos_masivos'] as const;
export type GrupoInforme = (typeof GRUPOS_INFORME)[number];

export const ETIQUETA_GRUPO: Record<GrupoInforme, string> = {
  transferencias: 'Transferencias',
  pagos_masivos: 'Pagos masivos',
};

/**
 * El único estado desde el que se puede informar.
 *
 * <p>Antes de esto el banco todavía puede rechazar el pago, y decirle al casino que se pagó algo que
 * luego se devuelve es peor que no decir nada: el jugador ve su dinero acreditado y no lo está.</p>
 */
export const ESTADO_EXIGIDO = 'PAGO_CONFIRMADO';

/** Una operación que se puede programar. */
export interface CandidatoInforme {
  id: string;
  codigoOperacion?: string | null;
  /** El identificador del origen (`1.3572384016`). Sin él no hay con qué buscarla allí. */
  codigoExterno?: string | null;
  referenciaOrigen?: string | null;
  monto?: number | string | null;
  moneda?: string | null;
  tipoOperacion?: string | null;
  fechaOperacion?: string | null;
  titular?: string | null;
  cuenta?: string | null;
}

export interface CandidatosInforme {
  items: CandidatoInforme[];
  total: number;
  montoTotal?: number | string | null;
  /**
   * Si se llegó al tope de candidatos que el backend devuelve de una vez.
   *
   * <p>Se muestra: «500 candidatos» y «500 o más» no son lo mismo, y sin avisarlo alguien creería
   * que ya no queda nada por programar.</p>
   */
  truncado?: boolean;
}

/** Cabecera de una tanda. */
export interface ProgramacionInforme {
  id: string;
  codigo: string;
  sistema?: string | null;
  /** ABIERTA | PROGRAMADA | EN_PROCESO | INFORMADA | PARCIAL | ERROR | CANCELADA */
  estado: string;
  /** MANUAL | AUTOMATICO: quién la originó. */
  modoEnvio?: string | null;
  /**
   * OFFLINE | SIMULACION | REAL en el momento de ejecutar.
   *
   * <p>No es informativo: una tanda en SIMULACIÓN **no cambió nada** en el origen, y sin este dato
   * sería indistinguible de una de verdad.</p>
   */
  modoIntegracion?: string | null;
  fechaProceso?: string | null;
  programado?: string | null;
  ejecutado?: string | null;
  totalOperaciones: number;
  /** Las verificadas releyendo el pago. Que el origen acepte la petición es otra cosa. */
  informadas: number;
  fallidas: number;
  montoTotal?: number | string | null;
  usuario?: string | null;
  usuarioEjecucion?: string | null;
  motivo?: string | null;
  /** Con qué criterio se armó, congelado. */
  criterio?: Record<string, unknown> | null;
}

/** Una operación dentro de la tanda, con su desenlace. */
export interface DetalleInforme {
  id: string;
  secuencial: number;
  idOperacion: string;
  codigoOperacion?: string | null;
  identificador?: string | null;
  monto?: number | string | null;
  moneda?: string | null;
  /** PLANIFICADO | COMPARADO | NO_COINCIDE | ENVIADO | INFORMADO | SIN_ENVIAR | ERROR | EXCLUIDO */
  estado: string;
  estadoPrevioOrigen?: string | null;
  /** La evidencia de la relectura: en qué estado quedó el pago. */
  estadoPostOrigen?: string | null;
  verificado?: boolean;
  /** Ya estaba aplicado: no se envió nada, solo se puso al día la operación. */
  sinEnviar?: boolean;
  comparacionOk?: boolean;
  /** La comparación campo a campo congelada. Es el *por qué* de la decisión. */
  comparacion?: Record<string, unknown> | null;
  motivo?: string | null;
  usuario?: string | null;
  informado?: string | null;
  intento?: number;
  titular?: string | null;
}

export interface DetalleProgramacionInforme {
  cabecera: ProgramacionInforme;
  detalles: DetalleInforme[];
}

/** Lo que se manda al crear la tanda. */
export interface CrearInforme {
  operaciones: string[];
  grupo?: GrupoInforme | null;
  moneda?: string | null;
  /** ISO-8601 con zona. Vacío = ahora. Nunca en el pasado. */
  programado?: string | null;
  motivo?: string | null;
}

/**
 * Con qué alcance se le pregunta a Calimaco por los pagos.
 *
 * <p>`OPERACION` pregunta por el identificador de cada una: sin rango, sin estado y sin banco de por
 * medio, así que encuentra el pago aunque sea antiguo. `FECHAS` barre una ventana de una sola vez —lo
 * que hace el job— pero el reporte filtra además por estado de partida y por banco, y lo que caiga
 * fuera se ve como *ausente*, no como discrepante.</p>
 *
 * <p>Se configura en `CALIMACO#API#CONSULTA` (parametría + organización) y el asistente deja
 * cambiarla para una revisión o una ejecución concretas.</p>
 */
export const ESTRATEGIAS_CONSULTA = ['OPERACION', 'FECHAS'] as const;
export type EstrategiaConsulta = (typeof ESTRATEGIAS_CONSULTA)[number];

export const ETIQUETA_ESTRATEGIA: Record<EstrategiaConsulta, string> = {
  OPERACION: 'Por operación (identificador)',
  FECHAS: 'Por fechas de operación (barrido)',
};

/** Lo que la organización tiene configurado. */
export interface ConsultaConfigurada {
  estrategia: EstrategiaConsulta;
  diasVentana: number;
}

/** Una operación de la tanda ya comparada. */
export interface ItemComparado {
  idOperacion: string;
  codigoOperacion?: string | null;
  identificador?: string | null;
  /** Solo con `FECHAS`: el barrido no trajo ninguna fila con ese identificador. */
  ausenteEnBarrido?: boolean;
  /**
   * El veredicto campo a campo.
   *
   * <p>Es el mismo tipo que devuelve la comparación de una operación suelta —lo produce el mismo
   * `ComparadorPagoCalimaco`—, así que se declara como tal en vez de un `Record` genérico: tipearlo
   * flojo aquí solo trasladaba el problema a un `as` en la Page, que es donde el compilador acabó
   * protestando.</p>
   */
  comparacion: ComparacionCalimaco;
}

/** El resultado de comparar la tanda entera, sin informar nada. */
export interface ComparacionTanda {
  estrategia: EstrategiaConsulta;
  desde?: string | null;
  hasta?: string | null;
  /** Cuántos pagos trajo el barrido. Solo con `FECHAS`. */
  pagosLeidos?: number | null;
  items: ItemComparado[];
}

export interface ResultadoEjecucion {
  informadas: number;
  fallidas: number;
  total: number;
}

/**
 * Estados de la cabecera desde los que aún se puede ejecutar.
 *
 * <p>Espeja lo que acepta el backend. La autoridad sigue siendo él —el 422 se muestra tal cual—;
 * esto solo evita el viaje y explica en pantalla por qué el botón no está disponible.</p>
 */
export const EJECUTABLES = ['ABIERTA', 'PROGRAMADA', 'EN_PROCESO', 'PARCIAL', 'ERROR'];

/** Y desde los que se puede cancelar: solo si no se ha ejecutado. */
export const CANCELABLES = ['ABIERTA', 'PROGRAMADA'];
