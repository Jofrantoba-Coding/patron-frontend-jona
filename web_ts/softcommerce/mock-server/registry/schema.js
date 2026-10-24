import { DOC_DEFAULTS } from '../core/docIdentidad.js';
import { ENTRY_RULE_NAMES, ruleStates } from '../core/entryRules.js';
import { NORMALIZE_STEP } from '../core/normalize.js';
import { paramToken } from '../core/predicates.js';
import { isIsoDate } from '../core/dates.js';
import { DECIMAL_TEXT } from '../core/numbers.js';
import { applyPreset } from './presets.js';
import { PERMISSION_FLAG_NAMES } from './flags.js';
import { PARAM_KEYS, isGateParam } from './paramKeys.js';
import { PICKERS } from './pickers.js';
import { BACKINGS } from './backings.js';
import { PROJECTIONS } from './project.js';
import { BUILTIN_SOURCES } from './sources.js';

/**
 * One declarative catalog entry (design D1-D19). Only the attributes the core
 * reads in this slice are enforced here; later slices extend the checks.
 * @typedef {{ slug: string, idKey: string, codeWidth: number, entity: string, scope: 'tenant'|'shared'|'empresa',
 *   seed: string|null, messages: { style: string }, fields: any[], columns: any[], section?: string, formId?: string,
 *   title?: string, menu?: { parent: string, label: string }, optionLabel?: string | string[], modes?: string[], readOnly?: boolean, stamp?: string[], joins?: any[], unique?: any[], validation?: any[],
 *   rules?: { name: string }[], search?: string[], lookupFilters?: Record<string, any>, compat?: any, project?: string, backing?: string,
 *   constants?: Record<string, string|number|boolean>, derive?: { target: string, when?: { field: string, in: string[] }, then?: unknown, else?: unknown, fromRef?: { field: string, key: string } }[] }} CatalogDef
 */

export const SCOPES = ['tenant', 'empresa', 'shared'];
export const MODES = ['INSERT', 'UPDATE', 'DELETE', 'DETAIL', 'CLONE'];
const KINDS = ['code', 'text', 'textarea', 'password', 'number', 'boolean', 'date', 'select', 'options', 'lookup'];
const STYLES = ['M1', 'M2', 'MS', 'label', 'w1'];
const STAMPS = ['id_usuario', 'id_empresa'];
/** Closed set of named rules (D9): the hooks live in `core/entryRules.js`. */
const ENTRY_RULES = ENTRY_RULE_NAMES;
const FILTER_RULES = ['ubigeoChildren', 'ubigeoHasActive'];
const CONDITIONS = ['visibleWhen', 'enabledWhen', 'requiredWhen'];
/** Column renderings beyond plain text; each lands with the first catalog that shows it. */
const COLUMN_TYPES = ['bool', 'dec', 'date'];
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

/** A password confirms itself unless the entry says otherwise (R-REG-13). @param {any} field */
const withConfirm = (field) => (field.kind === 'password' && field.confirm === undefined ? { ...field, confirm: true } : field);

/** The literal defaults of a field: a `$params.X` token (D27b) is resolved at write time, so it is not a value to check against the kind. @param {any} f @returns {unknown[]} */
const literalDefaults = (f) => (isModeMap(f.default) ? Object.values(f.default) : f.default === undefined ? [] : [f.default]).filter((value) => paramToken(value) === undefined);

/**
 * A `gate: { param, in? }` (R-REG-17, D25): `param` must be a boolean key of the `GET /v1/params` payload (a number such as `PORC_IGV` is a value source,
 * not a gate) and `in`, when given, a non-empty list.
 * @param {string} at @param {any} gate
 */
function assertGate(at, gate) {
  if (gate === undefined) return;
  if (typeof gate?.param !== 'string') fail(at, 'gate needs a param');
  if (!Object.hasOwn(PARAM_KEYS, gate.param)) fail(at, `gate.param "${gate.param}" is not a params key`);
  if (!isGateParam(gate.param)) fail(at, `gate.param "${gate.param}" is a value, not a gate`);
  if (gate.in !== undefined && (!Array.isArray(gate.in) || gate.in.length === 0)) fail(at, 'gate.in must be a non-empty list');
}

/** A `$params.X` default must name a params key. @param {string} at @param {any} f */
function assertParamDefaults(at, f) {
  const defaults = isModeMap(f.default) ? Object.values(f.default) : [f.default];
  for (const value of defaults) {
    const key = paramToken(value);
    if (key !== undefined && !Object.hasOwn(PARAM_KEYS, key)) fail(at, `default names unknown params key "${key}"`);
  }
}

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
  const defaults = literalDefaults(f);
  for (const value of defaults) if (!seen.has(value)) fail(at, `default "${value}" is not one of the options`);
}

/**
 * A number needs a scale. At scale 0 `max` is the digit count (R-CRUD-11) and an optional `range` bounds the value
 * (R-MOCK-10); a range words its failure with its own literal, so it needs `messages.range`.
 * @param {string} at @param {any} f
 */
function assertNumber(at, f) {
  if (!Number.isInteger(f.scale)) fail(at, 'number needs a scale');
  if (f.max !== undefined && !(Number.isInteger(f.max) && f.max > 0)) fail(at, 'number max must be a positive integer');
  for (const bound of ['min', 'exclusiveMin']) if (f[bound] !== undefined && typeof f[bound] !== 'number') fail(at, `${bound} must be a number`);
  const defaults = literalDefaults(f);
  for (const value of defaults) if (!DECIMAL_TEXT.test(String(value))) fail(at, `default "${value}" is not a number`);
  if (f.range === undefined) return;
  const { min, max } = f.range;
  for (const bound of [min, max]) if (bound !== undefined && typeof bound !== 'number') fail(at, 'range bounds must be numbers');
  if (min !== undefined && max !== undefined && min > max) fail(at, `range min ${min} is above max ${max}`);
  if (!f.messages?.range) fail(at, 'range needs messages.range');
}

/**
 * A date default is `today` or an ISO date (a per-mode map holds one per mode); `min` is an ISO date and `notFuture`
 * a flag. `afterField` is checked once every field name is known.
 * @param {string} at @param {any} f
 */
function assertDate(at, f) {
  const defaults = literalDefaults(f);
  for (const value of defaults) if (value !== 'today' && !isIsoDate(value)) fail(at, `default "${value}" is not today or an ISO date`);
  if (f.min !== undefined && !isIsoDate(f.min)) fail(at, `min "${f.min}" is not an ISO date`);
  if (f.notFuture !== undefined && typeof f.notFuture !== 'boolean') fail(at, 'notFuture must be a boolean');
}

/**
 * `minLen` (a plain exact or minimum length) and `minLenWhen` (a list of `{ when: Cond, len }`, the first match decides) belong to text
 * fields and never exceed `max`. Field names in a condition are checked by the caller.
 * @param {string} at @param {any} f
 */
function assertMinLength(at, f) {
  if (f.minLen === undefined && f.minLenWhen === undefined) return;
  if (f.kind !== 'text') fail(at, `${f.minLen === undefined ? 'minLenWhen' : 'minLen'} needs a text field`);
  /** @param {string} what @param {unknown} len */
  const check = (what, len) => {
    if (!Number.isInteger(len) || /** @type {number} */ (len) < 1) fail(at, `${what} must be a positive integer`);
    if (f.max !== undefined && /** @type {number} */ (len) > f.max) fail(at, `${what === 'minLen' ? 'minLen' : 'minLenWhen len'} ${len} is above max ${f.max}`);
  };
  if (f.minLen !== undefined) check('minLen', f.minLen);
  if (f.minLenWhen === undefined) return;
  if (!Array.isArray(f.minLenWhen)) fail(at, 'minLenWhen must be a list');
  for (const rule of f.minLenWhen) {
    if (!rule.when?.field || !Array.isArray(rule.when.in)) fail(at, 'minLenWhen needs a condition { field, in }');
    check('minLenWhen len', rule.len);
  }
}

/**
 * `maxWhen` (a list of `{ when: Cond, len }`, the first match decides) belongs to text fields and never exceeds `max`; without a match the plain
 * `max` applies. Field names in a condition are checked by the caller.
 * @param {string} at @param {any} f
 */
function assertMaxWhen(at, f) {
  if (f.maxWhen === undefined) return;
  if (f.kind !== 'text') fail(at, 'maxWhen needs a text field');
  if (!Array.isArray(f.maxWhen)) fail(at, 'maxWhen must be a list');
  for (const rule of f.maxWhen) {
    if (!rule.when?.field || !Array.isArray(rule.when.in)) fail(at, 'maxWhen needs a condition { field, in }');
    if (!Number.isInteger(rule.len) || rule.len < 1) fail(at, 'maxWhen len must be a positive integer');
    if (f.max !== undefined && rule.len > f.max) fail(at, `maxWhen len ${rule.len} is above max ${f.max}`);
  }
}

/**
 * The params of a `docIdentidad` rule: the field names it reads (`tipo`, `numero`, `paterno`, `materno`, `nombres`, `razon`, `sexo`), the two tipo
 * ids (`dni`, `ruc`) and `persona`, a stored-only column that must not share a name with a field or a constant.
 * @param {string} where @param {any} entry @param {Map<string, any>} byName @param {any} params
 */
function assertDocParams(where, entry, byName, params = {}) {
  const at = `${where} rule "docIdentidad"`;
  const FIELDS = ['tipo', 'numero', 'paterno', 'materno', 'nombres', 'razon', 'sexo'];
  for (const [key, value] of Object.entries(params)) {
    if (!['persona', 'dni', 'ruc', ...FIELDS].includes(key)) fail(at, `unknown param "${key}"`);
    if (typeof value !== 'string' || value === '') fail(at, `${key} must be a field name`);
    if (FIELDS.includes(key) && !byName.has(value)) fail(at, `${key} names unknown field "${value}"`);
  }
  const all = { ...DOC_DEFAULTS, ...params };
  if (!['select', 'options'].includes(byName.get(all.tipo)?.kind)) fail(at, 'tipo must be a select or options field');
  for (const key of ['numero', 'paterno', 'materno', 'nombres', 'razon']) if (byName.get(all[key])?.kind !== 'text') fail(at, `${key} must be a text field`);
  if (params.persona !== undefined) {
    if (byName.has(params.persona)) fail(at, `persona "${params.persona}" is also a field`);
    if (entry.constants && Object.hasOwn(entry.constants, params.persona)) fail(at, `persona "${params.persona}" is also a constant`);
  }
}

/**
 * Stored-only columns (R-REG-2): `constants` are written on create and `derive` rules compute a column from the record; the body can
 * never set them, so none may share a name with a field (or with each other).
 * @param {string} where @param {any} entry @param {Set<string>} names @param {(context: string, name: string) => void} known
 */
function assertStored(where, entry, names, known) {
  const { constants, derive } = entry;
  if (constants !== undefined) {
    if (typeof constants !== 'object' || constants === null || Array.isArray(constants)) fail(where, 'constants must be an object');
    for (const [key, value] of Object.entries(constants)) {
      if (!['string', 'number', 'boolean'].includes(typeof value)) fail(where, `constant "${key}" must be a string, number or boolean`);
      if (names.has(key)) fail(where, `constant "${key}" is also a field`);
    }
  }
  if (derive === undefined) return;
  if (!Array.isArray(derive)) fail(where, 'derive must be a list');
  for (const rule of derive) {
    if (typeof rule.target !== 'string' || rule.target === '') fail(where, 'derive needs a target');
    if (names.has(rule.target)) fail(where, `derive target "${rule.target}" is also a field`);
    if (constants && Object.hasOwn(constants, rule.target)) fail(where, `derive target "${rule.target}" is also a constant`);
    // `fromRef` (D15): the column copies `key` of the row the select or lookup `field` points to; the server owns it.
    if (rule.fromRef !== undefined) {
      const source = entry.fields.find((/** @type {any} */ f) => f.name === rule.fromRef.field);
      if (!source || !['select', 'lookup'].includes(source.kind)) fail(where, `derive fromRef must name a select or lookup field, not "${rule.fromRef.field}"`);
      if (typeof rule.fromRef.key !== 'string' || rule.fromRef.key === '') fail(where, 'derive fromRef needs a key');
      continue;
    }
    if (typeof rule.when?.field !== 'string' || !Array.isArray(rule.when.in)) fail(where, 'derive needs a condition { field, in }');
    known('derive', rule.when.field);
    if (!('then' in rule) || !('else' in rule) || rule.then === undefined || rule.else === undefined) fail(where, 'derive needs then and else');
  }
}

/**
 * The ubigeo cascade as a parent of another select (D8, R-CRUD-12): `transient` keeps a select out of the server (never stored, validated or
 * checked as a parent), `restoreFrom { field, prefixLen }` rebuilds the levels from a ubigeo code the record carries (a field, or a join `as`), and
 * `filter { has }` keeps the ubigeos that hold an active row of that catalog.
 * @param {string} at @param {any} f @param {Set<string>} names @param {any[]} joins @param {Set<string>} slugs
 */
function assertCascade(at, f, names, joins, slugs) {
  if (f.transient !== undefined) {
    if (f.kind !== 'select') fail(at, 'transient needs a select field');
    if (typeof f.transient !== 'boolean') fail(at, 'transient must be a boolean');
  }
  const overUbigeo = f.kind === 'select' && f.source?.catalog === 'ubigeo';
  if (f.restoreFrom !== undefined) {
    if (!overUbigeo) fail(at, 'restoreFrom needs a select over ubigeo');
    if (typeof f.restoreFrom.field !== 'string' || !Number.isInteger(f.restoreFrom.prefixLen) || f.restoreFrom.prefixLen < 1) fail(at, 'restoreFrom needs a field and a prefixLen');
    if (!names.has(f.restoreFrom.field) && !joins.some((join) => join.as === f.restoreFrom.field)) fail(at, `restoreFrom names unknown field "${f.restoreFrom.field}"`);
  }
  if (f.filter === undefined) return;
  if (!overUbigeo) fail(at, 'filter needs a select over ubigeo');
  if (typeof f.filter !== 'object' || f.filter === null || Object.values(f.filter).some((value) => typeof value !== 'string')) fail(at, 'filter must be an object of text values');
  for (const [key, value] of Object.entries(f.filter)) {
    if (key !== 'has') fail(at, `filter names unknown key "${key}"`);
    if (!slugs.has(/** @type {string} */ (value))) fail(at, `filter has names unknown catalog "${value}"`);
  }
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
 * A lookup naming a picker (D2) takes its `search`, `columns`, `filters` and `pickLabel` from `registry/pickers.js` and its source from the picker (a static `where`
 * of the picker or of the field narrows it); what the field declares itself wins.
 * @param {string} at @param {any} f
 */
function expandPicker(at, f) {
  if (f.picker === undefined) return f;
  if (!Object.hasOwn(PICKERS, f.picker)) fail(at, `unknown picker "${f.picker}"`);
  const picker = PICKERS[f.picker];
  if (f.source?.catalog !== undefined && f.source.catalog !== picker.source) fail(at, `picker "${f.picker}" is over "${picker.source}", not "${f.source.catalog}"`);
  const where = f.source?.where ?? picker.where;
  return { search: picker.search, columns: picker.columns, filters: picker.filters, pickLabel: picker.pickLabel, ...f, source: { catalog: picker.source, ...(where ? { where } : {}) } };
}

/**
 * The `columns` and `filters` of a lookup (R-REG-13). Every filter is a `text` or a `select` over a field or joined display key of the source (a select also needs
 * its own source catalog, and may depend on another filter); a column only names its key, which the consistency spec checks against the source.
 * @param {string} at @param {any} f @param {any} target @param {Set<string>} targetNames @param {Map<string, any>} rawBySlug @param {Record<string, any>} sources
 */
function assertPickerParts(at, f, target, targetNames, rawBySlug, sources) {
  if (!Array.isArray(f.columns) || f.columns.length === 0 || f.columns.some((/** @type {any} */ c) => typeof c?.key !== 'string' || typeof c?.header !== 'string')) fail(at, 'lookup needs columns');
  if (!Array.isArray(f.filters) || f.filters.length === 0) fail(at, 'lookup needs filters');
  const filterFields = new Set(f.filters.map((/** @type {any} */ filter) => filter.field));
  for (const filter of f.filters) {
    const name = `filter "${filter.field}"`;
    if (!['text', 'select'].includes(filter.type)) fail(at, `${name} has unknown type "${filter.type}"`);
    if (!targetNames.has(filter.field)) fail(at, `filter names unknown field "${filter.field}" of "${target.slug}"`);
    if (filter.type === 'select') {
      if (!filter.source) fail(at, `${name} needs a source`);
      // A select sends an exact key: only a declared lookupFilters key is exact on the list route (R-MOCK-20).
      if (!Object.hasOwn(target.lookupFilters ?? {}, filter.field)) fail(at, `select ${name} must be a declared lookupFilters key of "${target.slug}"`);
      if (!rawBySlug.has(filter.source) && !Object.hasOwn(sources, filter.source)) fail(at, `${name} names unknown catalog "${filter.source}"`);
    }
    if (filter.dependsOn !== undefined && !filterFields.has(filter.dependsOn.field)) fail(at, `${name} dependsOn names unknown filter "${filter.dependsOn.field}"`);
  }
}

/**
 * `fill: { targetField: sourceKey }` (R-REG-13): what a pick copies into the entry's own fields, each source key a field or joined display key of the
 * source; `fillReadOnly` lists the targets the register then shows read-only. The UI does the copying; the server only stores the body.
 * @param {string} at @param {any} f @param {Set<string>} names the entry's field names @param {any} target @param {Set<string>} targetNames
 */
function assertFill(at, f, names, target, targetNames) {
  const fill = f.fill ?? {};
  for (const [name, key] of Object.entries(fill)) {
    if (name === f.name) fail(at, 'fill cannot name the lookup itself');
    if (!names.has(name)) fail(at, `fill names unknown field "${name}"`);
    if (!targetNames.has(/** @type {string} */ (key))) fail(at, `fill names unknown source key "${key}" of "${target.slug}"`);
  }
  for (const name of f.fillReadOnly ?? []) if (!Object.hasOwn(fill, name)) fail(at, `fillReadOnly names "${name}", which fill does not set`);
}

/**
 * `lookup` fields (R-REG-13, D3). The source must be a registered catalog (a W1 builtin source has no search) and the field names the `search`
 * fields of its picker, each a field or joined display key of the source. The description shown beside the code comes from a derived join
 * `{ as, ref: <field>, display: <source optionLabel> }` (R-REG-8), named by `display` or after the field without its `id_` prefix; a join the entry already
 * declares over the field is reused. The field keeps the join key in `display`. Replaces `entry.fields` and `entry.joins` with new values.
 * @param {string} where @param {any} entry @param {Map<string, any>} rawBySlug @param {Record<string, any>} sources
 */
function applyLookups(where, entry, rawBySlug, sources) {
  if (!entry.fields.some((/** @type {any} */ f) => f.kind === 'lookup')) return;
  const joins = [...(entry.joins ?? [])];
  const taken = new Set([...entry.fields.map((/** @type {any} */ f) => f.name), ...joins.map((join) => join.as)]);
  entry.fields = entry.fields.map((/** @type {any} */ declared) => {
    if (declared.kind !== 'lookup') return declared;
    const at = `${where} field "${declared.name}"`;
    const f = expandPicker(at, declared);
    if (!f.source?.catalog) fail(at, 'lookup needs a source');
    const target = rawBySlug.get(f.source.catalog);
    if (!target) fail(at, Object.hasOwn(sources, f.source.catalog) ? `lookup source "${f.source.catalog}" is not a registered catalog` : `unknown catalog "${f.source.catalog}"`);
    if (!Array.isArray(f.search) || f.search.length === 0 || f.search.some((/** @type {unknown} */ name) => typeof name !== 'string')) fail(at, 'lookup needs search fields');
    const targetNames = new Set([...target.fields.map((/** @type {any} */ t) => t.name), ...(target.joins ?? []).map((/** @type {any} */ join) => join.as)]);
    for (const name of f.search) if (!targetNames.has(name)) fail(at, `search names unknown field "${name}" of "${target.slug}"`);
    assertPickerParts(at, f, target, targetNames, rawBySlug, sources);
    assertFill(at, f, new Set(entry.fields.map((/** @type {any} */ t) => t.name)), target, targetNames);
    const existing = joins.find((join) => join.ref === f.name);
    if (existing) return { ...f, display: existing.as };
    const as = f.display ?? (f.name.startsWith('id_') ? f.name.slice('id_'.length) : `${f.name}_display`);
    if (taken.has(as)) fail(at, `display "${as}" is also a field or a join`);
    taken.add(as);
    joins.push({ as, ref: f.name, display: target.optionLabel ?? 'descripcion' });
    return { ...f, display: as };
  });
  entry.joins = joins;
}

const ACTION_KINDS = ['deferred', 'immediate'];
// `api` is served by the endpoints only and never rendered (the anexo `activar` / `desactivar` of S-MOCK-47..49).
const ACTION_PLACEMENTS = { entry: ['list-toolbar', 'register', 'api'], child: ['child'] };
const ACTION_WHEN_KEYS = ['modes', 'selection', 'row', 'noRow'];

/**
 * The `actions` of an entry or a child (R-ACT-1, R-REG-15, R-REG-20): `{ id, label, placement, flag, enabledWhen, dialog?, kind, confirm?, server?, rule? }`.
 * The `flag` is one of the 13 permission flags (default `modify`); `enabledWhen` is `{ modes, selection, row, noRow }` over the register mode, the selected row
 * and the rows of the grid, its conditions naming only known fields; an `immediate` action names its `server` action (R-MOCK-22) and a `deferred` one the
 * client `rule` that changes a pending row. A `dialog` is `{ title, fields }`, its fields checked like the fields of any entry. Returns the normalized list.
 * @param {string} where @param {any} owner the entry, or the child entry, that declares them @param {Set<string>} names the field names a condition may name
 * @param {(raw: any) => any} resolve resolves a raw entry (the dialog's fields)
 */
function normalizeActions(where, owner, names, resolve) {
  const { actions } = owner;
  if (actions === undefined) return undefined;
  if (!Array.isArray(actions)) fail(where, 'actions must be a list');
  const owned = owner.parent === undefined ? 'entry' : 'child';
  const seen = new Set();
  return actions.map((/** @type {any} */ declared) => {
    const at = `${where} action "${declared?.id}"`;
    if (typeof declared?.id !== 'string' || declared.id === '') fail(where, 'an action needs an id');
    if (declared.id === 'actions') fail(at, 'reserved name');
    if (seen.has(declared.id)) fail(at, 'duplicate action id');
    seen.add(declared.id);
    if (typeof declared.label !== 'string' || declared.label.trim() === '') fail(at, 'needs a label');
    if (!ACTION_KINDS.includes(declared.kind)) fail(at, `unknown kind "${declared.kind}"`);
    const flag = declared.flag ?? 'modify';
    if (!PERMISSION_FLAG_NAMES.includes(flag)) fail(at, `flag "${flag}" is not a permission flag`);
    const placement = declared.placement ?? (owned === 'child' ? 'child' : 'register');
    if (!Object.values(ACTION_PLACEMENTS).flat().includes(placement)) fail(at, `unknown placement "${placement}"`);
    if (!ACTION_PLACEMENTS[owned].includes(placement)) fail(at, `placement "${placement}" is not for ${owned === 'child' ? 'a child' : 'an entry'}`);
    if (declared.kind === 'immediate') {
      if (typeof declared.server !== 'string' || declared.server === '') fail(at, 'an immediate action needs a server action');
      if (declared.rule !== undefined) fail(at, 'an immediate action has no client rule');
    } else {
      if (typeof declared.rule !== 'string' || declared.rule === '') fail(at, 'a deferred action needs a rule');
      if (declared.server !== undefined) fail(at, 'a deferred action has no server action');
    }
    // `params` are the constants the named rule reads (the entity word of the anexo messages).
    if (declared.params !== undefined && (typeof declared.params !== 'object' || declared.params === null || Array.isArray(declared.params))) fail(at, 'params must be an object');
    const when = declared.enabledWhen;
    if (when !== undefined) {
      for (const key of Object.keys(when)) if (!ACTION_WHEN_KEYS.includes(key)) fail(at, `enabledWhen names unknown key "${key}"`);
      for (const mode of when.modes ?? []) if (!MODES.includes(mode)) fail(at, `enabledWhen names unknown mode "${mode}"`);
      if (when.noRow !== undefined && owned !== 'child') fail(at, 'enabledWhen.noRow needs a child action');
      for (const cond of [when.row, when.noRow].filter((c) => c !== undefined)) {
        if (typeof cond.field !== 'string' || !Array.isArray(cond.in)) fail(at, 'enabledWhen needs conditions { field, in }');
        if (!names.has(cond.field)) fail(at, `enabledWhen names unknown field "${cond.field}"`);
      }
    }
    let dialog;
    if (declared.dialog !== undefined) {
      if (!Array.isArray(declared.dialog.fields) || declared.dialog.fields.length === 0) fail(at, 'dialog needs fields');
      const raw = { slug: `${owner.slug}#${declared.id}`, idKey: 'id', codeWidth: 0, entity: owner.entity, scope: 'tenant', seed: null, messages: owner.messages, columns: [], fields: [{ name: 'id', kind: 'code', label: 'Codigo' }, ...declared.dialog.fields] };
      dialog = { title: declared.dialog.title ?? declared.label, fields: resolve(raw).fields.filter((/** @type {any} */ f) => f.kind !== 'code') };
    }
    return { ...declared, placement, flag, ...(dialog && { dialog }) };
  });
}

/**
 * @param {any} raw @param {Set<string>} slugs @param {Record<string, any>} sources @param {Map<string, any>} rawBySlug
 */
function resolveEntry(raw, slugs, sources, rawBySlug) {
  const where = `entry "${raw.slug}"`;
  const entry = { section: raw.slug, modes: MODES, ...raw, fields: raw.fields.map(applyPreset).map(withDisplay).map(withConfirm) };
  applyLookups(where, entry, rawBySlug, sources);
  if (!SCOPES.includes(entry.scope)) fail(where, `unknown scope "${entry.scope}"`);
  if (!STYLES.includes(entry.messages?.style)) fail(where, `unknown messages style "${entry.messages?.style}"`);
  if (entry.seed !== null && typeof entry.seed !== 'string') fail(where, 'seed must be a file name or null (W1 section)');
  for (const mode of entry.modes) if (!MODES.includes(mode)) fail(where, `unknown mode "${mode}"`);
  if (entry.menu !== undefined) {
    if (!entry.formId) fail(where, 'menu needs a formId');
    if (!entry.menu.parent || !entry.menu.label) fail(where, 'menu needs a parent and a label');
  }
  for (const stamp of entry.stamp ?? []) if (!STAMPS.includes(stamp)) fail(where, `unknown stamp "${stamp}"`);
  // A projection is a read-only view of a seed section already loaded (the auth users), so it has no seed file and no writes.
  if (entry.project !== undefined) {
    if (!Object.hasOwn(PROJECTIONS, entry.project)) fail(where, `unknown projection "${entry.project}"`);
    if (entry.seed !== null) fail(where, 'project needs seed null');
    if (entry.readOnly !== true) fail(where, 'project needs readOnly');
    if (entry.scope !== 'tenant') fail(where, 'project needs scope tenant');
  }

  // A backing (D15) gives a master write access to records another part of the store holds: no seed of its own, and never a projection as well.
  if (entry.backing !== undefined) {
    if (!Object.hasOwn(BACKINGS, entry.backing)) fail(where, `unknown backing "${entry.backing}"`);
    if (entry.project !== undefined) fail(where, 'backing and project exclude each other');
    if (entry.seed !== null) fail(where, 'backing needs seed null');
    if (entry.scope !== 'tenant') fail(where, 'backing needs scope tenant');
  }

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
    if (f.kind !== 'lookup') for (const key of ['fill', 'fillReadOnly']) if (f[key] !== undefined) fail(at, `${key} needs a lookup field`);
    // A textarea is a text with visible lines (R-REG-13): `rows` is a positive integer and means nothing elsewhere.
    if (f.kind === 'textarea') {
      if (f.rows !== undefined && !(Number.isInteger(f.rows) && f.rows > 0)) fail(at, 'rows must be a positive integer');
    } else if (f.rows !== undefined) fail(at, 'rows needs a textarea field');
    // A password (R-REG-13) needs a `max` (the desktop document length) and may switch its confirmation off; neither means anything elsewhere.
    if (f.kind === 'password') {
      if (!(Number.isInteger(f.max) && f.max > 0)) fail(at, 'password needs a max (a positive integer)');
      if (typeof f.confirm !== 'boolean') fail(at, 'confirm must be a boolean');
    } else if (f.confirm !== undefined) fail(at, 'confirm needs a password field');
    if (f.kind === 'date') assertDate(at, f);
    else if (f.notFuture !== undefined) fail(at, 'notFuture needs a date field');
    if (f.kind === 'number') assertNumber(at, f);
    else if (f.range !== undefined) fail(at, 'range needs a number field');
    if (f.min !== undefined && f.kind !== 'number' && f.kind !== 'date') fail(at, 'min needs a number or date field');
    if (f.exclusiveMin !== undefined && f.kind !== 'number') fail(at, 'exclusiveMin needs a number field');
    assertMinLength(at, f);
    assertMaxWhen(at, f);
    for (const rule of f.maxWhen ?? []) known(`field "${f.name}" maxWhen`, rule.when.field);
    for (const rule of f.minLenWhen ?? []) known(`field "${f.name}" minLenWhen`, rule.when.field);
    assertGate(at, f.gate);
    assertParamDefaults(at, f);
    if (f.blankToDefault && f.default === undefined) fail(at, 'blankToDefault needs a default');
    for (const mode of f.readOnlyOn ?? []) if (!MODES.includes(mode)) fail(at, `readOnlyOn names unknown mode "${mode}"`);
    if (isModeMap(f.default)) for (const mode of Object.keys(f.default)) if (!MODES.includes(mode)) fail(at, `default names unknown mode "${mode}"`);
    for (const step of f.normalize ?? []) if (!NORMALIZE_STEP.test(step)) fail(at, `unknown normalize step "${step}"`);
    for (const parent of f.dependsOn ?? []) known(`field "${f.name}" dependsOn`, parent.field);
    // `defaultOption` (S-CRUD-41) selects the first option after each load, so it only means something on a select that loads from a parent.
    if (f.defaultOption !== undefined) {
      if (f.kind !== 'select') fail(at, 'defaultOption needs a select field');
      if (f.defaultOption !== 'first') fail(at, 'defaultOption must be "first"');
      if (!f.dependsOn?.length) fail(at, 'defaultOption needs a dependsOn parent');
    }
    assertCascade(at, f, names, entry.joins ?? [], slugs);
    for (const key of CONDITIONS) {
      if (!f[key]) continue;
      if (typeof f[key].field !== 'string' || !Array.isArray(f[key].in)) fail(at, `${key} needs a condition { field, in }`);
      known(`field "${f.name}" ${key}`, f[key].field);
    }
    if (f.clearsOnChange !== undefined) {
      if (!Array.isArray(f.clearsOnChange)) fail(at, 'clearsOnChange must be a list');
      for (const name of f.clearsOnChange) known(`field "${f.name}" clearsOnChange`, name);
    }
    if (f.afterField !== undefined && f.kind !== 'date') fail(at, 'afterField needs a date field');
    if (f.afterField) {
      known(`field "${f.name}" afterField`, f.afterField);
      if (entry.fields.find((/** @type {any} */ other) => other.name === f.afterField).kind !== 'date') fail(at, 'afterField must name a date field');
    }
  }
  assertAcyclic(where, entry.fields);
  assertStored(where, entry, names, known);
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
  // `search` (R-REG-16): the fields or joined display keys the free-text `q` looks in.
  if (entry.search !== undefined) {
    if (!Array.isArray(entry.search) || entry.search.some((/** @type {unknown} */ name) => typeof name !== 'string')) fail(where, 'search must be a list of field names');
    for (const name of entry.search) {
      if (!names.has(name) && !(entry.joins ?? []).some((/** @type {any} */ join) => join.as === name)) fail(where, `search names unknown field "${name}"`);
    }
  }
  // `optionLabel` is a field name, or a list of them joined with " - " (the tabla SUNAT shows as `nombre - descripcion`).
  if (entry.optionLabel !== undefined) {
    const labels = entry.optionLabel;
    if (Array.isArray(labels) ? labels.some((name) => typeof name !== 'string') : typeof labels !== 'string') fail(where, 'optionLabel must be a field name or a list of field names');
    if (Array.isArray(labels) && labels.length === 0) fail(where, 'optionLabel needs at least one field');
    // A stored-only column a `derive` rule computes (the Usuario nombre) is a valid label too.
    const derived = new Set((entry.derive ?? []).map((/** @type {any} */ d) => d.target));
    for (const name of [labels].flat()) if (!derived.has(name)) known('optionLabel', name);
  }
  const byName = new Map(entry.fields.map((/** @type {any} */ f) => [f.name, f]));
  for (const { name, params } of entry.rules ?? []) {
    rule(name, ENTRY_RULES);
    if (name === 'docIdentidad') assertDocParams(where, entry, byName, params);
  }
  for (const filter of Object.values(entry.lookupFilters ?? {})) {
    if (filter.rule) rule(filter.rule, FILTER_RULES);
    // `exists` (R-MOCK-16): the catalog must exist; its fields are checked once every entry is resolved.
    if (filter.exists) {
      if (!filter.exists.catalog || !filter.exists.local) fail(where, 'exists needs a catalog and a local field');
      if (!slugs.has(filter.exists.catalog)) fail(where, `lookupFilters names unknown catalog "${filter.exists.catalog}"`);
    }
    // `via` (R-MOCK-16): the filter value is a row of `via.catalog`; `via.key` is read from it and matched against this entry's `via.as`.
    if (filter.via) {
      if (!slugs.has(filter.via.catalog)) fail(where, `lookupFilters names unknown catalog "${filter.via.catalog}"`);
      known('lookupFilters', filter.via.as);
    }
  }

  // A transient select is a form-only level: it has no ref, and a parent that is transient is not one the server can check.
  // A `lookup` is a ref like a select (R-REG-13, R-REG-6): it is checked against its source and its parents.
  const selects = entry.fields.filter((/** @type {any} */ f) => (f.kind === 'select' || f.kind === 'lookup') && !f.transient);
  const transient = new Set(entry.fields.filter((/** @type {any} */ f) => f.transient).map((/** @type {any} */ f) => f.name));
  // Refs come from the field `source` and its `dependsOn` parents (R-REG-6).
  const refs = selects.map((/** @type {any} */ f) => ({
    field: f.name,
    catalog: f.source.catalog,
    where: f.source.where ?? {},
    activeOnly: f.source.activeOnly !== false,
    parents: (f.dependsOn ?? []).filter((/** @type {any} */ p) => !transient.has(p.field)),
  }));
  // Default order (D10): fields, then refs, then unique keys.
  const declared = entry.validation ?? [
    ...entry.fields.filter((/** @type {any} */ f) => f.kind !== 'code').map((/** @type {any} */ f) => f.name),
    ...selects.map((/** @type {any} */ f) => ({ ref: f.name })),
    ...(entry.unique ?? []).map((/** @type {any} */ _k, /** @type {number} */ i) => ({ unique: i })),
  ];
  // A lookup is a ref the desktop never checks (the Vehiculo propietario): an explicit `validation` that leaves it out still gets it as a trailing step, so a
  // propietario that is not an active transportista is a 422 on the field and the declared order of the desktop checks stays as written (W3-10, S-MST-12).
  const refSteps = declared.some((/** @type {any} */ s) => typeof s === 'object' && 'ref' in s);
  const named = new Set(declared.map((/** @type {any} */ s) => (typeof s === 'string' ? s : s.ref)));
  const trailing = entry.validation === undefined ? [] : selects.filter((/** @type {any} */ f) => f.kind === 'lookup' && !named.has(f.name)).map((/** @type {any} */ f) => (refSteps ? { ref: f.name } : f.name));
  const steps = [...declared, ...trailing];
  for (const step of steps) {
    if (typeof step === 'string') known('validation', step);
    else if ('unique' in step) {
      if (!Number.isInteger(step.unique) || step.unique < 0 || step.unique >= (entry.unique ?? []).length) {
        fail(where, `unique step ${step.unique} has no matching unique key`);
      }
    } else if ('range' in step) {
      const ranged = entry.fields.find((/** @type {any} */ f) => f.name === step.range);
      if (!ranged?.range) fail(where, `range step names "${step.range}", which has no range`);
    } else if ('rule' in step) rule(step.rule, (entry.rules ?? []).map((/** @type {any} */ r) => r.name));
    else if (!selects.some((/** @type {any} */ f) => f.name === step.ref)) fail(where, `ref step names "${step.ref}", which is not a select field`);
  }
  // A field a named rule touches carries its state for the form and the server (D9); not enumerable, so the entry stays plain data.
  const touched = new Set(Object.keys(ruleStates(entry, {})));
  const fields = entry.fields.map((/** @type {any} */ f) => {
    if (!touched.has(f.name)) return f;
    const ruled = { ...f };
    Object.defineProperty(ruled, 'ruleState', { value: (/** @type {any} */ values) => ruleStates(entry, values)[f.name], enumerable: false });
    return ruled;
  });
  // The row actions (R-ACT-1): a condition may name a field of the entry; a child row also has its `id` and `estado`.
  const actions = normalizeActions(where, entry, new Set([...names, ...(entry.parent === undefined ? [] : ['id', 'estado'])]), (dialogEntry) => resolveEntry(dialogEntry, slugs, sources, rawBySlug));
  return { ...entry, fields, refs, steps, ...(actions && { actions }) };
}

const REMOVALS = ['deactivate', 'delete', 'none'];
const QUITAR_KEYS = ['none', 'confirm', 'already'];

/**
 * The first row the server creates for every new parent of a child (the `INICIO` activation, R-MD-9): stored field values.
 * @param {string} at @param {any} initial @param {Set<string>} fieldNames
 */
function assertInitial(at, initial, fieldNames) {
  if (initial === undefined) return;
  if (typeof initial !== 'object' || initial === null || Array.isArray(initial)) fail(at, 'initial must be an object');
  for (const name of Object.keys(initial)) if (!fieldNames.has(name)) fail(at, `initial names unknown field "${name}"`);
}

/**
 * The grid messages of a child `Quitar` (R-MD-4): `none` (no selected row), `confirm` (the question; absent when the desktop did not ask) and
 * `already` (a deactivated row pressed again). @param {string} at @param {any} quitar
 */
function assertQuitar(at, quitar) {
  if (quitar === undefined) return;
  if (typeof quitar !== 'object' || quitar === null || Array.isArray(quitar)) fail(at, 'quitar must be an object');
  for (const [key, text] of Object.entries(quitar)) {
    if (!QUITAR_KEYS.includes(key)) fail(at, `quitar names unknown key "${key}"`);
    if (typeof text !== 'string' || text.trim() === '') fail(at, `quitar.${key} must be a non-empty text`);
  }
}
// `none`: the grid has no Agregar; its rows come from the actions (the activation history).
const CHILD_ENTRIES = ['dialog', 'inline', 'none'];
/** Route words and row keys a child name or field may not take (R-REG-14, R-REG-20). */
const RESERVED_CHILD_NAMES = ['actions'];
const RESERVED_CHILD_FIELDS = ['id', 'estado', 'op'];

/** The children of an entry as an ordered `{ name, ...def }` list: a map (R-REG-14) or a list, which can repeat a name. @param {any} parent */
const childList = (parent) =>
  Array.isArray(parent.children) ? parent.children : Object.entries(parent.children ?? {}).map(([name, def]) => ({ ...(/** @type {any} */ (def)), name }));

/** What a store child takes from its owning entry instead of declaring it. */
const OWNER_PARTS = ['fields', 'unique', 'joins', 'validation', 'refs'];

/**
 * `entryFields: [{ name, message? }]` of a store child (R-REG-14): the owner's fields the entry of its parent shows, in order, each with an optional required message.
 * @param {string} at @param {any} view @param {any} owner @param {string} ownerSlug @param {string} key @returns {{ name: string, message?: string }[]}
 */
function assertEntryFields(at, view, owner, ownerSlug, key) {
  if (view === undefined) return [];
  if (!Array.isArray(view) || view.length === 0) fail(at, 'entryFields needs a list of fields');
  for (const { name } of view) {
    if (!owner.fields.some((/** @type {any} */ f) => f.name === name)) fail(at, `entryFields names unknown field "${name}" of "${ownerSlug}"`);
    if (name === owner.idKey) fail(at, `entryFields cannot name the code "${name}"`);
    if (name === key) fail(at, `entryFields cannot name the parent key "${key}"`);
  }
  return view;
}

/**
 * The internal entry of a store child: the owning entry under the slug `parent/name`, linked to the parent through `store.key`.
 * @param {any} parent @param {any} def @param {string} at @param {string} removal @param {string} entry @param {Map<string, any>} resolved @param {(raw: any) => any} resolve
 */
function storeChild(parent, def, at, removal, entry, resolved, resolve) {
  const { entry: ownerSlug, key } = def.store;
  if (typeof ownerSlug !== 'string' || typeof key !== 'string' || key === '') fail(at, 'store needs an entry and a key');
  const owner = resolved.get(ownerSlug);
  if (!owner) fail(at, `store names unknown entry "${ownerSlug}"`);
  if (ownerSlug === parent.slug) fail(at, 'store cannot name its own parent');
  for (const part of OWNER_PARTS) if (def[part] !== undefined) fail(at, `a store child takes ${part} from "${ownerSlug}"`);
  const { menu: _menu, children: _children, actions: _actions, ...rest } = owner;
  const slug = `${parent.slug}/${def.name}`;
  // The nested route binds every row to its parent, so the parent key is never ref-checked again; `entryFields` (W3-10) picks, orders and words the fields of the entry.
  const view = assertEntryFields(at, def.entryFields, owner, ownerSlug, key);
  const names = view.map((/** @type {any} */ v) => v.name);
  const words = new Map(view.filter((/** @type {any} */ v) => v.message !== undefined).map((/** @type {any} */ v) => [v.name, v.message]));
  const fields = owner.fields.map((/** @type {any} */ f) => (words.has(f.name) ? { ...f, message: words.get(f.name) } : f));
  const owned = owner.steps.filter((/** @type {any} */ s) => s !== key && !(typeof s === 'object' && s.ref === key));
  const steps = view.length === 0 ? owned : [...names, ...owned.filter((/** @type {any} */ s) => !(typeof s === 'string' && names.includes(s)))];
  const actions = normalizeActions(at, { actions: def.actions, parent: parent.slug, slug, entity: owner.entity, messages: owner.messages }, new Set([...owner.fields.map((/** @type {any} */ f) => f.name), 'id', 'estado']), resolve);
  return { ...rest, fields, steps, ...(view.length > 0 && { entryFields: names }), ...(actions && { actions }), slug, parent: parent.slug, childName: def.name, parentKey: key, seed: null, removal, entry, store: def.store, tab: def.tab, gate: def.gate, quitar: def.quitar, columns: def.columns ?? owner.columns };
}

/**
 * Expands the children of a resolved parent into internal entries (D5): slug `parent/name` (no single-segment route reaches it), the parent's scope,
 * stamp, formId and flags, a `id` code, the parent key as link column and a constant `estado`. Each goes through `resolveEntry`, so unknown field names in
 * `unique`, `joins`, `columns` and `validation` fail like in a top-level entry.
 * A `store: { entry, key }` child is a filtered view of another entry's section (R-REG-14): it takes the owner's rows and rules, links its rows to the
 * parent through `key`, and has no seed of its own.
 * @param {any} parent @param {Set<string>} slugs @param {Record<string, any>} sources @param {Map<string, any>} rawBySlug @param {Map<string, any>} resolved the resolved top-level entries
 */
function expandChildren(parent, slugs, sources, rawBySlug, resolved) {
  const seen = new Set();
  return childList(parent).map((/** @type {any} */ def) => {
    const at = `entry "${parent.slug}" child "${def.name}"`;
    if (seen.has(def.name)) fail(at, 'duplicate child name');
    seen.add(def.name);
    if (RESERVED_CHILD_NAMES.includes(def.name)) fail(at, 'reserved name');
    if (parent.fields.some((/** @type {any} */ f) => f.name === def.name)) fail(at, 'collides with a field of the parent');
    const removal = def.removal ?? 'delete';
    if (!REMOVALS.includes(removal)) fail(at, `unknown removal "${removal}"`);
    const entry = def.entry ?? 'dialog';
    if (!CHILD_ENTRIES.includes(entry)) fail(at, `unknown entry "${entry}"`);
    assertGate(at, def.gate);
    assertQuitar(at, def.quitar);
    for (const f of def.fields ?? []) {
      if ([...RESERVED_CHILD_FIELDS, parent.idKey].includes(f.name)) fail(`${at} field "${f.name}"`, 'reserved name');
    }
    const resolve = (/** @type {any} */ raw) => resolveEntry(raw, slugs, sources, rawBySlug);
    if (def.entryFields !== undefined && def.store === undefined) fail(at, 'entryFields needs a store child');
    if (def.store !== undefined) return storeChild(parent, def, at, removal, entry, resolved, resolve);
    const fieldNames = new Set((def.fields ?? []).map((/** @type {any} */ f) => f.name));
    assertInitial(at, def.initial, fieldNames);
    for (const ref of def.refs ?? []) if (!fieldNames.has(ref.field)) fail(`entry "${parent.slug}/${def.name}"`, `refs names unknown field "${ref.field}"`);
    const { name, refs: _refs, ...rest } = def;
    return resolveEntry({
      entity: parent.entity, messages: parent.messages, ...rest, slug: `${parent.slug}/${name}`, section: `${parent.section}/${name}`, parent: parent.slug, childName: name,
      parentKey: parent.idKey, idKey: 'id', codeWidth: 0, scope: parent.scope, seed: null, stamp: parent.stamp, formId: parent.formId, readOnly: parent.readOnly,
      removal, entry, constants: { estado: 'A' }, fields: [{ name: 'id', kind: 'code', label: 'Codigo' }, ...(def.fields ?? [])], columns: def.columns ?? [],
    }, slugs, sources, rawBySlug);
  });
}

/**
 * Validates every entry at load and returns the registry. Fails fast with a
 * `RegistryError` naming the entry and field (R-REG-4).
 * @param {any[]} rawEntries @param {{ sources?: Record<string, any> }} [options]
 */
export function validateRegistry(rawEntries, { sources = BUILTIN_SOURCES } = {}) {
  for (const key of ['slug', 'idKey', 'formId']) {
    // The entries over the W1 sections (`seed: null`) all keep the W1 row key `id`, so only they may share it.
    const seen = new Map();
    for (const raw of rawEntries) {
      if (raw[key] === undefined) continue;
      const first = seen.get(raw[key]);
      if (first && !(key === 'idKey' && first.seed === null && raw.seed === null)) fail(`entry "${raw.slug}"`, `duplicate ${key} "${raw[key]}"`);
      seen.set(raw[key], first ?? raw);
    }
  }
  const slugs = new Set(rawEntries.map((e) => e.slug));
  const rawBySlug = new Map(rawEntries.map((e) => [e.slug, e]));
  /** @type {any[]} */
  const entries = rawEntries.map((raw) => resolveEntry(raw, slugs, sources, rawBySlug));
  for (const entry of entries) {
    for (const { via } of Object.values(entry.lookupFilters ?? {}).filter((/** @type {any} */ f) => f.via)) {
      const target = entries.find((e) => e.slug === via.catalog);
      if (!target.fields.some((/** @type {any} */ f) => f.name === via.key)) fail(`entry "${entry.slug}"`, `lookupFilters names unknown field "${via.key}" of "${via.catalog}"`);
    }
  }
  for (const entry of entries) {
    for (const [key, { exists }] of Object.entries(entry.lookupFilters ?? {}).filter(([, f]) => /** @type {any} */ (f).exists)) {
      const target = entries.find((e) => e.slug === exists.catalog);
      for (const name of [exists.local, exists.key ?? key, ...Object.keys(exists.where ?? {})]) {
        if (!target.fields.some((/** @type {any} */ f) => f.name === name)) fail(`entry "${entry.slug}"`, `lookupFilters names unknown field "${name}" of "${exists.catalog}"`);
      }
    }
  }
  const resolved = new Map(entries.map((e) => [e.slug, e]));
  // A child is reachable by `bySlug` under `parent/name` only; it is not a top-level entry (no menu, no form, no route of its own).
  const childEntries = entries.flatMap((entry) => (entry.children === undefined ? [] : expandChildren(entry, slugs, sources, rawBySlug, resolved)));
  return { entries, childEntries, bySlug: /** @type {Map<string, any>} */ (new Map([...entries, ...childEntries].map((e) => [e.slug, e]))), sources };
}
