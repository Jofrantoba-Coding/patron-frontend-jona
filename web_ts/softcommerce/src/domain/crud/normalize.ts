import { normalizeValue } from '../../../mock-server/core/normalize.js';
import type { FieldConfig } from '../../catalogs/CatalogConfig';
import type { FormValues } from './validate';

/**
 * On submit: re-applies uppercase to the `uppercase` fields, trims and normalizes the registry fields with
 * the same steps as the server, never sends the server `code`, and drops the cascade levels above the leaf
 * (only the leaf id is stored).
 */
export function normalize(fields: FieldConfig[], values: FormValues): FormValues {
  const result = { ...values };
  for (const field of fields) {
    if (field.kind === 'code') delete result[field.name];
    else if (field.kind === 'text' && field.normalize && field.name in result) result[field.name] = normalizeValue(result[field.name], field.normalize) as string;
    else if (field.kind === 'text' && field.uppercase && field.name in result) result[field.name] = result[field.name].toUpperCase();
  }
  for (const field of fields) {
    if (field.kind === 'cascade') field.levels.slice(0, -1).forEach((level) => delete result[level.name]);
  }
  return result;
}
