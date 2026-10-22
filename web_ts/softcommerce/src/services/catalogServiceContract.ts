import { describe, expect, it } from 'vitest';
import { ApiError } from './ApiError';
import type { InterCatalogService } from './InterCatalogService';
import type { SessionContext } from './httpClient';

/** Subset of a localidad row the contract asserts on. */
export interface LocalidadRow {
  id_localidad: string;
  id_empresa: string;
  descripcion: string;
  direccion?: string;
  id_ubigeo: string;
  empresa?: string;
}

export type CatalogServiceFactory = (getSession: () => SessionContext) => InterCatalogService<LocalidadRow>;

const NEW_LOCALIDAD = { id_empresa: '1', descripcion: 'LOCAL NUEVO', direccion: 'AV. X 1', id_ubigeo: '150101' };

/**
 * Behavior both implementations must share (dual-source parity), exercised on the
 * `localidades` catalog: the http client against the live mock server and the in-browser mock.
 */
export function describeCatalogServiceContract(label: string, make: CatalogServiceFactory): void {
  describe(`InterCatalogService contract: ${label}`, () => {
    /** One service per call: the in-browser mock keeps its store per instance. */
    const demo = () => make(() => ({ tenantId: 'demo' }));

    it('lists active records as { items, pagination }, excluding inactive ones', async () => {
      const page = await demo().list();

      expect(page.items.map((r) => r.id_localidad)).toEqual(['1', '2', '3', '4']);
      expect(page.items[0]).toMatchObject({ descripcion: 'LOCAL CENTRAL', empresa: 'COMERCIAL DEMO SAC' });
      expect(page.pagination).toEqual({ page: 1, pageSize: 20, total: 4 });
    });

    it('pages with page and pageSize while total keeps counting every active record', async () => {
      const page = await demo().list({ page: 2, pageSize: 3 });

      expect(page.items.map((r) => r.id_localidad)).toEqual(['4']);
      expect(page.pagination).toEqual({ page: 2, pageSize: 3, total: 4 });
    });

    it('filters by a field substring, case-insensitively', async () => {
      const page = await demo().list({ filters: { descripcion: 'local' } });

      expect(page.items.map((r) => r.descripcion)).toEqual(['LOCAL CENTRAL', 'LOCAL ATE']);
      expect(page.pagination.total).toBe(2);
    });

    it('gets one record by id and rejects an unknown id with 404', async () => {
      const found = await demo().get('3');
      const missing = await demo().get('999').catch((e: unknown) => e);

      expect(found.descripcion).toBe('ALMACEN CALLAO');
      expect(missing).toBeInstanceOf(ApiError);
      expect(missing).toMatchObject({ status: 404 });
    });

    it('creates a record, returning it with an id, and lists it afterwards', async () => {
      const service = demo();
      const created = await service.create(NEW_LOCALIDAD);

      expect(created).toMatchObject({ descripcion: 'LOCAL NUEVO', id_empresa: '1' });
      expect((await service.list()).items.map((r) => r.id_localidad)).toContain(created.id_localidad);
    });

    it('rejects an invalid create with ApiError 422 naming the field', async () => {
      const error = await demo().create({ ...NEW_LOCALIDAD, descripcion: '' }).catch((e: unknown) => e);

      expect(error).toBeInstanceOf(ApiError);
      expect(error).toMatchObject({ status: 422 });
      expect((error as ApiError).details.map((d) => d.field)).toContain('descripcion');
    });

    it('updates by id, merging over the stored record', async () => {
      const updated = await demo().update('1', { descripcion: 'LOCAL RENOMBRADO' });

      expect(updated).toMatchObject({ id_localidad: '1', descripcion: 'LOCAL RENOMBRADO', id_ubigeo: '150101' });
    });

    it('removes logically: the record leaves the list but a direct get still finds it', async () => {
      const service = demo();
      await service.remove('2');

      expect((await service.list()).items.map((r) => r.id_localidad)).toEqual(['1', '3', '4']);
      await expect(service.get('2')).resolves.toMatchObject({ id_localidad: '2' });
    });

    it('S-LOC-17 exposes logical remove only: no physical-delete method', () => {
      expect(Object.keys(demo()).sort()).toEqual(['create', 'get', 'list', 'remove', 'update']);
    });

    it('rejects without a tenant (400) or with an unknown one (404)', async () => {
      const call = (tenantId?: string) => make(() => ({ tenantId })).list().then(() => undefined, (e: unknown) => e);

      expect(await call()).toMatchObject({ status: 400, code: 'TENANT_REQUIRED' });
      expect(await call('nope')).toMatchObject({ status: 404, code: 'TENANT_NOT_FOUND' });
    });
  });
}
