import { GATE_ENTRIES, GATE_SEED, RULES_ENTRIES, RULES_SEED } from '../../mock-server/core/children.rules.fixture';
import { useTestServer } from '../../mock-server/http/test-server';
import { validateRegistry } from '../../mock-server/registry/schema.js';
import { createCatalogServiceHttp } from '../../src/services/CatalogServiceHttp';
import { createChildServiceHttp } from '../../src/services/ChildServiceHttp';
import { createHttpClient } from '../../src/services/httpClient';
import { createAppServicesMock } from '../../src/services/mock/AppServicesMock';
import { describeChildRulesContract } from './children.rules.contract';

// One registry and seed for every W3-4b case: the rules entries plus the company-gated `clientes` (tenant a gates on, tenant b off).
const registry = validateRegistry([...RULES_ENTRIES, ...GATE_ENTRIES]);
const seed = { ...RULES_SEED, params: GATE_SEED.params, clientes: GATE_SEED.clientes };

// S-MOCK-35 / R-MOCK-18 for W3-4b: the same cases against the in-browser mock and the HTTP server.
describeChildRulesContract('in-browser mock', (tenantId = 'a') =>
  createAppServicesMock('exitoso', { getSession: () => ({ tenantId }), getRequestContext: () => ({}), delayMs: 0, registry, seed }),
);

const server = useTestServer({ seed, registry });
describeChildRulesContract('http mock server', (tenantId = 'a') => {
  const client = createHttpClient({ baseUrl: server.url(), getSession: () => ({ tenantId }), getRequestContext: () => ({}) });
  return { catalog: (slug) => createCatalogServiceHttp(client, slug), children: (slug) => createChildServiceHttp(client, slug) };
});
