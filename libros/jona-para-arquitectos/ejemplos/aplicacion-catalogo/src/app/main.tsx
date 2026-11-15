import '@jona-libro/ds-atomico/tokens.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { crearRepositorio } from './crearRepositorio';

// Por defecto, el adaptador en memoria con datos de ejemplo. VITE_REPOSITORIO=http usa la API
// REST de VITE_API_URL.
const repositorio = crearRepositorio(import.meta.env);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App repositorio={repositorio} />
  </StrictMode>,
);
