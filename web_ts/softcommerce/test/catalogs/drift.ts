import type { CatalogConfig } from '../../src/catalogs/CatalogConfig';

/**
 * Drift between a registry entry and the UI config of the same catalog (R-REG-3,
 * S-REG-2): every message names the catalog and the field. Empty means consistent.
 */
export function findDrift(config: CatalogConfig<any>, entry: any): string[] {
  const drift: string[] = [];
  const at = (field: string, what: string) => drift.push(`${entry.slug}.${field}: ${what}`);
  if (config.catalog !== entry.slug || config.idKey !== entry.idKey) at('(entry)', 'catalog or idKey differ');
  if (config.formId !== entry.formId) at('(entry)', `formId ${entry.formId} != ${config.formId}`);
  if (config.columns.map((c) => c.key).join() !== entry.columns.map((c: any) => c.key).join()) at('(columns)', 'column keys differ');
  for (const field of entry.fields) {
    const ui: any = config.fields.find((f) => f.name === field.name);
    if (!ui) {
      at(field.name, 'missing in the UI config');
      continue;
    }
    if (field.kind === 'code' && ui.kind !== 'code') at(field.name, `kind code != UI ${ui.kind}`);
    if (Boolean(ui.required) !== Boolean(field.required)) at(field.name, `required ${field.required} != UI ${ui.required}`);
    if ((field.kind === 'text' || field.kind === 'number') && ui.maxLength !== field.max) at(field.name, `max ${field.max} != UI maxLength ${ui.maxLength}`);
    if (field.kind === 'number' && JSON.stringify(ui.range) !== JSON.stringify(field.range)) at(field.name, `range ${JSON.stringify(field.range)} != UI range ${JSON.stringify(ui.range)}`);
  }
  for (const ui of config.fields) {
    if (!entry.fields.some((f: any) => f.name === ui.name)) drift.push(`${entry.slug}.${ui.name}: missing in the registry`);
  }
  return drift;
}
