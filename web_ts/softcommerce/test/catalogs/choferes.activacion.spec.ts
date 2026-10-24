import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { loadSeed } from '../../mock-server/http/loadSeed.js';
import { useTestServer } from '../../mock-server/http/test-server';
import { REGISTRY } from '../../mock-server/registry/index.js';
import { ApiError } from '../../src/services/ApiError';
import { createActionServiceHttp } from '../../src/services/ActionServiceHttp';
import { createCatalogServiceHttp } from '../../src/services/CatalogServiceHttp';
import { createChildServiceHttp } from '../../src/services/ChildServiceHttp';
import { createHttpClient } from '../../src/services/httpClient';
import type { InterActionService } from '../../src/services/InterActionService';
import type { InterCatalogService } from '../../src/services/InterCatalogService';
import type { InterChildService } from '../../src/services/InterChildService';
import { createAppServicesMock } from '../../src/services/mock/AppServicesMock';

/** S-REF-40, S-ANX-15, R-ANX-10: the Chofer activation tab (the W2 leftover G11 / G12), on both mocks and in the register. */
const dataDir = fileURLToPath(new URL('../../mock-server/data', import.meta.url));
const session = () => ({ tenantId: 'demo' });
const WRITER = { userId: '7', empresaId: '1' };
const chofer = (n: number) => String(n).padStart(10, '0');
const entry = REGISTRY.bySlug.get('choferes');

describe('R-ANX-10 the choferes entry gains the anexo pieces and keeps its W2 shape', () => {
  it('keeps the modes, adds the activacion rule, the history child, the tipo anexo 7 and a read-only estado', () => {
    expect(entry.modes).toEqual(['INSERT', 'UPDATE', 'DETAIL', 'CLONE']);
    expect(entry.rules.map((r: any) => r.name)).toEqual(['docIdentidad', 'activacion']);
    expect(entry.constants).toEqual({ flag_tipo_persona: 'N', id_tipo_anexo: '7' });
    expect(REGISTRY.childEntries.filter((c: any) => c.parent === 'choferes').map((c: any) => c.tab)).toEqual(['Activación de Chofer']);
    const estado = entry.fields.find((f: any) => f.name === 'estado');
    expect([estado.label, estado.readOnlyOn]).toEqual(['Estado', ['INSERT', 'UPDATE', 'DELETE', 'DETAIL', 'CLONE']]);
  });
});

type Services = { catalog: InterCatalogService<Record<string, any>>; children: InterChildService; actions: InterActionService };
const failure = async (promise: Promise<unknown>): Promise<ApiError> => {
  try {
    await promise;
  } catch (e) {
    return e as ApiError;
  }
  throw new Error('expected the call to fail');
};

function describeChoferServices(label: string, make: () => Services): void {
  describe(`choferes activation: ${label}`, () => {
    const history = async (services: Services, id: string) => (await services.children.list(id, 'activaciones')).items.map((r) => [r.motivo_activacion, r.estado]);

    it('S-REF-40 every seeded chofer shows its INICIO activation', async () => {
      const services = make();
      expect(await history(services, chofer(1))).toEqual([['INICIO', 'A']]);
      expect(await history(services, chofer(2))).toEqual([['INICIO', 'A']]);
    });

    it('R-ANX-2 a new chofer lists exactly the INICIO activation and is active', async () => {
      const services = make();
      const created = await services.catalog.create({ id_tipo_doc_iden: '01', numero_doc: '40123456', ap_paterno: 'a', ap_materno: 'b', nombres: 'c', id_nacionalidad: '001' });
      expect(await history(services, created.id_chofer)).toEqual([['INICIO', 'A']]);
      expect(created.estado).toBe(true);
    });

    it('S-REF-40 desactivar with a motivo marks the chofer deactivated; DELETE answers 405 MODE_NOT_SUPPORTED', async () => {
      const services = make();
      expect(await services.actions.run({ id: chofer(1) }, 'desactivar', { fecha_fin: '2026-03-12', motivo: 'cese' })).toMatchObject({ row: { estado: false }, message: 'Chofer Desactivado' });
      expect(await history(services, chofer(1))).toEqual([['INICIO', 'D']]);
      const gone = await failure(services.catalog.remove(chofer(1)));
      expect([gone.status, gone.code]).toEqual([405, 'MODE_NOT_SUPPORTED']);
    });

    it('S-ANX-15 activar on an active chofer is a 409 ACTION_NOT_ALLOWED with the Chofer sentence', async () => {
      const services = make();
      const error = await failure(services.actions.run({ id: chofer(1) }, 'activar', { fecha_inicio: '2026-03-12', motivo: 'otro' }));
      expect([error.status, error.code, error.message]).toEqual([409, 'ACTION_NOT_ALLOWED', 'Chofer ya Esta Activado']);
    });
  });
}

describeChoferServices('in-browser mock', () => {
  const mock = createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => WRITER, delayMs: 0 });
  return { catalog: mock.catalog('choferes'), children: mock.children('choferes'), actions: mock.actions('choferes') };
});
const server = useTestServer({ seed: loadSeed(dataDir) });
describeChoferServices('http mock server', () => {
  const client = createHttpClient({ baseUrl: server.url(), getSession: session, getRequestContext: () => WRITER });
  return { catalog: createCatalogServiceHttp(client, 'choferes'), children: createChildServiceHttp(client, 'choferes'), actions: createActionServiceHttp(client, 'choferes') };
});

