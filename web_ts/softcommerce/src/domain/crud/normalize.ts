import { normalizeValue } from '../../../mock-server/core/normalize.js';
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
 * On submit: re-applies uppercase to the `uppercase` fields, trims and normalizes the registry fields with
 * the same steps as the server, never sends the server `code`, and drops the cascade levels above the leaf
 * (only the leaf id is stored). The result is the typed payload: the codec turns each boolean field into a boolean.
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
  return encodeValues(fields, result);
}
