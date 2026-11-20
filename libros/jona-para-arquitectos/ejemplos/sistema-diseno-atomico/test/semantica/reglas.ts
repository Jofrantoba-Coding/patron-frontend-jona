// Reglas de semántica del sistema de diseño, con la API del compilador de TypeScript. Lo que un
// rastreador y un lector de pantalla entienden de una página sale del HTML, y en una aplicación
// que se compone con el sistema de diseño ese HTML lo escriben estas unidades:
// 5. Los títulos salen de JHeading, que exige el nivel.
// 6. Navegar es un enlace con destino: ni <a> sin href, ni un elemento cualquiera con onClick.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';
import { archivosFuente } from '../niveles/reglas';

export type Regla = 5 | 6;

export interface Violacion {
  regla: Regla;
  /** Ruta relativa a src/, con '/'. */
  archivo: string;
  mensaje: string;
}

/** La única unidad que dibuja <h1>…<h6>. */
const UNIDAD_DE_TITULOS = 'atomos/jheading/';
const TITULO = /^h[1-6]$/;
/** Elementos nativos que ya son interactivos: un onClick en ellos lo anuncia el elemento. */
const INTERACTIVOS = new Set(['a', 'button', 'input', 'select', 'textarea', 'summary']);
/** Un href que no lleva a ningún lado: el ancla vacía o código. */
const SIN_DESTINO = /^(#|javascript:)/i;

type ElementoJsx = ts.JsxOpeningElement | ts.JsxSelfClosingElement;

const atributo = (elemento: ElementoJsx, nombre: string) =>
  elemento.attributes.properties.find((p): p is ts.JsxAttribute => ts.isJsxAttribute(p) && p.name.getText() === nombre);

/** El valor de un atributo cuando es un texto literal: `as="h1"` o `as={'h1'}`. */
function textoLiteral(nodo: ts.JsxAttribute | undefined): string | undefined {
  const inicial = nodo?.initializer;
  if (inicial === undefined) return undefined;
  if (ts.isStringLiteral(inicial)) return inicial.text;
  if (ts.isJsxExpression(inicial) && inicial.expression && ts.isStringLiteralLike(inicial.expression)) return inicial.expression.text;
  return undefined;
}

/** Elemento nativo: la etiqueta empieza en minúscula (`div`), no es un componente (`JText`). */
const esNativo = (elemento: ElementoJsx) => /^[a-z]/.test(elemento.tagName.getText());

function revisar(archivo: string, fuente: ts.SourceFile): Violacion[] {
  const violaciones: Violacion[] = [];
  const linea = (nodo: ts.Node) => fuente.getLineAndCharacterOfPosition(nodo.getStart()).line + 1;
  const informar = (regla: Regla, nodo: ts.Node, mensaje: string) =>
    violaciones.push({ regla, archivo, mensaje: `línea ${linea(nodo)}: ${mensaje}` });

  const visitar = (nodo: ts.Node) => {
    if (ts.isJsxOpeningElement(nodo) || ts.isJsxSelfClosingElement(nodo)) {
      const etiqueta = nodo.tagName.getText();
      // Regla 5: un título a mano, o un átomo de texto disfrazado de título.
      if (TITULO.test(etiqueta) && !archivo.startsWith(UNIDAD_DE_TITULOS)) {
        informar(5, nodo, `dibuja <${etiqueta}> a mano; los títulos salen de JHeading, que exige el nivel`);
      }
      const como = textoLiteral(atributo(nodo, 'as'));
      if (como !== undefined && TITULO.test(como)) {
        informar(5, nodo, `usa <${etiqueta} as="${como}">; los títulos salen de JHeading, que separa el nivel del tamaño`);
      }
      // Regla 6: un enlace sin destino, o un elemento que navega o actúa sin serlo.
      if (etiqueta === 'a') {
        const href = atributo(nodo, 'href');
        const destino = textoLiteral(href);
        if (href === undefined) informar(6, nodo, '<a> sin href: el teclado no lo enfoca y un rastreador no tiene qué seguir');
        else if (destino !== undefined && SIN_DESTINO.test(destino)) informar(6, nodo, `<a href="${destino}"> no lleva a ningún lado`);
      }
      if (esNativo(nodo) && !INTERACTIVOS.has(etiqueta) && atributo(nodo, 'onClick')) {
        informar(6, nodo, `<${etiqueta}> con onClick: no es un enlace ni un botón; para navegar, JLink; para actuar, JButton`);
      }
    }
    ts.forEachChild(nodo, visitar);
  };
  visitar(fuente);
  return violaciones;
}

/** Las vistas de un árbol (src/ o un árbol de test/fixtures): solo ellas dibujan. */
export const vistasDe = (src: string) => archivosFuente(src).filter((archivo) => /View\.tsx$/.test(archivo));

export function verificarSemantica(src: string): Violacion[] {
  return vistasDe(src).flatMap((archivo) =>
    revisar(archivo, ts.createSourceFile(archivo, readFileSync(join(src, archivo), 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)),
  );
}
