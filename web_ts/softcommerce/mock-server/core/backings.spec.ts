import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { loadSeed } from '../http/loadSeed.js';
import { BACKINGS } from '../registry/backings.js';
import { validateRegistry } from '../registry/schema.js';
import { createRecord, deleteRecord, getRecord, listCatalog, updateRecord } from './catalog.js';
import type { MockError } from './errors.js';
import { lookupOptions } from './lookups.js';
import { hashPassword } from './password.js';
import { createStore } from './store.js';

/** The `users` backing (D15, R-REG-18): the Usuario master reads and writes the SAME records the login reads, filtered by tenant, with no copy. */
const dataDir = fileURLToPath(new URL('../data', import.meta.url));
const store = () => createStore(loadSeed(dataDir));
const caught = (fn: () => unknown): MockError => {
  try { fn(); } catch (e) { return e as MockError; }
  throw new Error('expected function to throw');
};
const body = (over: Record<string, unknown> = {}) => ({ id_trabajador: '001', usuario: 'nuevo', clave: 'secreto1', clave_confirmacion: 'secreto1', ...over });
const SECRETS = /clave|secreto|tenants|admin123/;

describe('the closed set and the entry attribute', () => {
  it('knows the users backing only', () => {
    expect(Object.keys(BACKINGS)).toEqual(['users']);
  });

  it('rejects an unknown backing, and a backing that also has a seed or is a projection', () => {
    const base = { slug: 'x', idKey: 'id_x', codeWidth: 0, entity: 'un x', scope: 'tenant', messages: { style: 'M1' }, fields: [{ name: 'id_x', kind: 'code', label: 'C' }], columns: [{ key: 'id_x', header: 'C' }] };
    expect(() => validateRegistry([{ ...base, seed: null, backing: 'nope' }])).toThrow(/unknown backing "nope"/);
    expect(() => validateRegistry([{ ...base, seed: 'x', backing: 'users' }])).toThrow(/backing needs seed null/);
    expect(() => validateRegistry([{ ...base, seed: null, backing: 'users', project: 'users', readOnly: true }])).toThrow(/backing and project exclude each other/);
  });
});

describe('the store of users (S-AUTH-27: the W1 seed keeps working)', () => {
  it('hashes the seed passwords at load: no plaintext in the store, the seed itself untouched', () => {
    const seed = loadSeed(dataDir);
    const s = createStore(seed);
    const admin = s.shared.users.find((u: any) => u.usuario === 'admin');
    expect(admin.clave_hash).toBe(hashPassword('1', 'admin123'));
    expect(JSON.stringify(s.shared.users)).not.toMatch(/admin123|cajero123|"clave"/);
    expect(seed.users[0].clave).toBe('admin123');
  });

  it('keeps the rows in shared.users with a text id, and lists them per tenant', () => {
    const s = store();
    expect(s.shared.users.map((u: any) => u.id_usuario)).toEqual(['1', '2', '3', '4']);
    expect(listCatalog(s, 'demo', 'usuarios').items.map((r: any) => r.usuario)).toEqual(['admin', 'cajero', 'bloqueado', 'soloweb']);
    expect(listCatalog(s, 'botica', 'usuarios').items.map((r: any) => r.usuario)).toEqual(['admin']);
  });
});

describe('create, read and write through the master', () => {
  it('gives the next integer id across every tenant and the session tenant to the new user', () => {
    const s = store();
    const first = createRecord(s, 'demo', 'usuarios', body());
    const second = createRecord(s, 'demo', 'usuarios', body({ usuario: 'otro' }));
    expect([first.id_usuario, second.id_usuario]).toEqual(['5', '6']);
    const stored = s.shared.users.find((u: any) => u.id_usuario === '5');
    expect(stored.tenants).toEqual(['demo']);
    expect(listCatalog(s, 'botica', 'usuarios').items.map((r: any) => r.usuario)).toEqual(['admin']);
    expect(() => getRecord(s, 'botica', 'usuarios', '5')).toThrow(/not found/);
  });

  it('stores only the salted hash and the flags OFF by default (R-MST-7)', () => {
    const s = store();
    createRecord(s, 'demo', 'usuarios', body());
    const stored = s.shared.users.find((u: any) => u.id_usuario === '5');
    expect(stored.clave_hash).toBe(hashPassword('5', 'secreto1'));
    expect([stored.flaghabilitado, stored.flagEscritorio, stored.flagWeb, stored.flagContable]).toEqual(['D', 'N', 'N', 'N']);
    expect(JSON.stringify(stored)).not.toMatch(/secreto1|"clave"|clave_confirmacion/);
  });

  it('ticked flags are stored as A and S; the stored row keeps no boolean alias', () => {
    const s = store();
    createRecord(s, 'demo', 'usuarios', body({ habilitado: true, escritorio: true, web: true, contable: true }));
    const stored = s.shared.users.find((u: any) => u.id_usuario === '5');
    expect([stored.flaghabilitado, stored.flagEscritorio, stored.flagWeb, stored.flagContable]).toEqual(['A', 'S', 'S', 'S']);
    expect(Object.keys(stored)).not.toEqual(expect.arrayContaining(['habilitado']));
  });

  it('derives nombre from the trabajador, ignoring a nombre in the body (S-MST-16)', () => {
    const s = store();
    const created = createRecord(s, 'demo', 'usuarios', body({ nombre: 'IMPOSTOR' }));
    expect(created.nombre).toBe('JUAN PEREZ LOPEZ');
    expect(lookupOptions(s, 'demo', 'usuarios').items).toContainEqual({ id: '5', name: 'JUAN PEREZ LOPEZ' });
  });

  it('an update keeps the flags, the password and the nombre a partial body leaves out, and recomputes nombre when the trabajador changes', () => {
    const s = store();
    const created = createRecord(s, 'demo', 'usuarios', body({ habilitado: true, escritorio: true }));
    const hash = s.shared.users.find((u: any) => u.id_usuario === created.id_usuario).clave_hash;
    updateRecord(s, 'demo', 'usuarios', created.id_usuario, { usuario: 'renombrado' });
    const stored = s.shared.users.find((u: any) => u.id_usuario === created.id_usuario);
    expect([stored.usuario, stored.flaghabilitado, stored.flagEscritorio, stored.clave_hash]).toEqual(['renombrado', 'A', 'S', hash]);
    expect(updateRecord(s, 'demo', 'usuarios', created.id_usuario, { id_trabajador: '002' }).nombre).toBe('MARIA GARCIA RAMOS');
  });

  it('a seeded user can be edited without losing what it already holds', () => {
    const s = store();
    updateRecord(s, 'demo', 'usuarios', '2', { id_trabajador: '001', usuario: 'cajero' });
    const stored = s.shared.users.find((u: any) => u.id_usuario === '2');
    expect([stored.flaghabilitado, stored.flagEscritorio, stored.clave_hash, stored.tenants]).toEqual(['A', 'S', hashPassword('2', 'cajero123'), ['demo']]);
  });

  it('a logical delete keeps the record out of the list and the lookup', () => {
    const s = store();
    deleteRecord(s, 'demo', 'usuarios', '2');
    expect(listCatalog(s, 'demo', 'usuarios').items.map((r: any) => r.id_usuario)).toEqual(['1', '3', '4']);
    expect(lookupOptions(s, 'demo', 'usuarios').items.map((o: any) => o.id)).toEqual(['1', '3', '4']);
    expect(s.shared.users.find((u: any) => u.id_usuario === '2').activo).toBe(false);
  });
});

describe('S-MOCK-55 writes and errors', () => {
  it.each([['unknown', '999'], ['retired', '004'], ['deactivated', '003']])('a %s trabajador is a 422 on id_trabajador', (_name, id) => {
    const error = caught(() => createRecord(store(), 'demo', 'usuarios', body({ id_trabajador: id })));
    expect([error.status, error.details.map((d) => d.field)]).toEqual([422, ['id_trabajador']]);
  });

  it('a duplicate usuario in the tenant is a 409 on usuario with the new text', () => {
    const s = store();
    createRecord(s, 'demo', 'usuarios', body());
    const error = caught(() => createRecord(s, 'demo', 'usuarios', body()));
    expect([error.status, error.details.map((d) => [d.field, d.message])]).toEqual([409, [['usuario', 'El nombre de usuario ya existe.']]]);
  });

  it('a deleted user frees its name', () => {
    const s = store();
    deleteRecord(s, 'demo', 'usuarios', '2');
    expect(createRecord(s, 'demo', 'usuarios', body({ usuario: 'cajero' })).usuario).toBe('cajero');
  });

  it('no read and no error carries the password, its confirmation, its hash or the tenants', () => {
    const s = store();
    const created = createRecord(s, 'demo', 'usuarios', body());
    const reads = [created, getRecord(s, 'demo', 'usuarios', '1'), listCatalog(s, 'demo', 'usuarios'), lookupOptions(s, 'demo', 'usuarios'), updateRecord(s, 'demo', 'usuarios', '5', { clave: 'otra-clave', clave_confirmacion: 'otra-clave' })];
    for (const read of reads) expect(JSON.stringify(read)).not.toMatch(SECRETS);
    const errors = [
      caught(() => createRecord(s, 'demo', 'usuarios', body())),
      caught(() => createRecord(s, 'demo', 'usuarios', body({ usuario: 'z', clave: 'x'.repeat(21), clave_confirmacion: 'x'.repeat(21) }))),
      caught(() => createRecord(s, 'demo', 'usuarios', body({ usuario: 'z', clave_confirmacion: 'distinta-xyz' }))),
      caught(() => createRecord(s, 'demo', 'usuarios', body({ id_trabajador: '999' }))),
    ];
    for (const error of errors) expect(JSON.stringify([error.message, error.details])).not.toMatch(/secreto|distinta|xxxxxxxx|clave_hash|tenants/);
  });
});
