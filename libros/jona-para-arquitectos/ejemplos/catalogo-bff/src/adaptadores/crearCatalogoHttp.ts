// Adaptador HTTP del puerto InterCatalogo: traduce cada operación a la API de catalogo y su
// formato de falla ({ falla: { tipo } } con 404 y 422) a un ErrorBackend.
import { ErrorBackend } from '../puertos/ErrorBackend.js';
import type { Articulo, DatosArticulo, InterCatalogo } from '../puertos/InterCatalogo.js';

export interface OpcionesAdaptadorHttp {
  baseUrl: string;
  /** Inyectable para las pruebas; por defecto, el fetch global. */
  fetch?: typeof fetch;
  /** Un backend que no contesta no debe dejar colgada a la SPA. */
  tiempoLimiteMs?: number;
}

interface FallaCatalogo {
  falla?: { tipo?: string; detalle?: string };
}

export function crearCatalogoHttp({ baseUrl, fetch: pedirHttp = fetch, tiempoLimiteMs = 3000 }: OpcionesAdaptadorHttp): InterCatalogo {
  async function pedir(ruta: string, metodo = 'GET', cuerpo?: DatosArticulo): Promise<Response> {
    try {
      return await pedirHttp(`${baseUrl}${ruta}`, {
        method: metodo,
        headers: { Accept: 'application/json', ...(cuerpo ? { 'Content-Type': 'application/json' } : {}) },
        body: cuerpo ? JSON.stringify(cuerpo) : undefined,
        signal: AbortSignal.timeout(tiempoLimiteMs),
      });
    } catch {
      throw new ErrorBackend('no-disponible', 'catalogo no responde');
    }
  }

  async function fallar(respuesta: Response): Promise<never> {
    const { falla } = ((await respuesta.json().catch(() => ({}))) ?? {}) as FallaCatalogo;
    if (respuesta.status === 404) throw new ErrorBackend('no-encontrado', falla?.detalle);
    // Solo este tipo es un conflicto: el BFF traduce la decisión de catalogo, no la toma.
    if (respuesta.status === 422 && falla?.tipo === 'SKU_DUPLICADO') throw new ErrorBackend('conflicto', falla.detalle);
    throw new ErrorBackend('no-disponible', `catalogo respondió HTTP ${respuesta.status}`);
  }

  const ruta = (codigo: string) => `/articulos/${encodeURIComponent(codigo)}`;

  return {
    async buscar(texto) {
      const respuesta = await pedir(`/articulos?texto=${encodeURIComponent(texto)}`);
      if (!respuesta.ok) return fallar(respuesta);
      return ((await respuesta.json()) as { datos: Articulo[] }).datos;
    },
    async obtener(codigo) {
      const respuesta = await pedir(ruta(codigo));
      if (respuesta.status === 404) return undefined;
      if (!respuesta.ok) return fallar(respuesta);
      return (await respuesta.json()) as Articulo;
    },
    async crear(datos) {
      const respuesta = await pedir('/articulos', 'POST', datos);
      if (respuesta.status !== 201) return fallar(respuesta);
      return (await respuesta.json()) as Articulo;
    },
    async actualizar(codigo, datos) {
      const respuesta = await pedir(ruta(codigo), 'PUT', datos);
      if (!respuesta.ok) return fallar(respuesta);
      return (await respuesta.json()) as Articulo;
    },
    async eliminar(codigo) {
      const respuesta = await pedir(ruta(codigo), 'DELETE');
      if (!respuesta.ok) await fallar(respuesta);
    },
  };
}
