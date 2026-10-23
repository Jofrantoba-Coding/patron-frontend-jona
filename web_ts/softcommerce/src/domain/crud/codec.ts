// Per-kind conversion between the string form state and the typed wire payload (design D7).
import type { FieldConfig } from '../../catalogs/CatalogConfig';
import type { FormValues } from './validate';

/** Wire value -> form string. A missing boolean reads as unchecked; a missing text as empty. */
export function decodeValue(field: FieldConfig, wire: unknown): string {
  if (field.kind === 'boolean') return wire === true ? 'true' : 'false';
  return wire === undefined || wire === null ? '' : String(wire);
}

/** Form string -> wire value: a boolean field becomes a real boolean; everything else stays a string. */
export function encodeValue(field: FieldConfig, value: string): unknown {
  return field.kind === 'boolean' ? value === 'true' : value;
}

/** The typed payload of a form: encodes the known fields and keeps any other key as it is. */
export function encodeValues(fields: FieldConfig[], values: FormValues): Record<string, unknown> {
  const result: Record<string, unknown> = { ...values };
  for (const field of fields) if (field.kind !== 'cascade' && field.name in values) result[field.name] = encodeValue(field, values[field.name]);
  return result;
}
