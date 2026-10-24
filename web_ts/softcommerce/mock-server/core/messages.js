/**
 * Validation messages, shared by the server validators and (from W2-2) the UI, so
 * both emit identical text (R-REF-3, R-CRUD-6, D12). Styles: `M1`, `M2`, `MS`,
 * `label`, `dialog` (the bare sentences of a child dialog, R-MST-11) and `w1` (the W1 English text, kept for Localidad).
 */

/** `{modo}` of each mode. */
export const MODO = { INSERT: 'agregar', CLONE: 'clonar', UPDATE: 'modificar', DELETE: 'eliminar' };

/** Field `messages` key that holds the literal of a rule code. */
const LITERAL_KEY = { RANGE: 'range', MIN_LENGTH: 'minLen', DATE: 'date', NOT_FUTURE: 'notFuture', MIN_DATE: 'min', AFTER_FIELD: 'afterField' };

/** Date rules the desktop never had: without a literal they read as plain text, never as a missing value. */
const OWN_TEXT = ['NOT_FUTURE', 'MIN_DATE', 'AFTER_FIELD'];

/** The confirmation of a password differs from it (R-CRUD-17): a NEW sentence, the desktop has no confirmation. It never names the value. */
export const MISMATCH_TEXT = 'La confirmación de la contraseña no coincide.';

/** @param {string} template @param {keyof typeof MODO} mode */
const fill = (template, mode) => template.replaceAll('{modo}', MODO[mode]);

/** The desktop "required" sentence of the entry style. */
function requiredText(/** @type {any} */ entry, /** @type {any} */ field, /** @type {keyof typeof MODO} */ mode) {
  const { style } = entry.messages;
  const modo = MODO[mode];
  if (style === 'M2') return `Para ${modo}, debes especificar ${field.msgLabel ?? `su ${field.label}`}.`;
  // The child dialogs of the desktop say it without the entity: `Debes Seleccionar un Distrito.`, `Debes Ingresar Direccion.`.
  if (style === 'dialog') return field.kind === 'text' ? `Debes Ingresar ${field.label}.` : `Debes Seleccionar ${field.article ?? 'un'} ${field.label}.`;
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
  if (code === 'NOT_FUTURE') return `${name} must not be in the future`;
  if (code === 'MIN_DATE') return `${name} is before the allowed date`;
  if (code === 'AFTER_FIELD') return `${name} must not be before ${field.afterField}`;
  if (field.kind === 'options') return `${name} must be one of: ${field.options.map((/** @type {any} */ o) => o.value).join(', ')}`;
  if (field.kind === 'number') return `${name} must be ${field.scale === 0 ? 'an integer' : 'a number'}`;
  if (field.kind === 'boolean') return `${name} must be a boolean`;
  return `${name} is invalid`;
}

/**
 * The message of one failed rule. `REQUIRED` and, without their own literal,
 * `RANGE`, `MIN_LENGTH` and `DATE` use the entry style; a field `message` is a
 * literal for the required case and, like `messages.range|minLen|date`, fills `{modo}`.
 * @param {any} entry @param {any} field
 * @param {'REQUIRED'|'MAX_LENGTH'|'INVALID'|'RANGE'|'MIN_LENGTH'|'DATE'|'NOT_FUTURE'|'MIN_DATE'|'AFTER_FIELD'|'MISMATCH'} code
 * @param {keyof typeof MODO} [mode]
 */
export function fieldMessage(entry, field, code, mode = 'INSERT') {
  if (code === 'MISMATCH') return field.messages?.mismatch ?? MISMATCH_TEXT;
  if (entry.messages.style === 'w1') return plainText(field, code);
  const desktop = code === 'REQUIRED' || Object.hasOwn(LITERAL_KEY, code);
  if (!desktop) return plainText(field, code);
  if (code === 'REQUIRED') return field.message ? fill(field.message, mode) : requiredText(entry, field, mode);
  const literal = field.messages?.[LITERAL_KEY[/** @type {keyof typeof LITERAL_KEY} */ (code)]];
  if (literal) return fill(literal, mode);
  if (OWN_TEXT.includes(code)) return plainText(field, code);
  return field.message ? fill(field.message, mode) : requiredText(entry, field, mode);
}
