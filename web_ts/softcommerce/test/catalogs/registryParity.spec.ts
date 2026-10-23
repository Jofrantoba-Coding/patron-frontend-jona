import { useTestServer } from '../../mock-server/http/test-server';
import { createCatalogServiceHttp } from '../../src/services/CatalogServiceHttp';
import { createLookupServiceHttp } from '../../src/services/LookupServiceHttp';
import { createHttpClient } from '../../src/services/httpClient';
import { createAppServicesMock } from '../../src/services/mock/AppServicesMock';
import { REGISTRY_UNDER_TEST, SEED_UNDER_TEST } from './cases';
import { describeRegistryContract } from './registryContract';

const session = () => ({ tenantId: 'demo' });

// S-MOCK-35 / R-MOCK-18: the same registry cases against the in-browser mock and the HTTP server.
describeRegistryContract('in-browser mock', (slug, ctx) => {
  const mock = createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => ctx, delayMs: 0, seed: SEED_UNDER_TEST, registry: REGISTRY_UNDER_TEST });
  return { catalog: mock.catalog(slug), lookup: mock.lookup };
});

const server = useTestServer({ seed: SEED_UNDER_TEST, registry: REGISTRY_UNDER_TEST });
describeRegistryContract('http mock server', (slug, ctx) => {
  const client = createHttpClient({ baseUrl: server.url(), getSession: session, getRequestContext: () => ctx });
  return { catalog: createCatalogServiceHttp(client, slug), lookup: createLookupServiceHttp(client) };
});
