// Capa: Service (http)
// Responsabilidad: implementar InterAuthService contra el backend real.
// Restricciones: el status sale de la respuesta HTTP; nunca se asume en el cuerpo.
import type { AuthSession, InterAuthService } from './InterAuthService';

const DEFAULT_ERROR_MESSAGE = 'No fue posible iniciar sesión.';

async function readErrorMessage(response: Response): Promise<string | undefined> {
  try {
    const body = (await response.json()) as { message?: unknown };
    return typeof body.message === 'string' ? body.message : undefined;
  } catch {
    return undefined;
  }
}

export function createAuthServiceHttp(
  baseUrl: string,
  fetchFn: typeof fetch = fetch,
): InterAuthService {
  return {
    async login(email: string, password: string): Promise<AuthSession> {
      const response = await fetchFn(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      if (!response.ok) {
        const message = await readErrorMessage(response);
        throw new Error(message ?? DEFAULT_ERROR_MESSAGE);
      }

      return (await response.json()) as AuthSession;
    },
  };
}
