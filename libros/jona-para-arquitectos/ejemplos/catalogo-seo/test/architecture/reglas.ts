// Reglas de arquitectura, con la API del compilador de TypeScript. Las cuatro primeras son las del
// capítulo 15 (copia, con los tres procesos de este ejemplo); la quinta es propia del SEO.
// 1. Lo del servidor no llega al navegador.      3. Las vistas son puras.
// 2. La cara de datos es serializable.           4. En el servidor, nada de estado de módulo.
// 5. Las vistas no escriben la cabeza: los metadatos salen del contrato InterMetadatosPagina.
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import ts from 'typescript';

export type Regla = 1 | 2 | 3 | 4 | 5;

export interface Violacion {
  regla: Regla;
  /** Ruta relativa a src/, con '/'. */
  archivo: string;
  mensaje: string;
}

/** Archivos analizados, relativos a src/. Las pruebas quedan fuera: son raíces de composición propias. */
export function archivosFuente(src: string): string[] {
  return readdirSync(src, { recursive: true, encoding: 'utf8' })
    .map((archivo) => archivo.split(sep).join('/'))
    .filter((archivo) => /\.tsx?$/.test(archivo) && !/\.d\.ts$/.test(archivo) && !/\.test\.tsx?$/.test(archivo))
    .sort();
}

const sinExtension = (ruta: string) => ruta.replace(/\.(tsx?|jsx?)$/, '');

/**
 * Código del servidor: todo lo que está en servidor/ y todo módulo cuyo nombre termina en
 * Servidor (la Implementación del servidor de una unidad y su indexServidor.ts). El resto
 * (cliente/, ui/, compartido/, dominio/) puede terminar en el navegador.
 */
export const esDelServidor = (ruta: string) => ruta.startsWith('servidor/') || /Servidor$/.test(sinExtension(ruta));

/** Los puntos de entrada de proceso: corren una vez, y son los únicos con código suelto en el servidor. */
const ENTRADAS_DE_PROCESO = new Set(['servidor/principal.ts', 'servidor/generarEstatico.ts', 'servidor/previsualizarEstatico.ts']);

/** Paquetes que solo existen en el servidor. */
const PAQUETES_DEL_SERVIDOR = (paquete: string) => paquete.startsWith('node:') || paquete === 'react-dom/server';

interface Modulo {
  archivo: string;
  fuente: ts.SourceFile;
  /** Imports relativos, resueltos a una ruta de src/ sin extensión. */
  internos: string[];
  paquetes: string[];
}

function analizar(src: string, archivo: string): Modulo {
  const fuente = ts.createSourceFile(archivo, readFileSync(join(src, archivo), 'utf8'), ts.ScriptTarget.Latest, true);
  const internos: string[] = [];
  const paquetes: string[] = [];
  for (const sentencia of fuente.statements) {
    if (!ts.isImportDeclaration(sentencia) && !ts.isExportDeclaration(sentencia)) continue;
    const especificador = sentencia.moduleSpecifier;
    if (especificador === undefined || !ts.isStringLiteral(especificador)) continue;
    if (!especificador.text.startsWith('.')) paquetes.push(especificador.text);
    else internos.push(sinExtension(relative(src, resolve(dirname(join(src, archivo)), especificador.text)).split(sep).join('/')));
  }
  return { archivo, fuente, internos, paquetes };
}

const lineaDe = (modulo: Modulo, nodo: ts.Node) => modulo.fuente.getLineAndCharacterOfPosition(nodo.getStart()).line + 1;

// ---------------------------------------------------------------------------------------------
// Regla 1: lo que puede llegar al navegador no importa código del servidor ni paquetes de Node.
// ---------------------------------------------------------------------------------------------

function nadaDelServidorEnElCliente(modulo: Modulo): string[] {
  if (esDelServidor(modulo.archivo)) return [];
  return [
    ...modulo.internos.filter(esDelServidor).map((destino) => `importa ${destino}, código del servidor; el navegador no debe recibirlo`),
    ...modulo.paquetes.filter(PAQUETES_DEL_SERVIDOR).map((paquete) => `importa ${paquete}, que solo existe en el servidor`),
  ];
}

// ---------------------------------------------------------------------------------------------
// Regla 2: los tipos Datos* de un contrato Inter*.ts solo tienen valores que sobreviven a JSON.
// ---------------------------------------------------------------------------------------------

const PRIMITIVOS = ts.TypeFlags.String | ts.TypeFlags.Number | ts.TypeFlags.Boolean | ts.TypeFlags.StringLiteral
  | ts.TypeFlags.NumberLiteral | ts.TypeFlags.BooleanLiteral | ts.TypeFlags.Null | ts.TypeFlags.Undefined;

function problemaDeSerializacion(programa: ts.Program, tipo: ts.Type, ruta: string, vistos: Set<ts.Type>): string | undefined {
  const checker = programa.getTypeChecker();
  if (vistos.has(tipo) || tipo.flags & PRIMITIVOS) return undefined;
  vistos.add(tipo);
  if (tipo.isUnionOrIntersection()) {
    for (const parte of tipo.types) {
      const problema = problemaDeSerializacion(programa, parte, ruta, vistos);
      if (problema) return problema;
    }
    return undefined;
  }
  const nombre = checker.typeToString(tipo);
  if (!(tipo.flags & ts.TypeFlags.Object)) return `${ruta} es ${nombre}, que JSON no conserva`;
  if (tipo.getCallSignatures().length > 0 || tipo.getConstructSignatures().length > 0) return `${ruta} es una función (${nombre})`;
  if (checker.isArrayType(tipo) || checker.isTupleType(tipo)) {
    for (const elemento of checker.getTypeArguments(tipo as ts.TypeReference)) {
      const problema = problemaDeSerializacion(programa, elemento, `${ruta}[]`, vistos);
      if (problema) return problema;
    }
    return undefined;
  }
  // Una clase, o un tipo de la biblioteca estándar (Date, Map, Set, RegExp, Promise): una instancia.
  const simbolo = tipo.getSymbol();
  const declaracion = simbolo?.declarations?.[0];
  if (simbolo && (simbolo.flags & ts.SymbolFlags.Class || (declaracion && programa.isSourceFileDefaultLibrary(declaracion.getSourceFile())))) {
    return `${ruta} es una instancia de ${nombre}, que JSON convierte en otra cosa`;
  }
  for (const propiedad of checker.getPropertiesOfType(tipo)) {
    if (propiedad.flags & ts.SymbolFlags.Method) return `${ruta}.${propiedad.name} es un método`;
    const problema = problemaDeSerializacion(programa, checker.getTypeOfSymbol(propiedad), `${ruta}.${propiedad.name}`, vistos);
    if (problema) return problema;
  }
  const indice = tipo.getStringIndexType();
  return indice ? problemaDeSerializacion(programa, indice, `${ruta}[clave]`, vistos) : undefined;
}

/** Los tipos de datos encontrados, para que la prueba no pase por no encontrar ninguno. */
export function caraDeDatos(src: string): { tipos: string[]; violaciones: Array<{ archivo: string; mensaje: string }> } {
  const contratos = archivosFuente(src).filter((archivo) => /(^|\/)Inter[A-Z]\w*\.ts$/.test(archivo));
  const programa = ts.createProgram(contratos.map((archivo) => join(src, archivo)), {
    strict: true, noEmit: true, skipLibCheck: true, target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler, lib: ['lib.es2022.d.ts', 'lib.dom.d.ts'],
  });
  const checker = programa.getTypeChecker();
  const tipos: string[] = [];
  const violaciones: Array<{ archivo: string; mensaje: string }> = [];
  for (const archivo of contratos) {
    const fuente = programa.getSourceFile(join(src, archivo));
    for (const sentencia of fuente?.statements ?? []) {
      if (!(ts.isInterfaceDeclaration(sentencia) || ts.isTypeAliasDeclaration(sentencia)) || !/^Datos[A-Z]/.test(sentencia.name.text)) continue;
      tipos.push(sentencia.name.text);
      const problema = problemaDeSerializacion(programa, checker.getTypeAtLocation(sentencia.name), sentencia.name.text, new Set());
      if (problema) violaciones.push({ archivo, mensaje: `la cara de datos no es serializable: ${problema}` });
    }
  }
  return { tipos, violaciones };
}

// ---------------------------------------------------------------------------------------------
// Regla 3: una vista (*View.tsx) no lee nada que cambie entre el servidor y el navegador.
// ---------------------------------------------------------------------------------------------

/** Globales que no existen en el servidor, o que valen distinto en cada lado. */
const GLOBALES_IMPUROS = new Set(['window', 'document', 'globalThis', 'navigator', 'location', 'localStorage', 'sessionStorage', 'performance', 'crypto']);
/** Llamadas cuyo resultado cambia en cada ejecución. */
const LLAMADAS_IMPURAS = new Set(['Date.now', 'Math.random']);

function esReferencia(nodo: ts.Identifier): boolean {
  const padre = nodo.parent;
  if (ts.isPropertyAccessExpression(padre) && padre.name === nodo) return false;
  if (ts.isQualifiedName(padre) && padre.right === nodo) return false;
  if ((ts.isPropertyAssignment(padre) || ts.isPropertySignature(padre) || ts.isMethodDeclaration(padre)) && padre.name === nodo) return false;
  if (ts.isJsxAttribute(padre) || ts.isBindingElement(padre) || ts.isParameter(padre) || ts.isVariableDeclaration(padre)) return false;
  return !ts.isImportSpecifier(padre) && !ts.isTypeReferenceNode(padre);
}

function vistaPura(modulo: Modulo): string[] {
  if (!/View\.tsx$/.test(modulo.archivo)) return [];
  const violaciones: string[] = [];
  const visitar = (nodo: ts.Node) => {
    if (ts.isIdentifier(nodo) && GLOBALES_IMPUROS.has(nodo.text) && esReferencia(nodo)) {
      violaciones.push(`línea ${lineaDe(modulo, nodo)}: la vista lee ${nodo.text}, que no existe igual en el servidor`);
    }
    if (ts.isPropertyAccessExpression(nodo) && LLAMADAS_IMPURAS.has(nodo.getText(modulo.fuente))) {
      violaciones.push(`línea ${lineaDe(modulo, nodo)}: la vista usa ${nodo.getText(modulo.fuente)}, que cambia entre el servidor y el cliente`);
    }
    if ((ts.isNewExpression(nodo) || ts.isCallExpression(nodo)) && ts.isIdentifier(nodo.expression) && nodo.expression.text === 'Date') {
      violaciones.push(`línea ${lineaDe(modulo, nodo)}: la vista crea una fecha; la hora llega como dato`);
    }
    ts.forEachChild(nodo, visitar);
  };
  visitar(modulo.fuente);
  return violaciones;
}

// ---------------------------------------------------------------------------------------------
// Regla 4: un módulo del servidor no guarda estado ni instancias a nivel de módulo. Lo comparten
// todas las peticiones del proceso: un singleton de módulo es estado compartido entre usuarios.
// La raíz de composición exporta una fábrica, no una instancia. Se permiten imports, tipos,
// funciones, clases y `const` con valores literales (incluidas funciones flecha).
// ---------------------------------------------------------------------------------------------

function sinDesenvolver(nodo: ts.Expression): ts.Expression {
  let actual = nodo;
  while (ts.isAsExpression(actual) || ts.isSatisfiesExpression(actual) || ts.isParenthesizedExpression(actual)) actual = actual.expression;
  return actual;
}

function esValorLiteral(nodo: ts.Expression): boolean {
  const valor = sinDesenvolver(nodo);
  if (ts.isStringLiteral(valor) || ts.isNumericLiteral(valor) || ts.isNoSubstitutionTemplateLiteral(valor)) return true;
  if ([ts.SyntaxKind.TrueKeyword, ts.SyntaxKind.FalseKeyword, ts.SyntaxKind.NullKeyword].includes(valor.kind)) return true;
  if (ts.isPrefixUnaryExpression(valor)) return ts.isNumericLiteral(valor.operand);
  if (ts.isArrowFunction(valor) || ts.isFunctionExpression(valor)) return true;
  // Una expresión regular sin g ni y no guarda estado (lastIndex).
  if (ts.isRegularExpressionLiteral(valor)) return !/\/[a-z]*[gy][a-z]*$/.test(valor.text);
  if (ts.isArrayLiteralExpression(valor)) return valor.elements.every(esValorLiteral);
  if (ts.isObjectLiteralExpression(valor)) return valor.properties.every((p) => ts.isPropertyAssignment(p) && esValorLiteral(p.initializer));
  return false;
}

function sentenciaSinEstado(sentencia: ts.Statement): boolean {
  if (ts.isImportDeclaration(sentencia) || ts.isExportDeclaration(sentencia)) return true;
  if (ts.isInterfaceDeclaration(sentencia) || ts.isTypeAliasDeclaration(sentencia)) return true;
  if (ts.isFunctionDeclaration(sentencia) || ts.isClassDeclaration(sentencia)) return true;
  if (ts.isVariableStatement(sentencia)) {
    const esConst = (sentencia.declarationList.flags & ts.NodeFlags.Const) !== 0;
    return esConst && sentencia.declarationList.declarations.every((d) => d.initializer !== undefined && esValorLiteral(d.initializer));
  }
  return false;
}

function sinEstadoDeModulo(modulo: Modulo): string[] {
  if (!esDelServidor(modulo.archivo) || ENTRADAS_DE_PROCESO.has(modulo.archivo)) return [];
  return modulo.fuente.statements
    .filter((sentencia) => !sentenciaSinEstado(sentencia))
    .map((sentencia) => `línea ${lineaDe(modulo, sentencia)}: estado de módulo en el servidor, compartido por todas las peticiones: ${sentencia.getText(modulo.fuente).split('\n')[0]}`);
}

// ---------------------------------------------------------------------------------------------
// Regla 5: una vista no dibuja <title>, <meta>, <link>, <script>, <head>, <html> ni <base>. React 19
// lleva <title> y <meta> a la cabeza desde cualquier componente; aquí eso saltaría el contrato de
// metadatos, su prueba sin DOM y el único renderizador de la cabeza (renderizarCabeza.ts).
// ---------------------------------------------------------------------------------------------

const ETIQUETAS_DE_CABEZA = new Set(['title', 'meta', 'link', 'script', 'head', 'html', 'base']);

function vistaSinCabeza(modulo: Modulo): string[] {
  if (!/View\.tsx$/.test(modulo.archivo)) return [];
  const violaciones: string[] = [];
  const visitar = (nodo: ts.Node) => {
    if ((ts.isJsxOpeningElement(nodo) || ts.isJsxSelfClosingElement(nodo)) && ETIQUETAS_DE_CABEZA.has(nodo.tagName.getText(modulo.fuente))) {
      violaciones.push(`línea ${lineaDe(modulo, nodo)}: la vista dibuja <${nodo.tagName.getText(modulo.fuente)}>; los metadatos van en el contrato InterMetadatosPagina`);
    }
    ts.forEachChild(nodo, visitar);
  };
  visitar(modulo.fuente);
  return violaciones;
}

// ---------------------------------------------------------------------------------------------

export function revisarArquitectura(src: string): Violacion[] {
  const violaciones: Violacion[] = [];
  for (const modulo of archivosFuente(src).map((archivo) => analizar(src, archivo))) {
    const reportar = (regla: Regla) => (mensaje: string) => violaciones.push({ regla, archivo: modulo.archivo, mensaje });
    nadaDelServidorEnElCliente(modulo).forEach(reportar(1));
    vistaPura(modulo).forEach(reportar(3));
    sinEstadoDeModulo(modulo).forEach(reportar(4));
    vistaSinCabeza(modulo).forEach(reportar(5));
  }
  violaciones.push(...caraDeDatos(src).violaciones.map((v) => ({ regla: 2 as const, ...v })));
  return violaciones.sort((a, b) => a.regla - b.regla);
}
