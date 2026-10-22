import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { loadSeed } from '../../mock-server/http/loadSeed.js';
import { useTestServer } from '../../mock-server/http/test-server';
import { REGISTRY } from '../../mock-server/registry/index.js';
import { toCatalogConfig } from '../../src/catalogs/registry';
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
  'motivos-descuento.descripcion': [100, true],
  'motivos-descuento.abrev': [5, true],
  'motivos-nc.descripcion': [100, true],
  'tipos-trabajador-perfil.descripcion': [100, true],
  'familias.descripcion': [100, true],
  'modelos-vehiculo.descripcion': [100, true],
  'subfamilias.descripcion': [100, true],
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
  // The motivo de descuento and perfil ids are int beans; the motivo de nota de credito pads to three (PanelTFMotivoNC focusLost "000").
  'motivos-descuento': 0, 'motivos-nc': 3, 'tipos-trabajador-perfil': 0,
  // PanelTFFamilia pads to three; the modelo id has no pad evidence (inferred, flagged for W6).
  familias: 3, 'modelos-vehiculo': 3,
  // PanelTFSubFamilia pads the code to three ("000" + id).
  subfamilias: 3,
};

/** Refs as read from the desktop combos (R-REG-6): the source catalog and its static where (the perfil lists tipos with estado A). */
const REFS: Record<string, [string, Record<string, unknown>]> = {
  'motivos-descuento.id_tipo_descuento': ['tipos-descuento', {}],
  'tipos-trabajador-perfil.id_tipo_trabajador': ['tipos-trabajador', { estado: true }],
  'familias.id_familia_sunat': ['familias-sunat', {}],
  'subfamilias.id_familia': ['familias', {}],
  'subfamilias.id_subfamilia_sunat': ['subfamilias-sunat', {}],
};

/**
 * Empresa-scope audit (5.6b), read from each `DAO<X>.java`: `empresa` when the list and the writes take the session empresa
 * (colores, marcas, familias), `stamp` when only the writes do (tamanos, marcas-vehiculo, modelos-vehiculo: their desktop list
 * passes '' or null), `tenant` when the DAO never sees an empresa.
 */
const SCOPE: Record<string, 'empresa' | 'stamp' | 'tenant'> = {
  aduanas: 'tenant', colores: 'empresa', 'estados-documento': 'tenant', laboratorios: 'tenant', marcas: 'empresa', nacionalidades: 'tenant',
  'motivos-traslado': 'tenant', 'clasif-clientes': 'tenant', 'clasif-inventarios': 'tenant', tamanos: 'stamp', 'tipos-anexo': 'tenant',
  'tipos-descuento': 'tenant', 'condiciones-pago': 'tenant', 'tipos-trabajador': 'tenant', 'marcas-vehiculo': 'stamp', turnos: 'tenant',
  'motivos-descuento': 'tenant', 'motivos-nc': 'tenant', 'tipos-trabajador-perfil': 'tenant', familias: 'empresa', 'modelos-vehiculo': 'stamp',
  // DAOSubFamilia.mantSubFamilia passes the empresa on every write; listar passes '' for it, so the list stays tenant-wide.
  subfamilias: 'stamp',
};

describe('W2 reference catalogs are registered', () => {
  it.each(Object.entries(SCOPE))('5.6b %s keeps its audited empresa scope', (slug, scope) => {
    const entry = REGISTRY.bySlug.get(slug);
    const decided = entry.scope === 'empresa' ? 'empresa' : (entry.stamp ?? []).includes('id_empresa') ? 'stamp' : 'tenant';
    expect(decided).toBe(scope);
  });

  it('5.6b the audit covers every reference catalog', () => {
    expect(Object.keys(SCOPE).sort()).toEqual(Object.keys(ENTITIES).sort());
  });

  it.each(Object.entries(REFS))('R-REG-6 %s refs its desktop source', (path, [catalog, where]) => {
    const [slug, name] = path.split('.');
    const ref = REGISTRY.bySlug.get(slug).refs.find((r: any) => r.field === name);
    expect([ref.catalog, ref.where, ref.activeOnly]).toEqual([catalog, where, true]);
  });

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

  it('R-CRUD-12 / S-REF-39 subfamilias: the SUNAT select depends on the familia and no nested-create field exists', () => {
    const fields = toCatalogConfig(REGISTRY.bySlug.get('subfamilias')).fields;
    expect(fields.map((f: any) => `${f.kind}:${f.name}`)).toEqual(['code:id_sub_familia', 'select:id_familia', 'text:descripcion', 'select:id_subfamilia_sunat']);
    expect(fields.map((f: any) => f.dependsOn)).toEqual([undefined, undefined, undefined, [{ field: 'id_familia', filterKey: 'id_familia' }]]);
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
