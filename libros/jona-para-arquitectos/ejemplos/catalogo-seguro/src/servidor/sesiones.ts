// Las sesiones del BFF. El navegador solo guarda el identificador, en una cookie HttpOnly; lo que
// la sesión vale (el usuario y su rol, y en un BFF con OAuth, los tokens) se queda aquí.
import { randomBytes } from 'node:crypto';
import type { Usuario } from './usuarios';

export interface InterAlmacenSesiones {
  /** Una sesión nueva, con un identificador nuevo. */
  crear(usuario: Usuario): string;
  /** El usuario de una sesión viva; cada lectura la extiende. */
  leer(id: string | undefined): Usuario | undefined;
  destruir(id: string | undefined): void;
}

export interface OpcionesSesiones {
  /** Cuánto dura una sesión sin uso. */
  inactividadMs?: number;
  ahora?: () => number;
}

/** 256 bits de un generador criptográfico: imposible de adivinar, y base64url cabe en una cookie. */
const nuevoId = () => randomBytes(32).toString('base64url');

export function crearAlmacenSesiones({ inactividadMs = 30 * 60_000, ahora = Date.now }: OpcionesSesiones = {}): InterAlmacenSesiones {
  const sesiones = new Map<string, { usuario: Usuario; vence: number }>();
  return {
    crear(usuario) {
      const id = nuevoId();
      sesiones.set(id, { usuario, vence: ahora() + inactividadMs });
      return id;
    },
    leer(id) {
      const sesion = id === undefined ? undefined : sesiones.get(id);
      if (!sesion || !id) return undefined;
      if (ahora() > sesion.vence) {
        sesiones.delete(id);
        return undefined;
      }
      sesion.vence = ahora() + inactividadMs;
      return sesion.usuario;
    },
    destruir(id) {
      if (id !== undefined) sesiones.delete(id);
    },
  };
}
