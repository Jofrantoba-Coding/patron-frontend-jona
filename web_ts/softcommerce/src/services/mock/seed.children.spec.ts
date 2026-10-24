import { describe, expect, it } from 'vitest';
import { CHILD_REGISTRY, CHILD_SEED } from '../../../mock-server/core/children.fixture';
import { collectSeeds } from '../../../mock-server/registry/seeds.js';
import { createAppServicesMock } from './AppServicesMock';

describe('in-browser seed: child rows inside parent rows (R-REG-14)', () => {
  it('keeps the nested rows in the parent seed section the shared collector returns, then splits them in the store', async () => {
    const seeds = collectSeeds(CHILD_REGISTRY, (name) => (CHILD_SEED as any)[name]);
    expect(seeds.clientes.a[0].direcciones).toHaveLength(3);
    const mock = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'a' }), delayMs: 0, registry: CHILD_REGISTRY, seed: CHILD_SEED });
    const list = await mock.children('clientes').list('001', 'direcciones');
    expect(list.items.map((r: any) => r.direccion)).toEqual(['AV 1', 'AV 2']);
  });
});
