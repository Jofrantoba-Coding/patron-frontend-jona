import { Navigate, Route, Routes } from 'react-router-dom';
import type { AppServices } from './services/serviceComposer';
import { RequireSession } from './session/RequireSession';
import { SessionProvider, useSession } from './session/SessionProvider';
import type { SessionStore } from './session/sessionStore';
import { UiContexto } from './views/uicontexto';
import { UiLogin } from './views/uilogin';

/** Stand-in for the shell until W1b-2 replaces it. */
function ShellPlaceholder() {
  const { session } = useSession();
  return <main>Sesión de {session?.user.nombre}</main>;
}

/** Routes: login (step 1), context (step 2) and the protected shell. The router is provided by the caller. */
export function App({ services, store }: { services: AppServices; store: SessionStore }) {
  return (
    <SessionProvider store={store}>
      <Routes>
        <Route path="/login" element={<UiLogin service={services.auth} />} />
        <Route path="/contexto" element={<UiContexto service={services.auth} />} />
        <Route path="/" element={<RequireSession><ShellPlaceholder /></RequireSession>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SessionProvider>
  );
}
