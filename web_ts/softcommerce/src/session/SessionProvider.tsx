import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react';
import type { PendingLogin, Session, SessionStore } from './sessionStore';

export interface SessionApi {
  session: Session | null;
  pending: PendingLogin | null;
  /** Keeps the step-1 result in memory. */
  startLogin(pending: PendingLogin): void;
  /** Creates the session (step 2 done). */
  startSession(session: Session): void;
  logout(): void;
}

const SessionContextValue = createContext<SessionApi | null>(null);

export function SessionProvider({ store, children }: { store: SessionStore; children: ReactNode }) {
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot);
  const api = useMemo<SessionApi>(
    () => ({
      ...snapshot,
      startLogin: store.setPending,
      startSession: store.setSession,
      logout: store.clear,
    }),
    [snapshot, store],
  );
  return <SessionContextValue.Provider value={api}>{children}</SessionContextValue.Provider>;
}

export function useSession(): SessionApi {
  const api = useContext(SessionContextValue);
  if (!api) throw new Error('useSession must be used inside a SessionProvider.');
  return api;
}
