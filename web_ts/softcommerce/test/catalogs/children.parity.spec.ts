import { CHILD_REGISTRY, CHILD_SEED } from '../../mock-server/core/children.fixture';
import { useTestServer } from '../../mock-server/http/test-server';
import { createCatalogServiceHttp } from '../../src/services/CatalogServiceHttp';
import { createChildServiceHttp } from '../../src/services/ChildServiceHttp';
import { createHttpClient } from '../../src/services/httpClient';
import { createAppServicesMock } from '../../src/services/mock/AppServicesMock';
import { describeChildrenContract } from './children.contract';

const session = () => ({ tenantId: 'a' });

// S-MOCK-35 / R-MOCK-18 for W3-4a: the same cases against the in-browser mock and the HTTP server.
describeChildrenContract('in-browser mock', (empresaId) =>
  createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => ({ empresaId }), delayMs: 0, registry: CHILD_REGISTRY, seed: CHILD_SEED }),
);

const server = useTestServer({ seed: CHILD_SEED, registry: CHILD_REGISTRY });
describeChildrenContract('http mock server', (empresaId) => {
  const client = createHttpClient({ baseUrl: server.url(), getSession: session, getRequestContext: () => ({ empresaId }) });
  return { catalog: (slug) => createCatalogServiceHttp(client, slug), children: (slug) => createChildServiceHttp(client, slug) };
});
