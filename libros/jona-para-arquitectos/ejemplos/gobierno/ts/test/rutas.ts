// Rutas del proyecto vistas desde dist/test (las pruebas corren compiladas).
import { fileURLToPath } from 'node:url';

/** Ruta absoluta dentro de gobierno/ts. */
export const enProyecto = (ruta: string) => fileURLToPath(new URL(`../../${ruta}`, import.meta.url));

export const fixture = (nombre: string) => enProyecto(`fixtures/${nombre}`);
