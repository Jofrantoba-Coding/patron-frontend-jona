import { describe, expect, it } from 'vitest';
import { epochAHoraDePared, instanteDeBackendAHoraDePared } from './zona-horaria';

/**
 * Marcas de tiempo del backend pintadas en la zona del negocio.
 *
 * <p>El caso que justifica todo esto: una columna `timestamptz` NO viaja en ISO. El DAO la
 * saca con `getString` y el driver de PostgreSQL la escribe en la zona de la JVM que corre
 * la API, asi que el MISMO instante llega distinto segun donde este desplegada. Pintar el
 * texto en crudo mostraria una hora u otra sin que nada avisara, y con cortes horarios de
 * por medio (CCE 14:30, BCR 12:30) esa diferencia decide si una operacion entra o no.</p>
 */
describe('instanteDeBackendAHoraDePared', () => {
  /** 2026-08-12 19:32:16.788775-05 == 2026-08-13 00:32:16.788775+00 */
  const EN_LIMA = '2026-08-12 19:32:16.788775-05';
  const EN_UTC = '2026-08-13 00:32:16.788775+00';

  it('el mismo instante se ve igual venga de una API en Lima o en UTC', () => {
    expect(instanteDeBackendAHoraDePared(EN_LIMA)).toBe(instanteDeBackendAHoraDePared(EN_UTC));
  });

  it('lo pinta en hora de Lima, no en la zona que traiga el texto', () => {
    // Ambos son el mismo instante; en Lima son las 19:32 del dia 12.
    const esperado = epochAHoraDePared(Date.UTC(2026, 7, 13, 0, 32, 16, 788));

    expect(instanteDeBackendAHoraDePared(EN_LIMA)).toBe(esperado);
    expect(instanteDeBackendAHoraDePared(EN_UTC)).toBe(esperado);
    expect(instanteDeBackendAHoraDePared(EN_UTC)).toContain('19:32');
  });

  it('acepta la T de ISO, la Z y el desfase con dos puntos', () => {
    const esperado = instanteDeBackendAHoraDePared(EN_UTC);

    expect(instanteDeBackendAHoraDePared('2026-08-13T00:32:16.788Z')).toBe(esperado);
    expect(instanteDeBackendAHoraDePared('2026-08-12T19:32:16.788-05:00')).toBe(esperado);
  });

  it('sin desfase interpreta la hora como del negocio, no como UTC', () => {
    // `ope_dt_fecha_carga` es `timestamp` sin zona: lo escrito ya es hora de Lima.
    const sinZona = instanteDeBackendAHoraDePared('2026-08-12 19:31:07.244291');

    expect(sinZona).toContain('19:31');
  });

  it('recorta los microsegundos sin desplazar el instante', () => {
    // .788775 -> 788 ms. Si se leyera como 788775 ms se irian 12 minutos.
    expect(instanteDeBackendAHoraDePared('2026-08-13 00:32:16.788775+00')).toBe(
      instanteDeBackendAHoraDePared('2026-08-13 00:32:16.788+00')
    );
  });

  it('un texto que no se reconoce se devuelve tal cual, no se pierde', () => {
    expect(instanteDeBackendAHoraDePared('mañana por la tarde')).toBe('mañana por la tarde');
  });

  it('vacio y nulo dan cadena vacia, para que la tabla ponga su guion', () => {
    expect(instanteDeBackendAHoraDePared('')).toBe('');
    expect(instanteDeBackendAHoraDePared(null)).toBe('');
    expect(instanteDeBackendAHoraDePared(undefined)).toBe('');
  });

  it('con segundos añade la precision que la trazabilidad ya mostraba', () => {
    const conSegundos = instanteDeBackendAHoraDePared(EN_UTC, undefined, true);

    expect(conSegundos).toContain('19:32:16');
    expect(instanteDeBackendAHoraDePared(EN_UTC)).not.toContain(':16');
  });
});

/**
 * La trampa de las fechas SIN hora, que aqui no se sufre pero conviene dejar fijada.
 *
 * <p>`new Date('2026-08-12')` NO es medianoche local: la norma dice que una fecha sola se
 * lee como UTC. Al pintarla en una zona al oeste de Greenwich —Lima esta en -05— sale
 * <b>el dia anterior</b>. Por eso `fd()` en programaciones añade `T00:00:00` antes de
 * parsear, y por eso las columnas de fecha suelta se pintan tal cual llegan.</p>
 */
describe('fechas sin hora: por que no se pasan por new Date a secas', () => {
  it('una fecha sola parseada como UTC se corre un dia en Lima', () => {
    const comoUtc = new Date('2026-08-12');
    const enLima = new Intl.DateTimeFormat('es-PE', {
      timeZone: 'America/Lima',
      dateStyle: 'short',
    }).format(comoUtc);

    expect(enLima).toContain('11'); // 11/08/26, no 12
  });

  it('con T00:00:00 se queda en el dia que dice', () => {
    const comoLocal = new Date('2026-08-12T00:00:00');

    expect(comoLocal.getDate()).toBe(12);
  });
});
