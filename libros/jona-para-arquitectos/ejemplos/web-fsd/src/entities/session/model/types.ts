export interface LoginUser {
  id: number;
  usuario: string;
  nombre: string;
}

/** Tipo de dominio que devuelve el inicio de sesión (no una respuesta HTTP). */
export interface LoginResult {
  token: string;
  user: LoginUser;
}
