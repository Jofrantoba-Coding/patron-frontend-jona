// Backend falso a nivel de cable: reemplaza `fetch` y responde como el servidor mock del libro
// (POST /auth/login). Toda instantánea llama a `fetch` en algún lugar (el legado desde la pantalla,
// JONA desde AuthServiceHttp), así que la misma caracterización las prueba a todas sin red real.

export type Escenario = 'normal' | 'errorServidor' | 'sinRed' | 'sinRespuesta';

export interface OpcionesBackend {
  escenario?: Escenario;
  /** true (por defecto): cada petición espera a `responder()`, para observar el estado «ocupado». */
  retener?: boolean;
}

/** Los mismos usuarios que el servidor mock y que AuthServiceFake. */
export const USUARIOS = [
  { id: 1, usuario: 'ana@ejemplo.com', clave: 'secreta123', nombre: 'Ana Torres', bloqueado: false },
  { id: 2, usuario: 'bloqueado@ejemplo.com', clave: 'secreta123', nombre: 'Usuario Bloqueado', bloqueado: true },
];

interface Respuesta {
  status: number;
  body: unknown;
}

/** Reglas del servidor con su formato de cable: `{ token, user }` o `{ code, message, details, traceId }`. */
function atender(usuario: unknown, clave: unknown): Respuesta {
  const vacios = ([['usuario', usuario], ['clave', clave]] as const)
    .filter(([, valor]) => typeof valor !== 'string' || valor === '')
    .map(([field]) => ({ field, message: 'Es obligatorio.' }));
  const error = (status: number, code: string, message: string, details = vacios) =>
    ({ status, body: { code, message, details, traceId: 'traza-1' } });
  if (vacios.length > 0) return error(422, 'VALIDATION_ERROR', 'La petición no es válida.');
  const user = USUARIOS.find((u) => u.usuario === usuario && u.clave === clave);
  if (!user) return error(401, 'INVALID_CREDENTIALS', 'Usuario o clave incorrectos.');
  if (user.bloqueado) return error(403, 'USER_DISABLED', 'El usuario está bloqueado.');
  return { status: 200, body: { token: `token-${user.id}`, user: { id: user.id, usuario: user.usuario, nombre: user.nombre } } };
}

function responderA(escenario: Escenario, url: string, init: RequestInit | undefined): Respuesta {
  if (!url.endsWith('/auth/login') || init?.method !== 'POST') return { status: 404, body: { code: 'NOT_FOUND' } };
  if (escenario === 'errorServidor') {
    return { status: 500, body: { code: 'INTERNAL_ERROR', message: 'Error interno del servidor.', details: [], traceId: 't' } };
  }
  const peticion = JSON.parse(String(init.body)) as Record<string, unknown>;
  return atender(peticion.usuario, peticion.clave);
}

/** Rechaza como `fetch` cuando se aborta la señal (lo que hace un límite de tiempo con AbortController). */
function alAbortar(señal: AbortSignal | null | undefined, rechazar: (e: unknown) => void): void {
  señal?.addEventListener('abort', () => rechazar(new DOMException('This operation was aborted', 'AbortError')));
}

/** Instala el backend falso en `globalThis.fetch`. */
export function instalarBackend({ escenario = 'normal', retener = true }: OpcionesBackend = {}) {
  const original = globalThis.fetch;
  const peticiones: Array<Record<string, unknown>> = [];
  const pendientes: Array<() => void> = [];

  globalThis.fetch = (async (url: string, init?: RequestInit) => {
    peticiones.push(JSON.parse(String(init?.body)) as Record<string, unknown>);
    await new Promise<void>((resolver, rechazar) => {
      alAbortar(init?.signal, rechazar);
      if (escenario === 'sinRespuesta') return; // nunca contesta: solo el límite de tiempo la termina
      if (retener) pendientes.push(resolver);
      else resolver();
    });
    if (escenario === 'sinRed') throw new TypeError('fetch failed');
    const { status, body } = responderA(escenario, url, init);
    // Solo lo que el código usa de una Response: ok, status y json().
    return { ok: status >= 200 && status < 300, status, json: async () => body } as Response;
  }) as typeof fetch;

  return {
    peticiones,
    /** Deja responder a la petición más antigua y espera a que la pantalla termine de reaccionar. */
    async responder(): Promise<void> {
      pendientes.shift()?.();
      await esperarReaccion();
    },
    desinstalar(): void {
      globalThis.fetch = original;
    },
  };
}

/** Espera a que terminen las promesas en curso (setImmediate no lo adelantan los temporizadores simulados). */
export const esperarReaccion = () => new Promise<void>((resolver) => setImmediate(resolver));
