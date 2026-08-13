/**
 * Conversión entre la hora que el usuario ve y el instante que viaja a la API.
 *
 * <p>El selector de fecha devuelve una hora de pared sin zona (`2026-08-12T19:26`).
 * Traducirla a un instante exige decidir «¿las 19:26 de dónde?», y la respuesta no
 * puede ser «las del navegador»: dos personas filtrando el mismo texto desde Lima y
 * desde Madrid verían totales distintos. Se usa la zona del NEGOCIO, que la consola
 * ya conoce porque `/programaciones/ventana` la devuelve.</p>
 */

/** Zona de operación del canal. Es el respaldo si aún no llegó la de la API. */
export const ZONA_NEGOCIO_POR_DEFECTO = 'America/Lima';

/**
 * Desfase de una zona respecto a UTC, en milisegundos, para un instante dado.
 *
 * <p>Se calcula preguntándole a `Intl` qué hora de pared muestra esa zona en ese
 * instante y comparándola con la hora UTC. Es la vía estándar sin arrastrar una
 * librería de fechas.</p>
 */
function desfaseDeZona(instante: number, zona: string): number {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: zona,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(instante));

  const p: Record<string, string> = {};
  for (const parte of partes) p[parte.type] = parte.value;

  const comoUtc = Date.UTC(
    Number(p['year']),
    Number(p['month']) - 1,
    Number(p['day']),
    // `hour12: false` puede devolver 24 para la medianoche en algunos motores.
    Number(p['hour']) % 24,
    Number(p['minute']),
    Number(p['second'])
  );
  return comoUtc - instante;
}

/**
 * Hora de pared (`yyyy-MM-ddTHH:mm[:ss]`) → epoch en milisegundos, interpretada en `zona`.
 *
 * <p>Se evita `new Date(texto)` a propósito: el mismo formato ISO se parsea en zonas
 * distintas según lleve hora o no — `new Date('2026-08-12')` es UTC y
 * `new Date('2026-08-12T00:00')` es local—, así que el resultado dependería del equipo
 * del operador.</p>
 *
 * <p>Se aplica el desfase dos veces porque el propio desfase depende del instante: en
 * zonas con horario de verano, el primer cálculo puede caer al lado equivocado del
 * cambio. Lima no lo tiene, pero la función no debería servir solo para Lima.</p>
 *
 * @returns el epoch, o `null` si el texto no es una fecha completa.
 */
export function horaDeParedAEpoch(texto: string, zona = ZONA_NEGOCIO_POR_DEFECTO): number | null {
  const limpio = (texto ?? '').trim();
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?$/.exec(limpio);
  if (!m) return null;

  const naive = Date.UTC(
    Number(m[1]),
    Number(m[2]) - 1,
    Number(m[3]),
    Number(m[4] ?? 0),
    Number(m[5] ?? 0),
    Number(m[6] ?? 0)
  );

  const primer = naive - desfaseDeZona(naive, zona);
  return naive - desfaseDeZona(primer, zona);
}

/** Instante → hora de pared en `zona`, para etiquetar lo que se está filtrando. */
export function epochAHoraDePared(
  epoch: number,
  zona = ZONA_NEGOCIO_POR_DEFECTO,
  conSegundos = false
): string {
  return new Intl.DateTimeFormat('es-PE', {
    timeZone: zona,
    dateStyle: 'short',
    timeStyle: conSegundos ? 'medium' : 'short',
    hour12: false,
  }).format(new Date(epoch));
}

/**
 * Marca de tiempo tal como la manda el backend → hora de pared en la zona del negocio.
 *
 * <p>Una columna `timestamptz` no viaja en ISO: el DAO la saca con `getString` y el driver
 * de PostgreSQL la renderiza <b>en la zona de la JVM que corre la API</b>, con espacio en
 * vez de `T`, microsegundos y el desplazamiento en dos dígitos:</p>
 *
 * <pre>
 *   API en America/Lima  ->  "2026-08-12 19:32:16.788775-05"
 *   API en UTC           ->  "2026-08-13 00:32:16.788775+00"   (el mismo instante)
 * </pre>
 *
 * <p>Por eso pintar el texto en crudo no vale: la misma fila enseñaría una hora distinta
 * según dónde esté desplegada la API, y nadie lo notaría hasta cuadrar un corte horario.
 * Aquí se lleva a instante absoluto y se formatea en la zona del NEGOCIO, que es la única
 * que significa lo mismo para todos.</p>
 *
 * <p>Si el texto no trae desplazamiento (una columna `timestamp` sin zona, como
 * `ope_dt_fecha_carga`) se interpreta ya en la zona del negocio, que es como se grabó.</p>
 *
 * @returns la hora de pared, o el texto original si no se reconoce —nunca se descarta un
 *          dato que el backend sí mandó.
 */
export function instanteDeBackendAHoraDePared(
  texto: unknown,
  zona = ZONA_NEGOCIO_POR_DEFECTO,
  conSegundos = false
): string {
  const limpio = String(texto ?? '').trim();
  if (!limpio) return '';

  const m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?(?:\.(\d+))?\s*([+-]\d{2}(?::?\d{2})?|Z)?$/.exec(
    limpio
  );
  if (!m) return limpio;

  const [, anio, mes, dia, hh, mm, ss, frac, desfase] = m;
  const milis = Number((frac ?? '0').slice(0, 3).padEnd(3, '0'));
  const naive = Date.UTC(
    Number(anio),
    Number(mes) - 1,
    Number(dia),
    Number(hh),
    Number(mm),
    Number(ss ?? 0),
    milis
  );

  if (!desfase) {
    // Sin zona: la hora escrita ya es la del negocio. Se resta su propio desfase para
    // volver al instante, con el mismo doble paso que `horaDeParedAEpoch`.
    const primer = naive - desfaseDeZona(naive, zona);
    return epochAHoraDePared(naive - desfaseDeZona(primer, zona), zona, conSegundos);
  }
  if (desfase === 'Z') return epochAHoraDePared(naive, zona, conSegundos);

  const signo = desfase.startsWith('-') ? -1 : 1;
  const cuerpo = desfase.slice(1).replace(':', '');
  const horas = Number(cuerpo.slice(0, 2));
  const minutos = Number(cuerpo.slice(2, 4) || '0');
  return epochAHoraDePared(naive - signo * (horas * 60 + minutos) * 60_000, zona, conSegundos);
}
