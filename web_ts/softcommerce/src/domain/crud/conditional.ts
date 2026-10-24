// The form changes caused by one edit: the chain below, `clearsOnChange` and conditional fields that just hid (R-CRUD-12, R-CRUD-13). Pure.
import { fieldState, followedValue } from '../../../mock-server/core/predicates.js';
import type { FieldConfig } from '../../catalogs/CatalogConfig';
import type { FormValues } from './validate';

/** What a cleared field shows: an unchecked box for a boolean, its starting value for an integer or a radio / select of options that declares one (the días of a condición de pago: 0; the Item No perecible), an empty string for anything else. */
const blankOf = (field: FieldConfig | undefined) =>
  field?.kind === 'boolean' ? 'false' : (field?.kind === 'number' || field?.kind === 'options') && typeof field.default === 'string' ? field.default : '';

/** Whether the field is shown (a field with no `visibleWhen` always is); the code and cascade kinds are never conditional. */
export function isVisible(field: FieldConfig, values: FormValues): boolean {
  return field.kind === 'code' || field.kind === 'cascade' || fieldState(field, values).visible;
}

/** Whether the user can edit the field now: `enabledWhen` holds and it is visible (a cascade or code is never conditional). */
export function isEnabled(field: FieldConfig, values: FormValues): boolean {
  return field.kind === 'code' || field.kind === 'cascade' || fieldState(field, values).enabled;
}

/**
 * Applies one edit. The fields in `below` (the dependent chain under `name`) and those named by the field's `clearsOnChange` are emptied, and
 * so is every conditional field the edit just hid, so showing it again never brings back a value that was cleared.
 * `cleared` lists them all: their errors go with them.
 */
export function changeField(fields: FieldConfig[], current: FormValues, name: string, value: string, below: string[] = []): { values: FormValues; cleared: string[] } {
  const byName = new Map(fields.map((field) => [field.name, field]));
  const own = byName.get(name);
  const clearing = new Set([...below, ...(own && own.kind !== 'code' && own.kind !== 'cascade' ? (own.clearsOnChange ?? []) : [])]);
  const values: FormValues = { ...current, [name]: value };
  for (const field of fields) {
    if (field.name !== name && isVisible(field, current) && !isVisible(field, values)) clearing.add(field.name);
  }
  clearing.delete(name);
  for (const cleared of clearing) values[cleared] = blankOf(byName.get(cleared));
  // The fields that `follow` the edited one take the value computed from it (D27b: U. Compra and U. Venta, Kardex, Porc. IGV); a follower is shown as text like any value.
  const following = fields.flatMap((field) => (field.kind !== 'code' && field.kind !== 'cascade' && field.follows?.field === name ? [{ name: field.name, follows: field.follows }] : []));
  for (const follower of following) values[follower.name] = String(followedValue(follower.follows, values, undefined));
  return { values, cleared: [...clearing, ...following.map((follower) => follower.name)] };
}
