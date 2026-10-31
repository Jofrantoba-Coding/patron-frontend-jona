import type { DetalleCampo, InterAuthService } from './InterAuthService.js';

/** Datos de prueba del contrato de API (los mismos que el servidor mock). */
const USUARIOS = [
  { id: 1, usuario: 'ana@ejemplo.com', clave: 'secreta123', nombre: 'Ana Torres', bloqueado: false },
  { id: 2, usuario: 'bloqueado@ejemplo.com', clave: 'secreta123', nombre: 'Usuario Bloqueado', bloqueado: true },
];

/** Servicio falso en memoria: cumple el mismo contrato que el adaptador HTTP, sin red. */
export function crearAuthServiceFake(): InterAuthService {
  return {
    async iniciarSesion(correo, clave) {
      const detalles: DetalleCampo[] = (['correo', 'clave'] as const)
        .filter((campo) => ({ correo, clave })[campo] === '')
        .map((campo) => ({ campo, mensaje: 'Es obligatorio.' }));
      if (detalles.length > 0) return { tipo: 'error', codigo: 'VALIDATION_ERROR', detalles };
      const usuario = USUARIOS.find((u) => u.usuario === correo && u.clave === clave);
      if (!usuario) return { tipo: 'error', codigo: 'INVALID_CREDENTIALS', detalles: [] };
      if (usuario.bloqueado) return { tipo: 'error', codigo: 'USER_DISABLED', detalles: [] };
      return { tipo: 'ok', sesion: { token: `token-${usuario.id}`, usuario: { id: usuario.id, usuario: usuario.usuario, nombre: usuario.nombre } } };
    },
  };
}
