/**
 * Contratos de la conciliación de UNA operación con Calimaco.
 *
 * <p>Dos endpoints, y la separación importa:</p>
 *
 * <pre>
 *   POST api/mantenimientos/h2h/v1/operacion/calimaco/comparar   solo lectura
 *   POST api/mantenimientos/h2h/v1/operacion/calimaco/informar   irreversible
 * </pre>
 *
 * <p>Comparar se puede pulsar cuantas veces se quiera. Informar marca el pago en el sistema del
 * casino y no se deshace, y por eso lo pide una persona después de mirar la tabla — el barrido
 * automático nunca lo hace.</p>
 */

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
}
