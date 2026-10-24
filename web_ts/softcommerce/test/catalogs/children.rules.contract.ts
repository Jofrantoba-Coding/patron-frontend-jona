import { describe, expect, it } from 'vitest';
import { ApiError } from '../../src/services/ApiError';
import type { ChildServices } from './children.contract';

/** The services of one source acting in the given tenant (`a` has every company gate on, `b` has them off). */
export type RulesSource = (tenantId?: string) => ChildServices;

const failure = async (promise: Promise<unknown>): Promise<ApiError> => {
  try { await promise; } catch (e) { return e as ApiError; }
  throw new Error('expected the call to fail');
};
const shape = (e: ApiError) => [e.status, e.code, e.details.map((d) => [d.field, d.message])];

/**
 * S-MOCK-35 for the W3-4b cases (removal kinds, unique among active siblings, cascade, store children, gates): the same steps run against both sources
 * and must give the same status, code, details and rows.
 */
export function describeChildRulesContract(label: string, make: RulesSource): void {
  describe(`W3-4b child rules contract: ${label}`, () => {
    it('S-MOCK-41 removal kinds: deactivate keeps the row listed with estado D, delete removes it, none has no delete', async () => {
      const { children } = make();
      await children('items').remove('001', 'almacenes', '1');
      expect((await children('items').list('001', 'almacenes')).items.map((r) => [r.id, r.estado])).toEqual([['1', 'D'], ['2', 'D'], ['3', 'A']]);
      await children('vendedores').remove('001', 'notas', '1');
      expect((await children('vendedores').list('001', 'notas')).items).toEqual([]);
      expect(shape(await failure(children('vendedores').remove('001', 'activaciones', '1')))).toEqual([405, 'MODE_NOT_SUPPORTED', []]);
    });

    it('R-MOCK-21 a body estado never reactivates a deactivated row', async () => {
      const { children } = make();
      expect(await children('items').update('001', 'almacenes', '2', { almacen: 'B2', estado: 'A' })).toMatchObject({ almacen: 'B2', estado: 'D' });
    });

    it('S-MOCK-43 child unique: an active pair is a 409 with the literal message, a deactivated one is not, a PUT keeping its values is 200', async () => {
      const { children } = make();
      expect(shape(await failure(children('items').create('001', 'almacenes', { almacen: 'A', proceso: 'VENTA' })))).toEqual([409, 'DUPLICATE', [['almacen', 'Almacen ya se Encuentra Activado']]]);
      expect(await children('items').create('001', 'almacenes', { almacen: 'B', proceso: 'VENTA' })).toMatchObject({ estado: 'A' });
      expect(await children('items').update('001', 'almacenes', '1', { almacen: 'A', proceso: 'VENTA' })).toMatchObject({ id: '1' });
    });

    it('S-MD-9 server half: a composite duplicate is <child>[<n>].<field> in the sent array', async () => {
      const { catalog } = make();
      const body = { children: { almacenes: [{ op: 'I', almacen: 'Z', proceso: 'VENTA' }, { op: 'I', almacen: 'A', proceso: 'VENTA' }] } };
      expect(shape(await failure(catalog('items').update('001', body)))).toEqual([409, 'DUPLICATE', [['almacenes[1].almacen', 'Almacen ya se Encuentra Activado']]]);
    });

    it('S-MOCK-44 cascade: deleting the parent is not blocked and its nested routes then answer 404', async () => {
      const { catalog, children } = make();
      await catalog('vendedores').remove('001');
      expect(shape(await failure(children('vendedores').list('001', 'activaciones')))).toEqual([404, 'NOT_FOUND', []]);
      expect((await catalog('vendedores').list()).items.map((r) => r.id_vendedores)).toEqual(['002']);
    });

    it('S-REG-30 store child: the nested list is the owner rows by key, and a write through either route shows in the other', async () => {
      const { catalog, children } = make();
      expect((await children('transportistas').list('001', 'vehiculos')).items.map((r) => r.id_vehiculos)).toEqual(['001', '003']);
      expect(await children('transportistas').create('002', 'vehiculos', { placa: 'NEW444' })).toMatchObject({ id_vehiculos: '004', id_transportistas: '002' });
      expect((await catalog('vehiculos').list()).items.map((r) => r.id_vehiculos)).toContain('004');
      await catalog('vehiculos').create({ placa: 'OWN777', id_transportistas: '002' });
      expect((await children('transportistas').list('002', 'vehiculos')).items.map((r) => r.placa)).toEqual(['BBB222', 'NEW444', 'OWN777']);
    });

    it('S-REG-25 server half: a gated-off child answers 404 and ignores its composite body; with the parameter on it works', async () => {
      const off = make('b');
      expect(shape(await failure(off.children('clientes').create('001', 'sustitutos', { nombre: 'X' })))).toEqual([404, 'NOT_FOUND', []]);
      await off.catalog('clientes').update('001', { nombre: 'ACME 2', children: { sustitutos: [{ op: 'I', nombre: '' }] } });
      const on = make('a');
      expect(await on.children('clientes').create('001', 'sustitutos', { nombre: 'S1' })).toMatchObject({ nombre: 'S1', estado: 'A' });
      expect((await on.children('clientes').list('001', 'sustitutos')).items.map((r) => r.nombre)).toEqual(['S1']);
    });

    it('R-REG-17 a gate with `in` follows the value of the flag: open while ISBOTICA is false, 404 when it is true', async () => {
      expect((await make('a').children('clientes').list('001', 'avisos')).items).toEqual([]);
      expect(shape(await failure(make('b').children('clientes').list('001', 'avisos')))).toEqual([404, 'NOT_FOUND', []]);
    });
  });
}
