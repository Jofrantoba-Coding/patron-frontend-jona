// Violación de la regla 4: el import() depende de la URL, no de import.meta.env.DEV. En
// producción, cualquiera que agregue ?falso a la URL carga el servicio falso.
import { crearServicioFetch } from './crearServicioFetch';

export function elegirServicio() {
  if (new URLSearchParams(window.location.search).has('falso')) {
    return import('./servicioFalso').then((modulo) => modulo.crearServicioFalso());
  }
  return Promise.resolve(crearServicioFetch());
}
