import type { InterAuthService, Sesion } from './InterAuthService.js';

/** Adaptador HTTP: el único lugar del ejemplo que habla con la red. */
export class AuthServiceHttp implements InterAuthService {
  constructor(private readonly baseUrl: string) {}

  async login(correo: string, clave: string): Promise<Sesion> {
    const respuesta = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario: correo, clave }),
    });
    if (!respuesta.ok) throw new Error(`El servidor respondió ${respuesta.status}.`);
    return (await respuesta.json()) as Sesion;
  }
}
