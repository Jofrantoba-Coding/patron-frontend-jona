import { describe, expect, it } from 'vitest';
import { localidadConfig } from '../../src/catalogs/localidad/localidad.config';
import { createRecord } from '../core/catalog.js';
import { createStore } from '../core/store.js';
import { readSeed } from '../core/test-helpers.js';
import { localidades } from './catalogs/localidades.js';
import { REGISTRY } from './index.js';

/** A valid body per catalog: a registry entry without one fails the guard below. */
const VALID: Record<string, Record<string, string>> = {
  localidades: { id_empresa: '1', descripcion: 'LOCAL NUEVO', direccion: 'AV. X 1', id_ubigeo: '150101' },
};

type Entry = (typeof REGISTRY.entries)[number];

/** Drift between the registry entry and the UI config of the same catalog (R-REG-3). */
function uiDrift(entry: Entry, config: typeof localidadConfig): string[] {
  const drift: string[] = [];
  const at = (field: string, what: string) => drift.push(`${entry.slug}.${field}: ${what}`);
  if (config.catalog !== entry.slug || config.idKey !== entry.idKey) at('(entry)', 'catalog or idKey differ');
  if (config.formId !== entry.formId) at('(entry)', `formId ${entry.formId} != ${config.formId}`);
  if (config.columns.map((c) => c.key).join() !== entry.columns.map((c: any) => c.key).join()) at('(columns)', 'column keys differ');
  for (const field of entry.fields) {
    const ui: any = config.fields.find((f) => f.name === field.name);
    if (!ui) { at(field.name, 'missing in the UI config'); continue; }
    if (Boolean(ui.required) !== Boolean(field.required)) at(field.name, `required ${field.required} != UI ${ui.required}`);
    if (field.kind === 'text' && ui.maxLength !== field.max) at(field.name, `max ${field.max} != UI maxLength ${ui.maxLength}`);
  }
  return drift;
}

const rejects = (entry: Entry, body: Record<string, string>) => {
  try {
    createRecord(createStore(readSeed()), 'demo', entry.slug, body);
    return [];
  } catch (error) {
    return (error as { details: { field: string }[] }).details.map((d) => d.field);
  }
};

describe('S-REG-19 Localidad compat entry', () => {
  it('declares the W1 compat block and validation order', () => {
    expect(localidades.compat).toEqual({ messages: 'w1', serverOptional: ['direccion'] });
    expect(localidades.messages.style).toBe('w1');
    expect(localidades.validation).toEqual(['id_empresa', 'descripcion', 'id_ubigeo', 'direccion']);
  });

  it('keeps the W1 error text', () => {
    const err = (() => {
      try { createRecord(createStore(readSeed()), 'demo', 'localidades', { id_empresa: '99', descripcion: 'X'.repeat(101), id_ubigeo: '15' }); } catch (e) { return e as any; }
    })();
    expect(err.details.map((d: any) => d.message)).toEqual([
      'id_empresa does not exist',
      'descripcion must be at most 100 characters',
      'id_ubigeo must be an existing distrito',
    ]);
  });
});

describe.each(REGISTRY.entries)('R-REG-3 consistency of $slug', (entry) => {
  const serverOptional: string[] = entry.compat?.serverOptional ?? [];
  const valid = VALID[entry.slug];

  it('has a valid sample body', () => {
    expect(valid, `add a VALID body for ${entry.slug}`).toBeDefined();
    expect(rejects(entry, valid)).toEqual([]);
  });

  for (const { name } of entry.fields.filter((f: any) => f.required && !serverOptional.includes(f.name))) {
    it(`the server requires ${name}`, () => {
      expect(rejects(entry, { ...valid, [name]: '' })).toEqual([name]);
    });
  }

  it.each(serverOptional)('the server accepts a blank %s (exempt only as serverOptional)', (name) => {
    expect(rejects(entry, { ...valid, [name]: '' })).toEqual([]);
  });

  for (const { name, max } of entry.fields.filter((f: any) => f.kind === 'text' && f.max)) {
    it(`the server enforces max length of ${name}`, () => {
      expect(rejects(entry, { ...valid, [name]: 'X'.repeat(max + 1) })).toEqual([name]);
      expect(rejects(entry, { ...valid, [name]: 'X'.repeat(max) })).toEqual([]);
    });
  }

  it('matches the UI config', () => {
    expect(uiDrift(entry, localidadConfig)).toEqual([]);
  });
});

describe('S-REG-2 drift detection', () => {
  it('names the catalog and field when the registry max differs from the UI', () => {
    const drifted = {
      ...localidades,
      fields: localidades.fields.map((f: any) => (f.name === 'descripcion' ? { ...f, max: 99 } : f)),
    } as unknown as Entry;
    expect(uiDrift(drifted, localidadConfig)).toEqual(['localidades.descripcion: max 99 != UI maxLength 100']);
  });
});
