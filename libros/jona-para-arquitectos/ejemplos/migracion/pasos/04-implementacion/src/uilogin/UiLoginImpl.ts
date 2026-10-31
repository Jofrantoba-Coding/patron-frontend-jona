import type { InterAuthService, Sesion } from '../servicios/InterAuthService.js';

/** Lo que la vista pinta. Por ahora vive aquí; en el paso 05 pasa a su propio contrato. */
export interface ModeloLogin {
  correo: string;
  clave: string;
  errorCorreo?: string;
  errorClave?: string;
  mensaje?: string;
  ocupada?: boolean;
  alCambiarCorreo?: (correo: string) => void;
  alCambiarClave?: (clave: string) => void;
  alEnviar?: () => void;
}

export interface UiLoginImplDeps {
  servicio: InterAuthService;
  correoInicial: string;
  alAutenticar: (sesion: Sesion) => void;
}

type Estado = Required<Pick<ModeloLogin, 'correo' | 'clave' | 'errorCorreo' | 'errorClave' | 'mensaje' | 'ocupada'>>;

const MENSAJES: Record<string, string> = {
  INVALID_CREDENTIALS: 'Correo o contraseña incorrectos.',
  USER_DISABLED: 'Su usuario está bloqueado. Contacte al administrador.',
  VALIDATION_ERROR: 'Revise los datos marcados.',
  SIN_RED: 'No se pudo conectar con el servidor. Revise su conexión.',
  TIEMPO_AGOTADO: 'El servidor no respondió a tiempo. Intente de nuevo.',
};
const GENERICO = 'No se pudo iniciar sesión. Intente de nuevo.';
const SIN_MENSAJES = { errorCorreo: '', errorClave: '', mensaje: '' };

/** Implementación: guarda el estado, decide qué mostrar y entrega un modelo nuevo en cada cambio. */
export function crearUiLoginImpl(deps: UiLoginImplDeps, alCambiarModelo: (modelo: ModeloLogin) => void): void {
  let estado: Estado = { correo: deps.correoInicial, clave: '', ...SIN_MENSAJES, ocupada: false };

  function actualizar(cambios: Partial<Estado>): void {
    estado = { ...estado, ...cambios };
    alCambiarModelo({
      ...estado,
      alCambiarCorreo: (correo) => actualizar({ correo }),
      alCambiarClave: (clave) => actualizar({ clave }),
      alEnviar: () => void enviar(),
    });
  }

  async function enviar(): Promise<void> {
    if (estado.ocupada) return;
    // Rareza conservada (ver la caracterización): solo el correo se valida aquí; la clave vacía la rechaza el servidor.
    if (estado.correo === '') {
      actualizar({ ...SIN_MENSAJES, mensaje: 'Ingrese su correo.' });
      return;
    }
    actualizar({ ...SIN_MENSAJES, ocupada: true });
    const resultado = await deps.servicio.iniciarSesion(estado.correo, estado.clave);
    if (resultado.tipo === 'ok') {
      actualizar({ ocupada: false });
      deps.alAutenticar(resultado.sesion);
      return;
    }
    const detalle = (campo: 'correo' | 'clave') => resultado.detalles.find((d) => d.campo === campo)?.mensaje ?? '';
    actualizar({
      ocupada: false,
      mensaje: MENSAJES[resultado.codigo] ?? GENERICO,
      errorCorreo: detalle('correo'),
      errorClave: detalle('clave'),
      // Rareza conservada: con credenciales inválidas se borra la clave (y solo entonces).
      ...(resultado.codigo === 'INVALID_CREDENTIALS' ? { clave: '' } : {}),
    });
  }

  actualizar({});
}
