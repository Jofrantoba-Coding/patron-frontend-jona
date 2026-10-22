// Per-mode starting values and read-only rules of the register fields (R-CRUD-15). Pure.
import type { CrudMode, FieldConfig } from '../../catalogs/CatalogConfig';
import { decodeValue } from './codec';
import type { FormValues } from './validate';

type Defaultable = Extract<FieldConfig, { default?: unknown }>;
const hasDefault = (field: FieldConfig): field is Defaultable => field.kind === 'boolean';

/** A `default` as a form string for `mode`: a per-mode map answers its own entry, a scalar answers INSERT only. */
function defaultFor(field: FieldConfig, mode: CrudMode): string | undefined {
  if (!hasDefault(field) || field.default === undefined) return undefined;
  const { default: spec } = field;
  const value = typeof spec === 'object' ? (spec as Partial<Record<CrudMode, unknown>>)[mode] : mode === 'INSERT' ? spec : undefined;
  return value === undefined ? undefined : decodeValue(field, value);
}

const namesOf = (fields: FieldConfig[]) => fields.flatMap((f) => (f.kind === 'cascade' ? f.levels.map((l) => l.name) : [f.name]));

/** The form before any record loads: empty strings, an unchecked boolean, and the defaults of `mode`. */
export function initialValues(fields: FieldConfig[], mode: CrudMode): FormValues {
  const values: FormValues = Object.fromEntries(namesOf(fields).map((name) => [name, '']));
  for (const field of fields) {
    if (field.kind === 'boolean') values[field.name] = 'false';
    const preset = defaultFor(field, mode);
    if (preset !== undefined) values[field.name] = preset;
  }
  return values;
}

/** A loaded record on top: a per-mode default for `mode` overrides the record value (TipoCambio CLONE -> today). */
export function applyModeDefaults(fields: FieldConfig[], values: FormValues, mode: CrudMode): FormValues {
  const result = { ...values };
  for (const field of fields) {
    if (!hasDefault(field) || typeof field.default !== 'object') continue;
    const preset = defaultFor(field, mode);
    if (preset !== undefined) result[field.name] = preset;
  }
  return result;
}

/** True when the whole register is read-only or the field lists `mode` in `readOnlyOn`. */
export function isFieldReadOnly(field: FieldConfig, mode: CrudMode, formReadOnly: boolean): boolean {
  if (formReadOnly) return true;
  return hasDefault(field) && (field.readOnlyOn?.includes(mode) ?? false);
}
