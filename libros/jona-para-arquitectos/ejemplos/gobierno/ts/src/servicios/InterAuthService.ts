/** Tipo de dominio que devuelve el inicio de sesión. */
export interface Sesion {
  token: string;
  nombre: string;
}

/** Contrato de servicio (puerto): la unidad depende de esto, nunca de un adaptador. */
export interface InterAuthService {
  login: (correo: string, clave: string) => Promise<Sesion>;
}
