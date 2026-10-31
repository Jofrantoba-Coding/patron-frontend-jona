import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { createAuthService } from './createAuthService';

// Por defecto, el adaptador HTTP contra el servidor mock. VITE_API_URL cambia el servidor;
// VITE_AUTH_SERVICE=fake usa el servicio en memoria.
const service = createAuthService(import.meta.env);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App service={service} />
  </StrictMode>,
);
