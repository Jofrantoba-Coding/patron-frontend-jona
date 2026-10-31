import { useState } from 'react';
import type { LoginResult } from '../entities/session';
import type { InterAuthService } from '../features/auth-login';
import { HomePage } from '../pages/home';
import { LoginPage } from '../pages/login';

/** Capa app: no es una unidad JONA. Guarda la sesión y decide qué página mostrar; el servicio llega desde main.tsx. */
export function App({ service }: { service: InterAuthService }) {
  const [session, setSession] = useState<LoginResult | undefined>();

  if (session) return <HomePage session={session} onLogout={() => setSession(undefined)} />;
  return <LoginPage service={service} onAuthenticated={setSession} />;
}
