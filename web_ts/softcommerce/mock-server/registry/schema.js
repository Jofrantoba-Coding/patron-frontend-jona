import { NORMALIZE_STEP } from '../core/normalize.js';
import { applyPreset } from './presets.js';
import { BUILTIN_SOURCES } from './sources.js';

/**
 * One declarative catalog entry (design D1-D19). Only the attributes the core
 * reads in this slice are enforced here; later slices extend the checks.
 * @typedef {{ slug: string, idKey: string, codeWidth: number, entity: string, scope: 'tenant'|'shared'|'empresa',
 *   seed: string|null, messages: { style: string }, fields: any[], columns: any[], section?: string, formId?: string,
 *   title?: string, menu?: { parent: string, label: string }, optionLabel?: string, modes?: string[], readOnly?: boolean, stamp?: string[], joins?: any[], unique?: any[], validation?: any[],
 *   rules?: { name: string }[], lookupFilters?: Record<string, any>, compat?: any }} CatalogDef
 */

export const SCOPES = ['tenant', 'empresa', 'shared'];
export const MODES = ['INSERT', 'UPDATE', 'DELETE', 'DETAIL', 'CLONE'];
const KINDS = ['code', 'text', 'number', 'boolean', 'date', 'select', 'options'];
const STYLES = ['M1', 'M2', 'MS', 'label', 'w1'];
const STAMPS = ['id_usuario', 'id_empresa'];
/** Closed set of named rules (D9). Implementations land in the slices that need them. */
const ENTRY_RULES = ['docIdentidad'];
const FILTER_RULES = ['ubigeoChildren', 'ubigeoHasActive'];
const CONDITIONS = ['visibleWhen', 'enabledWhen', 'requiredWhen'];
/** Column renderings beyond plain text; each lands with the first catalog that shows it. */
const COLUMN_TYPES = ['bool'];
const DISPLAYS = ['select', 'radio'];

export class RegistryError extends Error {
  /** @param {string} message */
  constructor(message) {
    super(message);
    this.name = 'RegistryError';
  }
}

/** @param {string} where @param {string} message @returns {never} */
function fail(where, message) {
  throw new RegistryError(`${where}: ${message}`);
}

/** An `options` field renders as a select unless it asks for radios. @param {any} field */
const withDisplay = (field) => (field.kind === 'options' && field.display === undefined ? { ...field, display: 'select' } : field);

/** A `default` given per mode (`{ INSERT: true }`) rather than as one value. @param {unknown} value */
export const isModeMap = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

/** An options field needs a list of `{value,label}` without repeats, a known display and a default from the list. @param {string} at @param {any} f */
function assertOptions(at, f) {
  if (!(Array.isArray(f.options) && f.options.length > 0)) fail(at, 'options needs options');
  if (!DISPLAYS.includes(f.display)) fail(at, `unknown display "${f.display}"`);
  const seen = new Set();
  for (const option of f.options) {
    if (typeof option.value !== 'string' || typeof option.label !== 'string') fail(at, 'every option needs a value and a label');
    if (seen.has(option.value)) fail(at, `duplicate option value "${option.value}"`);
    seen.add(option.value);
  }
  const defaults = isModeMap(f.default) ? Object.values(f.default) : f.default === undefined ? [] : [f.default];
  for (const value of defaults) if (!seen.has(value)) fail(at, `default "${value}" is not one of the options`);
}

/** @param {string} where @param {any[]} fields */
function assertAcyclic(where, fields) {
  const parents = new Map(fields.map((f) => [f.name, (f.dependsOn ?? []).map((/** @type {any} */ d) => d.field)]));
  /** @param {string} name @param {string[]} path */
  const visit = (name, path) => {
    if (path.includes(name)) fail(where, `cyclic dependsOn ${[...path, name].join(' -> ')}`);
    for (const parent of parents.get(name) ?? []) visit(parent, [...path, name]);
  };
  for (const name of parents.keys()) visit(name, []);
}

/**
 * @param {any} raw @param {Set<string>} slugs @param {Record<string, any>} sources
 */
function resolveEntry(raw, slugs, sources) {
  const where = `entry "${raw.slug}"`;
  const entry = { section: raw.slug, modes: MODES, ...raw, fields: raw.fields.map(applyPreset).map(withDisplay) };
  if (!SCOPES.includes(entry.scope)) fail(where, `unknown scope "${entry.scope}"`);
  if (!STYLES.includes(entry.messages?.style)) fail(where, `unknown messages style "${entry.messages?.style}"`);
  if (entry.seed !== null && typeof entry.seed !== 'string') fail(where, 'seed must be a file name or null (W1 section)');
  for (const mode of entry.modes) if (!MODES.includes(mode)) fail(where, `unknown mode "${mode}"`);
  if (entry.menu !== undefined) {
    if (!entry.formId) fail(where, 'menu needs a formId');
    if (!entry.menu.parent || !entry.menu.label) fail(where, 'menu needs a parent and a label');
  }
  for (const stamp of entry.stamp ?? []) if (!STAMPS.includes(stamp)) fail(where, `unknown stamp "${stamp}"`);

  const names = new Set(entry.fields.map((/** @type {any} */ f) => f.name));
  /** @param {string} context @param {string} name */
  const known = (context, name) => {
    if (!names.has(name)) fail(where, `${context} names unknown field "${name}"`);
  };
  /** @param {string} name @param {string[]} list */
  const rule = (name, list) => {
    if (!list.includes(name)) fail(where, `unknown rule "${name}"`);
  };

  for (const f of entry.fields) {
    const at = `${where} field "${f.name}"`;
    if (!KINDS.includes(f.kind)) fail(at, `unknown kind "${f.kind}"`);
    if (f.kind === 'select') {
      if (!f.source?.catalog) fail(at, 'select needs a source');
      if (!slugs.has(f.source.catalog) && !Object.hasOwn(sources, f.source.catalog)) fail(at, `unknown catalog "${f.source.catalog}"`);
    }
    if (f.kind === 'options') assertOptions(at, f);
    if (f.kind === 'number' && !Number.isInteger(f.scale)) fail(at, 'number needs a scale');
    for (const mode of f.readOnlyOn ?? []) if (!MODES.includes(mode)) fail(at, `readOnlyOn names unknown mode "${mode}"`);
    if (isModeMap(f.default)) for (const mode of Object.keys(f.default)) if (!MODES.includes(mode)) fail(at, `default names unknown mode "${mode}"`);
    for (const step of f.normalize ?? []) if (!NORMALIZE_STEP.test(step)) fail(at, `unknown normalize step "${step}"`);
    for (const parent of f.dependsOn ?? []) known(`field "${f.name}" dependsOn`, parent.field);
    for (const key of CONDITIONS) if (f[key]) known(`field "${f.name}" ${key}`, f[key].field);
    if (f.afterField) known(`field "${f.name}" afterField`, f.afterField);
  }
  assertAcyclic(where, entry.fields);
  for (const column of entry.columns) {
    // `<name>_label` is the label the server adds beside an options field (R-MOCK-14).
    const base = column.key.endsWith('_label') ? column.key.slice(0, -'_label'.length) : undefined;
    if (base !== undefined && !entry.fields.some((/** @type {any} */ f) => f.name === base && f.kind === 'options')) {
      fail(where, `column "${column.key}" has no options field "${base}"`);
    }
    if (column.type !== undefined && !COLUMN_TYPES.includes(column.type)) fail(where, `column "${column.key}" has unknown type "${column.type}"`);
  }

  for (const key of entry.unique ?? []) {
    for (const name of key.fields) known('unique', name);
    known('unique', key.errorField);
  }
  for (const join of entry.joins ?? []) known('joins', join.ref);
  if (entry.optionLabel !== undefined) known('optionLabel', entry.optionLabel);
  for (const { name } of entry.rules ?? []) rule(name, ENTRY_RULES);
  for (const filter of Object.values(entry.lookupFilters ?? {})) if (filter.rule) rule(filter.rule, FILTER_RULES);

  const selects = entry.fields.filter((/** @type {any} */ f) => f.kind === 'select');
  // Refs come from the field `source` and its `dependsOn` parents (R-REG-6).
  const refs = selects.map((/** @type {any} */ f) => ({
    field: f.name,
    catalog: f.source.catalog,
    where: f.source.where ?? {},
    activeOnly: f.source.activeOnly !== false,
    parents: f.dependsOn ?? [],
  }));
  // Default order (D10): fields, then refs, then unique keys.
  const steps = entry.validation ?? [
    ...entry.fields.filter((/** @type {any} */ f) => f.kind !== 'code').map((/** @type {any} */ f) => f.name),
    ...selects.map((/** @type {any} */ f) => ({ ref: f.name })),
    ...(entry.unique ?? []).map((/** @type {any} */ _k, /** @type {number} */ i) => ({ unique: i })),
  ];
  for (const step of steps) {
    if (typeof step === 'string') known('validation', step);
    else if ('unique' in step) {
      if (!Number.isInteger(step.unique) || step.unique < 0 || step.unique >= (entry.unique ?? []).length) {
        fail(where, `unique step ${step.unique} has no matching unique key`);
      }
    } else if ('rule' in step) rule(step.rule, (entry.rules ?? []).map((/** @type {any} */ r) => r.name));
    else if (!selects.some((/** @type {any} */ f) => f.name === step.ref)) fail(where, `ref step names "${step.ref}", which is not a select field`);
  }
  return { ...entry, refs, steps };
}

/**
 * Validates every entry at load and returns the registry. Fails fast with a
 * `RegistryError` naming the entry and field (R-REG-4).
 * @param {any[]} rawEntries @param {{ sources?: Record<string, any> }} [options]
 */
export function validateRegistry(rawEntries, { sources = BUILTIN_SOURCES } = {}) {
  for (const key of ['slug', 'idKey', 'formId']) {
    const seen = new Set();
    for (const raw of rawEntries) {
      if (raw[key] === undefined) continue;
      if (seen.has(raw[key])) fail(`entry "${raw.slug}"`, `duplicate ${key} "${raw[key]}"`);
      seen.add(raw[key]);
    }
  }
  const slugs = new Set(rawEntries.map((e) => e.slug));
  /** @type {any[]} */
  const entries = rawEntries.map((raw) => resolveEntry(raw, slugs, sources));
  return { entries, bySlug: /** @type {Map<string, any>} */ (new Map(entries.map((e) => [e.slug, e]))), sources };
}
