import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { DENY_ALL } from '../../domain/permissions';
import type { InterPerfilGrantsService, PerfilMenuNode } from '../../services/InterPerfilGrantsService';
import { ServicesProvider } from '../../services/ServicesContext';
import type { AppServices } from '../../services/serviceComposer';
import { DialogStackProvider } from '../uishell/DialogStackProvider';
import { UiSeguridadPerfil } from './UiSeguridadPerfil';

export const perfiles = [
  { id_tipo_perfil: '1', descripcion: 'VENDEDOR', id_tipo_trabajador: '001', tipo_trabajador: 'VENTAS' },
  { id_tipo_perfil: '2', descripcion: 'CAJERO', id_tipo_trabajador: '002', tipo_trabajador: 'CAJA' },
];
export const tipos = [
  { id_tipo_trabajador: '001', descripcion: 'VENTAS', estado: true },
  { id_tipo_trabajador: '002', descripcion: 'CAJA', estado: true },
];
const node = (id_menu: number, id_menu_padre: number | null, menu_item: 'S' | 'N', descripcion: string, nombre: string, visible = true): PerfilMenuNode => ({
  id_menu, id_menu_padre, menu_item, descripcion, nombre, visible,
});
/** Maestros > Generales > (Aduana, Color), plus Ventas > Registro (unchecked) and a leaf with no form. */
export const menu = (): PerfilMenuNode[] => [
  node(1, null, 'N', 'Maestros', 'mnMaestros'),
  node(2, 1, 'N', 'Generales', 'mnGenerales'),
  node(3, 2, 'S', 'Aduana', 'miAduana'),
  node(4, 2, 'S', 'Color', 'miColor'),
  node(5, null, 'N', 'Ventas', 'mnVentas'),
  node(6, 5, 'S', 'Registro de Ventas', 'miVentas', false),
];

export type Grants = { [K in keyof InterPerfilGrantsService]: ReturnType<typeof vi.fn> };

export function fakeGrants(over: Partial<Grants> = {}): Grants {
  return {
    menu: vi.fn(async () => menu()),
    saveMenu: vi.fn(async () => menu()),
    permisos: vi.fn(async () => []),
    permiso: vi.fn(async () => ({ ...DENY_ALL })),
    savePermisos: vi.fn(async () => []),
    savePermiso: vi.fn(async () => ({ ...DENY_ALL })),
    ...over,
  } as Grants;
}

export async function openScreen(grants: Grants = fakeGrants()) {
  const page = (items: unknown[]) => ({ items, pagination: { page: 1, pageSize: 1000, total: items.length } });
  const services = {
    catalog: (name: string) => ({ list: async () => page(name === 'tipos-trabajador-perfil' ? perfiles : tipos) }),
    perfilGrants: grants,
  } as unknown as AppServices;
  render(
    <ServicesProvider services={services}>
      <DialogStackProvider>
        <UiSeguridadPerfil permissions={{ ...DENY_ALL }} />
      </DialogStackProvider>
    </ServicesProvider>,
  );
  await screen.findByText('VENDEDOR');
  return { user: userEvent.setup(), grants, loaded: (name: string) => waitFor(() => screen.getByRole('checkbox', { name })) };
}

/** The perfil rows of the left list (not the `<option>`s of the tipo select). */
export const perfilRows = () => within(screen.getByRole('listbox', { name: 'Perfiles' })).queryAllByRole('option');

/** The seeded `miAduana` grants: every flag but `nullify`, `report`, `export`, `print` and `printFast`. */
export const ADUANA_FLAGS = { ...DENY_ALL, add: true, modify: true, eliminate: true, clone: true, details: true, search: true, close: true, refresh: true };
export const forms = () => [
  { formId: 'miAduana', ...ADUANA_FLAGS },
  { formId: 'miColor', ...ADUANA_FLAGS, eliminate: false },
];
