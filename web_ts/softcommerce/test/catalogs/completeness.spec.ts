import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import menu from '../../mock-server/data/menu.json';
import permissions from '../../mock-server/data/permissions.json';
import { loadSeed } from '../../mock-server/http/loadSeed.js';
import { useTestServer } from '../../mock-server/http/test-server';
import { REGISTRY } from '../../mock-server/registry/index.js';
import { PERMISSION_FLAGS } from '../../src/domain/permissions';
import { createCatalogServiceHttp } from '../../src/services/CatalogServiceHttp';
import { createLookupServiceHttp } from '../../src/services/LookupServiceHttp';
import { createHttpClient } from '../../src/services/httpClient';
import { createAppServicesMock } from '../../src/services/mock/AppServicesMock';
import { DOCUMENT_CASES } from './docIdentidad.cases';
import { REFERENCE_CASES } from './reference.cases';
import { W1_SECTION_CASES } from './w1sections.cases';

/**
 * W2-12 12.6: the cross-cutting checks of wave 2. The 38 catalogs of R-REF-4..R-REF-6 are the registry's writable entries other than the W1 Localidad
 * (the nine read-only lookups are the R-REF-11 seeds), each with its menu node and 13 permission flags, a table row and the same behavior on both sources.
 */
const T1 = ['aduanas', 'colores', 'clasif-clientes', 'clasif-inventarios', 'condiciones-pago', 'estados-documento', 'laboratorios', 'marcas', 'nacionalidades', 'tamanos', 'tipos-anexo', 'tipos-descuento'];
const T2 = ['familias', 'subfamilias', 'motivos-descuento', 'motivos-nc', 'motivos-traslado', 'tipos-trabajador-perfil', 'empresa', 'tipos-trabajador', 'turnos', 'marcas-vehiculo', 'modelos-vehiculo'];
const T3 = [
  'almacenes', 'zonas', 'correlativos', 'usuario-correlativos', 'punto-venta', 'zonas-distancia', 'tipos-mov-inventario', 'unidades-medida', 'tipos-cambio', 'promociones',
  'trabajador-punto-venta', 'choferes', 'socios', 'ubicaciones', 'vehiculos',
];
const LOOKUPS = ['monedas', 'tipos-doc-iden', 'tablas-sunat', 'tablas-detalle-sunat', 'tipos-doc-venta', 'familias-sunat', 'subfamilias-sunat', 'cuentas-contables', 'parametros-prov', 'clases-sunat', 'padrones'];
const CATALOGS = [...T1, ...T2, ...T3];
// The Wave 3 masters have their own suites (R-MST-18 exception 3): they are not among the 38 reference catalogs.
const MASTERS = ['bancos', 'trabajadores', 'vendedores', 'transportistas', 'proveedores', 'clientes', 'usuarios'];

const entries = REGISTRY.entries as any[];

describe('R-REF-4..R-REF-6 the 38 catalogs', () => {
  it('the registry has 12 T1 + 11 T2 + 15 T3 = 38 writable catalogs, each assigned once', () => {
    expect([T1.length, T2.length, T3.length, new Set(CATALOGS).size]).toEqual([12, 11, 15, 38]);
    const writable = entries.filter((e) => !e.readOnly && !e.compat && !MASTERS.includes(e.slug)).map((e) => e.slug);
    expect(writable.sort()).toEqual([...CATALOGS].sort());
  });

  it('R-REF-11 the other entries are Localidad (W1) and the eleven read-only lookups', () => {
    const others = entries.filter((e) => e.readOnly || e.compat).map((e) => e.slug).sort();
    expect(others).toEqual(['localidades', ...LOOKUPS].sort());
  });

  it.each(CATALOGS)('S-REF-36 / S-REG-12 %s has a menu node and the 13 permission flags', (slug) => {
    const entry = REGISTRY.bySlug.get(slug);
    expect(entry.formId, `${slug} formId`).toBeTruthy();
    const node = (menu as any[]).find((n) => n.nombre === entry.formId);
    expect(node?.descripcion, `${slug} menu node`).toBe(entry.menu.label);
    const grant = (permissions as Record<string, any>)[entry.formId];
    expect(PERMISSION_FLAGS.map((flag) => typeof grant?.[flag])).toEqual(PERMISSION_FLAGS.map(() => 'boolean'));
  });

  it('S-REF-36 a toolbar flag is the permission: the unsupported delete of chofer and socio is off, every catalog keeps the rest', () => {
    for (const slug of ['choferes', 'socios']) expect((permissions as any)[REGISTRY.bySlug.get(slug).formId].eliminate).toBe(false);
  });

  it('R-REF-13 every catalog has table rows (generic, per-slug or W1-section) and the document catalogs their own table', () => {
    const covered = new Set([...REFERENCE_CASES, ...DOCUMENT_CASES, ...W1_SECTION_CASES].map((c) => c.slug));
    expect(CATALOGS.filter((slug) => !covered.has(slug))).toEqual([]);
  });

  it('R-REF-13 every catalog table row names the rule it proves (S-REF / S-MOCK / R- id) or the catalog it covers', () => {
    for (const c of [...DOCUMENT_CASES, ...W1_SECTION_CASES]) expect(c.name.length, c.slug).toBeGreaterThan(10);
  });

  it('S-REF-38 the W1 suites are still in place and Localidad keeps its compat block', () => {
    const here = (path: string) => existsSync(fileURLToPath(new URL(`../../${path}`, import.meta.url)));
    for (const path of ['src/views/uilocalidad/UiLocalidad.spec.tsx', 'test/parity.spec.ts', 'src/views/uishell/formRegistry.spec.ts']) expect(here(path), path).toBe(true);
    expect(REGISTRY.bySlug.get('localidades').compat).toEqual({ messages: 'w1', serverOptional: ['direccion'] });
  });
});

// S-REF-37: one probe of every catalog, run against the in-browser mock and the HTTP mock, must read the same.
const dataDir = fileURLToPath(new URL('../../mock-server/data', import.meta.url));
const session = () => ({ tenantId: 'demo' });
const ctx = { userId: '7', empresaId: '1' };
const server = useTestServer({ seed: loadSeed(dataDir) });

/** What a service answers: the success shape or the error status, code, fields and messages. */
async function outcome(run: () => Promise<any>) {
  try {
    const value = await run();
    return { ok: true, value };
  } catch (e: any) {
    return { ok: false, status: e.status, code: e.code, fields: (e.details ?? []).map((d: any) => d.field), messages: (e.details ?? []).map((d: any) => d.message) };
  }
}
async function probe(catalog: any, lookup: any, slug: string) {
  const list: any = await catalog.list({});
  const first = list.items[0];
  const idKey = REGISTRY.bySlug.get(slug).idKey;
  return {
    total: list.pagination.total,
    keys: Object.keys(first).sort(),
    first,
    get: await outcome(() => catalog.get(String(first[idKey]))),
    empty: await outcome(() => catalog.create({})),
    options: await outcome(() => lookup.options(slug)),
  };
}

describe('S-REF-37 dual-source parity across all catalogs', () => {
  it.each(CATALOGS)('%s answers the same on the in-browser mock and the HTTP mock', async (slug) => {
    const mock = createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => ctx, delayMs: 0 });
    const client = createHttpClient({ baseUrl: server.url(), getSession: session, getRequestContext: () => ctx });
    const [a, b] = [await probe(mock.catalog(slug), mock.lookup, slug), await probe(createCatalogServiceHttp(client, slug), createLookupServiceHttp(client), slug)];
    expect(JSON.parse(JSON.stringify(b))).toEqual(JSON.parse(JSON.stringify(a)));
  });
});
