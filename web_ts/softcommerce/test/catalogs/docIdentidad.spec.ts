import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { docIdentidad } from '../../mock-server/core/rules.js';
import { loadSeed } from '../../mock-server/http/loadSeed.js';
import { useTestServer } from '../../mock-server/http/test-server';
import { REGISTRY } from '../../mock-server/registry/index.js';
import { createCatalogServiceHttp } from '../../src/services/CatalogServiceHttp';
import { createLookupServiceHttp } from '../../src/services/LookupServiceHttp';
import { createHttpClient } from '../../src/services/httpClient';
import { createAppServicesMock } from '../../src/services/mock/AppServicesMock';
import { DOCUMENT_CASES } from './docIdentidad.cases';
import { describeRegistryContract } from './registryContract';

const dataDir = fileURLToPath(new URL('../../mock-server/data', import.meta.url));
const session = () => ({ tenantId: 'demo' });
const field = (slug: string, name: string) => REGISTRY.bySlug.get(slug).fields.find((f: any) => f.name === name);

describe('R-REF-6 / R-REF-8 chofer and socio entries', () => {
  it.each(['choferes', 'socios'])('S-REF-29 %s offers INSERT, UPDATE, DETAIL and CLONE only', (slug) => {
    expect(REGISTRY.bySlug.get(slug).modes).toEqual(['INSERT', 'UPDATE', 'DETAIL', 'CLONE']);
  });

  it.each(['choferes', 'socios'])('%s runs the docIdentidad rule at the desktop position and judges the DNI by id 01 and the RUC by 05', (slug) => {
    const entry = REGISTRY.bySlug.get(slug);
    expect(entry.rules.map((r: any) => r.name).filter((name: string) => name !== 'activacion')).toEqual(['docIdentidad']);
    expect(entry.validation.slice(0, 2)).toEqual(['id_tipo_doc_iden', { rule: 'docIdentidad' }]);
    const numero = field(slug, 'numero_doc');
    expect([numero.max, numero.normalize, numero.maxWhen, numero.minLenWhen]).toEqual([
      11, ['digits'], [{ when: { field: 'id_tipo_doc_iden', in: ['01'] }, len: 8 }],
      [{ when: { field: 'id_tipo_doc_iden', in: ['01'] }, len: 8 }, { when: { field: 'id_tipo_doc_iden', in: ['05'] }, len: 11 }],
    ]);
  });

  it.each(['choferes', 'socios'])('R-REF-8 %s: the tipo clears the number, the names and the razon social when it changes', (slug) => {
    expect(field(slug, 'id_tipo_doc_iden').clearsOnChange).toEqual(['numero_doc', 'ap_paterno', 'ap_materno', 'nombres', 'descripcion']);
  });

  it.each(['choferes', 'socios'])('%s lists the active persons of tipos-doc-iden (D16 where)', (slug) => {
    const ref = REGISTRY.bySlug.get(slug).refs.find((r: any) => r.field === 'id_tipo_doc_iden');
    expect([ref.catalog, ref.where, ref.activeOnly]).toEqual(['tipos-doc-iden', { persona: true, estado: true }, true]);
  });

  it('the declared lengths and the hook agree: maxWhen mirrors state()', () => {
    const numero = field('choferes', 'numero_doc');
    for (const [tipo, max] of [['01', 8], ['05', 11], ['04', 11]] as const) {
      const declared = numero.maxWhen.find((r: any) => r.when.in.includes(tipo))?.len ?? numero.max;
      expect((docIdentidad.state({ id_tipo_doc_iden: tipo }) as any).numero_doc.max).toBe(declared);
      expect(declared).toBe(max);
    }
  });

  it('S-REF-39 the Chofer form has no activation tab, history grid or percepcion flags', () => {
    expect(REGISTRY.bySlug.get('choferes').fields.map((f: any) => f.name)).toEqual([
      'id_chofer', 'id_tipo_doc_iden', 'numero_doc', 'ap_paterno', 'ap_materno', 'nombres', 'descripcion', 'nro_licencia', 'direccion', 'sexo', 'telefono', 'celular', 'id_nacionalidad', 'estado',
    ]);
  });

  it('R-REF-8 the Socio form is the tipo, the number, the names, the razon social and the read-only estado', () => {
    const entry = REGISTRY.bySlug.get('socios');
    expect(entry.fields.map((f: any) => f.name)).toEqual(['id_socio', 'id_tipo_doc_iden', 'numero_doc', 'ap_paterno', 'ap_materno', 'nombres', 'descripcion', 'estado']);
    expect([field('socios', 'estado').default, field('socios', 'estado').readOnlyOn]).toEqual([{ INSERT: true }, ['INSERT', 'CLONE', 'DETAIL', 'DELETE', 'UPDATE']]);
  });

  it('the desktop scope: Chofer stamps the session user (mantChofer), Socio stamps nothing (mantSocio comments the user out); both tenant-wide', () => {
    const [chofer, socio] = ['choferes', 'socios'].map((slug) => REGISTRY.bySlug.get(slug));
    expect([chofer.scope, chofer.stamp, chofer.codeWidth, chofer.constants]).toEqual(['tenant', ['id_usuario'], 10, { flag_tipo_persona: 'N', id_tipo_anexo: '7' }]);
    expect([socio.scope, socio.stamp, socio.codeWidth, socio.rules[0].params.persona]).toEqual(['tenant', [], 0, 'flag_tipo_persona']);
  });

  it('R-REF-6 the Chofer starts on DNI and PERUANA (INSERT only), the Socio on no tipo', () => {
    expect([field('choferes', 'id_tipo_doc_iden').default, field('choferes', 'id_nacionalidad').default, field('choferes', 'sexo').default]).toEqual([{ INSERT: '01' }, { INSERT: '001' }, 'M']);
    const seed = loadSeed(dataDir);
    expect(seed.nacionalidades.demo.find((r: any) => r.id_nacionalidad === '001').descripcion).toBe('PERUANA');
    expect(field('socios', 'id_tipo_doc_iden').default).toBeUndefined();
  });
});

// S-REF-37: the same table against the in-browser mock and the HTTP mock.
describeRegistryContract(
  'in-browser mock (documents)',
  (slug, ctx) => {
    const mock = createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => ctx, delayMs: 0 });
    return { catalog: mock.catalog(slug), lookup: mock.lookup };
  },
  DOCUMENT_CASES,
);

const server = useTestServer({ seed: loadSeed(dataDir) });
describeRegistryContract(
  'http mock server (documents)',
  (slug, ctx) => {
    const client = createHttpClient({ baseUrl: server.url(), getSession: session, getRequestContext: () => ctx });
    return { catalog: createCatalogServiceHttp(client, slug), lookup: createLookupServiceHttp(client) };
  },
  DOCUMENT_CASES,
);
