// Adaptador HTTP del puerto (el del capítulo 14, con dos agregados del servidor): reenvía las
// cabeceras propias de la petición que lo creó y se identifica con X-Origen ante la API.
import type { DatosProducto, Producto } from '../../dominio/Producto';
import { ErrorRepositorio } from '../ErrorRepositorio';
import type { InterProductoRepositorio } from '../InterProductoRepositorio';

/**
 * Marca de este adaptador: viaja como X-Origen y es la cadena que test/artefacto.test.ts busca
 * en dist/client para comprobar que el código del servidor no llega al navegador.
 */
export const ORIGEN_ADAPTADOR_HTTP = 'jona-catalogo-ssr/adaptador-http';

export interface OpcionesRepositorioHttp {
  baseUrl: string;
  /** Cabeceras de la petición en curso (usuario, traza). Por eso el adaptador se crea por petición. */
  cabeceras?: Record<string, string | undefined>;
  /** Inyectable para las pruebas; por defecto, el fetch global. */
  fetch?: typeof fetch;
}

export function crearRepositorioHttp({ baseUrl, cabeceras = {}, fetch: pedirHttp = fetch }: OpcionesRepositorioHttp): InterProductoRepositorio {
  const propias = Object.fromEntries(Object.entries(cabeceras).filter((par): par is [string, string] => par[1] !== undefined));

  async function pedir(ruta: string, metodo = 'GET', cuerpo?: DatosProducto): Promise<Response> {
    try {
      return await pedirHttp(`${baseUrl}${ruta}`, {
        method: metodo,
        headers: {
          ...propias,
          Accept: 'application/json',
          'X-Origen': ORIGEN_ADAPTADOR_HTTP,
          ...(cuerpo ? { 'Content-Type': 'application/json' } : {}),
        },
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
