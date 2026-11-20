// Adaptador del cliente: los contratos de servicio de las pantallas sobre la API del BFF. Mismo
// origen, sin token: la sesión viaja en una cookie que este código no puede leer ni necesita.
import { CABECERA_CSRF, VALOR_CSRF } from '../compartido/protocolo';
import type { InterServicioAplicacion } from '../ui/aplicacion';
import { leerProductos, leerSesion } from './leerRespuestas';

export { ErrorRespuesta } from './leerRespuestas';

export interface OpcionesServicioFetch {
  fetch?: typeof fetch;
}

export function crearServicioFetch({ fetch: pedirBase = fetch }: OpcionesServicioFetch = {}): InterServicioAplicacion {
  const pedir = (ruta: string, opciones: RequestInit = {}) =>
    pedirBase(ruta, {
      ...opciones,
      credentials: 'same-origin',
      headers: { Accept: 'application/json', [CABECERA_CSRF]: VALOR_CSRF, ...opciones.headers },
    });

  const fallo = (respuesta: Response) => new Error(`HTTP ${respuesta.status}`);

  return {
    async actual() {
      const respuesta = await pedir('/api/sesion');
      if (respuesta.status === 401) return undefined;
      if (!respuesta.ok) throw fallo(respuesta);
      return leerSesion(await respuesta.json());
    },
    async entrar(email, clave) {
      const respuesta = await pedir('/api/sesion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, clave }),
      });
      if (respuesta.status === 401) return undefined;
      if (!respuesta.ok) throw fallo(respuesta);
      return leerSesion(await respuesta.json());
    },
    async salir() {
      const respuesta = await pedir('/api/sesion', { method: 'DELETE' });
      if (!respuesta.ok) throw fallo(respuesta);
    },
    async listar() {
      const respuesta = await pedir('/api/productos');
      if (!respuesta.ok) throw fallo(respuesta);
      return leerProductos(await respuesta.json());
    },
    async eliminar(id) {
      const respuesta = await pedir(`/api/productos/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (respuesta.status === 204) return 'eliminado';
      if (respuesta.status === 403) return 'prohibido';
      if (respuesta.status === 404) return 'no-encontrado';
      throw fallo(respuesta);
    },
  };
}
