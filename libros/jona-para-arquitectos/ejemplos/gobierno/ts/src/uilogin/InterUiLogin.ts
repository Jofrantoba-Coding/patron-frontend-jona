/** Contrato de UI: lo que la vista recibe. Solo tipos y DEFAULTS literales (N2). */
export interface InterUiLogin {
  titulo?: string;
  etiquetaEnviar?: string;
  correo: string;
  clave: string;
  error?: string;
  enviando?: boolean;
  onCorreoChange?: (correo: string) => void;
  onClaveChange?: (clave: string) => void;
  onEnviar?: () => void;
}

export const UILOGIN_DEFAULTS = {
  titulo: 'Iniciar sesión',
  etiquetaEnviar: 'Ingresar',
} as const satisfies Required<Pick<InterUiLogin, 'titulo' | 'etiquetaEnviar'>>;
