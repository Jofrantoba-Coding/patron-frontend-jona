/** Contrato de UI (modelo de vista): lo que la vista recibe. Solo tipos y DEFAULTS. */
export interface InterUiLogin {
  titulo?: string;
  textoBoton?: string;
  correo: string;
  clave: string;
  errorCorreo?: string;
  errorClave?: string;
  mensaje?: string;
  ocupada?: boolean;
  /** Los callbacks reciben primero el valor de negocio, no el evento del control. */
  alCambiarCorreo?: (correo: string) => void;
  alCambiarClave?: (clave: string) => void;
  alEnviar?: () => void;
}

/** Solo valores de presentación; los valores de los campos son estado y no tienen default. */
export const UILOGIN_DEFAULTS: Required<Pick<InterUiLogin, 'titulo' | 'textoBoton'>> = {
  titulo: 'Iniciar sesión',
  textoBoton: 'Ingresar',
};
