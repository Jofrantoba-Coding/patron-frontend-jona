import type { FieldConfig } from '../../catalogs/CatalogConfig';
import type { FormValues } from './validate';

/** Defense on submit: re-applies uppercase to the fields flagged `uppercase`. */
export function normalize(fields: FieldConfig[], values: FormValues): FormValues {
  const result = { ...values };
  for (const field of fields) {
    if (field.kind === 'text' && field.uppercase && field.name in result) result[field.name] = result[field.name].toUpperCase();
  }
  return result;
}
