import type { FieldConfig } from '../../catalogs/CatalogConfig';
import type { FormValues } from './validate';

/** On submit: re-applies uppercase to the `uppercase` fields and drops the cascade levels above the leaf (only the leaf id is stored). */
export function normalize(fields: FieldConfig[], values: FormValues): FormValues {
  const result = { ...values };
  for (const field of fields) {
    if (field.kind === 'text' && field.uppercase && field.name in result) result[field.name] = result[field.name].toUpperCase();
  }
  for (const field of fields) {
    if (field.kind === 'cascade') field.levels.slice(0, -1).forEach((level) => delete result[level.name]);
  }
  return result;
}
