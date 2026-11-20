// @vitest-environment node
/**
 * Lo compilado, como lo recibe el navegador: el bundle de dist/client no contiene el adaptador
 * HTTP (su marca ORIGEN_ADAPTADOR_HTTP) ni el nombre de la variable del servidor API_URL.
 * El de dist/server sí los contiene: la búsqueda encuentra lo que busca. Requiere `npm run build`.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { ID_DATOS } from '../src/compartido/datosIncrustados';
import { ORIGEN_ADAPTADOR_HTTP } from '../src/servidor/adaptadores/crearRepositorioHttp';

const DIST = fileURLToPath(new URL('../dist', import.meta.url));

/** Todo el JavaScript de una carpeta de dist, concatenado. */
function codigo(carpeta: string): string {
  const raiz = join(DIST, carpeta);
  return readdirSync(raiz, { recursive: true, encoding: 'utf8' })
    .filter((archivo) => archivo.endsWith('.js'))
    .map((archivo) => readFileSync(join(raiz, archivo), 'utf8'))
    .join('\n');
}

describe('los artefactos de vite build', () => {
  it('dist/client y dist/server existen (si falla: npm run build)', () => {
    expect([existsSync(join(DIST, 'client', 'index.html')), existsSync(join(DIST, 'server', 'principal.js'))]).toEqual([true, true]);
  });

  it('el bundle del cliente es el de esta aplicación: lee los datos incrustados', () => {
    expect(codigo('client')).toContain(ID_DATOS);
  });

  it('el bundle del cliente no contiene el adaptador HTTP ni la variable del servidor', () => {
    const cliente = codigo('client');

    expect(cliente).not.toContain(ORIGEN_ADAPTADOR_HTTP);
    expect(cliente).not.toContain('API_URL');
  });

  it('la búsqueda no es vacía: el bundle del servidor sí los contiene', () => {
    const servidor = codigo('server');

    expect(servidor).toContain(ORIGEN_ADAPTADOR_HTTP);
    expect(servidor).toContain('API_URL');
  });
});
