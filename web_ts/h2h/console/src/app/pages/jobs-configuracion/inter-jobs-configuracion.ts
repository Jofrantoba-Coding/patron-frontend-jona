/**
 * Contratos de la configuración de procesamiento automático de la organización,
 * tal como los devuelve `POST api/schedulers/h2h/v1/configuracion/leer`.
 */

/**
 * Un nodo de configuración con su valor propio y el de plataforma.
 *
 * <p>Los dos van juntos a propósito: sin el contraste, un «1000» no dice si alguien lo eligió para
 * esta organización o es el defecto heredado. Y eso cambia qué pasa si se borra.</p>
 */
export interface BloqueConfig {
  codigo: string;
  organizacion: unknown;
  codigoPlataforma?: string;
  plataforma?: unknown;
}

/** Interruptor de un job para la organización. */
export interface InterruptorJob {
  codigo: string;
  organizacion: { habilitado?: boolean; motivo?: string | null; desde?: string | null } | null;
  plataforma: { habilitado?: boolean; forzarApagado?: boolean } | null;
  /**
   * Estado EFECTIVO tras la cascada (HAB-08 §6.4) — no el valor crudo del nodo. Un
   * `forzarApagado` de plataforma vence al encendido de la organización, así que este es el
   * único valor que dice si el job va a correr.
   */
  efectivo: boolean;
}

/** Cantidad de operaciones por planilla. `porMoneda` gana sobre `maxOperaciones`. */
export interface CantidadProgramable {
  maxOperaciones?: number;
  maxMontoTotal?: number | null;
  porMoneda?: Record<string, number>;
}

/** Política de reintentos automáticos. */
export interface Reintentos {
  maxReintentosAutomaticos?: number;
  /** MARCAR_REVISION (sale del barrido, intacta) | ANULAR. */
  alTope?: string;
  soloCausasTransitorias?: boolean;
}

/** Programación horaria de un subtipo de transferencia. */
export interface HorarioSubtipo {
  habilitado?: boolean;
  /** Cada cuánto se ARMA un lote. Decide el tamaño de las planillas, no la latencia. */
  cadenciaMinutos?: number;
  cadenciaPorMoneda?: Record<string, number>;
  /** `null` = usa el margen de la plataforma. */
  margenCierreMinutos?: number | null;
}

/**
 * Un tramo de atención publicado por el banco, un día por entrada: `LUN 07:00-20:30`.
 *
 * <p>`opera` viene declarado en la parametría para los siete días. Un día cerrado trae `opera:false`
 * y no trae horas — antes se deducía de que no apareciera, y esa ausencia obligaba a nombrar el
 * domingo a mano en cada pantalla. Ausente se lee como `true`: la configuración vieja solo escribía
 * los tramos abiertos.</p>
 */
export interface TramoCanal {
  dias: string;
  opera?: boolean;
  desde?: string;
  hasta?: string;
}

/** Ventana del canal (`H2H#BCP#HORARIO#DEFECTO`): horas del banco + margen por defecto. */
export interface VentanaCanal {
  zonaHoraria?: string;
  margenCierreMinutos?: number;
  ventanas?: TramoCanal[];
}

/**
 * Un cut-off del banco. **No es una hora suelta**: la parametría guarda el objeto completo porque la
 * vía se elige por el MONTO de cada operación (CCE hasta el umbral, BCR el resto), y el umbral
 * depende de moneda y plaza.
 */
export interface CutoffBanco {
  /** CCE | BCR. */
  via?: string;
  /** `HH:mm`. Es el único campo que la simulación necesita. */
  hora?: string;
  aplicaA?: string;
  umbrales?: unknown;
}

/** Reglas del BANCO para el subtipo. Los cut-off solo existen en INTERBANCARIA. */
export interface ReglaBancoSubtipo {
  tipoOperacion?: string;
  intrabancaria?: boolean;
  cutoffs?: CutoffBanco[];
}

/** Lo que rinde una moneda dentro de un tramo, con la cadencia vigente. */
export interface RendimientoMoneda {
  moneda: string;
  cadencia: number;
  /** Cuántas veces se arma un lote entre la apertura y el cierre efectivo. */
  lotes: number;
  /** Última hora a la que se arma. Lo que quede después se va al día siguiente. */
  ultimo: string;
}

/**
 * Simulación de un tramo con los valores en pantalla —guardados o en edición—.
 *
 * <p>Reproduce `HorarioEnvio.cierreEfectivo`, incluido su tope: si el margen se come la ventana,
 * el backend devuelve la hora de apertura y el canal queda muerto. Verlo antes de guardar es todo
 * el propósito de este bloque.</p>
 */
export interface TramoSimulado {
  dias: string;
  apertura: string;
  /** Hora que publica el banco, antes de restar el margen. */
  cierrePublicado: string;
  /** Hora a la que este subtipo deja de armar lotes: publicado − margen, o el cut-off si es antes. */
  cierre: string;
  /** Cut-off del banco que recortó el tramo, con su vía: `BCR 12:30`. `null` si ninguno lo hizo. */
  cutoffAplicado: string | null;
  minutosUtiles: number;
  porMoneda: RendimientoMoneda[];
  alerta: string | null;
}

/** Ventana efectiva de un subtipo: los tramos del canal recortados por sus propios valores. */
export interface SimulacionSubtipo {
  codigo: string;
  subtipo: string;
  editando: boolean;
  margen: number;
  /** El margen viene del nodo propio o se hereda de la plataforma. Cambia qué pasa si se borra. */
  margenHeredado: boolean;
  tramos: TramoSimulado[];
}

export interface ConfiguracionJobs {
  interruptores: Record<string, InterruptorJob>;
  /** AUTOMATICO | MANUAL. Gobierna la INGESTA, no los jobs. */
  modoEnvio: BloqueConfig;
  cantidadProgramable: BloqueConfig;
  reintentos: BloqueConfig;
  horarios: {
    /** Ventana del CANAL: es del banco. La organización no puede cambiarla. */
    ventanaCanal: unknown;
    subtipos: Record<string, { codigo: string; organizacion: unknown; banco: unknown }>;
  };
  generado: string;
}

/** Contrato de la página. La Vista edita en local; la Page persiste. */
export interface JobsConfiguracionPageContract {
  cargar(): void;
  /** Cambia el modo de envío de la organización (AUTOMATICO | MANUAL). */
  guardarModoEnvio(modo: string): void;
  guardarCantidad(valor: CantidadProgramable): void;
  guardarReintentos(valor: Reintentos): void;
  guardarHorario(codigo: string, valor: HorarioSubtipo): void;
  cambiarInterruptor(job: string, habilitado: boolean): void;
}

export const MODO_AUTOMATICO = 'AUTOMATICO';
export const MODO_MANUAL = 'MANUAL';
