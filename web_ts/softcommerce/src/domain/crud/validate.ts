/** Register-form rules driven by `config.fields`. Pure. */
import { fieldMessage } from '../../../mock-server/core/messages.js';
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

function fieldError(field: FieldConfig, values: FormValues, requiredMessage?: (name: string) => string): FieldError | undefined {
  if (field.kind === 'code') return undefined;
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
  return undefined;
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
  // Named `{rule}` steps arrive with the rules themselves (W2-12); unique and ref steps are the server's.
  for (const step of (entry as any).steps.slice(0, firstServerOnlyStep(entry))) {
    const field = typeof step === 'string' ? byName.get(step) : undefined;
    const error = field && fieldError(field, values, required);
    if (error) return [error];
  }
  return [];
}
