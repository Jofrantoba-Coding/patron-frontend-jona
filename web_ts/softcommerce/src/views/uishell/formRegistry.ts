// Form registry: the menu `nombre` of a leaf maps to the form it opens. Absent means "not available yet".
import type { ComponentType } from 'react';
import { REGISTRY } from '../../../mock-server/registry/index.js';
import { toCatalogConfig } from '../../catalogs/registry';
import type { Permissions } from '../../domain/permissions';
import { createCatalogForm } from '../uicatalog';
import { UiLocalidad } from '../uilocalidad';
import { UiSeguridadPerfil } from '../uiseguridadperfil';

export type FormComponent = ComponentType<{ permissions: Permissions }>;
export type FormRegistry = Readonly<Record<string, FormComponent>>;

/** One generic `UiCatalog` form per registry entry with a `formId`; Localidad (`compat`) keeps its own unit. */
export const buildFormRegistry = (registry: { entries: any[] }): FormRegistry =>
  Object.fromEntries(
    registry.entries.filter((entry) => entry.formId && !entry.compat).map((entry) => [entry.formId, createCatalogForm(toCatalogConfig(entry))]),
  );

/** Menu `nombre` -> form. W1c-4 swapped the W1b demo stub for Localidad; the Wave 2 catalogs derive from the registry; Seguridad - Perfil is a custom screen registered by hand (D24). */
export const formRegistry: FormRegistry = { ...buildFormRegistry(REGISTRY), mi_localidad: UiLocalidad, mi_SeguridadPerfil: UiSeguridadPerfil };

/** Own keys only, so a menu `nombre` like `constructor` is never mistaken for a form. */
export const findForm = (registry: FormRegistry, nombre: string): FormComponent | undefined =>
  Object.prototype.hasOwnProperty.call(registry, nombre) ? registry[nombre] : undefined;
