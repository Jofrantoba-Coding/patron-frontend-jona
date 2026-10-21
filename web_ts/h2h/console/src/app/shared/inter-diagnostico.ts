/**
 * Por qué una operación lleva varias vueltas del ciclo SFTP sin pagarse.
 *
 * <h3>El dato ya llegaba; lo que faltaba era mirarlo</h3>
 *
 * <p>El backend acumula el historial en `ope_jb_atributos.diagnostico` —una entrada cada vez que
 * nuestro validador pre-envío o el banco dijeron algo sobre esa operación— y el endpoint de detalle
 * devuelve `atributos` entre sus campos. Pero el diálogo de detalle pinta los campos de forma
 * genérica y **descarta los objetos**, así que el historial viajaba hasta la pantalla y se tiraba
 * en el último paso.</p>
 *
 * <h3>La pregunta que hay que contestar</h3>
 *
 * <p>No es «¿qué pasó?», que se puede leer entrada por entrada, sino <b>«¿rebotó siempre por lo
 * mismo?»</b>. De eso depende la única decisión que el operador puede tomar:</p>
 *
 * <ul>
 *   <li><b>La misma causa en dos intentos distintos</b> — reintentar ya se probó y dio el mismo
 *       rechazo. Volver a hacerlo sin corregir el dato repite el resultado.</li>
 *   <li><b>Causas distintas</b> — nada demuestra que el problema sea permanente; la última pudo
 *       ser transitoria y reactivar tiene sentido.</li>
 * </ul>
 *
 * <h3>Por qué se cuentan INTENTOS y no entradas</h3>
 *
 * <p>Una sola vuelta deja más de una entrada: el banco rechaza la línea en el `-VAL` y además anota
 * que quedó fuera de la planilla parcial. Contar entradas diría «dos veces lo mismo» de algo que
 * pasó una vez. Lo que prueba que reintentar no sirve es que la misma causa aparezca en
 * <b>intentos distintos</b>.</p>
 *
 * <h3>Las dos fuentes se cuentan aparte</h3>
 *
 * <p>`VALIDADOR` es una <b>predicción</b> nuestra y `BCP` es un <b>hecho</b>. Sumarlas escondería
 * justo lo que permite medir cuánto acierta nuestra réplica de las reglas del banco.</p>
 */

/** Una anotación del historial, tal como la escribe `DiagnosticoOperacion.entrada`. */
export interface EntradaDiagnostico {
  fecha: string;
  /** `VALIDADOR` (predicción nuestra) o `BCP` (lo que el banco dijo). */
  origen: string;
  /** Archivo en el que pasó, para poder volver a la evidencia cruda. */
  planilla: string;
  /** `ope_n_intentos_envio` en ese momento: qué vuelta del ciclo era. */
  intento: number;
  /** La regla (`UC-PRV-007`) o el estado del banco. Puede no venir. */
  codigo: string | null;
  mensaje: string;
}

/** Una causa distinta, con las vueltas en que apareció. */
export interface CausaDiagnostico {
  /** El texto tal como lo dijo quien lo dijo, sin normalizar. */
  mensaje: string;
  /** Intentos DISTINTOS en que se vio, en orden. Su longitud es lo que mide la repetición. */
  intentos: number[];
  /** Los códigos vistos para esta causa; el banco varía el número de línea entre vueltas. */
  codigos: string[];
  origenes: string[];
}

export interface Diagnostico {
  /** `false` cuando la operación nunca salió o no dejó rastro: la sección no se muestra. */
  hay: boolean;
  /** De la más reciente a la más vieja: lo último es lo que explica el estado de ahora. */
  entradas: EntradaDiagnostico[];
  /** Cuántas vueltas del ciclo dejaron rastro. */
  intentos: number;
  /** Causas distintas, de la más repetida a la menos. */
  causas: CausaDiagnostico[];
  /** La que más vueltas explica, o `null` si ninguna entrada trae mensaje. */
  causaPrincipal: CausaDiagnostico | null;
  /**
   * La misma causa se vio en DOS O MÁS intentos distintos.
   *
   * <p>Es la señal de que reintentar sin corregir el dato no va a cambiar nada: ya se reintentó y
   * el resultado se repitió.</p>
   */
  repetida: boolean;
  /** Cuántas anotaciones vienen del banco (hechos). */
  delBanco: number;
  /** Cuántas vienen de nuestro validador pre-envío (predicciones). */
  delValidador: number;
}

const VACIO: Diagnostico = {
  hay: false,
  entradas: [],
  intentos: 0,
  causas: [],
  causaPrincipal: null,
  repetida: false,
  delBanco: 0,
  delValidador: 0,
};

/** Dos mensajes que solo difieren en espacios o mayúsculas son la misma causa. */
const clave = (mensaje: string): string =>
  mensaje.trim().replace(/\s+/g, ' ').toLocaleLowerCase('es');

const texto = (v: unknown): string => (typeof v === 'string' ? v : v == null ? '' : String(v));

const entero = (v: unknown): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const normaliza = (fila: unknown): EntradaDiagnostico | null => {
  if (!fila || typeof fila !== 'object' || Array.isArray(fila)) return null;
  const f = fila as Record<string, unknown>;
  return {
    fecha: texto(f['fecha']),
    origen: texto(f['origen']),
    planilla: texto(f['planilla']),
    intento: entero(f['intento']),
    // Se conserva `null` en vez de convertirlo a '': el contrato del backend admite que no haya
    // codigo, y una cadena vacia obligaria a la plantilla a distinguir dos formas de "no hay".
    codigo: f['codigo'] == null || f['codigo'] === '' ? null : texto(f['codigo']),
    mensaje: texto(f['mensaje']),
  };
};

/**
 * @param atributos `ope_jb_atributos` de la operación, tal como llega en el detalle. Se acepta
 *                  `unknown` a propósito: el backend los devuelve como jsonb sin tipar, y darles
 *                  aquí un tipo que no se comprueba en tiempo de ejecución seria una promesa falsa.
 */
export const diagnosticoDe = (atributos: unknown): Diagnostico => {
  const a = atributos as { diagnostico?: unknown } | null | undefined;
  const lista = a?.diagnostico;
  if (!Array.isArray(lista) || lista.length === 0) return VACIO;

  const entradas = lista
    .map(normaliza)
    .filter((e): e is EntradaDiagnostico => e !== null);
  if (entradas.length === 0) return VACIO;

  // Agrupa por causa, quedandose con los intentos DISTINTOS en que se vio cada una.
  const porCausa = new Map<string, CausaDiagnostico>();
  for (const e of entradas) {
    if (!e.mensaje.trim()) continue;
    const k = clave(e.mensaje);
    const causa = porCausa.get(k) ?? {
      mensaje: e.mensaje.trim(),
      intentos: [],
      codigos: [],
      origenes: [],
    };
    if (!causa.intentos.includes(e.intento)) causa.intentos.push(e.intento);
    if (e.codigo && !causa.codigos.includes(e.codigo)) causa.codigos.push(e.codigo);
    if (e.origen && !causa.origenes.includes(e.origen)) causa.origenes.push(e.origen);
    porCausa.set(k, causa);
  }

  const causas = [...porCausa.values()]
    .map((c) => ({ ...c, intentos: [...c.intentos].sort((x, y) => x - y) }))
    .sort((c1, c2) => c2.intentos.length - c1.intentos.length);
  const causaPrincipal = causas[0] ?? null;

  return {
    hay: true,
    // El backend ACUMULA al final, asi que la lista llega de vieja a nueva; en pantalla interesa
    // al reves. Se copia antes de invertir: `lista` es del objeto que pinta la plantilla.
    entradas: [...entradas].reverse(),
    intentos: new Set(entradas.map((e) => e.intento)).size,
    causas,
    causaPrincipal,
    repetida: (causaPrincipal?.intentos.length ?? 0) >= 2,
    delBanco: entradas.filter((e) => e.origen === 'BCP').length,
    delValidador: entradas.filter((e) => e.origen === 'VALIDADOR').length,
  };
};
