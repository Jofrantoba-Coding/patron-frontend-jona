// Verificador de la norma JONA (reglas.json) para proyectos TypeScript, con la API del compilador.
// No depende de ninguna tecnología de UI: reconoce los roles por la convención de nombres de JONA.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, posix, relative, sep } from 'node:path';
import ts from 'typescript';

export type ReglaId = 'JONA-N1' | 'JONA-N2' | 'JONA-N3' | 'JONA-N4';

export interface Violacion {
  regla: ReglaId;
  /** Ruta relativa a la raíz analizada, con '/'. */
  archivo: string;
  linea?: number;
  /** Estable entre ejecuciones (sin números de línea): la deuda lo usa para reconocer la violación. */
  mensaje: string;
}

// ---------------------------------------------------------------------------------------------
// Convenciones: toda la configuración del verificador está aquí, a la vista.
// ---------------------------------------------------------------------------------------------

/** Pruebas e historias: composiciones de demostración, fuera del análisis. */
const EXENTOS = /\.(test|spec|stories)\.tsx?$|\.d\.ts$/;
const CONTRATO_SERVICIO = /^Inter[A-Z]\w*Service$/;
const CONTRATO_UI = /^Inter[A-Z]\w*$/;
/** `AuthServiceHttp` es un adaptador si existe el contrato `InterAuthService`. */
const ADAPTADOR = /^(\w+)Service[A-Z]\w*$/;
/** Valores constantes permitidos en un contrato: `DEFAULTS` o `ALGO_DEFAULTS`. */
const DEFAULTS = /^(\w+_)?DEFAULTS$/;
/** Efectos que solo la Implementación y los adaptadores pueden producir (N3). */
const EFECTOS = new Set([
  'fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'localStorage', 'sessionStorage', 'indexedDB',
  'setTimeout', 'setInterval',
]);
/** Objetos globales a través de los cuales también se alcanza un efecto: `window.localStorage`. */
const GLOBALES = new Set(['window', 'globalThis', 'self']);

type Rol = 'contrato' | 'contrato de servicio' | 'adaptador' | 'Implementación' | 'vista' | 'entrada' | 'interno' | 'libre';

interface Importacion {
  /** Destino resuelto, relativo a la raíz; undefined si es un paquete o queda fuera de la raíz. */
  destino?: string;
  soloTipos: boolean;
  linea: number;
}

interface Archivo {
  ruta: string;
  nombre: string;
  carpeta: string;
  fuente: ts.SourceFile;
  importaciones: Importacion[];
  rol: Rol;
  /** Carpeta de la unidad de UI a la que pertenece, si pertenece a alguna. */
  unidad?: string;
}

export interface Proyecto {
  archivos: Map<string, Archivo>;
  /** Carpeta de cada unidad de UI y los archivos que son su entrada. */
  unidades: Map<string, string[]>;
}

// ---------------------------------------------------------------------------------------------
// Lectura del proyecto
// ---------------------------------------------------------------------------------------------

const aPosix = (ruta: string) => ruta.split(sep).join('/');
const nombreDe = (ruta: string) => posix.basename(ruta).replace(/\.tsx?$/, '');
const lineaDe = (fuente: ts.SourceFile, nodo: ts.Node) => fuente.getLineAndCharacterOfPosition(nodo.getStart(fuente)).line + 1;

/** Archivos .ts y .tsx de la raíz, relativos a ella, sin pruebas, historias ni node_modules. */
export function archivosAnalizados(raiz: string): string[] {
  return readdirSync(raiz, { recursive: true, encoding: 'utf8' })
    .map(aPosix)
    .filter((ruta) => /\.tsx?$/.test(ruta) && !EXENTOS.test(ruta) && !ruta.split('/').includes('node_modules'))
    .sort();
}

/** Resuelve un import relativo: `./x`, `./x.js` (estilo NodeNext) o una carpeta con index. */
function resolver(raiz: string, desde: string, especificador: string): string | undefined {
  if (!especificador.startsWith('.')) return undefined; // paquetes y alias: fuera del análisis
  const base = join(raiz, dirname(desde), especificador).replace(/\.(js|jsx|ts|tsx)$/, '');
  const candidatos = [`${base}.ts`, `${base}.tsx`, join(base, 'index.ts'), join(base, 'index.tsx')];
  const encontrado = candidatos.find((c) => existsSync(c) && statSync(c).isFile());
  if (encontrado === undefined) return undefined;
  const ruta = aPosix(relative(raiz, encontrado));
  return ruta.startsWith('..') ? undefined : ruta;
}

function importaciones(raiz: string, ruta: string, fuente: ts.SourceFile): Importacion[] {
  const resultado: Importacion[] = [];
  const agregar = (nodo: ts.Node, especificador: string, soloTipos: boolean) =>
    resultado.push({ destino: resolver(raiz, ruta, especificador), soloTipos, linea: lineaDe(fuente, nodo) });

  const visitar = (nodo: ts.Node): void => {
    if (ts.isImportDeclaration(nodo) && ts.isStringLiteral(nodo.moduleSpecifier)) {
      agregar(nodo, nodo.moduleSpecifier.text, esImportSoloTipos(nodo));
    } else if (ts.isExportDeclaration(nodo) && nodo.moduleSpecifier && ts.isStringLiteral(nodo.moduleSpecifier)) {
      agregar(nodo, nodo.moduleSpecifier.text, nodo.isTypeOnly);
    } else if (ts.isCallExpression(nodo) && nodo.expression.kind === ts.SyntaxKind.ImportKeyword
      && nodo.arguments.length > 0 && ts.isStringLiteralLike(nodo.arguments[0])) {
      agregar(nodo, nodo.arguments[0].text, false); // import('./x') con un texto literal
    }
    ts.forEachChild(nodo, visitar);
  };
  visitar(fuente);
  return resultado;
}

function esImportSoloTipos(declaracion: ts.ImportDeclaration): boolean {
  const clausula = declaracion.importClause;
  if (clausula === undefined) return false; // import './efecto': ejecuta el módulo
  if (clausula.isTypeOnly) return true;
  const enlaces = clausula.namedBindings;
  return !clausula.name && enlaces !== undefined && ts.isNamedImports(enlaces)
    && enlaces.elements.length > 0 && enlaces.elements.every((e) => e.isTypeOnly);
}

/** En la forma de Plantilla (`class XImpl extends X`), la Implementación es la entrada. */
function heredaDe(fuente: ts.SourceFile): string[] {
  return fuente.statements.filter(ts.isClassDeclaration).flatMap((clase) =>
    (clase.heritageClauses ?? [])
      .filter((h) => h.token === ts.SyntaxKind.ExtendsKeyword)
      .flatMap((h) => h.types.map((t) => t.expression.getText(fuente))));
}

export function leerProyecto(raiz: string): Proyecto {
  const leidos = archivosAnalizados(raiz).map((ruta) => {
    const fuente = ts.createSourceFile(ruta, readFileSync(join(raiz, ruta), 'utf8'), ts.ScriptTarget.Latest, true);
    return { ruta, nombre: nombreDe(ruta), carpeta: posix.dirname(ruta), fuente, importaciones: importaciones(raiz, ruta, fuente) };
  });
  const contratosDeServicio = new Set(leidos.map((a) => a.nombre).filter((n) => CONTRATO_SERVICIO.test(n)));

  const rolDe = (nombre: string): Rol => {
    if (CONTRATO_SERVICIO.test(nombre)) return 'contrato de servicio';
    if (CONTRATO_UI.test(nombre)) return 'contrato';
    const adaptador = ADAPTADOR.exec(nombre);
    if (adaptador && contratosDeServicio.has(`Inter${adaptador[1]}Service`)) return 'adaptador';
    if (nombre.endsWith('Impl')) return 'Implementación';
    if (nombre.endsWith('View')) return 'vista';
    return 'libre';
  };

  // Una carpeta es una unidad de UI si tiene un contrato de UI, una Implementación o una vista.
  const carpetasDeUnidad = new Set(leidos
    .filter((a) => ['contrato', 'Implementación', 'vista'].includes(rolDe(a.nombre)))
    .map((a) => a.carpeta));
  const unidadDe = (carpeta: string): string | undefined => {
    for (let actual = carpeta; ; actual = posix.dirname(actual)) {
      if (carpetasDeUnidad.has(actual)) return actual;
      if (actual === '.' || actual === '/' || actual === '') return undefined;
    }
  };

  const archivos = new Map<string, Archivo>();
  for (const leido of leidos) {
    archivos.set(leido.ruta, { ...leido, rol: rolDe(leido.nombre), unidad: unidadDe(leido.carpeta) });
  }

  const unidades = new Map<string, string[]>();
  for (const carpeta of carpetasDeUnidad) {
    const propios = [...archivos.values()].filter((a) => a.carpeta === carpeta);
    const nombres = new Set(propios.map((a) => a.nombre));
    const publicos = new Set(propios.filter((a) => a.rol === 'contrato').map((a) => a.nombre.slice('Inter'.length)));
    const plantilla = propios.filter((a) => a.rol === 'Implementación' && heredaDe(a.fuente).some((b) => nombres.has(b)));
    const entradas = propios.filter((a) => a.nombre === 'index'
      || (plantilla.length > 0 ? plantilla.includes(a) : publicos.has(a.nombre)));
    // Sin archivo de entrada, la Implementación hace de entrada.
    const elegidas = entradas.length > 0 ? entradas : propios.filter((a) => a.rol === 'Implementación');
    unidades.set(carpeta, elegidas.map((a) => a.ruta).sort());
    for (const archivo of propios) {
      if (archivo.rol === 'libre') archivo.rol = elegidas.includes(archivo) ? 'entrada' : 'interno';
    }
  }
  for (const archivo of archivos.values()) {
    if (archivo.rol === 'libre' && archivo.unidad !== undefined) archivo.rol = 'interno';
  }
  return { archivos, unidades };
}

// ---------------------------------------------------------------------------------------------
// Las cuatro reglas
// ---------------------------------------------------------------------------------------------

const esContrato = (a: Archivo) => a.rol === 'contrato' || a.rol === 'contrato de servicio';
const ROL_CON_ARTICULO: Record<Rol, string> = {
  contrato: 'el contrato', 'contrato de servicio': 'el contrato de servicio', adaptador: 'el adaptador',
  Implementación: 'la Implementación', vista: 'la vista', entrada: 'la entrada', interno: 'el archivo interno', libre: 'el archivo',
};

/** N1: toda unidad tiene contrato de UI; la unidad depende del contrato de servicio, no del adaptador. */
function n1ContratosExplicitos({ archivos, unidades }: Proyecto): Violacion[] {
  const violaciones: Violacion[] = [];
  for (const carpeta of unidades.keys()) {
    const propios = [...archivos.values()].filter((a) => a.carpeta === carpeta);
    if (propios.some((a) => a.rol === 'contrato')) continue;
    const senalado = propios.find((a) => a.rol === 'Implementación') ?? propios.find((a) => a.rol === 'vista')!;
    violaciones.push({ regla: 'JONA-N1', archivo: senalado.ruta, mensaje: `la unidad ${carpeta} no tiene contrato de UI (Inter*.ts)` });
  }
  // La vista y el contrato importando un adaptador son N3; aquí, el resto de la unidad.
  for (const archivo of archivos.values()) {
    if (archivo.unidad === undefined || archivo.rol === 'vista' || esContrato(archivo)) continue;
    for (const imp of archivo.importaciones) {
      const destino = imp.destino ? archivos.get(imp.destino) : undefined;
      if (destino?.rol !== 'adaptador') continue;
      violaciones.push({
        regla: 'JONA-N1', archivo: archivo.ruta, linea: imp.linea,
        mensaje: `${ROL_CON_ARTICULO[archivo.rol]} depende del adaptador ${destino.nombre}; tipe el servicio con su contrato`,
      });
    }
  }
  return violaciones;
}

function sinEnvoltura(nodo: ts.Expression): ts.Expression {
  let actual = nodo;
  while (ts.isAsExpression(actual) || ts.isSatisfiesExpression(actual) || ts.isParenthesizedExpression(actual)) {
    actual = actual.expression;
  }
  return actual;
}

/** Texto, número, booleano o null, o un objeto o arreglo hecho solo de ellos. */
function esValorLiteral(nodo: ts.Expression): boolean {
  const valor = sinEnvoltura(nodo);
  if (ts.isStringLiteral(valor) || ts.isNumericLiteral(valor) || ts.isNoSubstitutionTemplateLiteral(valor)) return true;
  if ([ts.SyntaxKind.TrueKeyword, ts.SyntaxKind.FalseKeyword, ts.SyntaxKind.NullKeyword].includes(valor.kind)) return true;
  if (ts.isPrefixUnaryExpression(valor)) return ts.isNumericLiteral(valor.operand);
  if (ts.isArrayLiteralExpression(valor)) return valor.elements.every(esValorLiteral);
  if (ts.isObjectLiteralExpression(valor)) {
    return valor.properties.every((p) => ts.isPropertyAssignment(p) && esValorLiteral(p.initializer));
  }
  return false;
}

function permitidoEnContrato(sentencia: ts.Statement): boolean {
  if (ts.isInterfaceDeclaration(sentencia) || ts.isTypeAliasDeclaration(sentencia)) return true;
  if (ts.isImportDeclaration(sentencia)) return esImportSoloTipos(sentencia);
  if (ts.isExportDeclaration(sentencia)) return sentencia.isTypeOnly;
  if (ts.isVariableStatement(sentencia)) {
    const esConst = (sentencia.declarationList.flags & ts.NodeFlags.Const) !== 0;
    return esConst && sentencia.declarationList.declarations.every((d) =>
      ts.isIdentifier(d.name) && DEFAULTS.test(d.name.text) && d.initializer !== undefined && esValorLiteral(d.initializer));
  }
  return false;
}

/** N2: un contrato solo exporta tipos y DEFAULTS literales. */
function n2ContratosSinComportamiento({ archivos }: Proyecto): Violacion[] {
  return [...archivos.values()].filter(esContrato).flatMap((archivo) => archivo.fuente.statements
    .filter((sentencia) => !permitidoEnContrato(sentencia))
    .map((sentencia) => ({
      regla: 'JONA-N2' as const, archivo: archivo.ruta, linea: lineaDe(archivo.fuente, sentencia),
      mensaje: `${ROL_CON_ARTICULO[archivo.rol]} contiene comportamiento: ${sentencia.getText(archivo.fuente).split('\n')[0]}`,
    })));
}

/** Usos de un efecto como valor: `fetch(...)`, `window.localStorage`; no nombres de propiedades ni tipos. */
function usosDeEfectos(fuente: ts.SourceFile): Array<{ nombre: string; linea: number }> {
  const usos: Array<{ nombre: string; linea: number }> = [];
  const visitar = (nodo: ts.Node): void => {
    if (ts.isTypeNode(nodo)) return;
    if (ts.isIdentifier(nodo) && EFECTOS.has(nodo.text)) {
      const padre = nodo.parent;
      const esPropiedad = ts.isPropertyAccessExpression(padre) && padre.name === nodo;
      const desdeGlobal = esPropiedad && ts.isIdentifier(padre.expression) && GLOBALES.has(padre.expression.text);
      const esNombreDeclarado = !ts.isPropertyAccessExpression(padre) && (padre as { name?: ts.Node }).name === nodo;
      if ((!esPropiedad || desdeGlobal) && !esNombreDeclarado) usos.push({ nombre: nodo.text, linea: lineaDe(fuente, nodo) });
    }
    ts.forEachChild(nodo, visitar);
  };
  visitar(fuente);
  return usos;
}

/** N3: la vista y el contrato no conocen servicios; nada en la unidad salvo la Implementación produce efectos. */
function n3EfectosSoloEnImplYAdaptadores({ archivos }: Proyecto): Violacion[] {
  const violaciones: Violacion[] = [];
  for (const archivo of archivos.values()) {
    if (archivo.unidad === undefined || archivo.rol === 'Implementación' || archivo.rol === 'adaptador') continue;
    const quien = ROL_CON_ARTICULO[archivo.rol];
    if (archivo.rol === 'vista' || esContrato(archivo)) {
      for (const imp of archivo.importaciones) {
        const destino = imp.destino ? archivos.get(imp.destino) : undefined;
        const prohibido = destino?.rol === 'adaptador' || (archivo.rol === 'vista' && destino?.rol === 'contrato de servicio');
        if (!destino || !prohibido) continue;
        violaciones.push({ regla: 'JONA-N3', archivo: archivo.ruta, linea: imp.linea, mensaje: `${quien} importa ${destino.ruta}, un servicio` });
      }
    }
    for (const uso of usosDeEfectos(archivo.fuente)) {
      violaciones.push({
        regla: 'JONA-N3', archivo: archivo.ruta, linea: uso.linea,
        mensaje: `${quien} usa ${uso.nombre}; los efectos van en la Implementación o en un adaptador`,
      });
    }
  }
  return violaciones;
}

/** N4: fuera de una unidad solo se importa su entrada. */
function n4SoloLaEntrada({ archivos, unidades }: Proyecto): Violacion[] {
  const violaciones: Violacion[] = [];
  for (const archivo of archivos.values()) {
    for (const imp of archivo.importaciones) {
      const destino = imp.destino ? archivos.get(imp.destino) : undefined;
      if (!destino?.unidad || destino.unidad === archivo.unidad) continue;
      const entradas = unidades.get(destino.unidad) ?? [];
      if (entradas.includes(destino.ruta)) continue;
      violaciones.push({
        regla: 'JONA-N4', archivo: archivo.ruta, linea: imp.linea,
        mensaje: `importa ${destino.ruta}, interno de la unidad ${destino.unidad}; use su entrada: ${entradas.join(' o ') || '(no tiene)'}`,
      });
    }
  }
  return violaciones;
}

/** Una función por regla del catálogo (reglas.json); la prueba del catálogo verifica que coincidan. */
export const REGLAS: Record<ReglaId, (proyecto: Proyecto) => Violacion[]> = {
  'JONA-N1': n1ContratosExplicitos,
  'JONA-N2': n2ContratosSinComportamiento,
  'JONA-N3': n3EfectosSoloEnImplYAdaptadores,
  'JONA-N4': n4SoloLaEntrada,
};

/** Revisa la raíz con todas las reglas, en orden de regla, archivo y línea. */
export function revisar(raiz: string): Violacion[] {
  const proyecto = leerProyecto(raiz);
  return Object.values(REGLAS)
    .flatMap((regla) => regla(proyecto))
    .sort((a, b) => a.regla.localeCompare(b.regla) || a.archivo.localeCompare(b.archivo) || (a.linea ?? 0) - (b.linea ?? 0));
}
