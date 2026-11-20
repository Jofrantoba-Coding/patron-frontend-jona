// Un servidor de archivos mínimo para dist/estatico, sin dependencias: hace lo que haría el
// alojamiento estático. Una carpeta se sirve por su index.html, y lo que no existe responde 404
// con el contenido de 404.html, la convención de muchos alojamientos estáticos.
import { readFile } from 'node:fs/promises';
import { createServer, type Server } from 'node:http';
import { join } from 'node:path';
import { leerDentroDe, tipoDe, TIPOS } from './archivos';

export function crearServidorEstatico(dir: string): Server {
  return createServer((peticion, respuesta) => {
    const url = new URL(peticion.url ?? '/', 'http://localhost');
    leerDentroDe(dir, url.pathname)
      .then(async (encontrado) => {
        if (encontrado) {
          respuesta.writeHead(200, { 'Content-Type': tipoDe(encontrado.archivo) });
          return respuesta.end(encontrado.contenido);
        }
        respuesta.writeHead(404, { 'Content-Type': TIPOS['.html'] });
        respuesta.end(await readFile(join(dir, '404.html')).catch(() => 'No encontrado'));
      })
      .catch(() => {
        respuesta.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        respuesta.end('Error');
      });
  });
}
