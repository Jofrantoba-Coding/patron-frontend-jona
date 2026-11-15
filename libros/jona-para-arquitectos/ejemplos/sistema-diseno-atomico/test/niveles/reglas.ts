// Reglas de los niveles del sistema de diseño, con la API del compilador de TypeScript.
// Atomic Design gobierna las relaciones entre unidades (reglas 1 y 2); JONA, lo que cada
// unidad puede conocer (reglas 3 y 4).
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import ts from 'typescript';

export type Regla = 1 | 2 | 3 | 4;

export interface Violacion {
  regla: Regla;
  /** Ruta relativa a src/, con '/'. */
  archivo: string;
  mensaje: string;
}

/** Niveles de abajo arriba. `tema` no tiene unidades: tokens y clases que todos pueden usar. */
export const NIVELES = ['tema', 'atomos', 'moleculas', 'organismos', 'disposiciones'] as const;

/** Lo único externo que una unidad puede importar: React. Nada que llegue al sistema. */
const PAQUETES_PERMITIDOS = new Set(['react']);

/** Globales con los que una pieza llega al sistema: red, almacenamiento, conexiones. */
const GLOBALES_DEL_SISTEMA = new Set(['fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'localStorage', 'sessionStorage', 'indexedDB']);

/** Dónde está un módulo: nivel, unidad y nombre de archivo (`index` para la carpeta de la unidad). */
interface Ubicacion {
  /** Ruta relativa a src/, con '/' y sin extensión. */
  ruta: string;
  nivel: number;
  /** `atomos/jbutton`; undefined en `tema` y en el índice raíz. */
  unidad?: string;
  nombre: string;
}

function ubicar(ruta: string): Ubicacion {
  const partes = ruta.split('/');
  const nivel = NIVELES.indexOf(partes[0] as (typeof NIVELES)[number]);
  if (nivel <= 0) return { ruta, nivel, nombre: partes.at(-1)! };
  // Importar la carpeta de una unidad (`../../atomos/jbutton`) es importar su índice.
  const nombre = partes.length === 2 ? 'index' : partes.at(-1)!;
  return { ruta, nivel, unidad: partes.slice(0, 2).join('/'), nombre };
}

/** Archivos analizados, relativos a src/. */
export function archivosFuente(src: string): string[] {
  return readdirSync(src, { recursive: true, encoding: 'utf8' })
    .map((archivo) => archivo.split(sep).join('/'))
    .filter((archivo) => /\.tsx?$/.test(archivo) && !/\.d\.ts$/.test(archivo))
    .sort();
}

interface Modulo {
  archivo: string;
  en: Ubicacion;
  fuente: ts.SourceFile;
  /** Imports relativos, resueltos a una ruta de src/. */
  internos: Ubicacion[];
  /** Imports de paquetes de npm. */
  paquetes: string[];
}

function analizar(src: string, archivo: string): Modulo {
  const fuente = ts.createSourceFile(archivo, readFileSync(join(src, archivo), 'utf8'), ts.ScriptTarget.Latest, true);
  const internos: Ubicacion[] = [];
  const paquetes: string[] = [];
  for (const sentencia of fuente.statements) {
    if (!ts.isImportDeclaration(sentencia) && !ts.isExportDeclaration(sentencia)) continue;
    const especificador = sentencia.moduleSpecifier;
    if (especificador === undefined || !ts.isStringLiteral(especificador)) continue;
    if (!especificador.text.startsWith('.')) {
      paquetes.push(especificador.text);
      continue;
    }
    const absoluta = resolve(dirname(join(src, archivo)), especificador.text);
    internos.push(ubicar(relative(src, absoluta).split(sep).join('/').replace(/\.(tsx?|jsx?)$/, '')));
  }
  return { archivo, en: ubicar(archivo.replace(/\.tsx?$/, '')), fuente, internos, paquetes };
}

// ---------------------------------------------------------------------------------------------
// Reglas 1 y 2 (Atomic Design): un nivel solo usa niveles inferiores, y solo por la entrada.
// ---------------------------------------------------------------------------------------------

function direccionDeNiveles(de: Ubicacion, a: Ubicacion): string | undefined {
  if (de.unidad === undefined || de.unidad === a.unidad || a.nivel < 0) return undefined;
  if (a.nivel >= de.nivel) {
    const relacion = a.nivel === de.nivel ? 'del mismo nivel' : 'de un nivel superior';
    return `${de.unidad} (${NIVELES[de.nivel]}) importa ${a.ruta}, ${relacion}`;
  }
  return undefined;
}

function soloPorLaEntrada(de: Ubicacion, a: Ubicacion): string | undefined {
  if (a.unidad === undefined || a.unidad === de.unidad || a.nombre === 'index') return undefined;
  return `importa ${a.ruta}, una pieza interna; otra unidad se usa solo por ${a.unidad}/index.ts`;
}

// ---------------------------------------------------------------------------------------------
// Regla 3 (JONA, N1 y N3): ninguna unidad del sistema de diseño depende del sistema.
// ---------------------------------------------------------------------------------------------

function sinDependenciasDelSistema(modulo: Modulo): string[] {
  const mensajes = modulo.paquetes
    .filter((paquete) => !PAQUETES_PERMITIDOS.has(paquete.split('/')[0]))
    .map((paquete) => `importa el paquete ${paquete}; el sistema de diseño solo depende de React`);
  const visitar = (nodo: ts.Node) => {
    if (ts.isIdentifier(nodo) && GLOBALES_DEL_SISTEMA.has(nodo.text)) {
      mensajes.push(`usa ${nodo.text}: una unidad del sistema de diseño no llega al sistema; expone manejadores`);
    }
    ts.forEachChild(nodo, visitar);
  };
  visitar(modulo.fuente);
  return mensajes;
}

// ---------------------------------------------------------------------------------------------
// Regla 4 (JONA, N1): cada contrato tiene vocabulario propio; no importa contratos de otras unidades.
// ---------------------------------------------------------------------------------------------

function contratoPropio(modulo: Modulo): string[] {
  if (!/^Inter[A-Z]\w*$/.test(modulo.en.nombre)) return [];
  return modulo.internos
    .filter((a) => a.unidad !== modulo.en.unidad)
    .map((a) => `el contrato importa ${a.ruta}; un cambio en esa unidad rompería también este contrato`);
}

// ---------------------------------------------------------------------------------------------

export function verificarNiveles(src: string): Violacion[] {
  const violaciones: Violacion[] = [];
  const informar = (regla: Regla, archivo: string, mensaje: string | undefined) => {
    if (mensaje !== undefined) violaciones.push({ regla, archivo, mensaje });
  };
  for (const archivo of archivosFuente(src)) {
    const modulo = analizar(src, archivo);
    if (modulo.en.nivel < 0 && modulo.en.ruta !== 'index') {
      informar(1, archivo, `está fuera de los niveles (${NIVELES.join(', ')})`);
    }
    for (const a of modulo.internos) {
      informar(1, archivo, direccionDeNiveles(modulo.en, a));
      informar(2, archivo, soloPorLaEntrada(modulo.en, a));
    }
    sinDependenciasDelSistema(modulo).forEach((mensaje) => informar(3, archivo, mensaje));
    contratoPropio(modulo).forEach((mensaje) => informar(4, archivo, mensaje));
  }
  return violaciones;
}
