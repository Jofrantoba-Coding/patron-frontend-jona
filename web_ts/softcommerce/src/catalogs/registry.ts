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
      ...(field.minLen !== undefined ? { minLen: field.minLen } : {}), ...(field.minLenWhen ? { minLenWhen: field.minLenWhen } : {}),
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
    return {
      kind: 'number', name: field.name, label: field.label, required: Boolean(field.required), scale: field.scale,
      maxLength: field.max, range: field.range, normalize: field.normalize ?? [],
      // A decimal's amount rules and its starting text (the integer fields declare none of these).
      ...(field.min !== undefined ? { min: field.min } : {}), ...(field.exclusiveMin !== undefined ? { exclusiveMin: field.exclusiveMin } : {}),
      ...(field.default !== undefined ? { default: field.default } : {}), ...(field.blankToDefault ? { blankToDefault: true } : {}),
      ...(field.readOnlyOn ? { readOnlyOn: field.readOnlyOn } : {}),
    };
  }
  if (field.kind === 'date') {
    return {
      kind: 'date', name: field.name, label: field.label, required: Boolean(field.required),
      ...(field.default !== undefined ? { default: field.default } : {}), ...(field.readOnlyOn ? { readOnlyOn: field.readOnlyOn } : {}),
      ...(field.notFuture ? { notFuture: true } : {}), ...(field.min !== undefined ? { min: field.min } : {}), ...(field.afterField ? { afterField: field.afterField } : {}),
    };
  }
  // A select over `ubigeo` is the departamento > provincia > distrito cascade (R-REF-6, D8): the leaf carries the field name, the
  // levels above are not stored (INEI codes nest by prefix: departamento 2 digits, provincia 4, distrito 6).
  if (field.kind === 'select' && field.source.catalog === 'ubigeo') {
    return {
      kind: 'cascade', name: field.name, lookup: 'ubigeo', required: Boolean(field.required),
      levels: [
        { name: 'id_departamento', label: 'Departamento', article: 'un' },
        { name: 'id_provincia', label: 'Provincia', article: 'una' },
        { name: field.name, label: 'Distrito', article: 'un' },
      ],
      ancestorsOf: (leafId) => [leafId.slice(0, 2), leafId.slice(0, 4)],
    };
  }
  if (field.kind === 'select') {
    // The lookup filters travel as query strings, so a boolean or numeric `where` value is sent as its text.
    const where = field.source.where && Object.fromEntries(Object.entries(field.source.where).map(([key, value]) => [key, String(value)]));
    return { kind: 'select', name: field.name, label: field.label, required: Boolean(field.required), source: { catalog: field.source.catalog, where }, ...(field.dependsOn?.length ? { dependsOn: field.dependsOn } : {}), ...(field.default !== undefined ? { default: field.default } : {}), ...(field.readOnlyOn ? { readOnlyOn: field.readOnlyOn } : {}) };
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
    columns: entry.columns.map(({ key, header, type }) => ({ key, header, sortable: true, ...(type === 'bool' || type === 'dec' || type === 'date' ? { format: type as 'bool' | 'dec' | 'date' } : {}) })),
    fields: entry.fields.map((field) => toField(entry, field)),
    modes: entry.modes as CatalogConfig<Row>['modes'],
    entry,
  };
}
