import fs from 'node:fs';
import path from 'node:path';

/** Swing roots a GUI class chain must reach (design: Inventory Rules 2). */
const SWING_ROOTS = new Set(['JFrame', 'JDialog', 'JInternalFrame', 'JPanel', 'JComponent']);

/** Project base classes: GUI by definition, never listed as screens (R-INV-4). */
export const BASE_CLASSES = new Set([
  'CDialog', 'JHDialog', 'JHInternalFrame', 'AbstractRegister',
  'PanelControlView', 'ControlView', 'FrmPanel', 'CTable',
]);

const COMBO_MODELS = new Set(['ComboBoxModel', 'DefaultComboBoxModel', 'AbstractListModel']);

/** Directories (posix, relative to the source root) that never hold screens. */
const EXCLUDED_DIRS = ['/view/tablemodel/', '/view/conta/tablas/', '/view/comboboxmodel/'];
const RENDER_DIR = '/shared/util/render/';

/**
 * R-INV-4: base classes, renderers, table models and combo models are not screens.
 * @param {{ name: string, path: string, chain: string[], implemented: string[] }} cls
 */
export function isExcluded({ name, path: rel, chain, implemented }) {
  const dir = `/${rel}`;
  return (
    BASE_CLASSES.has(name) ||
    (name.startsWith('PnlRenderer') && dir.includes(RENDER_DIR)) ||
    EXCLUDED_DIRS.some((d) => dir.includes(d)) ||
    name.startsWith('ComboModel') ||
    [...chain, ...implemented].some((n) => COMBO_MODELS.has(n))
  );
}

/**
 * Pattern category, first match wins (design: Inventory Rules 4).
 * @param {string} name
 * @param {string[]} chain base chain, nearest first
 */
export function categorize(name, chain) {
  /** @param {...string} names */
  const has = (...names) => chain.some((b) => names.includes(b));
  if (name.includes('Buscar')) return 'search/lookup';
  if (has('AbstractRegister', 'JHDialog') || name.startsWith('Register')) return 'register dialog';
  if (has('JHInternalFrame') && name.startsWith('PanelTF')) return 'list frame';
  if (/^(Form|Frm)/.test(name) || has('JInternalFrame', 'JDialog', 'JFrame')) return 'process/detail form';
  return 'other';
}

/** @param {string} pkg @param {string[]} segments */
const inPackage = (pkg, segments) => pkg.split('.').some((s) => segments.includes(s));
const LISTED = ['list frame', 'register dialog', 'search/lookup'];

/**
 * Approximate wave, first match wins (design: Inventory Rules 5).
 * @type {{ wave: string, test: (c: { name: string, pkg: string, category: string }) => boolean }[]}
 */
export const WAVE_RULES = [
  { wave: 'W1', test: (c) => c.name === 'PanelTFLocalidad' || c.name === 'RegisterLocalidad' },
  { wave: 'W4', test: (c) => inPackage(c.pkg, ['ventas', 'reparto']) },
  { wave: 'W5', test: (c) => inPackage(c.pkg, ['compras', 'inventario', 'importar']) },
  { wave: 'W6', test: (c) => inPackage(c.pkg, ['conta', 'tesoreria', 'cxc', 'cxp']) },
  { wave: 'W7', test: (c) => inPackage(c.pkg, ['reportes', 'libros', 'sunat', 'ple']) },
  { wave: 'W2', test: (c) => LISTED.includes(c.category) },
  { wave: 'W3', test: () => true },
];

/** @param {{ name: string, pkg: string, category: string }} cls */
export function waveFor(cls) {
  return (WAVE_RULES.find((r) => r.test(cls)) ?? WAVE_RULES[WAVE_RULES.length - 1]).wave;
}

/**
 * Strips block comments, line comments, string literals and char literals.
 * Literals collapse to empty quotes so braces and keywords inside them vanish.
 * @param {string} source
 * @returns {string}
 */
export function stripJava(source) {
  let out = '';
  let i = 0;
  while (i < source.length) {
    const two = source.slice(i, i + 2);
    const ch = source[i];
    if (two === '//') {
      while (i < source.length && source[i] !== '\n') i++;
    } else if (two === '/*') {
      const end = source.indexOf('*/', i + 2);
      i = end === -1 ? source.length : end + 2;
      out += ' ';
    } else if (ch === '"' || ch === "'") {
      i++;
      while (i < source.length && source[i] !== ch && source[i] !== '\n') i += source[i] === '\\' ? 2 : 1;
      i++;
      out += ch + ch;
    } else {
      out += ch;
      i++;
    }
  }
  return out;
}

/** @param {string} qualified */
const simpleName = (qualified) => qualified.split('.').pop() ?? qualified;

/** Removes (possibly nested) generic argument lists from a header.
 * @param {string} header */
function stripGenerics(header) {
  let prev;
  let cur = header;
  do {
    prev = cur;
    cur = cur.replace(/<[^<>]*>/g, '');
  } while (cur !== prev);
  return cur;
}

/**
 * Scans every class header of a source. `extends` and `implements` come from
 * the header (text up to the next `{`) only, so no class borrows another's base.
 * @param {string} source
 * @returns {{ name: string, extends: string | null, implements: string[] }[]}
 */
export function scanClasses(source) {
  const text = stripJava(source);
  const classes = [];
  for (const match of text.matchAll(/(?<![.\p{L}\p{N}_$])class\s+([\p{L}\p{N}_$]+)/gu)) {
    const rest = text.slice(match.index + match[0].length);
    const brace = rest.indexOf('{');
    const header = stripGenerics(brace === -1 ? rest : rest.slice(0, brace));
    const ext = /\bextends\s+([\p{L}\p{N}_$.]+)/u.exec(header);
    const impl = /\bimplements\s+([^]*)$/.exec(header);
    classes.push({
      name: match[1],
      extends: ext ? simpleName(ext[1]) : null,
      implements: impl ? impl[1].split(',').map((s) => simpleName(s.trim())).filter(Boolean) : [],
    });
  }
  return classes;
}

/** @param {string} dir @returns {string[]} sorted posix paths of `.java` files, relative to dir */
function listJavaFiles(dir) {
  /** @type {string[]} */
  const found = [];
  /** @param {string} rel */
  const walk = (rel) => {
    for (const entry of fs.readdirSync(path.join(dir, rel), { withFileTypes: true })) {
      const next = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) walk(next);
      else if (entry.name.endsWith('.java')) found.push(next);
    }
  };
  walk('');
  return found.sort();
}

/** Base chain of a class: its extends ancestors, nearest first (cycle safe).
 * @param {string} name @param {Map<string, string>} bases */
function chainOf(name, bases) {
  /** @type {string[]} */
  const chain = [];
  for (let cur = bases.get(name); cur && !chain.includes(cur); cur = bases.get(cur)) chain.push(cur);
  return chain;
}

/**
 * Builds the inventory rows for every Java file under `srcRoot`. A file that
 * cannot be read is reported through `onSkip` and left out (R-INV-6).
 * @param {string} srcRoot
 * @param {{ readFile?: (file: string) => Buffer, onSkip?: (rel: string, error: Error) => void }} [options]
 */
export function buildInventory(srcRoot, { readFile = fs.readFileSync, onSkip = () => {} } = {}) {
  const files = [];
  for (const rel of listJavaFiles(srcRoot)) {
    let source;
    try {
      source = readFile(path.join(srcRoot, rel)).toString('latin1');
    } catch (error) {
      onSkip(rel, /** @type {Error} */ (error));
      continue;
    }
    const pkg = /^\s*package\s+([\w.]+)\s*;/m.exec(stripJava(source));
    files.push({ rel, pkg: pkg ? pkg[1] : '', classes: scanClasses(source) });
  }
  const bases = new Map();
  const implementsOf = new Map();
  for (const file of files) {
    for (const c of file.classes) {
      if (c.extends) bases.set(c.name, c.extends);
      implementsOf.set(c.name, c.implements);
    }
  }

  const rows = [];
  for (const file of files) {
    const name = path.posix.basename(file.rel, '.java');
    const top = file.classes.find((c) => c.name === name);
    if (!top) continue;
    const chain = chainOf(name, bases);
    if (!chain.some((b) => SWING_ROOTS.has(b) || BASE_CLASSES.has(b))) continue;
    const implemented = [name, ...chain].flatMap((n) => implementsOf.get(n) ?? []);
    if (isExcluded({ name, path: file.rel, chain, implemented })) continue;
    const category = categorize(name, chain);
    const wave = waveFor({ name, pkg: file.pkg, category });
    rows.push({ name, path: file.rel, pkg: file.pkg, base: top.extends ?? '', category, wave });
  }
  return { rows };
}

const CSV_HEADER = ['class', 'path', 'package', 'base', 'category', 'wave'];

/** @param {string} value */
const quote = (value) => `"${value.replaceAll('"', '""')}"`;

/**
 * Stable CSV: every field quoted, LF line ends, rows in the order given.
 * @param {{ name: string, path: string, pkg: string, base: string, category: string, wave: string }[]} rows
 */
export function toCsv(rows) {
  const lines = [CSV_HEADER, ...rows.map((r) => [r.name, r.path, r.pkg, r.base, r.category, r.wave])];
  return lines.map((fields) => fields.map(quote).join(',')).join('\n') + '\n';
}

/**
 * Scans `srcRoot` and writes the inventory as UTF-8 to `outFile`.
 * @param {string} srcRoot
 * @param {string} outFile
 */
export function writeInventory(srcRoot, outFile) {
  const inventory = buildInventory(srcRoot);
  fs.writeFileSync(outFile, toCsv(inventory.rows), 'utf8');
  return inventory;
}
