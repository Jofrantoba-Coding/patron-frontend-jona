import type { LoginResult, LoginUser } from './InterAuthService';

/**
 * Valida un LoginResult que llega de fuera del proceso (el cuerpo 200 del contrato de API o un mensaje de IPC):
 * token no vacío y usuario con id, usuario y nombre.
 */
export function isLoginResult(value: unknown): value is LoginResult {
  if (typeof value !== 'object' || value === null) return false;
  const { token, user } = value as Partial<LoginResult>;
  if (typeof token !== 'string' || token.length === 0) return false;
  if (typeof user !== 'object' || user === null) return false;
  const { id, usuario, nombre } = user as Partial<LoginUser>;
  return typeof id === 'number' && typeof usuario === 'string' && typeof nombre === 'string';
}
