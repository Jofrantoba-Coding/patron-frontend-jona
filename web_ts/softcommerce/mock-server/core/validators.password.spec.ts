import { describe, expect, it } from 'vitest';
import { createRecord, getRecord, listCatalog, updateRecord } from './catalog.js';
import type { MockError } from './errors.js';
import { hashPassword } from './password.js';
import { createStore } from './store.js';
import { tinySeed } from './test-helpers.js';
import { validateRegistry } from '../registry/schema.js';

/** The `password` kind (R-REG-13, R-CRUD-17, R-MOCK-23, D16) over a test-only entry: the core owns the rules, `usuarios` only declares the field. */
const cuentas = (over: Record<string, any> = {}) => ({
  slug: 'cuentas', idKey: 'id_cuenta', codeWidth: 0, entity: 'una cuenta', scope: 'tenant', seed: 'cuentas', messages: { style: 'M1' },
  fields: [
    { name: 'id_cuenta', kind: 'code', label: 'Codigo' },
    { name: 'usuario', kind: 'text', label: 'Usuario', max: 20 },
    { name: 'clave', kind: 'password', label: 'Contraseña', msgLabel: 'su clave', max: 20, ...over },
  ],
  columns: [{ key: 'usuario', header: 'U' }],
});
const store = (over: Record<string, any> = {}) => createStore({ ...tinySeed(), cuentas: { a: [] } }, validateRegistry([cuentas(over)]));
const caught = (fn: () => unknown): MockError => {
  try { fn(); } catch (e) { return e as MockError; }
  throw new Error('expected function to throw');
};
const failure = (error: MockError) => [error.status, error.details.map((d) => [d.field, d.code])];
const pair = (clave: string, confirmacion = clave) => ({ usuario: 'x', clave, clave_confirmacion: confirmacion });

describe('S-REG-24 the password kind at load', () => {
  it('keeps its max and defaults confirm to true', () => {
    expect(validateRegistry([cuentas()]).bySlug.get('cuentas').fields.find((f: any) => f.name === 'clave')).toMatchObject({ kind: 'password', max: 20, confirm: true });
  });

  it('throws naming the field when max is missing', () => {
    expect(() => validateRegistry([cuentas({ max: undefined })])).toThrow(/field "clave": password needs a max/);
  });

  it.each([0, -3, 1.5, '20'])('rejects max %s', (max) => {
    expect(() => validateRegistry([cuentas({ max })])).toThrow(/field "clave": password needs a max/);
  });

  it('rejects a confirm that is not a boolean, and confirm on another kind', () => {
    expect(() => validateRegistry([cuentas({ confirm: 'no' })])).toThrow(/field "clave": confirm must be a boolean/);
    const entry: any = cuentas();
    entry.fields[1] = { ...entry.fields[1], confirm: true };
    expect(() => validateRegistry([entry])).toThrow(/field "usuario": confirm needs a password field/);
  });
});

describe('R-CRUD-17 server rules of a password', () => {
  it('is required on create: a missing or empty value is a 422 REQUIRED on the field with the desktop sentence', () => {
    for (const body of [{ usuario: 'x' }, { usuario: 'x', clave: '', clave_confirmacion: '' }]) {
      const error = caught(() => createRecord(store(), 'a', 'cuentas', body));
      expect(failure(error)).toEqual([422, [['clave', 'REQUIRED']]]);
      expect(error.details[0].message).toBe('Para agregar una cuenta, debes especificar su clave.');
    }
  });

  it('accepts 20 characters and rejects 21 with a 422 MAX_LENGTH on the field', () => {
    const s = store();
    expect(createRecord(s, 'a', 'cuentas', pair('a'.repeat(20)))).toBeTruthy();
    expect(failure(caught(() => createRecord(s, 'a', 'cuentas', pair('a'.repeat(21)))))).toEqual([422, [['clave', 'MAX_LENGTH']]]);
  });

  it('a different or missing confirmation is a 422 on <name>_confirmacion with the configured message', () => {
    for (const body of [pair('abc', 'abd'), { usuario: 'x', clave: 'abc' }]) {
      const error = caught(() => createRecord(store(), 'a', 'cuentas', body));
      expect(failure(error)).toEqual([422, [['clave_confirmacion', 'MISMATCH']]]);
      expect(error.details[0].message).toBe('La confirmación de la contraseña no coincide.');
    }
  });

  it('confirm: false drops the equality check and the confirmation key', () => {
    expect(createRecord(store({ confirm: false }), 'a', 'cuentas', { usuario: 'x', clave: 'abc' })).toBeTruthy();
  });

  it('a failure never carries the value, in the message or the details', () => {
    const error = caught(() => createRecord(store(), 'a', 'cuentas', pair('secreto-largo-de-mas-1', 'otro-valor-secreto')));
    expect(JSON.stringify([error.message, error.details])).not.toMatch(/secreto|otro-valor/);
  });
});

describe('D16 the stored shape and the responses', () => {
  it('stores only clave_hash, salted with the id, and never the plaintext or the confirmation', () => {
    const s = store();
    const created = createRecord(s, 'a', 'cuentas', pair('secreto1'));
    const [row] = s.data('a').cuentas;
    expect(row.clave_hash).toBe(hashPassword(created.id_cuenta, 'secreto1'));
    expect(JSON.stringify(row)).not.toContain('secreto1');
    expect(row).not.toHaveProperty('clave');
    expect(row).not.toHaveProperty('clave_confirmacion');
  });

  it('no response (create, update, get, list) holds the password, the confirmation or the hash', () => {
    const s = store();
    const created = createRecord(s, 'a', 'cuentas', pair('secreto1'));
    const responses = [created, updateRecord(s, 'a', 'cuentas', created.id_cuenta, pair('otra-clave')), getRecord(s, 'a', 'cuentas', created.id_cuenta), listCatalog(s, 'a', 'cuentas')];
    for (const response of responses) expect(JSON.stringify(response)).not.toMatch(/clave|secreto1|otra-clave/);
  });

  it('on update a blank or missing password keeps the stored hash', () => {
    const s = store();
    const created = createRecord(s, 'a', 'cuentas', pair('secreto1'));
    const before = s.data('a').cuentas[0].clave_hash;
    updateRecord(s, 'a', 'cuentas', created.id_cuenta, { usuario: 'y' });
    updateRecord(s, 'a', 'cuentas', created.id_cuenta, { usuario: 'z', clave: '', clave_confirmacion: '' });
    expect([s.data('a').cuentas[0].clave_hash, s.data('a').cuentas[0].usuario]).toEqual([before, 'z']);
  });

  it('on update a typed pair replaces the hash; a blank password with a typed confirmation is a 422', () => {
    const s = store();
    const created = createRecord(s, 'a', 'cuentas', pair('secreto1'));
    updateRecord(s, 'a', 'cuentas', created.id_cuenta, pair('nueva-clave'));
    expect(s.data('a').cuentas[0].clave_hash).toBe(hashPassword(created.id_cuenta, 'nueva-clave'));
    const error = caught(() => updateRecord(s, 'a', 'cuentas', created.id_cuenta, { clave: '', clave_confirmacion: 'x' }));
    expect(failure(error)).toEqual([422, [['clave_confirmacion', 'MISMATCH']]]);
    expect(s.data('a').cuentas[0].clave_hash).toBe(hashPassword(created.id_cuenta, 'nueva-clave'));
  });

  it('a failed update leaves the stored hash untouched (21 characters)', () => {
    const s = store();
    const created = createRecord(s, 'a', 'cuentas', pair('secreto1'));
    expect(failure(caught(() => updateRecord(s, 'a', 'cuentas', created.id_cuenta, pair('b'.repeat(21)))))).toEqual([422, [['clave', 'MAX_LENGTH']]]);
    expect(s.data('a').cuentas[0].clave_hash).toBe(hashPassword(created.id_cuenta, 'secreto1'));
  });
});
