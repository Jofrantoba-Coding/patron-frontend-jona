// Qué puede hacer cada rol. Es la única tabla de permisos del sistema: el servidor la consulta para
// autorizar, y con ella calcula los permisos que la UI recibe como datos.
import type { SesionUsuario } from '../dominio/SesionUsuario';
import type { Rol, Usuario } from './usuarios';

export type Accion = 'listar' | 'eliminar';

const PERMITIDAS: Record<Rol, readonly Accion[]> = {
  administrador: ['listar', 'eliminar'],
  lector: ['listar'],
};

/** Denegar por defecto: lo que no está en la tabla no se puede. */
export const puede = (rol: Rol, accion: Accion): boolean => PERMITIDAS[rol]?.includes(accion) ?? false;

/** Lo que el navegador sabe de la sesión: ni el correo, ni el rol, ni el identificador. */
export const sesionPublica = (usuario: Usuario): SesionUsuario => ({
  usuario: { nombre: usuario.nombre },
  permisos: { eliminar: puede(usuario.rol, 'eliminar') },
});
