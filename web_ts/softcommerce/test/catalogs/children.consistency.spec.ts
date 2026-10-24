import { describe, expect, it } from 'vitest';
import { CHILD_REGISTRY, CHILD_SEED, parentEntry } from '../../mock-server/core/children.fixture';
import { useTestServer } from '../../mock-server/http/test-server';
import { validateRegistry } from '../../mock-server/registry/schema.js';
import { toCatalogConfig } from '../../src/catalogs/registry';
import { createChildServiceHttp } from '../../src/services/ChildServiceHttp';
import type { InterChildService } from '../../src/services/InterChildService';
import { createHttpClient } from '../../src/services/httpClient';
import { createAppServicesMock } from '../../src/services/mock/AppServicesMock';
import { findDrift } from './drift';

/**
 * S-REG-21 child consistency (R-REG-14): the UI config of a child, the HTTP mock and the in-browser mock expose the same `max` for a child field.
 * Each source is probed through its nested route: a value of `max` characters is accepted and one more is a 422 `MAX_LENGTH`. Every message names the
 * parent, the child and the field.
 */
type Source = { label: string; children: InterChildService };

async function childDrift(parent: string, child: string, field: string, valid: Record<string, string>, sources: Source[], registry = CHILD_REGISTRY): Promise<string[]> {
  const entry = registry.bySlug.get(`${parent}/${child}`);
  const at = `${parent}.${child}.${field}`;
  const ui = toCatalogConfig(entry, registry);
  const drift = findDrift(ui, entry).map((message) => `${parent}.${child}: ${message}`);
  const max = (ui.fields.find((f) => f.name === field) as any).maxLength as number;
  for (const { label, children } of sources) {
    const attempt = async (length: number) => {
      try { await children.create('002', child, { ...valid, [field]: 'x'.repeat(length) }); return 'accepted'; } catch (e: any) { return e.details?.[0]?.code ?? e.code; }
    };
    if ((await attempt(max)) !== 'accepted') drift.push(`${at}: ${label} rejects ${max} characters (UI maxLength ${max})`);
    if ((await attempt(max + 1)) !== 'MAX_LENGTH') drift.push(`${at}: ${label} accepts ${max + 1} characters (UI maxLength ${max})`);
  }
  return drift;
}

const session = () => ({ tenantId: 'a' });
const mockOver = (registry: typeof CHILD_REGISTRY): Source => ({
  label: 'in-browser mock',
  children: createAppServicesMock('exitoso', { getSession: session, delayMs: 0, registry, seed: CHILD_SEED }).children('clientes'),
});
const server = useTestServer({ seed: CHILD_SEED, registry: CHILD_REGISTRY });
const drifted = validateRegistry([
  parentEntry('clientes', {
    children: { ...parentEntry('clientes').children, direcciones: { ...parentEntry('clientes').children.direcciones, fields: [{ name: 'direccion', kind: 'text', label: 'direccion', required: true, max: 41 }] } },
  }),
]);
const driftedServer = useTestServer({ seed: CHILD_SEED, registry: drifted });
const httpOver = (url: string): Source => ({ label: 'http mock server', children: createChildServiceHttp(createHttpClient({ baseUrl: url, getSession: session }), 'clientes') });

describe('S-REG-21 child consistency: UI config vs HTTP mock vs in-browser mock', () => {
  it('has no drift when the three sources agree', async () => {
    const sources = [mockOver(CHILD_REGISTRY), httpOver(server.url())];
    expect(await childDrift('clientes', 'direcciones', 'direccion', {}, sources)).toEqual([]);
    expect(await childDrift('clientes', 'contactos', 'nombre', {}, sources)).toEqual([]);
  });

  it('fails naming the parent, the child and the field when a max differs in one source (MUTATION: max 41 in the HTTP registry)', async () => {
    const drift = await childDrift('clientes', 'direcciones', 'direccion', {}, [mockOver(CHILD_REGISTRY), httpOver(driftedServer.url())]);
    expect(drift).toEqual(['clientes.direcciones.direccion: http mock server accepts 41 characters (UI maxLength 40)']);
  });

  it('fails naming the parent, the child and the field when the UI config and the entry differ', async () => {
    const entry = CHILD_REGISTRY.bySlug.get('clientes/direcciones');
    const config = toCatalogConfig(entry, CHILD_REGISTRY);
    const bent = { ...config, fields: config.fields.map((f) => (f.name === 'direccion' ? { ...f, maxLength: 39 } : f)) };
    expect(findDrift(bent as any, entry)).toEqual(['clientes/direcciones.direccion: max 40 != UI maxLength 39']);
  });
});
