import { Navigate, Route, Routes } from 'react-router-dom';
import type { AppServices } from './services/serviceComposer';
import { ServicesProvider } from './services/ServicesContext';
import { RequireSession } from './session/RequireSession';
import { SessionProvider } from './session/SessionProvider';
import type { SessionStore } from './session/sessionStore';
import { UiContexto } from './views/uicontexto';
import { UiLogin } from './views/uilogin';
import { ShellHeader, UiShell } from './views/uishell';

/** Routes: login (step 1), context (step 2) and the protected shell. The router is provided by the caller. */
export function App({ services, store }: { services: AppServices; store: SessionStore }) {
  return (
    <SessionProvider store={store}>
      <Routes>
        <Route path="/login" element={<UiLogin service={services.auth} />} />
        <Route path="/contexto" element={<UiContexto service={services.auth} grants={services.grants} />} />
        <Route
          path="/"
          element={
            <RequireSession>
              <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <ShellHeader />
                <ServicesProvider services={services}><UiShell service={services.shell} /></ServicesProvider>
              </div>
            </RequireSession>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SessionProvider>
  );
}
