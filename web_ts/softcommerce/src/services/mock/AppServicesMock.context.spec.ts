import { describe, expect, it } from 'vitest';
import { readSeed } from '../../../mock-server/core/test-helpers.js';
import { validateRegistry } from '../../../mock-server/registry/schema.js';
import { ApiError } from '../ApiError';
import type { RequestContext } from '../httpClient';
import { createAppServicesMock } from './AppServicesMock';

// Test-only empresa-scope entry: the in-browser mock must apply the same session rules as the HTTP server.
const registry = validateRegistry([
  {
    slug: 'notas', idKey: 'id_notas', codeWidth: 0, entity: 'una nota', scope: 'empresa', seed: 'notas', stamp: ['id_usuario', 'id_empresa'],
    messages: { style: 'M1' }, fields: [{ name: 'descripcion', kind: 'text', label: 'Descripción', required: true, max: 10 }],
    columns: [{ key: 'descripcion', header: 'D' }],
  },
]);
const seed = { ...readSeed(), notas: { demo: [{ id_notas: '1', descripcion: 'E1', id_empresa: '1', activo: true }, { id_notas: '2', descripcion: 'E2', id_empresa: '2', activo: true }] } };
const notas = (context: RequestContext) =>
  createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => context, delayMs: 0, registry, seed }).catalog<any>('notas');

describe('AppServicesMock request context (D13)', () => {
  it('limits an empresa-scope catalog to the session empresa and stamps writes from it', async () => {
    const service = notas({ userId: '5', empresaId: '1' });
    expect((await service.list()).items.map((r: any) => r.id_notas)).toEqual(['1']);
    expect(await service.create({ descripcion: 'X', id_usuario: '9' })).toMatchObject({ id_empresa: '1', id_usuario: 5 });
  });

  it('rejects a missing or unknown empresa like the HTTP server', async () => {
    for (const [context, code] of [[{}, 'MISSING_SESSION_CONTEXT'], [{ empresaId: '999' }, 'INVALID_SESSION_CONTEXT']] as const) {
      const error = await notas(context).list().catch((e: unknown) => e);
      expect(error).toBeInstanceOf(ApiError);
      expect(error).toMatchObject({ status: 400, code });
    }
  });
});
