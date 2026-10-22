/** Register-form rules driven by `config.fields`. Pure. */
import type { FieldConfig } from '../../catalogs/CatalogConfig';

export type FormValues = Record<string, string>;
export interface FieldError {
  name: string;
  message: string;
}

const isBlank = (value: string | undefined) => !value?.trim();

function fieldError(field: FieldConfig, values: FormValues): FieldError | undefined {
  if (field.kind === 'cascade') {
    // The first unset level is the one to fix (and to focus).
    const unset = field.levels.find((level) => isBlank(values[level.name]));
    return field.required && unset ? { name: unset.name, message: `${unset.label} es obligatorio.` } : undefined;
  }
  const value = values[field.name];
  if (field.required && isBlank(value)) return { name: field.name, message: `${field.label} es obligatorio.` };
  if (field.kind === 'text' && field.maxLength !== undefined && (value?.length ?? 0) > field.maxLength) {
    return { name: field.name, message: `${field.label} no puede superar ${field.maxLength} caracteres.` };
  }
  return undefined;
}

/** Errors in `fields` order; empty when the form can be submitted. */
export function validate(fields: FieldConfig[], values: FormValues): FieldError[] {
  return fields.flatMap((field) => fieldError(field, values) ?? []);
}
