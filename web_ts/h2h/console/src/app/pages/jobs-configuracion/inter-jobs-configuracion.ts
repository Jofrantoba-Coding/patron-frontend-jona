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

/**
 * Cuántas operaciones entran en una tanda del job de informe al origen.
 *
 * <p>No confundir con `CantidadProgramable`, que es cuántas caben en una **planilla** que va al
 * banco. Esto es cuántas se **avisan al sistema de origen** por corrida: en modo REAL cada fila es
 * una llamada irreversible, y una tanda de quinientas no la revisa nadie.</p>
 *
 * <p>`efectivo` es lo que el job va a usar de verdad —ya resuelta la herencia y acotado el rango—.
 * Sin él, la pantalla no puede distinguir «hereda 50» de «alguien eligió 50».</p>
 */
export interface TopeInformeOrigen {
  codigo: string;
  organizacion: { tope?: number } | null;
  plataforma: { tope?: number } | null;
  efectivo: number;
  minimo: number;
  maximo: number;
}

/** Cantidad de operaciones por planilla. `porMoneda` gana sobre `maxOperaciones`. */
export interface CantidadProgramable {
  maxOperaciones?: number;
  maxMontoTotal?: number | null;
  porMoneda?: Record<string, number>;
}

/**
 * ¿Puede el job agendar un lote para una ventana FUTURA?
 *
 * <p>`true` —el defecto— es la conducta que el sistema ya tenía: fuera de ventana el plan se agenda
 * al siguiente instante en que el canal abre, y la fecha de proceso pasa a ser la de ese día, tanto
 * en el plan como en sus operaciones. `false` hace que el job **no programe** fuera de ventana:
 * espera, y como corre cada pocos minutos, programa solo en cuanto abre.</p>
 *
 * <p><b>En ninguno de los dos casos existe un plan fuera de ventana.</b> Lo que cambia no es dónde
 * cae el plan sino cuándo se crea, y por eso H2H sigue respetando el horario del banco: BCP acepta
 * el archivo según SUS ventanas, y una fecha vieja o una hora inválida se rechazan.</p>
 */
export interface DiferirFueraDeVentana {
  habilitado?: boolean;
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
  /**
   * Ventana propia de la ORGANIZACIÓN para este subtipo.
   *
   * <p>Ausente = hereda: el backend baja al tramo del banco y, si tampoco lo declara, al del canal
   * (`H2H#BCP#HORARIO#DEFECTO`). Cuando está presente **manda sobre los dos**, y la misma ventana
   * la usan los cinco caminos que consultan el horario —programar a mano, generar la planilla, el
   * ciclo SFTP, el job de programación y este calendario—, porque todos pasan por el mismo
   * resolutor.</p>
   *
   * <p>Los <b>siete</b> días son obligatorios cuando se declara, cada uno con su `opera`: un día
   * ausente no se distingue de un día sin cargar.</p>
   */
  ventanas?: TramoCanal[];
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
  /**
   * Ventana propia del subtipo publicada por el banco. Escalón intermedio de la cascada: pierde
   * frente a la de la organización y gana frente a la del canal.
   */
  ventanas?: TramoCanal[];
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
  /**
   * Quién declara la ventana simulada: `ORGANIZACION`, `BANCO` o `CANAL`.
   *
   * <p>Sin esto la tabla es ambigua: los mismos tramos pueden venir de la ventana propia del
   * subtipo o de la heredada, y de eso depende si editarla aquí cambia algo.</p>
   */
  origen: 'ORGANIZACION' | 'BANCO' | 'CANAL';
  tramos: TramoSimulado[];
}

/**
 * Un subtipo horario configurable, con el producto al que pertenece.
 *
 * <p>La clave del `Record` es `<PRODUCTO>#<SUBTIPO>` y no el subtipo suelto: hoy los nombres no
 * colisionan entre productos, pero apoyarse en eso haría que el día que dos compartan nombre uno
 * pisara al otro sin ruido.</p>
 *
 * <p>`producto` y `subtipo` llegan desglosados para que la pantalla pueda agrupar sin partir la
 * clave. Son opcionales porque un backend anterior a la rama de pagos masivos no los manda.</p>
 */
export interface SubtipoHorarioConfig {
  codigo: string;
  producto?: string;
  subtipo?: string;
  organizacion: unknown;
  banco: unknown;
}

export interface ConfiguracionJobs {
  interruptores: Record<string, InterruptorJob>;
  /** AUTOMATICO | MANUAL. Gobierna la INGESTA, no los jobs. */
  modoEnvio: BloqueConfig;
  cantidadProgramable: BloqueConfig;
  /** Tope de la tanda del informe al origen. Opcional: un backend anterior no lo manda. */
  topeInformeOrigen?: TopeInformeOrigen;
  reintentos: BloqueConfig;
  /** Interruptor del diferido. Opcional: un backend anterior no lo manda. */
  diferirFueraDeVentana?: BloqueConfig;
  horarios: {
    /** Ventana del CANAL: es del banco. La organización no puede cambiarla. */
    ventanaCanal: unknown;
    subtipos: Record<string, SubtipoHorarioConfig>;
  };
  generado: string;
}

/** Contrato de la página. La Vista edita en local; la Page persiste. */
export interface JobsConfiguracionPageContract {
  cargar(): void;
  /** Cambia el modo de envío de la organización (AUTOMATICO | MANUAL). */
  guardarModoEnvio(modo: string): void;
  guardarCantidad(valor: CantidadProgramable): void;
  /** Cuántas operaciones entran en una tanda del job de informe al origen. */
  guardarTopeInforme(tope: number): void;
  guardarReintentos(valor: Reintentos): void;
  /** Enciende o apaga el diferido del job cuando el canal esta cerrado. */
  guardarDiferido(habilitado: boolean): void;
  guardarHorario(codigo: string, valor: HorarioSubtipo): void;
  cambiarInterruptor(job: string, habilitado: boolean): void;
}

export const MODO_AUTOMATICO = 'AUTOMATICO';
export const MODO_MANUAL = 'MANUAL';
