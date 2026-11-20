// Peticiones HTTP con node:http y no con fetch: las pruebas tienen que poder enviar las cabeceras
// que pone el navegador (Origin, Sec-Fetch-Site, Cookie) con el valor que elijan.
import { request, type IncomingHttpHeaders, type Server } from 'node:http';

export interface Respuesta {
  estado: number;
  cabeceras: IncomingHttpHeaders;
  cuerpo: string;
}

export interface Pedido {
  metodo?: string;
  cabeceras?: Record<string, string>;
  cuerpo?: string;
}

export function pedir(base: string, ruta: string, { metodo = 'GET', cabeceras = {}, cuerpo }: Pedido = {}): Promise<Respuesta> {
  return new Promise((resolve, reject) => {
    const peticion = request(new URL(ruta, base), { method: metodo, headers: cabeceras }, (respuesta) => {
      const partes: Buffer[] = [];
      respuesta.on('data', (parte: Buffer) => partes.push(parte));
      respuesta.on('end', () => resolve({ estado: respuesta.statusCode ?? 0, cabeceras: respuesta.headers, cuerpo: Buffer.concat(partes).toString('utf8') }));
    });
    peticion.on('error', reject);
    peticion.end(cuerpo);
  });
}

export const ORIGEN = 'http://localhost:4070';

/** Lo que manda el cliente de este ejemplo desde su propia página. */
export const PROPIAS = { 'x-jona-csrf': '1', origin: ORIGEN, 'sec-fetch-site': 'same-origin' } as const;

/** Inicia sesión y devuelve la cookie lista para la cabecera Cookie. */
export async function entrar(base: string, email: string, clave = 'secreta123', cookie?: string): Promise<string> {
  const respuesta = await pedir(base, '/api/sesion', {
    metodo: 'POST',
    cabeceras: { ...PROPIAS, 'content-type': 'application/json', ...(cookie ? { cookie } : {}) },
    cuerpo: JSON.stringify({ email, clave }),
  });
  if (respuesta.estado !== 200) throw new Error(`No se pudo entrar como ${email}: ${respuesta.estado}`);
  return respuesta.cabeceras['set-cookie']![0].split(';')[0];
}

/** Arranca un servidor en un puerto libre y devuelve su URL. */
export async function escuchar(servidor: Server): Promise<string> {
  await new Promise<void>((resolve) => servidor.listen(0, '127.0.0.1', resolve));
  return `http://127.0.0.1:${(servidor.address() as { port: number }).port}`;
}
