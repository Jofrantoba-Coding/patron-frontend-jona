// Reglas de seguridad del cliente, con la API del compilador de TypeScript. Miran el código que
// puede llegar al navegador: todo lo que no está en servidor/.
// 1. Ni HTML ni código armado con texto.           4. El servicio falso no llega a producción.
// 2. Las credenciales no viven en JavaScript.      5. Los DEFAULTS no llevan credenciales.
// 3. Ningún secreto en el cliente.
// Las reglas 3 y 5 son heurísticas: buscan nombres, y un nombre se puede elegir para esquivarlas.
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

const sinExtension = (ruta: string) => ruta.replace(/\.(tsx?|jsx?)$/, '');

/** Código que puede llegar al navegador: todo menos servidor/ y las pruebas. */
export function archivosDelCliente(src: string): string[] {
  return readdirSync(src, { recursive: true, encoding: 'utf8' })
    .map((archivo) => archivo.split(sep).join('/'))
    .filter((archivo) => /\.tsx?$/.test(archivo) && !/\.d\.ts$/.test(archivo) && !/\.test\.tsx?$/.test(archivo) && !archivo.startsWith('servidor/'))
    .sort();
}

interface Modulo {
  archivo: string;
  fuente: ts.SourceFile;
  /** Resuelve un especificador relativo a una ruta de src/ sin extensión. */
  resolver: (especificador: string) => string;
}

function analizar(src: string, archivo: string): Modulo {
  const fuente = ts.createSourceFile(archivo, readFileSync(join(src, archivo), 'utf8'), ts.ScriptTarget.Latest, true);
  const resolver = (especificador: string) =>
    especificador.startsWith('.') ? sinExtension(relative(src, resolve(dirname(join(src, archivo)), especificador)).split(sep).join('/')) : especificador;
  return { archivo, fuente, resolver };
}

const lineaDe = (modulo: Modulo, nodo: ts.Node) => modulo.fuente.getLineAndCharacterOfPosition(nodo.getStart()).line + 1;

/** Recorre el árbol y junta lo que devuelve `revisar` en cada nodo. */
function recorrer(modulo: Modulo, revisar: (nodo: ts.Node) => string | undefined): string[] {
  const encontrados: string[] = [];
  const visitar = (nodo: ts.Node) => {
    const problema = revisar(nodo);
    if (problema) encontrados.push(`línea ${lineaDe(modulo, nodo)}: ${problema}`);
    ts.forEachChild(nodo, visitar);
  };
  visitar(modulo.fuente);
  return encontrados;
}

const textoDe = (modulo: Modulo, nodo: ts.Node) => nodo.getText(modulo.fuente);

// ---------------------------------------------------------------------------------------------
// Regla 1: el HTML lo escribe React, con los textos como texto. Nada de dangerouslySetInnerHTML,
// innerHTML, outerHTML, insertAdjacentHTML ni document.write; y nada de código desde texto.
// ---------------------------------------------------------------------------------------------

const PROPIEDADES_HTML = new Set(['innerHTML', 'outerHTML']);
const LLAMADAS_HTML = new Set(['insertAdjacentHTML', 'write', 'writeln']);

function htmlDesdeTexto(modulo: Modulo): string[] {
  return recorrer(modulo, (nodo) => {
    if (ts.isJsxAttribute(nodo) && nodo.name.getText(modulo.fuente) === 'dangerouslySetInnerHTML') {
      return 'dangerouslySetInnerHTML inserta HTML sin que React lo escape';
    }
    if (ts.isBinaryExpression(nodo) && nodo.operatorToken.kind === ts.SyntaxKind.EqualsToken
      && ts.isPropertyAccessExpression(nodo.left) && PROPIEDADES_HTML.has(nodo.left.name.text)) {
      return `asigna ${nodo.left.name.text}: el texto se interpreta como HTML`;
    }
    if (ts.isCallExpression(nodo) && ts.isPropertyAccessExpression(nodo.expression) && LLAMADAS_HTML.has(nodo.expression.name.text)) {
      const nombre = nodo.expression.name.text;
      if (nombre === 'insertAdjacentHTML' || textoDe(modulo, nodo.expression.expression) === 'document') return `${textoDe(modulo, nodo.expression)} escribe HTML desde texto`;
    }
    if (ts.isCallExpression(nodo) && ts.isIdentifier(nodo.expression) && nodo.expression.text === 'eval') return 'eval ejecuta texto como código';
    if (ts.isNewExpression(nodo) && ts.isIdentifier(nodo.expression) && nodo.expression.text === 'Function') return 'new Function ejecuta texto como código';
    return undefined;
  });
}

// ---------------------------------------------------------------------------------------------
// Regla 2: ni tokens ni identificadores de sesión en el navegador. Ningún módulo del cliente usa
// localStorage, sessionStorage, indexedDB ni document.cookie: la sesión es una cookie HttpOnly.
// ---------------------------------------------------------------------------------------------

const ALMACENES = new Set(['localStorage', 'sessionStorage', 'indexedDB']);

function credencialesEnJavaScript(modulo: Modulo): string[] {
  return recorrer(modulo, (nodo) => {
    if (ts.isIdentifier(nodo) && ALMACENES.has(nodo.text)) {
      const padre = nodo.parent;
      const esNombreDePropiedad = ts.isPropertyAccessExpression(padre) && padre.name === nodo && !['window', 'globalThis', 'self'].includes(textoDe(modulo, padre.expression));
      if (!esNombreDePropiedad) return `usa ${nodo.text}: todo script de la página lo puede leer`;
    }
    if (ts.isPropertyAccessExpression(nodo) && nodo.name.text === 'cookie' && textoDe(modulo, nodo.expression) === 'document') {
      return 'usa document.cookie: la cookie de sesión es HttpOnly y JavaScript no la necesita';
    }
    return undefined;
  });
}

// ---------------------------------------------------------------------------------------------
// Regla 3: lo que se compila en el cliente lo tiene quien lo descarga. Ningún módulo del cliente
// lee process.env, ni una variable de import.meta.env con nombre de secreto (heurística).
// ---------------------------------------------------------------------------------------------

const NOMBRE_DE_SECRETO = /SECRET|SECRETO|TOKEN|KEY|CLAVE|PASSWORD|CONTRASENA|PRIVAD/i;

function secretosEnElCliente(modulo: Modulo): string[] {
  return recorrer(modulo, (nodo) => {
    if (!ts.isPropertyAccessExpression(nodo)) return undefined;
    const objeto = textoDe(modulo, nodo.expression);
    if (objeto === 'process' && nodo.name.text === 'env') return 'lee process.env en código del cliente';
    if (objeto === 'import.meta.env' && NOMBRE_DE_SECRETO.test(nodo.name.text)) {
      return `lee import.meta.env.${nodo.name.text}: Vite compila su valor en el bundle`;
    }
    return undefined;
  });
}

// ---------------------------------------------------------------------------------------------
// Regla 4: un módulo *Falso (el servicio falso) solo se importa con import() dentro de una rama
// de import.meta.env.DEV, que Vite elimina al compilar para producción. Un import estático puede
// quedar fuera del bundle si el empaquetador demuestra que no se usa; la regla no depende de eso.
// Las pruebas no cuentan.
// ---------------------------------------------------------------------------------------------

const esFalso = (ruta: string) => /Falso$/.test(ruta);
const CONDICION_DEV = 'import.meta.env.DEV';

/** Si el nodo está en la rama verdadera de una condición que exige import.meta.env.DEV. */
function dentroDeDesarrollo(modulo: Modulo, nodo: ts.Node): boolean {
  for (let hijo = nodo, padre = nodo.parent; padre; hijo = padre, padre = padre.parent) {
    if (ts.isIfStatement(padre) && hijo === padre.thenStatement && textoDe(modulo, padre.expression).includes(CONDICION_DEV)) return true;
    if (ts.isConditionalExpression(padre) && hijo === padre.whenTrue && textoDe(modulo, padre.condition).includes(CONDICION_DEV)) return true;
    if (ts.isBinaryExpression(padre) && padre.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken
      && hijo === padre.right && textoDe(modulo, padre.left).includes(CONDICION_DEV)) return true;
  }
  return false;
}

function falsoEnProduccion(modulo: Modulo): string[] {
  if (esFalso(sinExtension(modulo.archivo))) return [];
  return recorrer(modulo, (nodo) => {
    if ((ts.isImportDeclaration(nodo) || ts.isExportDeclaration(nodo)) && nodo.moduleSpecifier && ts.isStringLiteral(nodo.moduleSpecifier)) {
      const destino = modulo.resolver(nodo.moduleSpecifier.text);
      if (esFalso(destino)) return `importa ${destino} con import estático: llega al bundle salvo que el empaquetador demuestre que no se usa`;
    }
    if (ts.isCallExpression(nodo) && nodo.expression.kind === ts.SyntaxKind.ImportKeyword && nodo.arguments[0] && ts.isStringLiteral(nodo.arguments[0])) {
      const destino = modulo.resolver(nodo.arguments[0].text);
      if (esFalso(destino) && !dentroDeDesarrollo(modulo, nodo)) return `importa ${destino} fuera de una rama de ${CONDICION_DEV}`;
    }
    return undefined;
  });
}

// ---------------------------------------------------------------------------------------------
// Regla 5: los DEFAULTS son configuración de presentación, sin estado. Un objeto *_DEFAULTS no
// tiene propiedades con nombre de credencial (heurística): ni un correo ni una contraseña de prueba.
// ---------------------------------------------------------------------------------------------

const NOMBRES_DE_CREDENCIAL = new Set(['email', 'correo', 'usuario', 'clave', 'password', 'contrasena', 'token', 'secreto', 'apikey', 'sesion']);

function defaultsConCredenciales(modulo: Modulo): string[] {
  return recorrer(modulo, (nodo) => {
    if (!ts.isVariableDeclaration(nodo) || !ts.isIdentifier(nodo.name) || !/_DEFAULTS$/.test(nodo.name.text) || !nodo.initializer) return undefined;
    let valor: ts.Expression = nodo.initializer;
    while (ts.isAsExpression(valor) || ts.isSatisfiesExpression(valor) || ts.isParenthesizedExpression(valor)) valor = valor.expression;
    if (!ts.isObjectLiteralExpression(valor)) return undefined;
    const prohibidas = valor.properties
      .map((p) => (p.name && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)) ? p.name.text : ''))
      .filter((nombre) => NOMBRES_DE_CREDENCIAL.has(nombre.toLowerCase()));
    return prohibidas.length ? `${nodo.name.text} tiene ${prohibidas.join(', ')}: los DEFAULTS no llevan estado ni credenciales` : undefined;
  });
}

// ---------------------------------------------------------------------------------------------

export function revisarSeguridad(src: string): Violacion[] {
  const violaciones: Violacion[] = [];
  for (const modulo of archivosDelCliente(src).map((archivo) => analizar(src, archivo))) {
    const reportar = (regla: Regla) => (mensaje: string) => violaciones.push({ regla, archivo: modulo.archivo, mensaje });
    htmlDesdeTexto(modulo).forEach(reportar(1));
    credencialesEnJavaScript(modulo).forEach(reportar(2));
    secretosEnElCliente(modulo).forEach(reportar(3));
    falsoEnProduccion(modulo).forEach(reportar(4));
    defaultsConCredenciales(modulo).forEach(reportar(5));
  }
  return violaciones.sort((a, b) => a.regla - b.regla);
}
