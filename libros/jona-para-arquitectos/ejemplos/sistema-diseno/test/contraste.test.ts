// @vitest-environment node
/**
 * Contraste WCAG de los pares de tokens semánticos en cada modo. Lee tokens.css
 * con un analizador propio y sigue las cadenas var() hasta los tripletes RGB
 * de la capa primitiva. Sin navegador: el CSS es un dato.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

type Rgb = [number, number, number];
type Modo = 'light' | 'dark' | 'system-oscuro';

interface Bloque {
  selector: string;
  declaraciones: Map<string, string>;
  hijos: Bloque[];
}

/** Analizador mínimo: bloques anidados (para @media) y declaraciones `--x: valor`. */
function analizarCss(texto: string): Bloque[] {
  const fuente = texto.replace(/\/\*[\s\S]*?\*\//g, '');
  let i = 0;
  const leer = (selector: string): Bloque => {
    const bloque: Bloque = { selector: selector.trim(), declaraciones: new Map(), hijos: [] };
    let buffer = '';
    const declarar = () => {
      const dosPuntos = buffer.indexOf(':');
      if (dosPuntos > 0) bloque.declaraciones.set(buffer.slice(0, dosPuntos).trim(), buffer.slice(dosPuntos + 1).trim());
      buffer = '';
    };
    while (i < fuente.length) {
      const c = fuente[i++];
      if (c === '{') {
        bloque.hijos.push(leer(buffer));
        buffer = '';
      } else if (c === ';') declarar();
      else if (c === '}') break;
      else buffer += c;
    }
    declarar();
    return bloque;
  };
  return leer('').hijos;
}

const selectores = (bloque: Bloque) => bloque.selector.split(',').map((s) => s.replace(/\s+/g, '').replace(/"/g, "'"));
const ATRIBUTO = { dark: ":root[data-theme-mode='dark']", 'system-oscuro': ":root[data-theme-mode='system']" } as const;
const OS_OSCURO = '@media(prefers-color-scheme:dark)';

/** Tokens vigentes en un modo: primero `:root`, luego los bloques del atributo (más específicos). */
function tokensDelModo(bloques: Bloque[], modo: Modo): Map<string, string> {
  const tokens = new Map<string, string>();
  const aplicar = (bloque: Bloque) => bloque.declaraciones.forEach((valor, nombre) => tokens.set(nombre, valor));
  bloques.filter((b) => selectores(b).includes(':root')).forEach(aplicar);
  if (modo === 'dark') bloques.filter((b) => selectores(b).includes(ATRIBUTO.dark)).forEach(aplicar);
  if (modo === 'system-oscuro') {
    bloques
      .filter((b) => b.selector.replace(/\s+/g, '') === OS_OSCURO)
      .flatMap((media) => media.hijos)
      .filter((b) => selectores(b).includes(ATRIBUTO['system-oscuro']))
      .forEach(aplicar);
  }
  return tokens;
}

/** Sigue var(--x) hasta un triplete "r g b". */
function rgbDe(tokens: Map<string, string>, nombre: string, profundidad = 0): Rgb {
  const valor = tokens.get(nombre);
  if (valor === undefined || profundidad > 10) throw new Error(`token sin resolver: ${nombre}`);
  const referencia = /^var\((--[\w-]+)\)$/.exec(valor);
  if (referencia) return rgbDe(tokens, referencia[1], profundidad + 1);
  const canales = valor.split(/\s+/).map(Number);
  if (canales.length !== 3 || canales.some((c) => !Number.isInteger(c) || c < 0 || c > 255)) {
    throw new Error(`${nombre} no es un triplete RGB: ${valor}`);
  }
  return canales as Rgb;
}

/** Luminancia relativa y razón de contraste de WCAG 2.x. */
const luminancia = (rgb: Rgb) => {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

function razonContraste(a: Rgb, b: Rgb): number {
  const [claro, oscuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (claro + 0.05) / (oscuro + 0.05);
}

/** Pares [primer plano, fondo, mínimo]: 4.5 para texto, 3 para foco y bordes de control. */
const PARES: [string, string, number][] = [
  ['--ds-fg', '--ds-surface', 4.5],
  ['--ds-fg-muted', '--ds-surface', 4.5],
  ['--ds-on-primary', '--ds-primary', 4.5],
  ['--ds-focus', '--ds-surface', 3],
  ['--ds-line-strong', '--ds-surface', 3],
];

const MODOS: Modo[] = ['light', 'dark', 'system-oscuro'];

/** Pares que no llegan al mínimo, en todos los modos. */
function paresQueFallan(css: string) {
  const bloques = analizarCss(css);
  return MODOS.flatMap((modo) => {
    const tokens = tokensDelModo(bloques, modo);
    return PARES.map(([fg, bg, minimo]) => ({
      modo,
      par: `${fg} sobre ${bg}`,
      razon: Math.round(razonContraste(rgbDe(tokens, fg), rgbDe(tokens, bg)) * 100) / 100,
      minimo,
    })).filter(({ razon, minimo }) => razon < minimo);
  });
}

const leer = (ruta: string) => readFileSync(new URL(ruta, import.meta.url), 'utf8');

describe('contraste de tokens (WCAG 2.x)', () => {
  it('calcula la razón de colores conocidos', () => {
    expect(razonContraste([255, 255, 255], [0, 0, 0])).toBeCloseTo(21, 5);
    expect(razonContraste([100, 116, 139], [255, 255, 255])).toBeCloseTo(4.76, 2);
  });

  it('el tema oscuro es opcional: solo rige con data-theme-mode dark, o system con preferencia oscura', () => {
    const bloques = analizarCss(leer('../src/tema/tokens.css'));
    const claro = tokensDelModo(bloques, 'light');
    const oscuro = tokensDelModo(bloques, 'dark');

    expect(rgbDe(claro, '--ds-surface')).not.toEqual(rgbDe(oscuro, '--ds-surface'));
    expect(rgbDe(tokensDelModo(bloques, 'system-oscuro'), '--ds-surface')).toEqual(rgbDe(oscuro, '--ds-surface'));
  });

  it('los semánticos apuntan a primitivos con var(), en los tres modos', () => {
    const bloques = analizarCss(leer('../src/tema/tokens.css'));
    for (const modo of MODOS) {
      const tokens = tokensDelModo(bloques, modo);
      for (const [fg, bg] of PARES) {
        expect(tokens.get(fg), `${fg} en ${modo}`).toMatch(/^var\(--ds-(primary|neutral)-\d+\)$/);
        expect(tokens.get(bg), `${bg} en ${modo}`).toMatch(/^var\(--ds-[\w-]+\)$/);
      }
    }
  });

  it('todos los pares de tokens.css cumplen en claro, oscuro y sistema oscuro', () => {
    expect(paresQueFallan(leer('../src/tema/tokens.css'))).toEqual([]);
  });

  it('no es una prueba vacía: un tokens.css con un par débil se reporta', () => {
    expect(paresQueFallan(leer('./fixtures/tokens-debiles.css'))).toEqual([
      { modo: 'dark', par: '--ds-fg-muted sobre --ds-surface', razon: 2.36, minimo: 4.5 },
    ]);
  });
});
