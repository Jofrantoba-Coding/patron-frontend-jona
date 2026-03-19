import type { AuthSession } from './services/AuthService';

export const STORAGE_KEYS = {
  authenticated: 'appjona_codex_authenticated',
  token: 'appjona_codex_token',
  user: 'appjona_codex_user',
  homeGuideDismissed: 'appjona_codex_home_guide_dismissed',
} as const;

export interface StoredUser {
  name: string;
  email: string;
  role: string;
}

function safeParse<T>(raw: string | null): T | null {
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function persistAuthenticatedSession(session: AuthSession): void {
  localStorage.setItem(STORAGE_KEYS.authenticated, 'true');
  localStorage.setItem(STORAGE_KEYS.token, session.token);
  localStorage.setItem(
    STORAGE_KEYS.user,
    JSON.stringify({
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
    }),
  );
}

export function clearAuthenticatedSession(): void {
  localStorage.removeItem(STORAGE_KEYS.authenticated);
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.user);
}

export function isAuthenticatedSession(): boolean {
  return localStorage.getItem(STORAGE_KEYS.authenticated) === 'true';
}

export function readAuthenticatedUser(): StoredUser | null {
  return safeParse<StoredUser>(localStorage.getItem(STORAGE_KEYS.user));
}

export function readHomeGuideDismissed(): boolean {
  return localStorage.getItem(STORAGE_KEYS.homeGuideDismissed) === 'true';
}

export function writeHomeGuideDismissed(value: boolean): void {
  if (value) {
    localStorage.setItem(STORAGE_KEYS.homeGuideDismissed, 'true');
    return;
  }

  localStorage.removeItem(STORAGE_KEYS.homeGuideDismissed);
}
