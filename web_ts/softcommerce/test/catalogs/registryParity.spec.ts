import { useTestServer } from '../../mock-server/http/test-server';
import { createCatalogServiceHttp } from '../../src/services/CatalogServiceHttp';
import { createHttpClient } from '../../src/services/httpClient';
import { createAppServicesMock } from '../../src/services/mock/AppServicesMock';
import { REGISTRY_UNDER_TEST, SEED_UNDER_TEST } from './cases';
import { describeRegistryContract } from './registryContract';

const session = () => ({ tenantId: 'demo' });

// S-MOCK-35 / R-MOCK-18: the same registry cases against the in-browser mock and the HTTP server.
describeRegistryContract('in-browser mock', (slug) =>
  createAppServicesMock('exitoso', { getSession: session, delayMs: 0, seed: SEED_UNDER_TEST, registry: REGISTRY_UNDER_TEST }).catalog(slug),
);

const server = useTestServer({ seed: SEED_UNDER_TEST, registry: REGISTRY_UNDER_TEST });
describeRegistryContract('http mock server', (slug) =>
  createCatalogServiceHttp(createHttpClient({ baseUrl: server.url(), getSession: session }), slug),
);
