import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { loadSeed } from '../../mock-server/http/loadSeed.js';
import { useTestServer } from '../../mock-server/http/test-server';
import { REGISTRY } from '../../mock-server/registry/index.js';
import { createCatalogServiceHttp } from '../../src/services/CatalogServiceHttp';
import { createLookupServiceHttp } from '../../src/services/LookupServiceHttp';
import { createHttpClient } from '../../src/services/httpClient';
import { createAppServicesMock } from '../../src/services/mock/AppServicesMock';
import { describeRegistryContract } from './registryContract';
import { ENTITIES, REFERENCE_CASES, referenceEntries } from './reference.cases';

const session = () => ({ tenantId: 'demo' });

/** R-REF-4 as read from the `Register*.java` documents: `[max, uppercased]` per slug.field. */
const DESKTOP: Record<string, [number, boolean]> = {
  'aduanas.descripcion': [100, false],
  'colores.descripcion': [100, true],
  'estados-documento.descripcion': [100, true],
  'laboratorios.descripcion': [100, true],
  'laboratorios.pais': [100, true],
  'marcas.descripcion': [100, true],
  'nacionalidades.descripcion': [100, true],
  'motivos-traslado.descripcion': [100, true],
  'motivos-traslado.abrev': [100, true],
  'clasif-clientes.descripcion': [100, true],
  'clasif-inventarios.descripcion': [100, true],
  'clasif-inventarios.abrev': [100, true],
  'tamanos.descripcion': [100, true],
  'tipos-anexo.descripcion': [100, true],
  'tipos-anexo.abreviatura': [100, true],
  'tipos-descuento.descripcion': [100, true],
  'tipos-descuento.abrev': [5, true],
  'condiciones-pago.descripcion': [255, true],
  'tipos-trabajador.descripcion': [100, true],
  'tipos-trabajador.abreviatura': [5, true],
  'marcas-vehiculo.descripcion': [100, true],
};

/** Integer fields as read from the desktop (IntegerDocument digits, focusLost pad, isRegisterValid range): `[digits, padLeft, range]`. */
const INTEGERS: Record<string, [number, boolean, { min?: number; max?: number } | undefined]> = {
  'condiciones-pago.dias_pago': [2, false, undefined],
  'turnos.hora': [2, true, { min: 0, max: 12 }],
  'turnos.minuto': [2, true, { min: 0, max: 59 }],
};

/** Code width per slug: string ids pad to three digits (PanelTF focusLost "000"; clasif-inventarios is inferred), integer beans print unpadded. */
const CODE_WIDTH: Record<string, number> = {
  'motivos-traslado': 3, 'clasif-clientes': 0, 'clasif-inventarios': 3, tamanos: 3, 'tipos-anexo': 3, 'tipos-descuento': 0,
  // String ids with no pad evidence in the desktop are inferred as 3 (flagged for W6); the Turno id is an int.
  'condiciones-pago': 3, 'tipos-trabajador': 3, 'marcas-vehiculo': 3, turnos: 0,
};

describe('W2 reference catalogs are registered', () => {
  it.each(Object.entries(DESKTOP))('R-REF-4 %s keeps the desktop max and case rule', (path, [max, upper]) => {
    const [slug, name] = path.split('.');
    const field = REGISTRY.bySlug.get(slug).fields.find((f: any) => f.name === name);
    expect([field.max, field.normalize.includes('upper')]).toEqual([max, upper]);
  });

  it.each(Object.entries(INTEGERS))('R-CRUD-11 %s keeps the desktop digits, padding and range', (path, [digits, padded, range]) => {
    const [slug, name] = path.split('.');
    const field = REGISTRY.bySlug.get(slug).fields.find((f: any) => f.name === name);
    expect([field.kind, field.scale, field.max, field.normalize.some((s: string) => s.startsWith('padLeft:')), field.range]).toEqual(['number', 0, digits, padded, range]);
  });

  it.each(Object.entries(CODE_WIDTH))('%s keeps the desktop code width %i', (slug, width) => {
    expect(REGISTRY.bySlug.get(slug).codeWidth).toBe(width);
  });

  it('registers the reference catalogs, each with seed rows and one inactive row', () => {
    expect(referenceEntries().map((e: any) => e.slug).sort()).toEqual(Object.keys(ENTITIES).sort());
    expect(REFERENCE_CASES.length).toBeGreaterThan(40);
  });

  it('S-REG-6 every one of them seeds demo only: botica starts empty', () => {
    const seed = loadSeed(fileURLToPath(new URL('../../mock-server/data', import.meta.url)));
    // A shared lookup is one global list (S-REG-18, lookups.spec.ts), not a section keyed by tenant.
    for (const entry of REGISTRY.entries.filter((e: any) => !e.compat && e.scope !== 'shared')) expect(Object.keys(seed[entry.section]), entry.slug).toEqual(['demo']);
  });
});

// S-REF-37 / R-MOCK-18: the same table against the in-browser mock and the HTTP mock.
describeRegistryContract(
  'in-browser mock',
  (slug, ctx) => {
    const mock = createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => ctx, delayMs: 0 });
    return { catalog: mock.catalog(slug), lookup: mock.lookup };
  },
  REFERENCE_CASES,
);

const server = useTestServer({ seed: loadSeed(fileURLToPath(new URL('../../mock-server/data', import.meta.url))) });
describeRegistryContract(
  'http mock server',
  (slug, ctx) => {
    const client = createHttpClient({ baseUrl: server.url(), getSession: session, getRequestContext: () => ctx });
    return { catalog: createCatalogServiceHttp(client, slug), lookup: createLookupServiceHttp(client) };
  },
  REFERENCE_CASES,
);
