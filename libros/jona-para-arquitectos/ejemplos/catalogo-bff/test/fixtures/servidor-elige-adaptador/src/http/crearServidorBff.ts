// Violación de la regla 2: la capa HTTP crea su adaptador. La URL del backend queda fija aquí y
// la raíz de composición deja de ser el único lugar que decide con qué se habla.
import { createServer } from 'node:http';
import { crearCatalogoHttp } from '../adaptadores/crearCatalogoHttp.js';

export function crearServidorBff() {
  const catalogo = crearCatalogoHttp({ baseUrl: 'http://127.0.0.1:4021' });
  return createServer(async (_peticion, respuesta) => {
    respuesta.end(JSON.stringify(await catalogo.buscar('')));
  });
}
