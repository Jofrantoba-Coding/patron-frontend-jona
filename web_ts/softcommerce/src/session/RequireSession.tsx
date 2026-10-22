import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from './SessionProvider';

/** Guard: without a session, redirects to login step 1 (S-AUTH-19). */
export function RequireSession({ children }: { children: ReactNode }) {
  const { session } = useSession();
  return session ? <>{children}</> : <Navigate to="/login" replace />;
}
