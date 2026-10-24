import { describe, expect, it } from 'vitest';
import { ACTION_REGISTRY, ACTION_SEED } from '../../mock-server/core/actions.fixture';
import { useTestServer } from '../../mock-server/http/test-server';
import { ApiError } from '../../src/services/ApiError';
import { createActionServiceHttp } from '../../src/services/ActionServiceHttp';
import { createChildServiceHttp } from '../../src/services/ChildServiceHttp';
import { createHttpClient } from '../../src/services/httpClient';
import type { InterActionService } from '../../src/services/InterActionService';
import type { InterChildService } from '../../src/services/InterChildService';
import { createAppServicesMock } from '../../src/services/mock/AppServicesMock';

type Services = { actions: (slug: string) => InterActionService; children: (slug: string) => InterChildService };

const failure = async (promise: Promise<unknown>): Promise<ApiError> => {
  try { await promise; } catch (e) { return e as ApiError; }
  throw new Error('expected the call to fail');
};
const shape = (e: ApiError) => [e.status, e.code, e.message, e.details.map((d) => d.field)];

/** S-MOCK-35 / R-MOCK-18 for the row actions: the same steps against the in-browser mock and the HTTP server give the same status, code, message and rows. */
function describeActionsContract(label: string, make: () => Services): void {
  describe(`W3-6 row actions contract: ${label}`, () => {
    it('S-MOCK-47 the entry form and the child row form answer the updated row, the parent and the message', async () => {
      const { actions } = make();
      expect(await actions('clientes').run({ id: '001' }, 'cerrar')).toMatchObject({ row: { id_clientes: '001', cerrado: 'S' }, message: 'Cliente Cerrado' });
      expect(await actions('clientes').run({ id: '001', child: 'activaciones', childId: '1' }, 'desactivar', { fecha_fin: '2026-04-01' })).toMatchObject({
        row: { id: '1', estado: 'D' }, parent: { id_clientes: '001' }, message: 'Cliente Desactivado',
      });
    });

    it('the collection form creates the row, which the nested list then shows', async () => {
      const { actions, children } = make();
      const out = await actions('clientes').run({ id: '002', child: 'activaciones' }, 'activar', { fecha_inicio: '2026-05-01', motivo: 'VUELVE' });
      expect(out.row).toMatchObject({ id: '2', estado: 'A', motivo: 'VUELVE' });
      expect((await children('clientes').list('002', 'activaciones')).items.map((r) => [r.id, r.estado])).toEqual([['1', 'D'], ['2', 'A']]);
    });

    it('S-MOCK-48 / S-MOCK-49 a refused action is a 409 ACTION_NOT_ALLOWED, invalid input a 422, and neither changes the rows', async () => {
      const { actions, children } = make();
      expect(shape(await failure(actions('clientes').run({ id: '001', child: 'activaciones' }, 'activar', { fecha_inicio: '2026-05-01' })))).toEqual([409, 'ACTION_NOT_ALLOWED', 'Cliente ya Esta Activado', []]);
      expect(shape(await failure(actions('clientes').run({ id: '001', child: 'activaciones', childId: '1' }, 'desactivar', { fecha_fin: '2026-03-09' })))).toEqual([422, 'VALIDATION_ERROR', 'Validation failed', ['fecha_fin']]);
      expect((await children('clientes').list('001', 'activaciones')).items.map((r) => [r.id, r.estado])).toEqual([['1', 'A']]);
    });

    it('answers 404 for an unknown action, parent, child or row, and 501 for an action nobody implements', async () => {
      const { actions } = make();
      for (const [target, action] of [[{ id: '001' }, 'nada'], [{ id: '999' }, 'cerrar'], [{ id: '001', child: 'nada' }, 'activar'], [{ id: '001', child: 'activaciones', childId: '9' }, 'desactivar']] as const) {
        expect(shape(await failure(actions('clientes').run(target, action))).slice(0, 2)).toEqual([404, 'NOT_FOUND']);
      }
      expect(shape(await failure(actions('clientes').run({ id: '001', child: 'activaciones' }, 'avisar'))).slice(0, 2)).toEqual([501, 'NOT_IMPLEMENTED']);
    });
  });
}

describeActionsContract('in-browser mock', () => {
  const mock = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'a' }), getRequestContext: () => ({}), delayMs: 0, registry: ACTION_REGISTRY, seed: ACTION_SEED });
  return { actions: mock.actions, children: mock.children };
});

const server = useTestServer({ seed: ACTION_SEED, registry: ACTION_REGISTRY });
describeActionsContract('http mock server', () => {
  const client = createHttpClient({ baseUrl: server.url(), getSession: () => ({ tenantId: 'a' }), getRequestContext: () => ({}) });
  return { actions: (slug) => createActionServiceHttp(client, slug), children: (slug) => createChildServiceHttp(client, slug) };
});
