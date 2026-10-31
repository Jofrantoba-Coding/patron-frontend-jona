import type { DetalleCampo, InterAuthService } from './InterAuthService.js';

/** Nombres de campo del backend -> nombres del contrato. */
const CAMPOS: Record<string, DetalleCampo['campo']> = { usuario: 'correo', clave: 'clave' };

/** Adaptador: el contrato de servicio contra el backend real (POST /auth/login), con el límite de tiempo del legado. */
export function crearAuthServiceHttp({ urlBase = 'http://127.0.0.1:4010', limiteMs = 10000 } = {}): InterAuthService {
  return {
    async iniciarSesion(correo, clave) {
      const control = new AbortController();
      const temporizador = setTimeout(() => control.abort(), limiteMs);
      try {
        const respuesta = await fetch(`${urlBase}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usuario: correo, clave }),
          signal: control.signal,
        });
        const cuerpo = await respuesta.json();
        if (respuesta.ok) return { tipo: 'ok', sesion: { token: cuerpo.token, usuario: cuerpo.user } };
        const detalles: DetalleCampo[] = (cuerpo.details ?? [])
          .filter((d: { field: string }) => d.field in CAMPOS)
          .map((d: { field: string; message: string }) => ({ campo: CAMPOS[d.field], mensaje: d.message }));
        return { tipo: 'error', codigo: cuerpo.code ?? 'HTTP_ERROR', detalles };
      } catch (e) {
        return { tipo: 'error', codigo: (e as Error).name === 'AbortError' ? 'TIEMPO_AGOTADO' : 'SIN_RED', detalles: [] };
      } finally {
        clearTimeout(temporizador);
      }
    },
  };
}
