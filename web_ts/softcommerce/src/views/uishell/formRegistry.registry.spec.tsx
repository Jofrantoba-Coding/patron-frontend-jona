import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useTestServer } from '../../../mock-server/http/test-server';
import { REGISTRY } from '../../../mock-server/registry/index.js';
import { validateRegistry } from '../../../mock-server/registry/schema.js';
import { PERMISSION_FLAGS, type Permissions } from '../../domain/permissions';
import { createCatalogServiceHttp } from '../../services/CatalogServiceHttp';
import { createLookupServiceHttp } from '../../services/LookupServiceHttp';
import { ServicesProvider } from '../../services/ServicesContext';
import { createHttpClient } from '../../services/httpClient';
import { createAppServicesMock } from '../../services/mock/AppServicesMock';
import { seed } from '../../services/mock/seed';
import type { AppServices } from '../../services/serviceComposer';
import { UiLocalidad } from '../uilocalidad';
import { DialogStackProvider } from './DialogStackProvider';
import { buildFormRegistry, findForm, formRegistry } from './formRegistry';

const granted = Object.fromEntries(PERMISSION_FLAGS.map((f) => [f, true])) as Permissions;

describe('formRegistry derived from the catalog registry (G15)', () => {
  it('S-REG-12 every registry formId resolves to a form; Localidad keeps its own unit', () => {
    for (const entry of REGISTRY.entries.filter((e: any) => e.formId)) {
      expect(findForm(formRegistry, entry.formId), entry.formId).toBeDefined();
    }
    expect(findForm(formRegistry, 'mi_localidad')).toBe(UiLocalidad);
  });

  it('keeps unregistered names unknown', () => {
    expect(findForm(formRegistry, 'miFormularioInexistente')).toBeUndefined();
  });
});

describe('S-REG-1 one entry drives both sources', () => {
  const minimal = validateRegistry([
    {
      slug: 'cosas', idKey: 'id_cosa', codeWidth: 3, entity: 'un Cosa', scope: 'tenant', seed: 'cosas', stamp: ['id_usuario'],
      formId: 'miCosa', title: 'Cosa', messages: { style: 'M1' },
      fields: [
        { name: 'id_cosa', kind: 'code', label: 'Código' },
        { name: 'descripcion', kind: 'text', label: 'Descripción', required: true, max: 100 },
      ],
      columns: [{ key: 'id_cosa', header: 'Código' }, { key: 'descripcion', header: 'Descripción' }],
    },
  ]);
  const data = { ...seed, cosas: { demo: [{ id_cosa: '001', descripcion: 'Primera', activo: true }] } };
  const Form = findForm(buildFormRegistry(minimal), 'miCosa')!;
  const show = (services: AppServices) =>
    render(
      <ServicesProvider services={services}>
        <DialogStackProvider>
          <Form permissions={granted} />
        </DialogStackProvider>
      </ServicesProvider>,
    );

  it('lists against the in-browser mock with no other code change', async () => {
    show(createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), delayMs: 0, registry: minimal, seed: data }) as AppServices);
    expect(await screen.findByText('Primera')).toBeTruthy();
  });

  const server = useTestServer({ seed: data, registry: minimal });
  it('lists against the HTTP mock with no other code change', async () => {
    const client = createHttpClient({ baseUrl: server.url(), getSession: () => ({ tenantId: 'demo' }) });
    show({ lookup: createLookupServiceHttp(client), catalog: (name: string) => createCatalogServiceHttp(client, name) } as unknown as AppServices);
    expect(await screen.findByText('Primera')).toBeTruthy();
  });
});
