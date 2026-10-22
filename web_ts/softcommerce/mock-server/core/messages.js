/**
 * Validation messages, shared by the server validators and (from W2-2) the UI, so
 * both emit identical text (R-REF-3, R-CRUD-6, D12). Styles: `M1`, `M2`, `MS`,
 * `label`, and `w1` (the W1 English text, kept for Localidad).
 */

/** `{modo}` of each mode. */
export const MODO = { INSERT: 'agregar', CLONE: 'clonar', UPDATE: 'modificar', DELETE: 'eliminar' };

/** Field `messages` key that holds the literal of a rule code. */
const LITERAL_KEY = { RANGE: 'range', MIN_LENGTH: 'minLen', DATE: 'date' };

/** @param {string} template @param {keyof typeof MODO} mode */
const fill = (template, mode) => template.replaceAll('{modo}', MODO[mode]);

/** The desktop "required" sentence of the entry style. */
function requiredText(/** @type {any} */ entry, /** @type {any} */ field, /** @type {keyof typeof MODO} */ mode) {
  const { style } = entry.messages;
  const modo = MODO[mode];
  if (style === 'M2') return `Para ${modo}, debes especificar ${field.msgLabel ?? `su ${field.label}`}.`;
  if (style === 'MS') return `Para ${modo} ${entry.entity}, debes Seleccionar ${field.article ?? 'un'} ${field.label}.`;
  // `label` takes the label phrase as written ("el Usuario"); M1 is "su {label}".
  const phrase = style === 'label' ? (field.msgLabel ?? field.label) : (field.msgLabel ?? `su ${field.label}`);
  return `Para ${modo} ${entry.entity}, debes especificar ${phrase}.`;
}

/** W1 text of the rules that have no desktop sentence (the input is constrained there). */
function plainText(/** @type {any} */ field, /** @type {string} */ code) {
  const { name } = field;
  if (code === 'REQUIRED') return `${name} is required`;
  if (code === 'MAX_LENGTH') return `${name} must be at most ${field.max} characters`;
  if (code === 'RANGE') return `${name} is out of range`;
  if (code === 'MIN_LENGTH') return `${name} is too short`;
  if (code === 'DATE') return `${name} must be a valid date`;
  if (field.kind === 'options') return `${name} must be one of: ${field.options.map((/** @type {any} */ o) => o.value).join(', ')}`;
  if (field.kind === 'number') return `${name} must be ${field.scale === 0 ? 'an integer' : 'a number'}`;
  if (field.kind === 'boolean') return `${name} must be a boolean`;
  return `${name} is invalid`;
}

/**
 * The message of one failed rule. `REQUIRED` and, without their own literal,
 * `RANGE`, `MIN_LENGTH` and `DATE` use the entry style; a field `message` is a
 * literal for the required case and `messages.range|minLen|date` fill `{modo}`.
 * @param {any} entry @param {any} field
 * @param {'REQUIRED'|'MAX_LENGTH'|'INVALID'|'RANGE'|'MIN_LENGTH'|'DATE'} code
 * @param {keyof typeof MODO} [mode]
 */
export function fieldMessage(entry, field, code, mode = 'INSERT') {
  if (entry.messages.style === 'w1') return plainText(field, code);
  const desktop = code === 'REQUIRED' || Object.hasOwn(LITERAL_KEY, code);
  if (!desktop) return plainText(field, code);
  if (code === 'REQUIRED') return field.message ?? requiredText(entry, field, mode);
  const literal = field.messages?.[LITERAL_KEY[/** @type {keyof typeof LITERAL_KEY} */ (code)]];
  return literal ? fill(literal, mode) : (field.message ?? requiredText(entry, field, mode));
}
