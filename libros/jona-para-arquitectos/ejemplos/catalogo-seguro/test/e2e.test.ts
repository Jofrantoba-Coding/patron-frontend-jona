// @vitest-environment node
/** El proceso compilado, como lo arranca `npm start`. Requiere `npm run build`. */
import { spawn, type ChildProcess } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { ORIGEN, PROPIAS, entrar, pedir } from './pedir';

const PRINCIPAL = fileURLToPath(new URL('../dist/server/principal.js', import.meta.url));

let proceso: ChildProcess | undefined;
afterEach(() => proceso?.kill());

async function arrancar(entorno: Record<string, string> = {}): Promise<string> {
  proceso = spawn(process.execPath, [PRINCIPAL], { env: { ...process.env, PORT: '0', ...entorno }, stdio: ['ignore', 'pipe', 'inherit'] });
  return new Promise((resolve, reject) => {
    proceso!.stdout!.on('data', (parte) => {
      const url = /listo en (http:\/\/127\.0\.0\.1:\d+)/.exec(String(parte));
      if (url) resolve(url[1]);
    });
    proceso!.on('exit', (codigo) => reject(new Error(`El servidor terminó con código ${codigo}`)));
  });
}

describe('npm start: el BFF compilado', () => {
  it('entrega el documento con CSP y nonce, y el script de entrada con nosniff', async () => {
    const base = await arrancar();

    const documento = await pedir(base, '/');
    const nonce = /'nonce-([^']+)'/.exec(String(documento.cabeceras['content-security-policy']))![1];
    const entrada = /<script type="module"[^>]*src="([^"]+)"/.exec(documento.cuerpo)![1];
    const script = await pedir(base, entrada);

    expect(documento.cuerpo).toContain(`nonce="${nonce}"`);
    expect(documento.cuerpo).not.toContain('NONCE_POR_RESPUESTA');
    expect(script.estado).toBe(200);
    expect(script.cabeceras).toMatchObject({ 'content-type': 'text/javascript; charset=utf-8', 'x-content-type-options': 'nosniff' });
  });

  it('un lector recibe 403 al eliminar, y la administradora, 204', async () => {
    const base = await arrancar();
    const [beto, ana] = [await entrar(base, 'beto@ejemplo.com'), await entrar(base, 'ana@ejemplo.com')];
    const eliminar = (cookie: string) => pedir(base, '/api/productos/p-2', { metodo: 'DELETE', cabeceras: { ...PROPIAS, cookie } });

    expect((await eliminar(beto)).estado).toBe(403);
    expect((await eliminar(ana)).estado).toBe(204);
  });

  it('ORIGEN_PUBLICO decide qué origen acepta la defensa CSRF', async () => {
    const base = await arrancar({ ORIGEN_PUBLICO: 'https://catalogo.example' });

    await expect(entrar(base, 'ana@ejemplo.com')).rejects.toThrow('403');
    const desdeSuOrigen = await pedir(base, '/api/sesion', { cabeceras: { ...PROPIAS, origin: 'https://catalogo.example' } });
    expect(desdeSuOrigen.estado).toBe(401);
    expect(ORIGEN).not.toBe('https://catalogo.example');
  });
});
