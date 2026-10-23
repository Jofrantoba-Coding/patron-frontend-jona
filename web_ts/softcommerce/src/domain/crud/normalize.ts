import { normalizeValue } from '../../../mock-server/core/normalize.js';
import { fieldState } from '../../../mock-server/core/predicates.js';
import type { FieldConfig } from '../../catalogs/CatalogConfig';
import { encodeValues } from './codec';
import type { FormValues } from './validate';

const hasPad = (steps: string[] | undefined) => (steps ?? []).some((step) => step.startsWith('padLeft:'));

/**
 * On blur (S-CRUD-35): a text or integer field with a `padLeft` step shows its full normalization (trim, case,
 * digits, pad); an empty value stays empty. A decimal with `blankToDefault` shows its default when left blank
 * (S-CRUD-26). Any other field is returned exactly as typed.
 */
export function blurNormalize(field: FieldConfig, value: string): string {
  if (field.kind === 'number' && field.blankToDefault && value.trim() === '' && typeof field.default === 'string') return field.default;
  if ((field.kind !== 'text' && field.kind !== 'number') || !hasPad(field.normalize)) return value;
  return normalizeValue(value, field.normalize) as string;
}

/**
 * On every typed or pasted edit (R-CRUD-6, S-REF-4, S-REF-10): a text field applies its `upper`, `lower` and `digits` steps as the
 * characters arrive, so a digits field ignores letters and a lower-case field never shows capitals. Nothing is trimmed or padded
 * here: an edit in progress keeps its spaces, `padLeft` waits for blur and the full normalization for submit.
 */
export function typedNormalize(field: FieldConfig, value: string): string {
  if (field.kind !== 'text') return value;
  return (field.normalize ?? []).reduce((out, step) => (step === 'upper' ? out.toUpperCase() : step === 'lower' ? out.toLowerCase() : step === 'digits' ? out.replace(/\D/g, '') : out), value);
}

/**
 * On submit: re-applies uppercase to the `uppercase` fields, trims and normalizes the registry fields with
 * the same steps as the server, never sends the server `code`, and drops the cascade levels above the leaf
 * (only the leaf id is stored). The result is the typed payload: the codec turns each boolean field into a boolean, and a hidden
 * conditional field becomes `null`.
 */
export function normalize(fields: FieldConfig[], values: FormValues): Record<string, unknown> {
  const result = { ...values };
  for (const field of fields) {
    if (field.kind === 'code') delete result[field.name];
    else if (field.kind === 'text' && field.normalize && field.name in result) result[field.name] = normalizeValue(result[field.name], field.normalize) as string;
    else if (field.kind === 'number' && field.normalize && field.name in result) result[field.name] = normalizeValue(result[field.name], field.normalize) as string;
    else if (field.kind === 'text' && field.uppercase && field.name in result) result[field.name] = result[field.name].toUpperCase();
  }
  for (const field of fields) {
    if (field.kind === 'cascade') field.levels.slice(0, -1).forEach((level) => delete result[level.name]);
  }
  const payload = encodeValues(fields, result);
  // A hidden conditional field is sent as `null`; the server stores an empty string (R-CRUD-13, D7).
  for (const field of fields) if (field.kind !== 'code' && field.kind !== 'cascade' && field.name in payload && !fieldState(field, values).visible) payload[field.name] = null;
  return payload;
}
