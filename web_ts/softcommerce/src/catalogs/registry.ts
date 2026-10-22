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
  if (field.kind === 'boolean') {
    return { kind: 'boolean', name: field.name, label: field.label, default: field.default, readOnlyOn: field.readOnlyOn };
  }
  if (field.kind === 'options') {
    return {
      kind: 'options', name: field.name, label: field.label, required: Boolean(field.required), options: field.options,
      display: field.display, default: field.default, readOnlyOn: field.readOnlyOn,
    };
  }
  if (field.kind === 'number') {
    // Decimals (scale > 0) arrive with the decimal field in W2-7.
    if (field.scale !== 0) throw new Error(`${entry.slug}.${field.name}: the UI does not support decimal numbers yet`);
    return {
      kind: 'number', name: field.name, label: field.label, required: Boolean(field.required), scale: 0,
      maxLength: field.max, range: field.range, normalize: field.normalize ?? [],
    };
  }
  if (field.kind === 'select') {
    // The lookup filters travel as query strings, so a boolean or numeric `where` value is sent as its text.
    const where = field.source.where && Object.fromEntries(Object.entries(field.source.where).map(([key, value]) => [key, String(value)]));
    return { kind: 'select', name: field.name, label: field.label, required: Boolean(field.required), source: { catalog: field.source.catalog, where } };
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
    columns: entry.columns.map(({ key, header, type }) => ({ key, header, sortable: true, ...(type === 'bool' ? { format: 'bool' as const } : {}) })),
    fields: entry.fields.map((field) => toField(entry, field)),
    modes: entry.modes as CatalogConfig<Row>['modes'],
    entry,
  };
}
