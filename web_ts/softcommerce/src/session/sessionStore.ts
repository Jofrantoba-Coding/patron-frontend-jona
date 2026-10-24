import type { GrantsSnapshot } from '../services/InterGrantsService';
import type { AppParams, Empresa, LoginResult, LoginUser, PuntoVenta } from '../services/InterAuthService';
import type { RequestContext, SessionContext } from '../services/httpClient';

export const SESSION_STORAGE_KEY = 'softcommerce.session.v1';

/** The session created by a successful step 2 (R-AUTH-7). */
export interface Session {
  tenantId: string;
  token: string;
  user: LoginUser;
  empresa: Empresa;
  puntoVenta: PuntoVenta;
  periodo: { fechaInicio: string; fechaFin: string };
  params: AppParams;
  /** Menu and flags of the user's perfil taken at login: an open session keeps them until logout (R-AUTH-11). */
  grants?: GrantsSnapshot;
}

/** Step-1 result: kept in memory only, never written to storage. */
export interface PendingLogin {
  tenantId: string;
  result: LoginResult;
}

export interface SessionSnapshot {
  session: Session | null;
  pending: PendingLogin | null;
}

function readStored(storage: Storage): Session | null {
  const raw = storage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

/** Framework-free session store; the snapshot object changes identity only when the state changes. */
export function createSessionStore(storage: Storage) {
  let snapshot: SessionSnapshot = { session: readStored(storage), pending: null };
  const listeners = new Set<() => void>();

  const update = (next: SessionSnapshot) => {
    snapshot = next;
    listeners.forEach((listener) => listener());
  };

  return {
    getSnapshot: (): SessionSnapshot => snapshot,
    subscribe(listener: () => void): () => void {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    setPending: (pending: PendingLogin) => update({ ...snapshot, pending }),
    setSession(session: Session): void {
      storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      update({ session, pending: null });
    },
    clear(): void {
      storage.removeItem(SESSION_STORAGE_KEY);
      update({ session: null, pending: null });
    },
    /** Tenant and token for every request: the session once it exists, else the step-1 result. */
    getContext(): SessionContext {
      if (snapshot.session) return { tenantId: snapshot.session.tenantId, token: snapshot.session.token };
      if (snapshot.pending) return { tenantId: snapshot.pending.tenantId, token: snapshot.pending.result.token };
      return {};
    },
    /** Acting user and empresa for the session headers: the user from step 1, the empresa once chosen (D13). */
    getRequestContext(): RequestContext {
      if (snapshot.session) return { userId: String(snapshot.session.user.id_usuario), empresaId: snapshot.session.empresa.id };
      if (snapshot.pending) return { userId: String(snapshot.pending.result.user.id_usuario) };
      return {};
    },
  };
}

export type SessionStore = ReturnType<typeof createSessionStore>;
