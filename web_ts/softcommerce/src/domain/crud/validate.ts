/** Register-form rules driven by `config.fields`. Pure. */
import { fieldMessage } from '../../../mock-server/core/messages.js';
import { displayToIso, todayIso } from '../../../mock-server/core/dates.js';
import { DECIMAL_TEXT, outOfBounds } from '../../../mock-server/core/numbers.js';
import { firstServerOnlyStep } from '../../../mock-server/core/validators.js';
import type { CatalogDef } from '../../../mock-server/registry/schema.js';
import type { CrudMode, FieldConfig } from '../../catalogs/CatalogConfig';

export type FormValues = Record<string, string>;
export interface FieldError {
  name: string;
  message: string;
}

/** A registry entry plus the mode being submitted: its declared steps and shared messages drive the check. */
export interface ValidationRules {
  entry: CatalogDef;
  mode: CrudMode;
}

const isBlank = (value: string | undefined) => !value?.trim();

type DateRule = 'DATE' | 'NOT_FUTURE' | 'MIN_DATE' | 'AFTER_FIELD';
type DateMessage = (name: string, rule: DateRule) => string;

/** A typed date must be real, then pass the optional rules (S-CRUD-28): not in the future, not before `min`, not before `afterField`. */
function dateError(field: Extract<FieldConfig, { kind: 'date' }>, values: FormValues, message?: DateMessage): FieldError | undefined {
  const fail = (rule: DateRule) => ({ name: field.name, message: message?.(field.name, rule) ?? `${field.label} no es una fecha válida.` });
  const iso = displayToIso(values[field.name] ?? '');
  if (iso === null) return fail('DATE');
  if (field.notFuture && iso > todayIso()) return fail('NOT_FUTURE');
  if (field.min !== undefined && iso < field.min) return fail('MIN_DATE');
  // Nothing to compare while the other date is blank or not a date: that field reports itself.
  const other = field.afterField === undefined ? null : displayToIso(values[field.afterField] ?? '');
  return other !== null && iso < other ? fail('AFTER_FIELD') : undefined;
}

/** A number outside its inclusive range; a blank or non-numeric value is another step's business. */
function rangeError(field: FieldConfig, values: FormValues, rangeMessage?: (name: string) => string): FieldError | undefined {
  if (field.kind !== 'number' || !field.range) return undefined;
  const text = values[field.name]?.trim() ?? '';
  if (!/^\d+$/.test(text)) return undefined;
  const { min = -Infinity, max = Infinity } = field.range;
  const n = Number(text);
  return n < min || n > max ? { name: field.name, message: rangeMessage?.(field.name) ?? `${field.label} está fuera de rango.` } : undefined;
}

function fieldError(field: FieldConfig, values: FormValues, requiredMessage?: (name: string) => string, rangeMessage?: (name: string) => string, skipRange = false, dateMessage?: DateMessage): FieldError | undefined {
  // A code is server-issued and a checkbox is always valid: neither can be blank.
  if (field.kind === 'code' || field.kind === 'boolean') return undefined;
  if (field.kind === 'cascade') {
    // The first unset level is the one to fix (and to focus).
    const unset = field.levels.find((level) => isBlank(values[level.name]));
    return field.required && unset ? { name: unset.name, message: `${unset.label} es obligatorio.` } : undefined;
  }
  const value = values[field.name];
  if (field.required && isBlank(value)) return { name: field.name, message: requiredMessage?.(field.name) ?? `${field.label} es obligatorio.` };
  if (field.kind === 'text' && field.maxLength !== undefined && (value?.length ?? 0) > field.maxLength) {
    return { name: field.name, message: `${field.label} no puede superar ${field.maxLength} caracteres.` };
  }
  if (isBlank(value)) return undefined;
  if (field.kind === 'date') return dateError(field, values, dateMessage);
  if (field.kind === 'number' && field.scale > 0) return decimalError(field, value.trim(), requiredMessage, rangeMessage);
  return skipRange ? undefined : rangeError(field, values, rangeMessage);
}

/** A decimal must be complete (`1.` and `-` are not amounts) and inside `min` / `exclusiveMin`; both failures read like a missing amount. */
function decimalError(field: Extract<FieldConfig, { kind: 'number' }>, text: string, requiredMessage?: (name: string) => string, rangeMessage?: (name: string) => string): FieldError | undefined {
  if (!DECIMAL_TEXT.test(text)) return { name: field.name, message: requiredMessage?.(field.name) ?? `${field.label} no es un número válido.` };
  return outOfBounds(field, text) ? { name: field.name, message: rangeMessage?.(field.name) ?? `${field.label} está fuera de rango.` } : undefined;
}

/**
 * Errors in `fields` order; empty when the form can be submitted. With `rules` (a registry entry) it follows the
 * declared steps up to the first server-only one and stops at the first failure, like the desktop (D10).
 */
export function validate(fields: FieldConfig[], values: FormValues, rules?: ValidationRules): FieldError[] {
  if (!rules) return fields.flatMap((field) => fieldError(field, values) ?? []);
  const { entry, mode } = rules;
  const byName = new Map(fields.map((field) => [field.name, field]));
  const entryFields = new Map(entry.fields.map((field: any) => [field.name, field]));
  const required = (name: string) => fieldMessage(entry, entryFields.get(name), 'REQUIRED', mode as 'INSERT');
  const range = (name: string) => fieldMessage(entry, entryFields.get(name), 'RANGE', mode as 'INSERT');
  const date: DateMessage = (name, rule) => fieldMessage(entry, entryFields.get(name), rule, mode as 'INSERT');
  const steps: any[] = (entry as any).steps;
  // A `{range: name}` step takes that field's range check out of its field step (R-REF-7 Turno order).
  const ranged = new Set(steps.flatMap((step) => (typeof step === 'object' && 'range' in step ? [step.range] : [])));
  // Named `{rule}` steps arrive with the rules themselves (W2-12); unique and ref steps are the server's.
  for (const step of steps.slice(0, firstServerOnlyStep(entry))) {
    const field = byName.get(typeof step === 'string' ? step : step.range);
    const error = field && (typeof step === 'string' ? fieldError(field, values, required, range, ranged.has(step), date) : rangeError(field, values, range));
    if (error) return [error];
  }
  return [];
}
