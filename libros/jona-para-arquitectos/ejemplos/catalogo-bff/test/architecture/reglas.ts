// Reglas de arquitectura del BFF sobre src/, con la API del compilador de TypeScript.
// 1 y 2 son del hexágono: los manejadores dependen de los puertos y solo la raíz elige adaptadores.
// 3 es la propia de un BFF: no tiene reglas de negocio; las tienen los backends.
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import ts from 'typescript';

export type Regla = 1 | 2 | 3;

export interface Violacion {
  regla: Regla;
  /** Ruta relativa a src/, con '/'. */
  archivo: string;
  mensaje: string;
}

/** Lo que un manejador puede importar: los puertos y el contrato de la API que sirve. */
const PERMITIDO_EN_MANEJADORES = new Set(['puertos', 'api', 'manejadores']);

/** Métodos que recorren una colección buscando o filtrando elementos. */
const BUSQUEDAS = new Set(['some', 'every', 'find', 'findIndex', 'findLast', 'findLastIndex', 'filter']);

/** Archivos analizados, relativos a src/. Las pruebas quedan fuera. */
export function archivosFuente(src: string): string[] {
  return readdirSync(src, { recursive: true, encoding: 'utf8' })
    .map((archivo) => archivo.split(sep).join('/'))
    .filter((archivo) => /\.ts$/.test(archivo) && !/\.(d|test)\.ts$/.test(archivo))
    .sort();
}

interface Modulo {
  archivo: string;
  /** Primera carpeta bajo src/: api, puertos, adaptadores, manejadores, http o app. */
  zona: string;
  fuente: ts.SourceFile;
  /** Imports relativos: la zona de destino y la ruta relativa a src/. */
  internos: Array<{ zona: string; ruta: string }>;
  paquetes: string[];
}

function analizar(src: string, archivo: string): Modulo {
  const fuente = ts.createSourceFile(archivo, readFileSync(join(src, archivo), 'utf8'), ts.ScriptTarget.Latest, true);
  const internos: Modulo['internos'] = [];
  const paquetes: string[] = [];
  for (const sentencia of fuente.statements) {
    if (!ts.isImportDeclaration(sentencia) && !ts.isExportDeclaration(sentencia)) continue;
    const especificador = sentencia.moduleSpecifier;
    if (especificador === undefined || !ts.isStringLiteral(especificador)) continue;
    if (!especificador.text.startsWith('.')) {
      paquetes.push(especificador.text);
      continue;
    }
    const ruta = relative(src, resolve(dirname(join(src, archivo)), especificador.text)).split(sep).join('/');
    internos.push({ zona: ruta.split('/')[0], ruta: ruta.replace(/\.(ts|js)$/, '') });
  }
  return { archivo, zona: archivo.split('/')[0], fuente, internos, paquetes };
}

// Regla 1: los manejadores dependen solo de los puertos (y del contrato de la API).
function manejadoresSoloPuertos(modulo: Modulo): string[] {
  if (modulo.zona !== 'manejadores') return [];
  return [
    ...modulo.internos
      .filter((destino) => !PERMITIDO_EN_MANEJADORES.has(destino.zona))
      .map((destino) => `el manejador importa ${destino.ruta}; solo depende de los puertos`),
    ...modulo.paquetes.map((paquete) => `el manejador importa el paquete ${paquete}; solo depende de los puertos`),
  ];
}

// Regla 2: solo la raíz de composición (app/) elige un adaptador.
function adaptadoresSoloEnLaRaiz(modulo: Modulo): string[] {
  if (modulo.zona === 'app' || modulo.zona === 'adaptadores') return [];
  return modulo.internos
    .filter((destino) => destino.zona === 'adaptadores')
    .map((destino) => `importa el adaptador ${destino.ruta}; solo app/ elige un adaptador`);
}

// Regla 3: sin reglas de negocio. La forma detectable de una regla de unicidad es recorrer una
// colección comparando SKU (`existentes.some((a) => a.sku === datos.sku)`). Para unir datos de dos
// backends se indexa con un Map; buscar por SKU es decidir si un SKU ya existe, y eso es de catalogo.
function esPropiedadSku(nodo: ts.Node): boolean {
  if (ts.isPropertyAccessExpression(nodo)) return nodo.name.text === 'sku';
  if (ts.isElementAccessExpression(nodo)) return ts.isStringLiteral(nodo.argumentExpression) && nodo.argumentExpression.text === 'sku';
  return false;
}

const COMPARACIONES = new Set([
  ts.SyntaxKind.EqualsEqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsEqualsToken,
  ts.SyntaxKind.EqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsToken,
]);

function comparaSku(nodo: ts.Node): boolean {
  if (ts.isBinaryExpression(nodo) && COMPARACIONES.has(nodo.operatorToken.kind) && (esPropiedadSku(nodo.left) || esPropiedadSku(nodo.right))) {
    return true;
  }
  return ts.forEachChild(nodo, comparaSku) ?? false;
}

function sinReglasDeNegocio(modulo: Modulo): string[] {
  const violaciones: string[] = [];
  const visitar = (nodo: ts.Node) => {
    if (ts.isCallExpression(nodo) && ts.isPropertyAccessExpression(nodo.expression) && BUSQUEDAS.has(nodo.expression.name.text)) {
      const [callback] = nodo.arguments;
      if (callback && (ts.isArrowFunction(callback) || ts.isFunctionExpression(callback)) && comparaSku(callback.body)) {
        const linea = modulo.fuente.getLineAndCharacterOfPosition(nodo.getStart()).line + 1;
        violaciones.push(`línea ${linea}: recorre una colección comparando SKU; la unicidad es una regla de catalogo, no del BFF`);
      }
    }
    ts.forEachChild(nodo, visitar);
  };
  visitar(modulo.fuente);
  return violaciones;
}

export function revisarArquitectura(src: string): Violacion[] {
  const violaciones: Violacion[] = [];
  for (const modulo of archivosFuente(src).map((archivo) => analizar(src, archivo))) {
    const reportar = (regla: Regla) => (mensaje: string) => violaciones.push({ regla, archivo: modulo.archivo, mensaje });
    manejadoresSoloPuertos(modulo).forEach(reportar(1));
    adaptadoresSoloEnLaRaiz(modulo).forEach(reportar(2));
    sinReglasDeNegocio(modulo).forEach(reportar(3));
  }
  return violaciones;
}
