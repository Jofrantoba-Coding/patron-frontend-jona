// Adaptador HTTP del puerto: traduce cada operación a la API REST de productos, y cada
// código de estado a un ErrorRepositorio. Ninguna otra pieza ve una URL ni un código HTTP.
import { ErrorRepositorio } from '../../../shared/api';
import type { InterProductoRepositorio } from '../model/InterProductoRepositorio';
import type { DatosProducto, Producto } from '../model/Producto';

export interface OpcionesRepositorioHttp {
  baseUrl: string;
  /** Inyectable para las pruebas; por defecto, el fetch global. */
  fetch?: typeof fetch;
}

export function crearRepositorioHttp({ baseUrl, fetch: pedirHttp = fetch }: OpcionesRepositorioHttp): InterProductoRepositorio {
  async function pedir(ruta: string, metodo = 'GET', cuerpo?: DatosProducto): Promise<Response> {
    try {
      return await pedirHttp(`${baseUrl}${ruta}`, {
        method: metodo,
        headers: { Accept: 'application/json', ...(cuerpo ? { 'Content-Type': 'application/json' } : {}) },
        body: cuerpo ? JSON.stringify(cuerpo) : undefined,
      });
    } catch {
      throw new ErrorRepositorio('red', 'Sin conexión con el servidor');
    }
  }

  function fallar(respuesta: Response): never {
    if (respuesta.status === 404) throw new ErrorRepositorio('no-encontrado');
    if (respuesta.status === 409) throw new ErrorRepositorio('conflicto');
    throw new ErrorRepositorio('red', `HTTP ${respuesta.status}`);
  }

  return {
    async listar(termino = '') {
      const respuesta = await pedir(`/productos?q=${encodeURIComponent(termino)}`);
      if (!respuesta.ok) fallar(respuesta);
      return (await respuesta.json()) as Producto[];
    },
    async obtener(id) {
      const respuesta = await pedir(`/productos/${encodeURIComponent(id)}`);
      if (respuesta.status === 404) return undefined;
      if (!respuesta.ok) fallar(respuesta);
      return (await respuesta.json()) as Producto;
    },
    async crear(datos) {
      const respuesta = await pedir('/productos', 'POST', datos);
      if (respuesta.status !== 201) fallar(respuesta);
      return (await respuesta.json()) as Producto;
    },
    async actualizar(id, datos) {
      const respuesta = await pedir(`/productos/${encodeURIComponent(id)}`, 'PUT', datos);
      if (!respuesta.ok) fallar(respuesta);
      return (await respuesta.json()) as Producto;
    },
    async eliminar(id) {
      const respuesta = await pedir(`/productos/${encodeURIComponent(id)}`, 'DELETE');
      if (respuesta.status !== 204) fallar(respuesta);
    },
  };
}
