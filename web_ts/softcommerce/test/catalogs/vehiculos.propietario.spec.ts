import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { loadSeed } from '../../mock-server/http/loadSeed.js';
import { useTestServer } from '../../mock-server/http/test-server';
import { REGISTRY } from '../../mock-server/registry/index.js';
import { createCatalogServiceHttp } from '../../src/services/CatalogServiceHttp';
import { createLookupServiceHttp } from '../../src/services/LookupServiceHttp';
import { createHttpClient } from '../../src/services/httpClient';
import { createAppServicesMock } from '../../src/services/mock/AppServicesMock';
import { PROPIETARIO_CASES } from './vehiculos.propietario.cases';
import { describeRegistryContract } from './registryContract';

const dataDir = fileURLToPath(new URL('../../mock-server/data', import.meta.url));
const session = () => ({ tenantId: 'demo' });
const entry = REGISTRY.bySlug.get('vehiculos');
const field = (name: string) => entry.fields.find((f: any) => f.name === name);

describe('R-MST-6 the vehiculos entry gains the propietario lookup', () => {
  it('Propietario is an optional lookup over the active transportistas, with the inline Buscar Transportista dialog', () => {
    const propietario = field('id_anexo_empresa_transportista');
    expect(propietario).toMatchObject({ kind: 'lookup', label: 'Propietario', display: 'transportista', source: { catalog: 'transportistas', where: { estado: true } } });
    expect(propietario.required).toBeUndefined();
    expect(propietario.columns.map((c: any) => c.header)).toEqual(['CODIGO', 'RAZON SOCIAL', 'RUC/DNI']);
    expect(propietario.filters.map((f: any) => f.label)).toEqual(['Codigo', 'RUC/DNI', 'Descripcion']);
  });

  it('joins the razon social and the RUC of the propietario for the list and the picker (R-LKP-3)', () => {
    expect(entry.joins.filter((j: any) => j.ref === 'id_anexo_empresa_transportista').map((j: any) => [j.as, j.display])).toEqual([['transportista', 'descripcion'], ['transportista_ruc', 'numero_doc']]);
  });

  it('the W2 validation order and messages stay: the propietario adds no step (the desktop does not check it)', () => {
    expect(entry.validation).toEqual(['placa', 'constancia_inscripcion', 'peso', 'id_marca', 'id_modelo', 'estado']);
  });

  it('declares the marca and modelo as exact lookup filters for the FormBuscarVehiculo selects', () => {
    expect(Object.keys(entry.lookupFilters)).toEqual(['id_marca', 'id_modelo']);
  });
});

describeRegistryContract(
  'in-browser mock (vehiculos propietario)',
  (slug, ctx) => {
    const mock = createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => ctx, delayMs: 0 });
    return { catalog: mock.catalog(slug), lookup: mock.lookup };
  },
  PROPIETARIO_CASES,
);

const server = useTestServer({ seed: loadSeed(dataDir) });
describeRegistryContract(
  'http mock server (vehiculos propietario)',
  (slug, ctx) => {
    const client = createHttpClient({ baseUrl: server.url(), getSession: session, getRequestContext: () => ctx });
    return { catalog: createCatalogServiceHttp(client, slug), lookup: createLookupServiceHttp(client) };
  },
  PROPIETARIO_CASES,
);
