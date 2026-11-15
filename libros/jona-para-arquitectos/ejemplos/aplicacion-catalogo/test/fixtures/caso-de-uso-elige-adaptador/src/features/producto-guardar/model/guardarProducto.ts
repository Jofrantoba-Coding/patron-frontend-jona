// Violación: el caso de uso crea su adaptador en lugar de recibir el puerto; solo app elige.
import { crearRepositorioHttp } from '../../../entities/producto';

const repositorio = crearRepositorioHttp({ baseUrl: 'http://127.0.0.1:4020' });

export const guardarProducto = (datos: unknown) => repositorio.crear(datos);
