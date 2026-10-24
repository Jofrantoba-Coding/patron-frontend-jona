import { describe, expect, it } from 'vitest';
import { ApiError } from '../../src/services/ApiError';
import type { InterCatalogService } from '../../src/services/InterCatalogService';
import type { InterChildService } from '../../src/services/InterChildService';

/** The services of one source (in-browser mock or HTTP mock) over the children fixture, acting in tenant `a` with the given empresa. */
export type ChildServices = { catalog: (slug: string) => InterCatalogService<Record<string, any>>; children: (slug: string) => InterChildService };
export type ChildSource = (empresaId?: string) => ChildServices;

const failure = async (promise: Promise<unknown>): Promise<ApiError> => {
  try { await promise; } catch (e) { return e as ApiError; }
  throw new Error('expected the call to fail');
};
const shape = (e: ApiError) => [e.status, e.code, e.details.map((d) => d.field)];

/**
 * S-MOCK-35 for the W3-4a cases (nested routes, composite write, indexed details): the same steps run against both sources and must give the same status,
 * code, details and rows. `make()` gives services over a store in its seed state (a new mock, or the test server, which resets after each test).
 */
export function describeChildrenContract(label: string, make: ChildSource): void {
  describe(`W3-4a children contract: ${label}`, () => {
    it('S-MOCK-39 lists active and deactivated rows, not deleted ones; get resolves a deactivated one', async () => {
      const { children } = make();
      const list = await children('clientes').list('001', 'direcciones');
      expect(list.items.map((r) => [r.id, r.estado])).toEqual([['1', 'A'], ['2', 'D']]);
      expect(list.pagination).toEqual({ page: 1, pageSize: 20, total: 2 });
      expect(await children('clientes').get('001', 'direcciones', '2')).toMatchObject({ estado: 'D' });
    });

    it('S-MOCK-40 creates a child and answers 404 for every unreachable parent', async () => {
      const { children } = make();
      expect(await children('clientes').create('002', 'contactos', { nombre: 'ROSA' })).toMatchObject({ id_clientes: '002', estado: 'A' });
      expect((await children('clientes').list('002', 'contactos')).items.map((r) => r.nombre)).toEqual(['ROSA']);
      for (const [parent, child] of [['999', 'contactos'], ['001', 'nada'], ['001', 'actions'], ['003', 'contactos']]) {
        expect(shape(await failure(children('clientes').list(parent, child)))).toEqual([404, 'NOT_FOUND', []]);
      }
      expect(shape(await failure(make('1').children('cuentas').list('002', 'contactos')))).toEqual([404, 'NOT_FOUND', []]);
    });

    it('validates a child write like a parent write and follows the removal kind on remove', async () => {
      const { children } = make();
      expect(shape(await failure(children('clientes').create('002', 'contactos', { nombre: '' })))).toEqual([422, 'VALIDATION_ERROR', ['nombre']]);
      await children('clientes').remove('001', 'direcciones', '1');
      expect(await children('clientes').get('001', 'direcciones', '1')).toMatchObject({ estado: 'D' });
      await children('clientes').remove('001', 'contactos', '1');
      expect(shape(await failure(children('clientes').get('001', 'contactos', '1')))).toEqual([404, 'NOT_FOUND', []]);
    });

    it('S-MOCK-42 / S-MOCK-57 composite: an invalid second sent op is direcciones[1].direccion and nothing is persisted', async () => {
      const { catalog, children } = make();
      const body = { nombre: 'NUEVO', children: { direcciones: [{ op: 'I', direccion: 'AV OK' }, { op: 'I', direccion: '' }] } };
      expect(shape(await failure(catalog('clientes').create(body)))).toEqual([422, 'VALIDATION_ERROR', ['direcciones[1].direccion']]);
      expect((await catalog('clientes').list()).items.map((r) => r.nombre)).toEqual(['ACME', 'BETA']);
      const update = { children: { direcciones: [{ op: 'A', id: '1', direccion: 'AV 1 B' }, { op: 'I', direccion: '' }] } };
      expect(shape(await failure(catalog('clientes').update('001', update)))).toEqual([422, 'VALIDATION_ERROR', ['direcciones[1].direccion']]);
      expect((await children('clientes').list('001', 'direcciones')).items.map((r) => r.direccion)).toEqual(['AV 1', 'AV 2']);
    });

    it('S-MOCK-42 composite: all valid answers with the parent and every child persists; ops I, A and E apply on changed rows only', async () => {
      const { catalog, children } = make();
      const created = await catalog('clientes').create({ nombre: 'NUEVO', children: { direcciones: [{ op: 'I', direccion: 'AV 9' }], contactos: [{ op: 'I', nombre: 'ROSA' }] } });
      expect(created).toMatchObject({ id_clientes: '004', nombre: 'NUEVO' });
      expect((await children('clientes').list('004', 'direcciones')).items.map((r) => r.direccion)).toEqual(['AV 9']);
      await catalog('clientes').update('001', { children: { direcciones: [{ op: 'A', id: '1', direccion: 'AV 1 B', estado: 'D' }, { op: 'I', direccion: 'AV 4' }], contactos: [{ op: 'E', id: '1' }] } });
      expect((await children('clientes').list('001', 'direcciones')).items.map((r) => [r.id, r.direccion, r.estado])).toEqual([['1', 'AV 1 B', 'D'], ['2', 'AV 2', 'D'], ['5', 'AV 4', 'A']]);
      expect((await children('clientes').list('001', 'contactos')).items).toEqual([]);
    });
  });
}
