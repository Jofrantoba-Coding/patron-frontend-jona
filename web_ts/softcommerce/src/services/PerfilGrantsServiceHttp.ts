import { parsePermissions } from '../domain/permissions';
import type { InterPerfilGrantsService, PerfilForm, PerfilMenuNode } from './InterPerfilGrantsService';
import type { HttpClient } from './httpClient';

/** Fail closed like the login snapshot: only a literal `true` is a granted flag. */
const parseForms = (items: unknown[]): PerfilForm[] => items.map((raw) => ({ formId: String((raw as { formId?: unknown }).formId), ...parsePermissions(raw) }));

export function createPerfilGrantsServiceHttp(client: HttpClient): InterPerfilGrantsService {
  const base = (perfilId: string) => `/v1/tipos-trabajador-perfil/${encodeURIComponent(perfilId)}`;
  const form = (perfilId: string, formId: string) => `${base(perfilId)}/permisos/${encodeURIComponent(formId)}`;
  return {
    async menu(perfilId) {
      return (await client.request<{ items: PerfilMenuNode[] }>('GET', `${base(perfilId)}/menu`)).items;
    },
    async saveMenu(perfilId, changes) {
      return (await client.request<{ items: PerfilMenuNode[] }>('PUT', `${base(perfilId)}/menu`, { body: changes })).items;
    },
    async permisos(perfilId) {
      return parseForms((await client.request<{ items: unknown[] }>('GET', `${base(perfilId)}/permisos`)).items);
    },
    async permiso(perfilId, formId) {
      return parsePermissions(await client.request('GET', form(perfilId, formId)));
    },
    async savePermisos(perfilId, changes) {
      return parseForms((await client.request<{ items: unknown[] }>('PUT', `${base(perfilId)}/permisos`, { body: changes })).items);
    },
    async savePermiso(perfilId, formId, changes) {
      return parsePermissions(await client.request('PUT', form(perfilId, formId), { body: changes }));
    },
  };
}
