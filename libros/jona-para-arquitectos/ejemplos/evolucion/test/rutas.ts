// Rutas del proyecto vistas desde dist/test (las pruebas corren compiladas).
import { fileURLToPath } from 'node:url';

/** Raíz de evolucion/. */
export const RAIZ = fileURLToPath(new URL('../..', import.meta.url));
