// Rutas del proyecto vistas desde dist/test (las pruebas corren compiladas).
import { fileURLToPath } from 'node:url';

/** Raíz de migracion/. */
export const RAIZ = fileURLToPath(new URL('../..', import.meta.url));
