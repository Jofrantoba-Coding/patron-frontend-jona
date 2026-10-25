import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from './SessionProvider';

/** Guard for the login steps: a logged-in user goes to the shell instead of seeing login again (R-AUTH-7). */
export function RedirectIfSession({ children }: { children: ReactNode }) {
  const { session } = useSession();
  return session ? <Navigate to="/" replace /> : <>{children}</>;
}
