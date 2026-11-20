// Violación de las reglas 1 y 2: el manejador importa el adaptador y lo crea. Depende de un
// detalle (regla 1) y elige con qué backend se habla (regla 2).
import { crearCatalogoHttp } from '../adaptadores/crearCatalogoHttp.js';

export function crearManejadoresProductos() {
  const catalogo = crearCatalogoHttp({ baseUrl: 'http://127.0.0.1:4021' });
  return {
    listar: (termino = '') => catalogo.buscar(termino),
  };
}
