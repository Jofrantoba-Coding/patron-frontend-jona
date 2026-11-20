// @vitest-environment node
/**
 * Lo compilado, como lo recibe el navegador. El bundle de dist/client no contiene el servicio
 * falso, ni las contraseñas de demostración, ni el nombre de la cookie de sesión, ni la
 * derivación de contraseñas: todo eso es del servidor, y dist/server sí lo contiene (la búsqueda
 * encuentra lo que busca). Requiere `npm run build`.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { ORIGEN_SERVICIO_FALSO } from '../src/cliente/servicioFalso';
import { CABECERA_CSRF } from '../src/compartido/protocolo';
import { MARCA_NONCE } from '../src/servidor/documento';

const DIST = fileURLToPath(new URL('../dist', import.meta.url));

/** Todo el JavaScript de una carpeta (por defecto, de dist), concatenado. */
function codigo(carpeta: string, base = DIST): string {
  const raiz = join(base, carpeta);
  return readdirSync(raiz, { recursive: true, encoding: 'utf8' })
    .filter((archivo) => archivo.endsWith('.js'))
    .map((archivo) => readFileSync(join(raiz, archivo), 'utf8'))
    .join('\n');
}

/** Lo que solo debe existir en el servidor. */
const DEL_SERVIDOR = ['secreta123', '__Host-sesion', 'scrypt'];

describe('los artefactos de vite build', () => {
  it('dist/client y dist/server existen (si falla: npm run build)', () => {
    expect([existsSync(join(DIST, 'client', 'index.html')), existsSync(join(DIST, 'server', 'principal.js'))]).toEqual([true, true]);
  });

  it('cada <script> del index.html compilado lleva la marca del nonce, que el BFF reemplaza en cada respuesta', () => {
    const html = readFileSync(join(DIST, 'client', 'index.html'), 'utf8');
    const scripts = html.match(/<script\b[^>]*>/g) ?? [];

    expect(scripts.length).toBeGreaterThan(0);
    expect(scripts.every((s) => s.includes(`nonce="${MARCA_NONCE}"`))).toBe(true);
  });

  it('el bundle del cliente es el de esta aplicación: habla con /api con la cabecera propia', () => {
    const cliente = codigo('client');

    expect(cliente).toContain(CABECERA_CSRF);
    expect(cliente).toContain('/api/productos');
  });

  it('el bundle del cliente no contiene el servicio falso ni nada del servidor', () => {
    const cliente = codigo('client');

    expect(cliente).not.toContain(ORIGEN_SERVICIO_FALSO);
    for (const marca of DEL_SERVIDOR) expect(cliente).not.toContain(marca);
  });

  it('la búsqueda no es vacía: con import.meta.env.DEV verdadero, el servicio falso sí llega al bundle', () => {
    const salida = mkdtempSync(join(tmpdir(), 'catalogo-seguro-dev-'));
    const vite = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url));
    const compilacion = spawnSync(process.execPath, [vite, 'build', '--outDir', salida, '--emptyOutDir', '--logLevel', 'error'], {
      cwd: fileURLToPath(new URL('..', import.meta.url)), env: { ...process.env, NODE_ENV: 'development' }, encoding: 'utf8',
    });

    expect(compilacion.status, compilacion.stderr).toBe(0);
    expect(codigo('assets', salida)).toContain(ORIGEN_SERVICIO_FALSO);
  });

  it('la búsqueda no es vacía: el bundle del servidor sí contiene lo del servidor', () => {
    const servidor = codigo('server');

    for (const marca of DEL_SERVIDOR) expect(servidor).toContain(marca);
  });
});
