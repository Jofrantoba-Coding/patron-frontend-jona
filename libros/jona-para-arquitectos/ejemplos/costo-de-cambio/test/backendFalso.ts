// Backend falso a nivel de cable: reemplaza `fetch` y responde como el servidor mock del libro.
// Las dos variantes llaman a `fetch` (directo desde la pantalla, JONA desde AuthServiceHttp),
// así que la misma suite las prueba a ambas sin red real.

/** v1: el formato de v0. v2: el formato nuevo del pedido C3 (`formato-backend`). */
export type Formato = 'v1' | 'v2';
export type Escenario = 'normal' | 'errorServidor' | 'sinRed';

const USUARIOS = [
  { id: 1, usuario: 'ana@ejemplo.com', clave: 'secreta123', nombre: 'Ana Torres', bloqueado: false },
  { id: 2, usuario: 'bloqueado@ejemplo.com', clave: 'secreta123', nombre: 'Usuario Bloqueado', bloqueado: true },
];

interface Respuesta {
  status: number;
  body: unknown;
}

type Resultado =
  | { status: 200; user: { id: number; usuario: string; nombre: string } }
  | { status: number; code: string; message: string; campos: string[] };

/** Reglas del servidor, independientes del formato: devuelve estado, código, mensaje y detalles. */
function atender(usuario: unknown, clave: unknown): Resultado {
  const vacios = (
    [['usuario', usuario], ['clave', clave]] as const
  ).filter(([, valor]) => typeof valor !== 'string' || valor === '').map(([campo]) => campo);
  if (vacios.length > 0) return { status: 422, code: 'VALIDATION_ERROR', message: 'La petición no es válida.', campos: vacios };
  const user = USUARIOS.find((u) => u.usuario === usuario && u.clave === clave);
  if (!user) return { status: 401, code: 'INVALID_CREDENTIALS', message: 'Usuario o clave incorrectos.', campos: [] };
  if (user.bloqueado) return { status: 403, code: 'USER_DISABLED', message: 'El usuario está bloqueado.', campos: [] };
  return { status: 200, user: { id: user.id, usuario: user.usuario, nombre: user.nombre } };
}

/** Traduce el resultado al formato de cable pedido. En v2 el campo `usuario` se llama `correo`. */
function serializar(formato: Formato, r: Resultado): Respuesta {
  const traceId = 'traza-1';
  if ('user' in r) {
    const token = `token-${r.user.id}`;
    return { status: 200, body: formato === 'v1' ? { token, user: r.user } : { accessToken: token, user: r.user } };
  }
  if (formato === 'v1') {
    const details = r.campos.map((field) => ({ field, message: 'Es obligatorio.' }));
    return { status: r.status, body: { code: r.code, message: r.message, details, traceId } };
  }
  const fields = r.campos.map((campo) => ({ name: campo === 'usuario' ? 'correo' : campo, message: 'Es obligatorio.' }));
  return { status: r.status, body: { error: { code: r.code, message: r.message, fields }, traceId } };
}

function responder(formato: Formato, escenario: Escenario, url: string, init: RequestInit | undefined): Respuesta {
  if (!url.endsWith('/auth/login') || init?.method !== 'POST') return { status: 404, body: { code: 'NOT_FOUND' } };
  if (escenario === 'errorServidor') {
    const error = { code: 'INTERNAL_ERROR', message: 'Error interno del servidor.' };
    return { status: 500, body: formato === 'v1' ? { ...error, details: [], traceId: 't' } : { error, traceId: 't' } };
  }
  const peticion = JSON.parse(String(init.body)) as Record<string, unknown>;
  return serializar(formato, atender(formato === 'v1' ? peticion.usuario : peticion.correo, peticion.clave));
}

/**
 * Instala el backend falso. Cada petición queda retenida hasta `responder()`,
 * para poder observar el estado «ocupado» de la pantalla.
 */
export function instalarBackend(formato: Formato, escenario: Escenario = 'normal') {
  const original = globalThis.fetch;
  const peticiones: Array<Record<string, unknown>> = [];
  const pendientes: Array<() => void> = [];

  globalThis.fetch = (async (url: string, init?: RequestInit) => {
    peticiones.push(JSON.parse(String(init?.body)) as Record<string, unknown>);
    await new Promise<void>((resolve) => pendientes.push(resolve));
    if (escenario === 'sinRed') throw new TypeError('fetch failed');
    const { status, body } = responder(formato, escenario, url, init);
    // Solo lo que usan las variantes de una Response: ok, status y json().
    return { ok: status >= 200 && status < 300, status, json: async () => body } as Response;
  }) as typeof fetch;

  return {
    peticiones,
    /** Deja responder al backend y espera a que la pantalla termine de reaccionar. */
    async responder(): Promise<void> {
      pendientes.shift()?.();
      await new Promise<void>((resolve) => setImmediate(resolve));
    },
    desinstalar(): void {
      globalThis.fetch = original;
    },
  };
}
