// Aplica mapeo.json: renombra rutas e identificadores de la nomenclatura anterior a la canónica.
// Si dos árboles son iguales después de normalizar, la diferencia entre ellos es solo de nombres.
import { readFileSync } from 'node:fs';
import { posix } from 'node:path';

export interface Regla {
  rol: string;
  antes: string;
  despues: string;
}

export interface Mapeo {
  reglas: Regla[];
}

export function leerMapeo(ruta: string): Mapeo {
  return JSON.parse(readFileSync(ruta, 'utf8')) as Mapeo;
}

/** Cada unidad se nombra por su contrato de UI: `InterUiAlgo.ts` define la unidad `UiAlgo`. */
export function unidadesDe(rutas: string[]): string[] {
  return rutas.map((r) => /^Inter([A-Z]\w*)\.tsx?$/.exec(posix.basename(r))?.[1]).filter((u) => u !== undefined);
}

/** Renombra un identificador exacto; el que no coincide con ninguna regla queda igual. */
function renombrarNombre(nombre: string, mapeo: Mapeo, unidades: string[]): string {
  for (const unidad of unidades) {
    const regla = mapeo.reglas.find((r) => r.antes.replace('{U}', unidad) === nombre);
    if (regla) return regla.despues.replace('{U}', unidad);
  }
  return nombre;
}

/** `views/u/UiAlgoView.ts` -> `views/u/UiAlgo.ts`, según el rol que indica el nombre del archivo. */
export function renombrarRuta(ruta: string, mapeo: Mapeo, unidades: string[]): string {
  const extension = posix.extname(ruta);
  const nombre = posix.basename(ruta, extension);
  return posix.join(posix.dirname(ruta), `${renombrarNombre(nombre, mapeo, unidades)}${extension}`);
}

/** Reemplaza todos los identificadores del texto, también los de las rutas de import, en una sola pasada. */
export function normalizar(texto: string, mapeo: Mapeo, unidades: string[]): string {
  return texto.replace(/[A-Za-z_$][\w$]*/g, (nombre) => renombrarNombre(nombre, mapeo, unidades));
}
