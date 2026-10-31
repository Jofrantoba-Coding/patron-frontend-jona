// Trinquete: la deuda conocida se tolera mientras exista, pero nunca puede crecer.
import { readFileSync } from 'node:fs';
import type { ReglaId, Violacion } from './jona-check.js';

/** Una violación conocida. Sin línea: mover código no debe romper la deuda. */
export interface EntradaDeuda {
  regla: ReglaId;
  archivo: string;
  mensaje: string;
}

export interface ResultadoTrinquete {
  /** Violaciones que la deuda anota: pasan. */
  toleradas: Violacion[];
  /** Violaciones que la deuda no anota: fallan. */
  nuevas: Violacion[];
  /** Entradas de la deuda que ya no ocurren: fallan hasta que se quiten del archivo. */
  saldadas: EntradaDeuda[];
  aprobado: boolean;
}

const clave = (v: EntradaDeuda) => `${v.regla}|${v.archivo}|${v.mensaje}`;

export function leerDeuda(ruta: string): EntradaDeuda[] {
  return JSON.parse(readFileSync(ruta, 'utf8')) as EntradaDeuda[];
}

/** Cada entrada de la deuda tolera una sola ocurrencia; lo que sobra a cada lado hace fallar. */
export function aplicarDeuda(violaciones: Violacion[], deuda: EntradaDeuda[]): ResultadoTrinquete {
  const pendientes = new Map<string, EntradaDeuda[]>();
  for (const entrada of deuda) pendientes.set(clave(entrada), [...(pendientes.get(clave(entrada)) ?? []), entrada]);

  const toleradas: Violacion[] = [];
  const nuevas: Violacion[] = [];
  for (const violacion of violaciones) {
    const anotadas = pendientes.get(clave(violacion));
    if (anotadas && anotadas.length > 0) {
      anotadas.pop();
      toleradas.push(violacion);
    } else {
      nuevas.push(violacion);
    }
  }
  const saldadas = [...pendientes.values()].flat();
  return { toleradas, nuevas, saldadas, aprobado: nuevas.length === 0 && saldadas.length === 0 };
}
