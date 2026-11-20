// Contrato de UI del inicio de sesión.

export interface DatosUiSesion {
  email: string;
  /** Lo que se escribe en el campo; la Implementación lo borra después de cada intento. */
  clave: string;
  pendiente: boolean;
  /** Qué salió mal, como dato; el texto lo pone la configuración. */
  error?: 'credenciales' | 'no-disponible';
}

export interface EventosUiSesion {
  onCambiarEmail: (email: string) => void;
  onCambiarClave: (clave: string) => void;
  onEntrar: () => void;
}

export interface TextosUiSesion {
  titulo: string;
  etiquetaEmail: string;
  etiquetaClave: string;
  textoEntrar: string;
  /** Uno solo para correo desconocido y contraseña incorrecta. */
  textoCredenciales: string;
  textoNoDisponible: string;
}

export interface InterUiSesion extends DatosUiSesion, EventosUiSesion, TextosUiSesion {}

/** Solo textos. Ni un correo ni una contraseña de prueba: los DEFAULTS no llevan estado (regla 5). */
export const UISESION_DEFAULTS = {
  titulo: 'Iniciar sesión',
  etiquetaEmail: 'Correo',
  etiquetaClave: 'Contraseña',
  textoEntrar: 'Entrar',
  textoCredenciales: 'Correo o contraseña incorrectos.',
  textoNoDisponible: 'No se pudo iniciar sesión. Intente de nuevo.',
} as const satisfies TextosUiSesion;
