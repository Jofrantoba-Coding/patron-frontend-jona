import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { revisar, type ReglaId } from './jona-check.js';
import { archivosDe, PASOS } from './pasos.js';

export const REGLAS_MEDIDAS: readonly ReglaId[] = ['JONA-N1', 'JONA-N2', 'JONA-N3', 'JONA-N4'];

export interface MedidaPaso {
  paso: string;
  /** Violaciones por regla según el verificador (copia vigilada de gobierno/ts). */
  reglas: Record<ReglaId, number>;
  total: number;
  /** Código de producción: los .ts de src/. */
  prod: { archivos: number; lineas: number };
  /** Pruebas propias del paso: los .ts de test/. */
  prueba: { archivos: number; lineas: number };
}

/** Líneas de código de un archivo: sin líneas en blanco ni líneas que son solo comentario. */
export function lineasDeCodigo(texto: string): string[] {
  const codigo: string[] = [];
  let enBloque = false;
  for (const cruda of texto.split(/\r?\n/)) {
    let resto = cruda.trim();
    while (resto !== '') {
      if (enBloque) {
        const fin = resto.indexOf('*/');
        enBloque = fin < 0;
        resto = fin < 0 ? '' : resto.slice(fin + 2).trim();
      } else if (resto.startsWith('//')) {
        resto = '';
      } else if (resto.startsWith('/*')) {
        enBloque = true;
        resto = resto.slice(2);
      } else {
        codigo.push(resto);
        resto = '';
      }
    }
  }
  return codigo;
}

function contar(carpeta: string): { archivos: number; lineas: number } {
  if (!existsSync(carpeta)) return { archivos: 0, lineas: 0 };
  const ts = [...archivosDe(carpeta).entries()].filter(([ruta]) => ruta.endsWith('.ts'));
  return { archivos: ts.length, lineas: ts.reduce((total, [, texto]) => total + lineasDeCodigo(texto).length, 0) };
}

export function medirPaso(raiz: string, paso: string): MedidaPaso {
  const carpeta = join(raiz, 'pasos', paso);
  const violaciones = revisar(join(carpeta, 'src'));
  const reglas = Object.fromEntries(REGLAS_MEDIDAS.map((r) => [r, violaciones.filter((v) => v.regla === r).length])) as Record<ReglaId, number>;
  return { paso, reglas, total: violaciones.length, prod: contar(join(carpeta, 'src')), prueba: contar(join(carpeta, 'test')) };
}

/** Mide todos los pasos; falla si las carpetas no son exactamente los pasos esperados. */
export function medirMigracion(raiz: string): MedidaPaso[] {
  const encontrados = readdirSync(join(raiz, 'pasos')).sort();
  if (encontrados.join() !== [...PASOS].join()) {
    throw new Error(`pasos encontrados: ${encontrados.join(', ')}; se esperaban ${PASOS.join(', ')}`);
  }
  return PASOS.map((paso) => medirPaso(raiz, paso));
}

/** Tabla en Markdown, lista para el capítulo. */
export function tablaMarkdown(medidas: MedidaPaso[]): string {
  return [
    '| Paso | N1 | N2 | N3 | N4 | Total | Archivos de producción | Líneas de producción |',
    '|---|---:|---:|---:|---:|---:|---:|---:|',
    ...medidas.map((m) =>
      `| ${m.paso} | ${REGLAS_MEDIDAS.map((r) => m.reglas[r]).join(' | ')} | ${m.total} | ${m.prod.archivos} | ${m.prod.lineas} |`),
  ].join('\n');
}
