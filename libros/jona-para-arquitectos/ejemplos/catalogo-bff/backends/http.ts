// Utilidades HTTP de los backends simulados: leer y responder JSON, y escuchar en un puerto.
// Solo node:http. No las usa el BFF: son de los backends, como lo sería su propio framework.
import type { IncomingMessage, Server, ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';

/** El cuerpo como JSON; undefined si no lo es. */
export async function leerJson(peticion: IncomingMessage): Promise<unknown> {
  let texto = '';
  for await (const parte of peticion) texto += parte;
  try {
    return JSON.parse(texto);
  } catch {
    return undefined;
  }
}

export function responder(respuesta: ServerResponse, estado: number, cuerpo?: unknown): void {
  respuesta.writeHead(estado, cuerpo === undefined ? {} : { 'Content-Type': 'application/json' });
  respuesta.end(cuerpo === undefined ? undefined : JSON.stringify(cuerpo));
}

export interface Escuchando {
  url: string;
  cerrar: () => Promise<void>;
}

/** Escucha en 127.0.0.1; con el puerto 0, en uno libre. */
export async function escuchar(servidor: Server, puerto: number): Promise<Escuchando> {
  await new Promise<void>((listo) => servidor.listen(puerto, '127.0.0.1', listo));
  const { port } = servidor.address() as AddressInfo;
  return {
    url: `http://127.0.0.1:${port}`,
    cerrar: () => new Promise((listo) => {
      servidor.closeAllConnections();
      servidor.close(() => listo());
    }),
  };
}
