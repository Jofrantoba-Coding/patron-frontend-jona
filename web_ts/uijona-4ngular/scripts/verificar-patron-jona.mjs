#!/usr/bin/env node
/**
 * Verificador del patron JONA para uijona-4ngular.
 *
 * La convencion deja de ser un documento que se erosiona y pasa a ser una
 * comprobacion que corre en CI. Reglas:
 *
 *  1. La capa View es un archivo real: no existen `*View.ts` con la plantilla
 *     como string. La plantilla vive en `<Comp>View.html` y los estilos del
 *     componente en `<Comp>View.css`.
 *  2. Todo @Component usa `templateUrl`, nunca `template:` en linea.
 *  3. El contrato (`Inter<Comp>.ts`) es agnostico: no contiene clases de
 *     Tailwind ni valores de presentacion. Eso vive en `<Comp>Styles.ts`.
 *  4. Los mapas de presentacion no forman parte de la API publica: ni los
 *     entry point ni `public-api.ts` los reexportan.
 *  5. Cada carpeta de componente tiene sus capas: Inter, Impl, entry e index.
 *
 * Uso: npm run lint:jona
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, dirname, basename, relative } from 'node:path';

const RAIZ = 'projects/uijona/src/lib';
const PUBLIC_API = 'projects/uijona/src/public-api.ts';

/** Tokens que delatan que un string es una clase de Tailwind. */
const TAILWIND = /\b(bg|text|border|rounded|p|px|py|m|mx|my|w|h|min-h|max-w|flex|grid|gap|shadow|ring|hover:|focus-visible:|sm:|md:|lg:|animate-|translate-)[-:[]/;

/**
 * Prosa = frase en lenguaje natural (los mapas de DOCUMENTACION del contrato,
 * que si deben vivir en el Inter). Se distingue de una lista de clases por
 * llevar un punto seguido de espacio o de fin de linea. Ojo: `py-0.5` tambien
 * tiene punto, de ahi que no baste con buscar `.`.
 */
const esProsa = (valor) => /\.(\s|$)/.test(valor);

function walk(dir, out = []) {
  for (const nombre of readdirSync(dir)) {
    const p = join(dir, nombre);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function matchBrace(s, open) {
  let depth = 0;
  for (let i = open; i < s.length; i++) {
    const c = s[i];
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) return i;
    } else if (c === '`' || c === "'" || c === '"') {
      const q = c;
      i++;
      while (i < s.length && s[i] !== q) {
        if (s[i] === '\\') i++;
        i++;
      }
    }
  }
  return -1;
}

const archivos = walk(RAIZ);
const fallos = [];
const rel = (p) => relative('.', p).replace(/\\/g, '/');

// ── Regla 1: la capa View no puede ser un .ts ────────────────────────────────
for (const f of archivos.filter((f) => f.endsWith('View.ts'))) {
  fallos.push(
    `[R1] ${rel(f)}: la capa View debe ser <Comp>View.html (+ .css), no un .ts con la plantilla como string.`
  );
}

// ── Reglas 2 y 3 ─────────────────────────────────────────────────────────────
for (const f of archivos.filter((f) => f.endsWith('Impl.ts'))) {
  const src = readFileSync(f, 'utf8');
  let idx = src.indexOf('@Component({');
  while (idx !== -1) {
    const abre = src.indexOf('{', idx);
    const cierra = matchBrace(src, abre);
    if (cierra === -1) break;
    const decorador = src.slice(abre, cierra + 1);
    if (/(^|[\s,{])template\s*:/.test(decorador)) {
      const clase = src.slice(cierra).match(/export class (\w+)/)?.[1] ?? '?';
      fallos.push(`[R2] ${rel(f)} (${clase}): usa 'template:' en linea; debe ser 'templateUrl'.`);
    }
    idx = src.indexOf('@Component({', cierra);
  }
}

for (const f of archivos.filter((f) => basename(f).startsWith('Inter') && f.endsWith('.ts'))) {
  const src = readFileSync(f, 'utf8');
  const re = /^export const ([A-Z][A-Z0-9_]*)\s*:\s*Record<[^=]*?>\s*=\s*\{/gm;
  let m;
  while ((m = re.exec(src))) {
    const abre = src.indexOf('{', m.index + m[0].length - 1);
    const cierra = matchBrace(src, abre);
    const cuerpo = src.slice(abre, cierra + 1);
    const valores = [...cuerpo.matchAll(/'([^']*)'/g)].map((v) => v[1]);
    const pareceClase = valores.some((v) => TAILWIND.test(v) && !esProsa(v));
    const pareceValorCss = /_VALUES$/.test(m[1]);
    if (pareceClase || pareceValorCss) {
      fallos.push(
        `[R3] ${rel(f)}: '${m[1]}' contiene valores de presentacion; muevelo a <Comp>Styles.ts.`
      );
    }
  }
}

// ── Regla 4: la presentacion no se exporta ───────────────────────────────────
for (const f of archivos) {
  const b = basename(f);
  if (!f.endsWith('.ts')) continue;
  if (b.startsWith('Inter') || /Impl\.ts$|Styles\.ts$|\.spec\.ts$/.test(b)) continue;
  const src = readFileSync(f, 'utf8');
  if (/\bexport\b[^;]*_CLASSES/.test(src)) {
    fallos.push(`[R4] ${rel(f)}: reexporta mapas *_CLASSES; son detalle de implementacion.`);
  }
  if (/from '\.\/\w+Styles'/.test(src) && b !== 'index.ts') {
    fallos.push(`[R4] ${rel(f)}: el entry point no debe reexportar <Comp>Styles.`);
  }
}

if (existsSync(PUBLIC_API)) {
  const api = readFileSync(PUBLIC_API, 'utf8');
  if (/Styles'/.test(api)) fallos.push(`[R4] ${PUBLIC_API}: exporta un modulo *Styles.`);
}

// ── Regla 5: capas completas por componente ──────────────────────────────────
// El contrato y la plantilla pueden ser COMPARTIDOS por una familia de
// componentes (p.ej. los layouts basados en JPanel comparten InterLayoutBase.ts
// y LayoutBaseView.html). Compartir es correcto; duplicar por cumplir, no.
for (const f of archivos.filter((f) => f.endsWith('Impl.ts'))) {
  const dir = dirname(f);
  const comp = basename(f).replace(/Impl\.ts$/, '');
  const src = readFileSync(f, 'utf8');

  for (const requerido of [`${comp}.ts`, 'index.ts']) {
    if (!existsSync(join(dir, requerido))) fallos.push(`[R5] ${rel(dir)}: falta ${requerido}.`);
  }

  const contratoPropio = existsSync(join(dir, `Inter${comp}.ts`));
  const contratoCompartido = readdirSync(dirname(dir)).some(
    (n) => n.startsWith('Inter') && n.endsWith('.ts')
  );
  if (!contratoPropio && !contratoCompartido) {
    fallos.push(`[R5] ${rel(dir)}: sin contrato (Inter${comp}.ts ni uno compartido en la familia).`);
  }

  // Toda plantilla referenciada debe existir (permite compartir con '../').
  for (const m of src.matchAll(/templateUrl:\s*'([^']+)'/g)) {
    if (!existsSync(join(dir, m[1]))) {
      fallos.push(`[R5] ${rel(f)}: templateUrl '${m[1]}' no existe.`);
    }
  }
  for (const m of src.matchAll(/styleUrls?:\s*'([^']+)'/g)) {
    if (!existsSync(join(dir, m[1]))) {
      fallos.push(`[R5] ${rel(f)}: styleUrl '${m[1]}' no existe.`);
    }
  }
}

// ── Informe ──────────────────────────────────────────────────────────────────
const componentes = archivos.filter((f) => f.endsWith('Impl.ts')).length;
const plantillas = archivos.filter((f) => f.endsWith('View.html')).length;
const estilos = archivos.filter((f) => f.endsWith('Styles.ts')).length;

console.log(`Patron JONA — ${componentes} carpetas de componente, ${plantillas} plantillas, ${estilos} modulos de estilos.`);

if (fallos.length === 0) {
  console.log('OK: la libreria cumple el patron.');
  process.exit(0);
}

console.error(`\n${fallos.length} incumplimiento(s):\n`);
for (const f of fallos) console.error('  ' + f);
process.exit(1);
