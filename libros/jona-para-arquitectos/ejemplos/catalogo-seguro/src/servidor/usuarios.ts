// El directorio de usuarios del ejemplo. En producción este papel lo cumple el proveedor de
// identidad, y el BFF solo recibe su respuesta; aquí vive en el BFF para que el ejemplo no
// dependa de otro servicio. Lo que importa al capítulo es lo que sale de aquí: un usuario con su
// rol, nunca una contraseña ni un hash.
import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from 'node:crypto';

export type Rol = 'administrador' | 'lector';

export interface Usuario {
  email: string;
  nombre: string;
  rol: Rol;
}

export interface UsuarioRegistrado extends Usuario {
  sal: string;
  hash: string;
}

export interface InterDirectorioUsuarios {
  /** El usuario si la contraseña es la suya; si no, nada, sin decir qué falló. */
  verificar(email: string, clave: string): Promise<Usuario | undefined>;
}

/** Una de las configuraciones mínimas de scrypt que recomienda OWASP: N=2^14, r=8, p=5 (16 MiB). */
const PARAMETROS: ScryptOptions = { N: 2 ** 14, r: 8, p: 5 };
const LARGO = 64;

function derivar(clave: string, sal: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(clave, sal, LARGO, PARAMETROS, (error, clave) => (error ? reject(error) : resolve(clave)));
  });
}

const normalizar = (email: string) => email.trim().toLowerCase();

/** Guarda el hash con una sal propia. La contraseña no sale de esta función. */
export async function registrarUsuario(usuario: Usuario, clave: string): Promise<UsuarioRegistrado> {
  const sal = randomBytes(16).toString('base64');
  return { ...usuario, email: normalizar(usuario.email), sal, hash: (await derivar(clave, sal)).toString('base64') };
}

export function crearDirectorioUsuarios(registrados: readonly UsuarioRegistrado[]): InterDirectorioUsuarios {
  // Con un correo desconocido también se deriva, contra una sal cualquiera: así la respuesta no
  // tarda menos cuando el correo no existe.
  const salFicticia = randomBytes(16).toString('base64');
  return {
    async verificar(email, clave) {
      const registrado = registrados.find((r) => r.email === normalizar(email));
      const calculado = await derivar(clave, registrado?.sal ?? salFicticia);
      const esperado = registrado ? Buffer.from(registrado.hash, 'base64') : Buffer.alloc(LARGO);
      if (!timingSafeEqual(calculado, esperado) || !registrado) return undefined;
      return { email: registrado.email, nombre: registrado.nombre, rol: registrado.rol };
    },
  };
}
