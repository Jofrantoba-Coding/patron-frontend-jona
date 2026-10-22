import { describe, expect, it, vi } from 'vitest';
import { createDependentChain, fieldsToClear, type ChainNode, type ChainOption } from './dependentChain';

/** A loader whose every call stays pending until the test settles it. */
function deferredLoader() {
  const calls: { name: string; filters: Record<string, string>; resolve: (items: ChainOption[]) => void; reject: () => void }[] = [];
  const load = vi.fn(
    (name: string, filters: Record<string, string>) =>
      new Promise<ChainOption[]>((resolve, reject) => {
        calls.push({ name, filters, resolve, reject: () => reject(new Error('boom')) });
      }),
  );
  return { load, calls };
}
const items = (...ids: string[]): ChainOption[] => ids.map((id) => ({ id, name: `N${id}` }));
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

const ABC: ChainNode[] = [
  { name: 'a', parents: [] },
  { name: 'b', parents: [{ field: 'a', filterKey: 'a' }] },
  { name: 'c', parents: [{ field: 'b', filterKey: 'b' }] },
];

describe('S-CRUD-31 a chain A -> B -> C resets and reloads', () => {
  it('loads the top level, keeps the rest blocked until their parent is chosen', async () => {
    const { load, calls } = deferredLoader();
    const chain = createDependentChain(ABC, load, () => undefined);
    chain.sync({});
    expect(calls.map((c) => c.name)).toEqual(['a']);
    expect([chain.blocked('a', {}), chain.blocked('b', {}), chain.blocked('c', {})]).toEqual([false, true, true]);
    calls[0].resolve(items('1', '2'));
    await flush();
    expect(chain.options('a')).toEqual(items('1', '2'));
    expect(chain.options('b')).toEqual([]);
  });

  it('a parent change reloads the next level with its filterKey and empties the one below', async () => {
    const { load, calls } = deferredLoader();
    const chain = createDependentChain(ABC, load, () => undefined);
    chain.sync({ a: '1' });
    chain.sync({ a: '1', b: '2' });
    expect(calls.map((c) => [c.name, c.filters])).toEqual([['a', {}], ['b', { a: '1' }], ['c', { b: '2' }]]);
    calls[2].resolve(items('7'));
    await flush();
    chain.sync({ a: '9', b: '', c: '' });
    expect(calls[3]).toMatchObject({ name: 'b', filters: { a: '9' } });
    expect(chain.options('c')).toEqual([]);
    expect(chain.blocked('c', { a: '9', b: '' })).toBe(true);
  });

  it('does not reload a level whose parents did not change', () => {
    const { load } = deferredLoader();
    const chain = createDependentChain(ABC, load, () => undefined);
    chain.sync({ a: '1' });
    chain.sync({ a: '1' });
    expect(load).toHaveBeenCalledTimes(2);
  });

  it('fieldsToClear lists every level below the changed one', () => {
    expect(fieldsToClear(ABC, 'a')).toEqual(['b', 'c']);
    expect(fieldsToClear(ABC, 'b')).toEqual(['c']);
    expect(fieldsToClear(ABC, 'c')).toEqual([]);
  });
});

describe('S-CRUD-32 restore and stale responses', () => {
  it('loads every level at once when the form opens with a saved record', () => {
    const { load, calls } = deferredLoader();
    createDependentChain(ABC, load, () => undefined).sync({ a: '1', b: '2', c: '3' });
    expect(calls.map((c) => [c.name, c.filters])).toEqual([['a', {}], ['b', { a: '1' }], ['c', { b: '2' }]]);
  });

  it('applies only the response of the latest request of a level', async () => {
    const { load, calls } = deferredLoader();
    const chain = createDependentChain(ABC, load, () => undefined);
    chain.sync({ a: '1' });
    chain.sync({ a: '2' });
    calls[2].resolve(items('20'));
    calls[1].resolve(items('10'));
    await flush();
    expect(chain.options('b')).toEqual(items('20'));
  });

  it('a response that arrives after its parent was cleared is dropped', async () => {
    const { load, calls } = deferredLoader();
    const chain = createDependentChain(ABC, load, () => undefined);
    chain.sync({ a: '1' });
    chain.sync({ a: '' });
    calls[1].resolve(items('10'));
    await flush();
    expect(chain.options('b')).toEqual([]);
  });

  it('marks a failed level, offers a retry and recovers', async () => {
    const { load, calls } = deferredLoader();
    const chain = createDependentChain(ABC, load, () => undefined);
    chain.sync({ a: '1' });
    calls[1].reject();
    await flush();
    expect(chain.failed('b')).toBe(true);
    chain.retry('b', { a: '1' });
    expect(chain.failed('b')).toBe(false);
    calls[2].resolve(items('3'));
    await flush();
    expect(chain.options('b')).toEqual(items('3'));
  });

  it('tells its owner when something changed', async () => {
    const { load, calls } = deferredLoader();
    const changed = vi.fn();
    createDependentChain(ABC, load, changed).sync({});
    calls[0].resolve(items('1'));
    await flush();
    expect(changed).toHaveBeenCalled();
  });
});

describe('S-CRUD-40 several parents', () => {
  const MULTI: ChainNode[] = [
    { name: 'id_tipo_doc', parents: [{ field: 'id_punto_venta', filterKey: 'id_punto_venta' }] },
    {
      name: 'id_correlativo',
      parents: [{ field: 'id_punto_venta', filterKey: 'id_punto_venta' }, { field: 'id_tipo_doc', filterKey: 'id_tipo_doc' }],
    },
  ];

  it('stays blocked until every parent is set', () => {
    const { load } = deferredLoader();
    const chain = createDependentChain(MULTI, load, () => undefined);
    expect(chain.blocked('id_correlativo', { id_punto_venta: '1' })).toBe(true);
    chain.sync({ id_punto_venta: '1' });
    expect(load).toHaveBeenCalledTimes(1);
    expect(chain.blocked('id_correlativo', { id_punto_venta: '1', id_tipo_doc: '03' })).toBe(false);
  });

  it('loads with both filterKeys, and either parent change reloads it', () => {
    const { load, calls } = deferredLoader();
    const chain = createDependentChain(MULTI, load, () => undefined);
    chain.sync({ id_punto_venta: '1', id_tipo_doc: '03' });
    chain.sync({ id_punto_venta: '2', id_tipo_doc: '03' });
    chain.sync({ id_punto_venta: '2', id_tipo_doc: '01' });
    expect(calls.filter((c) => c.name === 'id_correlativo').map((c) => c.filters)).toEqual([
      { id_punto_venta: '1', id_tipo_doc: '03' },
      { id_punto_venta: '2', id_tipo_doc: '03' },
      { id_punto_venta: '2', id_tipo_doc: '01' },
    ]);
  });

  it('either parent clears the select, once, even when it is below both', () => {
    expect(fieldsToClear(MULTI, 'id_punto_venta')).toEqual(['id_tipo_doc', 'id_correlativo']);
    expect(fieldsToClear(MULTI, 'id_tipo_doc')).toEqual(['id_correlativo']);
  });

  it('ignores the stale response of a superseded parent pair', async () => {
    const { load, calls } = deferredLoader();
    const chain = createDependentChain(MULTI, load, () => undefined);
    chain.sync({ id_punto_venta: '1', id_tipo_doc: '03' });
    chain.sync({ id_punto_venta: '2', id_tipo_doc: '03' });
    // calls: tipo_doc and correlativo for the first pair, then both again for the second.
    calls[3].resolve(items('NEW'));
    calls[1].resolve(items('OLD'));
    await flush();
    expect(chain.options('id_correlativo')).toEqual(items('NEW'));
  });
});

describe('clearsOnChange for fields that are not selects', () => {
  it('lists them with the levels below', () => {
    const nodes: ChainNode[] = [{ name: 'tipo', parents: [], clearsOnChange: ['serie', 'nro'] }, { name: 'sub', parents: [{ field: 'tipo', filterKey: 'tipo' }], clearsOnChange: ['nro'] }];
    expect(fieldsToClear(nodes, 'tipo')).toEqual(['serie', 'nro', 'sub']);
  });
});
