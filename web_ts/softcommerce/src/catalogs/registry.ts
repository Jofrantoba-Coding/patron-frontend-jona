// G15 UI adapter: a registry entry becomes the CatalogConfig the generic list and register units consume.
import type { CatalogDef } from '../../mock-server/registry/schema.js';
import { PICKERS } from '../../mock-server/registry/pickers.js';
import { REGISTRY } from '../../mock-server/registry/index.js';
import type { ActionConfig, CatalogConfig, FieldConfig } from './CatalogConfig';

type Row = Record<string, string>;

/** The conditional attributes of a field (G8), carried as declared. */
const conditionsOf = (field: any) => ({
  ...(field.gate ? { gate: field.gate } : {}),
  ...(field.visibleWhen ? { visibleWhen: field.visibleWhen } : {}), ...(field.enabledWhen ? { enabledWhen: field.enabledWhen } : {}),
  ...(field.requiredWhen ? { requiredWhen: field.requiredWhen } : {}), ...(field.clearsOnChange ? { clearsOnChange: field.clearsOnChange } : {}),
  ...(field.ruleState ? { ruleState: field.ruleState } : {}),
});

function toField(entry: CatalogDef, field: any, registry: Registry): FieldConfig {
  const config = baseField(entry, field, registry);
  // What a company parameter changes (R-MST-11) rides on the cascade too; the other conditions never apply to it.
  const byParam = field.byParam && config.kind !== 'code' ? { byParam: field.byParam } : {};
  return config.kind === 'code' ? config : { ...(config.kind === 'cascade' ? config : { ...config, ...conditionsOf(field) }), ...byParam };
}

type Registry = { bySlug: Map<string, any>; childEntries?: any[] };

function baseField(entry: CatalogDef, field: any, registry: Registry): FieldConfig {
  if (field.kind === 'code') return { kind: 'code', name: field.name, label: field.label };
  // A textarea is a text for the core (R-CRUD-18): the same required, max and normalize checks; `multiline` only picks the control.
  if (field.kind === 'text' || field.kind === 'textarea') {
    const normalize: string[] = field.normalize ?? [];
    return {
      kind: 'text', name: field.name, label: field.label, required: Boolean(field.required),
      maxLength: field.max, uppercase: normalize.includes('upper'), normalize,
      ...(field.message ? { message: field.message } : {}),
      ...(field.kind === 'textarea' ? { multiline: true, rows: field.rows ?? 4 } : {}),
      ...(field.minLen !== undefined ? { minLen: field.minLen } : {}), ...(field.minLenWhen ? { minLenWhen: field.minLenWhen } : {}), ...(field.maxWhen ? { maxWhen: field.maxWhen } : {}),
    };
  }
  if (field.kind === 'password') {
    return { kind: 'password', name: field.name, label: field.label, maxLength: field.max, confirm: field.confirm !== false, ...(field.messages?.mismatch ? { confirmMessage: field.messages.mismatch } : {}) };
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
  if (field.kind === 'lookup') {
    // The dialog is the named picker (its title, Refrescar and extras) or what the field declares inline.
    const named = field.picker ? PICKERS[field.picker as keyof typeof PICKERS] : undefined;
    const target = registry.bySlug.get(field.source.catalog);
    const where = field.source.where && Object.fromEntries(Object.entries(field.source.where).map(([key, value]) => [key, String(value)]));
    return {
      kind: 'lookup', name: field.name, label: field.label, required: Boolean(field.required), source: { catalog: field.source.catalog, ...(where ? { where } : {}) },
      display: field.display, idKey: target.idKey,
      ...(field.fill ? { fill: field.fill } : {}), ...(field.fillReadOnly ? { fillReadOnly: field.fillReadOnly } : {}), ...(field.readOnlyOn ? { readOnlyOn: field.readOnlyOn } : {}), codeWidth: target.codeWidth ?? 0, optionLabel: target.optionLabel ?? 'descripcion',
      picker: { title: named?.title ?? field.label, columns: field.columns, filters: field.filters, pickLabel: field.pickLabel ?? 'Agregar', ...(named?.refresh ? { refresh: true } : {}), ...(named?.extras ? { extras: named.extras } : {}) },
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
      // A transient cascade (ZonaDistancia) is form-only: restored from a code the record carries, filtered by `has`, never sent (R-CRUD-12).
      ...(field.transient ? { transient: true } : {}), ...(field.restoreFrom ? { restoreFrom: field.restoreFrom } : {}), ...(field.filter ? { filter: field.filter } : {}),
    };
  }
  if (field.kind === 'select') {
    // The lookup filters travel as query strings, so a boolean or numeric `where` value is sent as its text.
    const where = field.source.where && Object.fromEntries(Object.entries(field.source.where).map(([key, value]) => [key, String(value)]));
    return { kind: 'select', name: field.name, label: field.label, required: Boolean(field.required), source: { catalog: field.source.catalog, where }, ...(field.dependsOn?.length ? { dependsOn: field.dependsOn } : {}), ...(field.defaultOption ? { defaultOption: field.defaultOption } : {}), ...(field.default !== undefined ? { default: field.default } : {}), ...(field.readOnlyOn ? { readOnlyOn: field.readOnlyOn } : {}), ...(field.message ? { message: field.message } : {}), ...(field.fillLabel ? { fillLabel: field.fillLabel } : {}) };
  }
  throw new Error(`${entry.slug}.${field.name}: the UI does not support kind "${field.kind}" yet`);
}

/** The row actions of an entry or child (R-ACT-1) as the UI config: the dialog fields become form fields. */
const toActions = (entry: CatalogDef, registry: Registry): ActionConfig[] | undefined =>
  (entry as any).actions?.map(({ dialog, ...action }: any) => ({ ...action, ...(dialog && { dialog: { title: dialog.title, fields: dialog.fields.map((field: any) => toField(entry, field, registry)) } }) }));

/** The list and register config of an entry; the entry rides along for validation order and messages. */
export function toCatalogConfig(entry: CatalogDef, registry: Registry = REGISTRY): CatalogConfig<Row> {
  const all = (registry.childEntries ?? []).filter((child) => child.parent === entry.slug);
  const kids = all.filter((child) => (child as any).tab !== false);
  const hidden = all.filter((child) => (child as any).tab === false);
  const toChild = (child: CatalogDef) => ({ name: (child as any).childName, title: (child as any).tab || (child as any).childName, removal: (child as any).removal, entryMode: (child as any).entry, ...((child as any).pick ? { pick: (child as any).pick } : {}), quitar: { none: 'Seleccione Fila.', already: 'Fila ya Esta desactivada', ...(child as any).quitar }, ...((child as any).gate ? { gate: (child as any).gate } : {}), ...((child as any).actions ? { actions: toActions(child, registry) } : {}), config: { ...toCatalogConfig(child, registry), title: (child as any).tab || (child as any).childName } });
  return {
    formId: entry.formId ?? entry.slug,
    title: entry.title ?? entry.slug,
    catalog: entry.slug,
    idKey: entry.idKey,
    columns: entry.columns.map(({ key, header, type, gate }: any) => ({ key, header, sortable: true, ...(type === 'bool' || type === 'dec' || type === 'date' ? { format: type as 'bool' | 'dec' | 'date' } : {}), ...(gate ? { gate } : {}) })),
    // A store child shows only the owner's fields it picks, in that order (`entryFields`, R-REG-14); everything else is the owner's.
    fields: ((entry as any).entryFields?.map((name: string) => entry.fields.find((field) => field.name === name)) ?? entry.fields).map((field: any) => toField(entry, field, registry)),
    modes: entry.modes as CatalogConfig<Row>['modes'],
    entry,
    // A child is a nested config of its own (R-REG-14): the child dialog is the unchanged crud register over it.
    ...(kids.length ? { children: kids.map(toChild) } : {}),
    ...(hidden.length ? { resources: hidden.map(toChild) } : {}),
    ...((entry as any).layout ? { layout: (entry as any).layout } : {}),
    // A child's own actions ride on its `ChildConfig`; its nested config has none.
    ...((entry as any).actions && (entry as any).parent === undefined ? { rowActions: toActions(entry, registry) } : {}),
  };
}
