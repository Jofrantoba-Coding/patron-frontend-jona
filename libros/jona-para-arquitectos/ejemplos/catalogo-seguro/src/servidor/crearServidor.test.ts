// @vitest-environment node
// El BFF de punta a punta, en proceso: sesión, autorización, CSRF, documento y estáticos.
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import type { Server } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { ORIGEN, PROPIAS, entrar, escuchar, pedir } from '../../test/pedir';
import { crearRaizComposicion, type RaizComposicion } from './crearRaizComposicion';
import { crearServidor } from './crearServidor';
import { MARCA_NONCE } from './documento';

const PLANTILLA = `<!doctype html><html><head><meta property="csp-nonce" nonce="${MARCA_NONCE}" /></head><body><script type="module" nonce="${MARCA_NONCE}" src="/assets/entrada.js"></script></body></html>`;

let abierto: Server | undefined;
afterEach(() => abierto?.close());

async function arrancar(cambiar: (raiz: RaizComposicion) => RaizComposicion = (r) => r, dirEstaticos?: string) {
  const raiz = cambiar(await crearRaizComposicion({ ORIGEN_PUBLICO: ORIGEN }));
  abierto = crearServidor({ raiz, plantilla: PLANTILLA, dirEstaticos });
  return { base: await escuchar(abierto), raiz };
}

const conCookie = (cookie: string) => ({ ...PROPIAS, cookie });
const ids = (cuerpo: string) => (JSON.parse(cuerpo) as Array<{ id: string }>).map((p) => p.id);

describe('la sesión vive en el BFF', () => {
  it('entrar responde la sesión pública y una cookie __Host- con Secure, HttpOnly y SameSite=Strict', async () => {
    const { base } = await arrancar();

    const respuesta = await pedir(base, '/api/sesion', {
      metodo: 'POST', cabeceras: { ...PROPIAS, 'content-type': 'application/json' }, cuerpo: JSON.stringify({ email: 'ana@ejemplo.com', clave: 'secreta123' }),
    });

    expect(respuesta.estado).toBe(200);
    expect(JSON.parse(respuesta.cuerpo)).toEqual({ usuario: { nombre: 'Ana' }, permisos: { eliminar: true } });
    const [cookie] = respuesta.cabeceras['set-cookie']!;
    expect(cookie).toMatch(/^__Host-sesion=[A-Za-z0-9_-]{43}; Path=\/; Secure; HttpOnly; SameSite=Strict$/);
    expect(respuesta.cuerpo).not.toContain(cookie.split(';')[0].split('=')[1]);
  });

  it('una contraseña incorrecta y un correo desconocido reciben la misma respuesta, sin cookie', async () => {
    const { base } = await arrancar();
    const intentar = (email: string, clave: string) => pedir(base, '/api/sesion', {
      metodo: 'POST', cabeceras: { ...PROPIAS, 'content-type': 'application/json' }, cuerpo: JSON.stringify({ email, clave }),
    });

    const [mal, nadie] = [await intentar('ana@ejemplo.com', 'otra'), await intentar('nadie@ejemplo.com', 'secreta123')];

    expect([mal.estado, nadie.estado]).toEqual([401, 401]);
    expect(mal.cuerpo).toBe(nadie.cuerpo);
    expect([mal.cabeceras['set-cookie'], nadie.cabeceras['set-cookie']]).toEqual([undefined, undefined]);
  });

  it('entrar renueva el identificador: la cookie anterior deja de valer (fijación de sesión)', async () => {
    const { base } = await arrancar();
    const primera = await entrar(base, 'ana@ejemplo.com');

    const segunda = await entrar(base, 'ana@ejemplo.com', 'secreta123', primera);

    expect(segunda).not.toBe(primera);
    expect((await pedir(base, '/api/sesion', { cabeceras: conCookie(primera) })).estado).toBe(401);
    expect((await pedir(base, '/api/sesion', { cabeceras: conCookie(segunda) })).estado).toBe(200);
  });

  it('salir destruye la sesión en el servidor y pide al navegador borrar la cookie', async () => {
    const { base } = await arrancar();
    const cookie = await entrar(base, 'ana@ejemplo.com');

    const salida = await pedir(base, '/api/sesion', { metodo: 'DELETE', cabeceras: conCookie(cookie) });

    expect(salida.estado).toBe(204);
    expect(salida.cabeceras['set-cookie']![0]).toContain('Max-Age=0');
    expect((await pedir(base, '/api/productos', { cabeceras: conCookie(cookie) })).estado).toBe(401);
  });

  it('un cuerpo que no es el esperado responde 400, y uno demasiado grande, 413', async () => {
    const { base } = await arrancar();
    const enviar = (cuerpo: string) => pedir(base, '/api/sesion', { metodo: 'POST', cabeceras: { ...PROPIAS, 'content-type': 'application/json' }, cuerpo });

    expect((await enviar('{"email": 1}')).estado).toBe(400);
    expect((await enviar('no es JSON')).estado).toBe(400);
    expect((await enviar(JSON.stringify({ email: 'a', clave: 'x'.repeat(5000) }))).estado).toBe(413);
  });
});

describe('la autorización la decide el servidor', () => {
  it('sin sesión, los productos responden 401', async () => {
    const { base } = await arrancar();

    expect((await pedir(base, '/api/productos', { cabeceras: PROPIAS })).estado).toBe(401);
  });

  it('el lector recibe sus permisos como datos: no puede eliminar', async () => {
    const { base } = await arrancar();
    const cookie = await entrar(base, 'beto@ejemplo.com');

    const sesion = await pedir(base, '/api/sesion', { cabeceras: conCookie(cookie) });

    expect(JSON.parse(sesion.cuerpo)).toEqual({ usuario: { nombre: 'Beto' }, permisos: { eliminar: false } });
  });

  it('aunque la UI no le muestre el botón, un lector que pide DELETE recibe 403, y el producto sigue', async () => {
    const { base } = await arrancar();
    const cookie = await entrar(base, 'beto@ejemplo.com');

    const borrado = await pedir(base, '/api/productos/p-1', { metodo: 'DELETE', cabeceras: conCookie(cookie) });

    expect(borrado.estado).toBe(403);
    expect(ids((await pedir(base, '/api/productos', { cabeceras: conCookie(cookie) })).cuerpo)).toContain('p-1');
  });

  it('el administrador elimina: 204, y el producto ya no está', async () => {
    const { base } = await arrancar();
    const cookie = await entrar(base, 'ana@ejemplo.com');

    const borrado = await pedir(base, '/api/productos/p-1', { metodo: 'DELETE', cabeceras: conCookie(cookie) });

    expect(borrado.estado).toBe(204);
    expect(ids((await pedir(base, '/api/productos', { cabeceras: conCookie(cookie) })).cuerpo)).not.toContain('p-1');
  });
});

describe('la defensa CSRF cubre todo /api', () => {
  it('sin la cabecera propia, la cookie viaja pero el BFF responde 403 y no elimina', async () => {
    const { base } = await arrancar();
    const cookie = await entrar(base, 'ana@ejemplo.com');

    const borrado = await pedir(base, '/api/productos/p-1', { metodo: 'DELETE', cabeceras: { cookie, origin: ORIGEN } });

    expect(borrado.estado).toBe(403);
    expect(ids((await pedir(base, '/api/productos', { cabeceras: conCookie(cookie) })).cuerpo)).toContain('p-1');
  });

  it('desde otro origen tampoco se puede iniciar sesión (CSRF de inicio de sesión)', async () => {
    const { base } = await arrancar();

    const respuesta = await pedir(base, '/api/sesion', {
      metodo: 'POST',
      cabeceras: { ...PROPIAS, origin: 'https://atacante.example', 'content-type': 'application/json' },
      cuerpo: JSON.stringify({ email: 'ana@ejemplo.com', clave: 'secreta123' }),
    });

    expect(respuesta.estado).toBe(403);
    expect(respuesta.cabeceras['set-cookie']).toBeUndefined();
  });
});

describe('el documento y las respuestas', () => {
  it('cada respuesta del documento trae su propio nonce, el mismo en la CSP y en cada script', async () => {
    const { base } = await arrancar();

    const [una, otra] = [await pedir(base, '/'), await pedir(base, '/')];

    for (const respuesta of [una, otra]) {
      const nonce = /'nonce-([^']+)'/.exec(String(respuesta.cabeceras['content-security-policy']))![1];
      expect(respuesta.cuerpo.match(/nonce="([^"]+)"/g)).toEqual([`nonce="${nonce}"`, `nonce="${nonce}"`]);
      expect(respuesta.cabeceras['cache-control']).toBe('no-store');
    }
    expect(una.cabeceras['content-security-policy']).not.toBe(otra.cabeceras['content-security-policy']);
  });

  it('un error interno responde 500 sin detalles: el mensaje se queda en el registro del servidor', async () => {
    const { base } = await arrancar((raiz) => ({
      ...raiz,
      productos: { listar: () => Promise.reject(new Error('conexión a db-interna:5432 rechazada')), eliminar: () => Promise.resolve(false) },
    }));
    const cookie = await entrar(base, 'ana@ejemplo.com');
    const consola = console.error;
    console.error = () => {};

    const respuesta = await pedir(base, '/api/productos', { cabeceras: conCookie(cookie) }).finally(() => { console.error = consola; });

    expect(respuesta.estado).toBe(500);
    expect(JSON.parse(respuesta.cuerpo)).toEqual({ error: 'interno' });
    expect(respuesta.cabeceras).toMatchObject({ 'x-content-type-options': 'nosniff', 'cache-control': 'no-store' });
  });

  it('los estáticos salen de su carpeta y de ninguna otra: ../ no llega', async () => {
    const raizTemporal = mkdtempSync(join(tmpdir(), 'catalogo-seguro-'));
    const dir = join(raizTemporal, 'publico');
    mkdirSync(dir);
    writeFileSync(join(dir, 'entrada.js'), 'export {};');
    writeFileSync(join(raizTemporal, 'privado.txt'), 'no se sirve');
    const { base } = await arrancar(undefined, dir);

    // %2F no lo normaliza el analizador de URL: llega como ../privado.txt al decodificar.
    const [archivo, fuera] = [await pedir(base, '/entrada.js'), await pedir(base, '/..%2Fprivado.txt')];

    expect(archivo.estado).toBe(200);
    expect(archivo.cabeceras).toMatchObject({ 'content-type': 'text/javascript; charset=utf-8', 'x-content-type-options': 'nosniff' });
    expect(fuera.estado).toBe(404);
  });
});
