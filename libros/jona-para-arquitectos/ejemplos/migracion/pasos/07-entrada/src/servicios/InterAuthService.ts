export interface Usuario {
  id: number;
  usuario: string;
  nombre: string;
}

export interface Sesion {
  token: string;
  usuario: Usuario;
}

/** Detalle de validación con los nombres de campo del contrato, no los del backend. */
export interface DetalleCampo {
  campo: 'correo' | 'clave';
  mensaje: string;
}

/**
 * Resultado de dominio del inicio de sesión: nunca una respuesta HTTP.
 * Además de los códigos del backend, `SIN_RED` y `TIEMPO_AGOTADO` los produce el adaptador.
 */
export type ResultadoLogin =
  | { tipo: 'ok'; sesion: Sesion }
  | { tipo: 'error'; codigo: string; detalles: DetalleCampo[] };

/** Contrato de servicio (puerto): lo único que la pantalla sabe del backend. */
export interface InterAuthService {
  iniciarSesion(correo: string, clave: string): Promise<ResultadoLogin>;
}
