import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

/**
 * Los pasos de la migración, en orden. Cada uno es una copia completa y acumulativa del anterior.
 * El orden sigue al del capítulo: primero el borde del sistema (el servicio), al final la vista.
 */
export const PASOS = [
  '00-legado',
  '01-caracterizacion',
  '02-costura-servicio',
  '03-servicio-falso',
  '04-implementacion',
  '05-contrato-ui',
  '06-vista-pura',
  '07-entrada',
  '08-cambio-de-vista',
] as const;

export type Paso = (typeof PASOS)[number];

/** Desde este paso la unidad cumple la norma: deuda cero. */
export const PRIMER_PASO_SIN_DEUDA: Paso = '07-entrada';

/** Archivos de una carpeta (recursivo), por ruta relativa con '/', con el fin de línea normalizado a LF. */
export function archivosDe(carpeta: string): Map<string, string> {
  const archivos = new Map<string, string>();
  const recorrer = (actual: string): void => {
    for (const nombre of readdirSync(actual).sort()) {
      const ruta = join(actual, nombre);
      if (statSync(ruta).isDirectory()) recorrer(ruta);
      else archivos.set(relative(carpeta, ruta).split(sep).join('/'), readFileSync(ruta, 'utf8').replace(/\r\n/g, '\n'));
    }
  };
  recorrer(carpeta);
  return archivos;
}
