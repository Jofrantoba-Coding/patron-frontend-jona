// G15 UI adapter: a registry entry becomes the CatalogConfig the generic list and register units consume.
import type { CatalogDef } from '../../mock-server/registry/schema.js';
import type { CatalogConfig, FieldConfig } from './CatalogConfig';

type Row = Record<string, string>;

function toField(entry: CatalogDef, field: any): FieldConfig {
  if (field.kind === 'code') return { kind: 'code', name: field.name, label: field.label };
  if (field.kind === 'text') {
    const normalize: string[] = field.normalize ?? [];
    return {
      kind: 'text', name: field.name, label: field.label, required: Boolean(field.required),
      maxLength: field.max, uppercase: normalize.includes('upper'), normalize,
    };
  }
  throw new Error(`${entry.slug}.${field.name}: the UI does not support kind "${field.kind}" yet`);
}

/** The list and register config of an entry; the entry rides along for validation order and messages. */
export function toCatalogConfig(entry: CatalogDef): CatalogConfig<Row> {
  return {
    formId: entry.formId ?? entry.slug,
    title: entry.title ?? entry.slug,
    catalog: entry.slug,
    idKey: entry.idKey,
    columns: entry.columns.map(({ key, header }) => ({ key, header, sortable: true })),
    fields: entry.fields.map((field) => toField(entry, field)),
    modes: entry.modes as CatalogConfig<Row>['modes'],
    entry,
  };
}
