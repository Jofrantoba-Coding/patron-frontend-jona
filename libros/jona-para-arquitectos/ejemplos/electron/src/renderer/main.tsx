import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createAuthServiceHttp } from '../shared/services/AuthServiceHttp';
import type { InterAuthService, LoginResult } from '../shared/services/InterAuthService';
import { createAuthServiceIpc } from './services/AuthServiceIpc';
import { UiLogin } from './uilogin';

// Raíz de composición del renderizador. Dentro de Electron, el servicio viaja por IPC hasta el
// proceso principal; en un navegador (npx vite), el adaptador HTTP apunta al servidor mock.
const service: InterAuthService = window.authIpc
  ? createAuthServiceIpc(window.authIpc)
  : createAuthServiceHttp({ baseUrl: 'http://127.0.0.1:4010' });

function App() {
  const [session, setSession] = useState<LoginResult | undefined>();
  return session
    ? <h1>Hola, {session.user.nombre}</h1>
    : <UiLogin service={service} onAuthenticated={setSession} />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
