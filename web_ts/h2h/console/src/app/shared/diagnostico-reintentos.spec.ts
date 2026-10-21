import { describe, expect, it } from 'vitest';
import { diagnosticoDe } from './inter-diagnostico';

/**
 * Por qué se está reintentando una operación.
 *
 * <h3>La pregunta que esto contesta</h3>
 *
 * <p>Una operación con varias vueltas del ciclo SFTP no dice, hoy, por qué rebotó. El backend sí lo
 * guarda —`ope_jb_atributos.diagnostico`, una entrada por cada vez que el validador o el banco
 * dijeron algo— pero el diálogo de detalle **descarta los objetos** al pintar los campos, así que
 * ese historial viaja hasta la pantalla y nadie lo ve.</p>
 *
 * <p>Y la pregunta operativa no es «¿qué pasó?» sino <b>«¿rebotó siempre por lo mismo?»</b>. Si la
 * causa se repitió en dos intentos distintos, reintentar sin corregir el dato va a dar el mismo
 * rechazo otra vez; si cada vuelta falló por algo distinto, la última pudo ser transitoria. Esa
 * distinción es la que decide si el operador toca «reactivar» o va a corregir el dato.</p>
 *
 * <h3>Por qué se cuentan INTENTOS y no entradas</h3>
 *
 * <p>Una sola vuelta deja más de una entrada: el banco rechaza la línea en el `-VAL` y además
 * anota que quedó fuera de la planilla parcial. Contar entradas diría «dos veces lo mismo» de algo
 * que pasó una vez. Lo que prueba que reintentar no sirve es que la misma causa aparezca en
 * <b>intentos distintos</b>.</p>
 */
describe('diagnosticoDe: por qué se está reintentando', () => {
  const entrada = (over: Record<string, unknown> = {}) => ({
    fecha: '2026-09-21T11:42:07.135593100-05:00',
    origen: 'BCP',
    planilla: 'P20260921000003P.txt',
    intento: 1,
    codigo: 'VAL/linea 4',
    mensaje: 'La longitud del número de cuenta (Ahorros) abono es incorrecto.',
    ...over,
  });

  // ── Sin nada que contar ──────────────────────────────────────────────────────────

  it('no hay diagnóstico cuando la operación nunca salió', () => {
    expect(diagnosticoDe(null).hay).toBe(false);
    expect(diagnosticoDe({}).hay).toBe(false);
    expect(diagnosticoDe({ diagnostico: [] }).hay).toBe(false);
  });

  it('un atributo que no es una lista no revienta ni inventa', () => {
    expect(diagnosticoDe({ diagnostico: 'vaya' }).hay).toBe(false);
    expect(diagnosticoDe({ diagnostico: { a: 1 } }).hay).toBe(false);
  });

  // ── El caso real del 21/09/2026 ──────────────────────────────────────────────────

  /**
   * `PARRES-PM-PEN-112749-2`: dos vueltas del ciclo, tres entradas, y la MISMA causa las dos
   * veces. Es el caso que justifica la pantalla: el operador ve que reintentar ya se probó.
   */
  it('detecta que la causa se repitió en dos intentos distintos', () => {
    const d = diagnosticoDe({
      diagnostico: [
        entrada({ intento: 1, codigo: 'VAL/linea 4' }),
        entrada({
          intento: 1,
          codigo: 'NoConsiderada',
          mensaje: 'El banco no la considero para procesar: quedo fuera de la planilla parcial.',
        }),
        entrada({ intento: 2, codigo: 'VAL/linea 2', planilla: 'P20260921000004P.txt' }),
      ],
    });

    expect(d.hay).toBe(true);
    expect(d.intentos).toBe(2);
    expect(d.repetida).toBe(true);
    expect(d.causaPrincipal?.mensaje).toContain('longitud del número de cuenta');
    expect(d.causaPrincipal?.intentos).toEqual([1, 2]);
  });

  /**
   * Y el contraste: dos vueltas, dos causas distintas. Aquí reintentar SÍ puede tener sentido,
   * porque nada demuestra que el problema sea permanente.
   */
  it('no marca repetida cuando cada intento falló por algo distinto', () => {
    const d = diagnosticoDe({
      diagnostico: [
        entrada({ intento: 1, mensaje: 'Cuenta de abono no válida.' }),
        entrada({ intento: 2, mensaje: 'Saldo insuficiente en la cuenta de cargo.' }),
      ],
    });
    expect(d.intentos).toBe(2);
    expect(d.repetida).toBe(false);
  });

  /**
   * Dos entradas del MISMO intento no prueban nada sobre reintentar: es una sola vuelta que dejó
   * dos anotaciones. Contarlas como repetición diría que el reintento ya se probó cuando no.
   */
  it('dos entradas del mismo intento no son una repetición', () => {
    const d = diagnosticoDe({
      diagnostico: [entrada({ intento: 1 }), entrada({ intento: 1 })],
    });
    expect(d.intentos).toBe(1);
    expect(d.repetida).toBe(false);
  });

  // ── Las dos fuentes no se mezclan ────────────────────────────────────────────────

  /**
   * `VALIDADOR` es una PREDICCIÓN nuestra y `BCP` es un HECHO. Juntarlas en un solo número
   * escondería justo lo que permite medir cuánto acierta nuestro validador.
   */
  it('separa lo que predijo el validador de lo que dijo el banco', () => {
    const d = diagnosticoDe({
      diagnostico: [
        entrada({ origen: 'VALIDADOR', codigo: 'UC-PRV-007' }),
        entrada({ origen: 'BCP' }),
        entrada({ origen: 'BCP', intento: 2 }),
      ],
    });
    expect(d.delValidador).toBe(1);
    expect(d.delBanco).toBe(2);
  });

  // ── Orden y presentación ─────────────────────────────────────────────────────────

  /**
   * El backend ACUMULA al final (`historial.add`), así que la lista llega de vieja a nueva. En
   * pantalla interesa al revés: lo último es lo que explica el estado de ahora.
   */
  it('devuelve las entradas de la más reciente a la más vieja', () => {
    const d = diagnosticoDe({
      diagnostico: [
        entrada({ intento: 1, planilla: 'vieja.txt' }),
        entrada({ intento: 2, planilla: 'nueva.txt' }),
      ],
    });
    expect(d.entradas[0].planilla).toBe('nueva.txt');
    expect(d.entradas[1].planilla).toBe('vieja.txt');
  });

  /** Mensajes que solo difieren en espacios o mayúsculas son la misma causa. */
  it('agrupa causas que solo difieren en espacios o mayúsculas', () => {
    const d = diagnosticoDe({
      diagnostico: [
        entrada({ intento: 1, mensaje: 'Cuenta  no válida.' }),
        entrada({ intento: 2, mensaje: 'cuenta no válida.' }),
      ],
    });
    expect(d.causas).toHaveLength(1);
    expect(d.repetida).toBe(true);
  });

  /** Las causas van de la más repetida a la menos, que es el orden en que se quieren leer. */
  it('ordena las causas por cuántos intentos distintos las vieron', () => {
    const d = diagnosticoDe({
      diagnostico: [
        entrada({ intento: 1, mensaje: 'Rara.' }),
        entrada({ intento: 2, mensaje: 'Frecuente.' }),
        entrada({ intento: 3, mensaje: 'Frecuente.' }),
      ],
    });
    expect(d.causas[0].mensaje).toBe('Frecuente.');
    expect(d.causas[0].intentos).toEqual([2, 3]);
    expect(d.causas[1].mensaje).toBe('Rara.');
  });

  // ── Bordes de datos reales ───────────────────────────────────────────────────────

  /** `codigo` puede venir nulo: el contrato del backend lo admite. */
  it('una entrada sin código sigue siendo válida', () => {
    const d = diagnosticoDe({ diagnostico: [entrada({ codigo: null })] });
    expect(d.hay).toBe(true);
    expect(d.entradas[0].codigo).toBeNull();
  });

  /** Una entrada sin mensaje no puede agrupar por causa, pero tampoco debe tirar la pantalla. */
  it('una entrada sin mensaje no cuenta como causa', () => {
    const d = diagnosticoDe({
      diagnostico: [entrada({ mensaje: '' }), entrada({ intento: 2, mensaje: null })],
    });
    expect(d.hay).toBe(true);
    expect(d.causas).toHaveLength(0);
    expect(d.repetida).toBe(false);
  });
});
