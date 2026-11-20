// Adaptador HTTP del puerto InterInventario: traduce a la API de inventario y su formato de
// error ({ codigo, mensaje }) a un ErrorBackend.
import { ErrorBackend } from '../puertos/ErrorBackend.js';
import type { Existencia, InterInventario } from '../puertos/InterInventario.js';
import type { OpcionesAdaptadorHttp } from './crearCatalogoHttp.js';

export function crearInventarioHttp({ baseUrl, fetch: pedirHttp = fetch, tiempoLimiteMs = 3000 }: OpcionesAdaptadorHttp): InterInventario {
  async function pedir(ruta: string, metodo = 'GET', cuerpo?: unknown): Promise<Response> {
    try {
      return await pedirHttp(`${baseUrl}${ruta}`, {
        method: metodo,
        headers: { Accept: 'application/json', ...(cuerpo ? { 'Content-Type': 'application/json' } : {}) },
        body: cuerpo ? JSON.stringify(cuerpo) : undefined,
        signal: AbortSignal.timeout(tiempoLimiteMs),
      });
    } catch {
      throw new ErrorBackend('no-disponible', 'inventario no responde');
    }
  }

  function fallar(respuesta: Response): never {
    if (respuesta.status === 404) throw new ErrorBackend('no-encontrado');
    throw new ErrorBackend('no-disponible', `inventario respondió HTTP ${respuesta.status}`);
  }

  const ruta = (sku: string) => `/existencias/${encodeURIComponent(sku)}`;

  return {
    async consultar(skus) {
      if (skus.length === 0) return [];
      const consulta = new URLSearchParams(skus.map((sku): [string, string] => ['sku', sku]));
      const respuesta = await pedir(`/existencias?${consulta}`);
      if (!respuesta.ok) fallar(respuesta);
      return ((await respuesta.json()) as { existencias: Existencia[] }).existencias;
    },
    async fijar(sku, unidades) {
      const respuesta = await pedir(ruta(sku), 'PUT', { unidades });
      if (!respuesta.ok) fallar(respuesta);
      return (await respuesta.json()) as Existencia;
    },
    async eliminar(sku) {
      const respuesta = await pedir(ruta(sku), 'DELETE');
      if (respuesta.status !== 204) fallar(respuesta);
    },
  };
}
