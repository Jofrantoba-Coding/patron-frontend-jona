// Raíz de composición del BFF: arma una vez lo que dura lo que el proceso. Exporta una fábrica:
// cada proceso y cada prueba tienen sus propias sesiones y sus propios datos.
import { crearRepositorioProductos, PRODUCTOS_DE_EJEMPLO, type InterRepositorioProductos } from './repositorioProductos';
import { crearAlmacenSesiones, type InterAlmacenSesiones } from './sesiones';
import { crearDirectorioUsuarios, registrarUsuario, type InterDirectorioUsuarios } from './usuarios';

/** Variables del servidor, no VITE_*: Vite no las compila en el cliente. */
export interface EntornoServidor {
  /** El origen con el que el navegador abre la aplicación: lo compara la defensa CSRF. */
  ORIGEN_PUBLICO?: string;
}

export interface RaizComposicion {
  origen: string;
  usuarios: InterDirectorioUsuarios;
  sesiones: InterAlmacenSesiones;
  productos: InterRepositorioProductos;
}

/**
 * Usuarios de demostración, con la contraseña de prueba del libro. Se registran al arrancar, así
 * que el directorio solo guarda hashes; en producción, el directorio es el proveedor de identidad.
 */
const USUARIOS_DE_DEMOSTRACION = [
  { email: 'ana@ejemplo.com', nombre: 'Ana', rol: 'administrador', clave: 'secreta123' },
  { email: 'beto@ejemplo.com', nombre: 'Beto', rol: 'lector', clave: 'secreta123' },
] as const;

export async function crearRaizComposicion(entorno: EntornoServidor): Promise<RaizComposicion> {
  const registrados = await Promise.all(USUARIOS_DE_DEMOSTRACION.map(({ clave, ...usuario }) => registrarUsuario(usuario, clave)));
  return {
    origen: entorno.ORIGEN_PUBLICO ?? 'http://localhost:4070',
    usuarios: crearDirectorioUsuarios(registrados),
    sesiones: crearAlmacenSesiones(),
    productos: crearRepositorioProductos(PRODUCTOS_DE_EJEMPLO),
  };
}
