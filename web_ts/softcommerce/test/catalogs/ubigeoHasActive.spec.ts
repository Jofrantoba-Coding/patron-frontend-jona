import { fileURLToPath } from 'node:url';
import { loadSeed } from '../../mock-server/http/loadSeed.js';
import { useTestServer } from '../../mock-server/http/test-server';
import { createCatalogServiceHttp } from '../../src/services/CatalogServiceHttp';
import { createLookupServiceHttp } from '../../src/services/LookupServiceHttp';
import { createHttpClient } from '../../src/services/httpClient';
import { createAppServicesMock } from '../../src/services/mock/AppServicesMock';
import type { CatalogCase } from './cases';
import { describeRegistryContract } from './registryContract';

const session = () => ({ tenantId: 'demo' });
const items = (...pairs: [string, string][]) => pairs.map(([id, name]) => ({ id, name }));
const ubigeo = (name: string, filters: Record<string, string>, expected: { id: string; name: string }[]): CatalogCase => ({
  name: `ubigeo S-MOCK-31 ${name}`, slug: 'ubigeo', steps: [{ op: 'options', filters }], expect: { ok: true, items: expected },
});

// S-MOCK-31 over the demo zonas seed: 1 LIMA CENTRO (150101), 2 ATE ESTE (150103), 3 CALLAO PUERTO (070101, estado off) and a deleted CUSCO one.
const CASES: CatalogCase[] = [
  ubigeo('has=zonas offers only the departamentos with an active zona', { has: 'zonas' }, items(['07', 'CALLAO'], ['15', 'LIMA'])),
  ubigeo('has=zonas under a departamento offers its provincias with one', { parent: '15', has: 'zonas' }, items(['1501', 'LIMA'])),
  ubigeo('has=zonas under a provincia offers its distritos with one', { parent: '1501', has: 'zonas' }, items(['150101', 'LIMA'], ['150103', 'ATE'])),
  ubigeo('a departamento whose only zona is deleted is not offered', { parent: '08', has: 'zonas' }, []),
  ubigeo('an unknown parent has no options, not an error', { parent: '99', has: 'zonas' }, []),
  ubigeo('without has the departamentos are all of them', {}, items(['04', 'AREQUIPA'], ['07', 'CALLAO'], ['08', 'CUSCO'], ['15', 'LIMA'])),
  ubigeo('a catalog the rule does not know offers nothing', { has: 'localidades' }, []),
];

describeRegistryContract(
  'in-browser mock (ubigeoHasActive)',
  (slug, ctx) => {
    const mock = createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => ctx, delayMs: 0 });
    return { catalog: mock.catalog(slug), lookup: mock.lookup };
  },
  CASES,
);

const server = useTestServer({ seed: loadSeed(fileURLToPath(new URL('../../mock-server/data', import.meta.url))) });
describeRegistryContract(
  'http mock server (ubigeoHasActive)',
  (slug, ctx) => {
    const client = createHttpClient({ baseUrl: server.url(), getSession: session, getRequestContext: () => ctx });
    return { catalog: createCatalogServiceHttp(client, slug), lookup: createLookupServiceHttp(client) };
  },
  CASES,
);
