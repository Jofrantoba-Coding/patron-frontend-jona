// La frontera del cliente: lo que llega del BFF es texto JSON, no tipos. Estas funciones lo
// convierten en los tipos del dominio, o fallan. Copian solo los campos que conocen: un campo de
// más en la respuesta no llega a la pantalla.
import type { Producto } from '../dominio/Producto';
import type { SesionUsuario } from '../dominio/SesionUsuario';

export class ErrorRespuesta extends Error {
  constructor(motivo: string) {
    super(`Respuesta inesperada del servidor: ${motivo}`);
    this.name = 'ErrorRespuesta';
  }
}

type Objeto = Record<string, unknown>;

function objeto(valor: unknown, que: string): Objeto {
  if (typeof valor !== 'object' || valor === null || Array.isArray(valor)) throw new ErrorRespuesta(`${que} no es un objeto`);
  return valor as Objeto;
}

function texto(o: Objeto, campo: string): string {
  if (typeof o[campo] !== 'string') throw new ErrorRespuesta(`${campo} no es texto`);
  return o[campo];
}

export function leerProducto(valor: unknown): Producto {
  const o = objeto(valor, 'el producto');
  if (typeof o.precio !== 'number' || !Number.isFinite(o.precio)) throw new ErrorRespuesta('precio no es un número');
  const producto: Producto = { id: texto(o, 'id'), sku: texto(o, 'sku'), nombre: texto(o, 'nombre'), precio: o.precio, descripcion: texto(o, 'descripcion') };
  if (o.enlaceFabricante !== undefined) producto.enlaceFabricante = texto(o, 'enlaceFabricante');
  return producto;
}

export function leerProductos(valor: unknown): Producto[] {
  if (!Array.isArray(valor)) throw new ErrorRespuesta('la lista de productos no es una lista');
  return valor.map(leerProducto);
}

export function leerSesion(valor: unknown): SesionUsuario {
  const o = objeto(valor, 'la sesión');
  const usuario = objeto(o.usuario, 'el usuario');
  const permisos = objeto(o.permisos, 'los permisos');
  if (typeof permisos.eliminar !== 'boolean') throw new ErrorRespuesta('permisos.eliminar no es booleano');
  return { usuario: { nombre: texto(usuario, 'nombre') }, permisos: { eliminar: permisos.eliminar } };
}
