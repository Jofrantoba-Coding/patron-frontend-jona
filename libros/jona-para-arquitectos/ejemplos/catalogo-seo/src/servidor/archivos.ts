// Leer un archivo de una carpeta pública sin salir de ella. Lo usan el servidor SSR (dist/client)
// y el servidor del sitio estático (dist/estatico).
import { readFile, realpath, stat } from 'node:fs/promises';
import { extname, join, relative, resolve, sep } from 'node:path';

export const TIPOS: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

export const tipoDe = (archivo: string) => TIPOS[extname(archivo)] ?? 'application/octet-stream';

/** El archivo de `ruta` dentro de `dir`; una carpeta, por su index.html. undefined si no existe o sale de `dir`. */
export async function leerDentroDe(dir: string, ruta: string): Promise<{ archivo: string; contenido: Buffer } | undefined> {
  const base = resolve(dir);
  let archivo: string;
  try {
    archivo = resolve(join(base, decodeURIComponent(ruta)));
  } catch {
    return undefined;
  }
  if (archivo !== base && !archivo.startsWith(base + sep)) return undefined;
  const info = await stat(archivo).catch(() => undefined);
  if (info?.isDirectory()) archivo = join(archivo, 'index.html');
  // Distingue mayúsculas también en un disco que no las distingue (Windows, macOS): /productos/tec-001
  // no es /productos/TEC-001. Servirla con 200 publicaría la misma página en dos URLs.
  const real = await realpath(archivo).catch(() => undefined);
  if (real === undefined || relative(await realpath(base), real) !== relative(base, archivo)) return undefined;
  const contenido = await readFile(archivo).catch(() => undefined);
  return contenido && { archivo, contenido };
}
