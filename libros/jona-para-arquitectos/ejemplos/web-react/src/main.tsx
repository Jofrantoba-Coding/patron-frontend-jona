import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { createAuthServiceHttp } from './services/AuthServiceHttp';

// Raíz de composición: el único lugar que decide hacia qué servidor apunta la aplicación.
// Por defecto, el servidor mock (.env); para el backend real solo cambia VITE_API_URL.
const service = createAuthServiceHttp({ baseUrl: import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:4010' });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App service={service} />
  </StrictMode>,
);
