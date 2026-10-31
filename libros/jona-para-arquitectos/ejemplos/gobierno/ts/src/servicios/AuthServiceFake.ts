import type { InterAuthService, Sesion } from './InterAuthService.js';

/** Adaptador falso en memoria: la misma promesa que el HTTP, sin red. */
export class AuthServiceFake implements InterAuthService {
  async login(correo: string, clave: string): Promise<Sesion> {
    if (correo === 'ana@ejemplo.com' && clave === 'secreta123') return { token: 'falso', nombre: 'Ana Torres' };
    throw new Error('Correo o contraseña incorrectos.');
  }
}
