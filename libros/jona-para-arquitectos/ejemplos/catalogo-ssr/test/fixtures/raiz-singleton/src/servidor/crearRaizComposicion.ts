// Violación de la regla 4: la raíz de composición crea el repositorio al cargarse el módulo.
// Es uno solo para todas las peticiones del proceso: no puede llevar el usuario de ninguna, y
// las pruebas no pueden aislarlo.
import { crearRepositorioHttp } from './adaptadores/crearRepositorioHttp';

const repositorio = crearRepositorioHttp({ baseUrl: 'http://127.0.0.1:4020' });

export function crearRaizComposicion() {
  return { repositorioPara: () => repositorio };
}
