import { describe, expect, it } from 'vitest';
import { validateRegistry } from './schema.js';

/**
 * The W1 sections (`empresas`, `puntosVenta`) keep their rows as `{ id, name, ... }`, so the Wave 2 entries that write them
 * (`empresa`, `punto-venta`, R-REG-12) both use the idKey `id` and a `section` instead of a seed file.
 */
const w1 = (slug: string, section: string, over: Record<string, any> = {}) => ({
  slug, section, idKey: 'id', codeWidth: 0, entity: 'una cosa', scope: 'tenant', seed: null, messages: { style: 'M1' },
  fields: [{ name: 'name', kind: 'text', label: 'Nombre', required: true, max: 20 }], columns: [{ key: 'name', header: 'Nombre' }], ...over,
});
const seeded = (slug: string, over: Record<string, any> = {}) => w1(slug, slug, { seed: slug, ...over });

describe('R-REG-4 duplicate idKey', () => {
  it('two entries over W1 sections may share the W1 idKey `id`', () => {
    expect(() => validateRegistry([w1('empresa', 'empresas'), w1('punto-venta', 'puntosVenta')])).not.toThrow();
  });

  it('two seeded entries still may not', () => {
    expect(() => validateRegistry([seeded('uno'), seeded('dos')])).toThrow(/duplicate idKey "id"/);
  });

  it('a seeded entry may not take the idKey of a W1-section entry', () => {
    expect(() => validateRegistry([w1('empresa', 'empresas'), seeded('dos')])).toThrow(/duplicate idKey "id"/);
  });
});
