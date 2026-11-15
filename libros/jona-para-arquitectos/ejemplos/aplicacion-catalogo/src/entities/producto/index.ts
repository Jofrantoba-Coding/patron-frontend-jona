// API pública de la entidad (FSD) = lo que el resto de la aplicación conoce del producto:
// el dominio, el puerto y las fábricas de adaptadores (estas, solo para app).
export {
  BORRADOR_VACIO,
  borradorDe,
  coincide,
  validarProducto,
  type BorradorProducto,
  type CampoProducto,
  type DatosProducto,
  type ErroresProducto,
  type Producto,
  type Validacion,
} from './model/Producto';
export type { InterProductoRepositorio } from './model/InterProductoRepositorio';
// Solo app las importa: es la raíz de composición (regla 4 de test/architecture).
export { crearRepositorioHttp, type OpcionesRepositorioHttp } from './api/crearRepositorioHttp';
export { crearRepositorioMemoria } from './api/crearRepositorioMemoria';
