import { describe, expect, it } from 'vitest';
import { RegistryError, validateRegistry } from './schema.js';

/** `project` (R-REG-2, D3): a tenant section derived from a seed section already loaded, so it is never copied to a file of its own. */
const entry = (over: Record<string, unknown> = {}) => ({
  slug: 'gente', idKey: 'id_usuario', codeWidth: 0, entity: 'un Usuario', scope: 'tenant', seed: null, readOnly: true, project: 'users', messages: { style: 'M1' },
  fields: [{ name: 'id_usuario', kind: 'code', label: 'Código' }, { name: 'nombre', kind: 'text', label: 'Nombre', max: 50 }], columns: [{ key: 'nombre', header: 'Nombre' }], ...over,
});
const failure = (over: Record<string, unknown>) => {
  try { validateRegistry([entry(over)]); } catch (e) { return e instanceof RegistryError ? e.message : String(e); }
  return undefined;
};

describe('project is validated at load (R-REG-4)', () => {
  it('accepts a known projection on a readOnly tenant entry with no seed file', () => {
    expect(validateRegistry([entry()]).entries[0].project).toBe('users');
  });

  it('rejects an unknown projection, naming it', () => {
    expect(failure({ project: 'clientes' })).toMatch(/unknown projection "clientes"/);
  });

  it('rejects a projection that also has a seed file: one source only', () => {
    expect(failure({ seed: 'gente' })).toMatch(/project needs seed null/);
  });

  it('rejects a writable or non-tenant projection: it is a read-only view', () => {
    expect(failure({ readOnly: undefined })).toMatch(/project needs readOnly/);
    expect(failure({ scope: 'shared' })).toMatch(/project needs scope tenant/);
  });
});
