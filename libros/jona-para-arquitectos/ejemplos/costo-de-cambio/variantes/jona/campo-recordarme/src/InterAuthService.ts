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

/** Contrato de servicio (puerto). Toda falla rechaza con `ApiError`; sus detalles nombran 'email' o 'password'. */
export interface InterAuthService {
  login: (email: string, password: string, remember?: boolean) => Promise<LoginResult>;
}
