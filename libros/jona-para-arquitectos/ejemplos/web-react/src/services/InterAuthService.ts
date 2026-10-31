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

/** Contrato de servicio (puerto). Toda falla rechaza con `ApiError`. */
export interface InterAuthService {
  /** Devuelve el token y el usuario. Rechaza si el servidor responde con error. */
  login: (email: string, password: string) => Promise<LoginResult>;
}
