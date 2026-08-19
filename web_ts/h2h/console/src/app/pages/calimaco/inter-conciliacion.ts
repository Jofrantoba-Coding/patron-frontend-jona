/**
 * Contratos del informe manual de UNA operación a Calimaco.
 *
 * <p>Cuatro pasos, y la separación importa: <b>tres son de solo lectura y uno no se deshace</b>.</p>
 *
 * <pre>
 *   1  POST …/operacion/calimaco/sesion     la cuenta de servicio entra y PUEDE la transición
 *   2  POST …/operacion/calimaco/comparar   se lee el pago y se compara campo a campo
 *   3  POST …/operacion/calimaco/informar   se manda el cambio de estado — IRREVERSIBLE
 *   4  POST …/operacion/calimaco/estado     se relee y se confirma que de verdad cambió
 * </pre>
 *
 * <p>Los pasos 1, 2 y 4 se pueden pulsar cuantas veces se quiera. El 3 marca el pago en el sistema
 * del casino y por eso lo pide una persona después de ver los dos primeros — el barrido automático
 * nunca lo hace.</p>
 *
 * <p><b>Por qué el 4 no es el 2 otra vez.</b> Después de informar, la operación queda en
 * `PAGO_INFORMADO`, y el paso 2 tiene el estado propio entre sus campos críticos contrastado con
 * `PAGO_CONFIRMADO`: repetirlo diría «no cuadra» por un motivo que no es el que se pregunta.</p>
 */

/**
 * Paso 1. Estado de la credencial de la cuenta de servicio.
 *
 * <p>No lleva operación: pregunta por la integración. Un login que funciona no basta — la cuenta
 * puede entrar y no tener concedido el paso al estado destino, y sin este paso ese permiso que falta
 * aparecería en el envío, hablando del lote y no de la credencial.</p>
 */
export interface SesionCalimaco {
  /** OFFLINE / SIMULACION / REAL. En OFFLINE no sale ninguna petición y no se comprueba nada. */
  modo?: string | null;
  /** Si la integración está configurada y encendida en los tres frenos. */
  utilizable: boolean;
  /** Si el modo permite un envío de verdad. */
  envioPermitido?: boolean;
  /** Hay sesión válida (de Redis o recién hecha). */
  sesionActiva: boolean;
  /** La cuenta tiene concedido el paso del estado de partida al destino. */
  transicionPermitida: boolean;
  /** Todos los estados a los que Calimaco deja pasar desde el de partida. */
  estadosPermitidos?: string[];
  usuario?: string | null;
  company?: string | null;
  estadoOrigenCalimaco?: string | null;
  estadoDestinoCalimaco?: string | null;
  motivos: string[];
}

/**
 * Paso 4. Cómo está el pago ahora, y si los dos sistemas coinciden.
 *
 * <p>`coherente` exige las dos mitades: Calimaco en el estado destino **y** la operación en
 * `PAGO_INFORMADO`. Que solo una lo esté es precisamente lo que hay que poder ver — es el estado en
 * que queda un envío aceptado que no se pudo confirmar.</p>
 */
export interface EstadoCalimaco {
  modo?: string | null;
  identificador?: string | null;
  /** El estado que Calimaco reporta ahora mismo. */
  estadoCalimaco?: string | null;
  estadoDestinoCalimaco?: string | null;
  /** Calimaco lo tiene en el estado destino. */
  enDestino?: boolean;
  /** El estado de nuestra operación. */
  estadoOperacion?: string | null;
  /** Nuestra operación está en PAGO_INFORMADO. */
  operacionInformada?: boolean;
  /** Las dos mitades de acuerdo. */
  coherente?: boolean;
  motivos: string[];
}

/** Un campo comparado entre nuestra operación y el pago que Calimaco dice tener. */
export interface CampoComparado {
  campo: string;
  /** Lo que tenemos aquí. */
  nuestro?: string | null;
  /** Lo que dice Calimaco. */
  suyo?: string | null;
  coincide: boolean;
  /**
   * Si no cuadrar bloquea el envío.
   *
   * <p>Críticos: estado, importe, moneda y cuenta — los que definen que el pago es ese. De
   * contraste: banco, titular y documento, que se escriben a mano en los dos sistemas y difieren de
   * forma inocente («BCP» frente a «Banco de Crédito»). Bloquear por ellos dejaría una pantalla que
   * nunca permite informar.</p>
   */
  critico: boolean;
}

export interface ComparacionCalimaco {
  /** Si cuadran todos los campos críticos. */
  coincide: boolean;
  /** Si la comparación permite informar. Ojo: no es lo mismo que estar permitido — ver `modo`. */
  puedeInformar: boolean;

  /**
   * Calimaco tiene el pago en el estado de partida: hay que **enviarle** el cambio.
   *
   * <p>Separado de `yaAplicado` porque las acciones son distintas: una manda una petición
   * irreversible y la otra solo actualiza nuestra fila.</p>
   */
  puedeEnviar?: boolean;

  /**
   * Calimaco YA tiene el pago en el estado destino: no hay nada que enviar, solo poner al día la
   * operación de aquí.
   *
   * <p>Es lo que se ve cuando un envío anterior salió bien y se perdió la respuesta. Sin este caso
   * la operación quedaría atascada, porque lo único que faltaría sería reenviar — y esa llamada no
   * se puede repetir.</p>
   */
  yaAplicado?: boolean;

  /**
   * Solo al informar: se **releyó** el pago y de verdad quedó en el estado destino.
   *
   * <p>La respuesta del lote es un indicio, no una prueba: dice que aceptó la petición, no que el
   * estado cambió. La operación solo avanza si esto es `true`.</p>
   */
  verificado?: boolean;

  /** Solo al informar: se puso al día sin mandar nada porque ya estaba aplicado. */
  sinEnviar?: boolean;

  /** Solo al informar: en qué estado quedó el pago al releerlo. */
  estadoCalimacoDespues?: string | null;
  /** Por qué no, en frases que se pueden mostrar tal cual. */
  motivos: string[];
  campos: CampoComparado[];
  /** OFFLINE / SIMULACION / REAL. En los dos primeros no sale ninguna petición de escritura. */
  modo?: string | null;
  /** Si el modo permite un envío de verdad. Se separa de `puedeInformar` a propósito. */
  envioPermitido?: boolean;
  /** El identificador con el que se consultó a Calimaco (`1.3572384016`). */
  identificador?: string | null;
  estadoCalimaco?: string | null;
  estadoOperacion?: string | null;
  estadoDestinoCalimaco?: string | null;
  /** Solo al informar: si Calimaco confirmó y la operación pasó a PAGO_INFORMADO. */
  informado?: boolean;
  /** Solo al informar: la respuesta fue fabricada (OFFLINE/SIMULACIÓN) y nada avanzó. */
  simulada?: boolean;
  aplicada?: boolean;

  /**
   * La tanda de informe que quedó registrada por este envío.
   *
   * <p>El paso 3 no llama al API a pelo: envuelve la llamada en una tanda de una sola operación, así
   * que un informe manual deja las mismas filas en `tt_pin_programacion_informe` y
   * `tt_pid_programacion_informe_detalle` que uno del scheduler — con el modo sellado, la comparación
   * congelada y el usuario. Se devuelve el código para poder abrirla desde *Informes de pago*.</p>
   */
  idProgramacionInforme?: string | null;
  codigoProgramacionInforme?: string | null;
}
