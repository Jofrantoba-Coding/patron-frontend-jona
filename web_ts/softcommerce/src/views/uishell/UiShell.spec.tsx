import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { MenuItem } from '../../domain/menuTree';
import { DENY_ALL } from '../../domain/permissions';
import { ApiError } from '../../services/ApiError';
import type { InterShellService } from '../../services/InterShellService';
import { UiDemoStub } from '../uidemostub';
import { UiShell } from './UiShell';

const menu: MenuItem[] = [
  { id_menu: 1, id_menu_padre: null, menu_item: 'N', descripcion: 'Maestros', nombre: 'mnMaestros' },
  { id_menu: 2, id_menu_padre: 1, menu_item: 'S', descripcion: 'Alfa', nombre: 'form_a' },
  { id_menu: 3, id_menu_padre: 1, menu_item: 'S', descripcion: 'Beta', nombre: 'form_b' },
  { id_menu: 4, id_menu_padre: 1, menu_item: 'S', descripcion: 'Pantalla X', nombre: 'form_x' },
];
const registry = { form_a: UiDemoStub, form_b: UiDemoStub };
const EMPTY_MESSAGE = 'Abra una opción del menú para comenzar.';

function fakeShell(overrides: Partial<InterShellService> = {}): InterShellService {
  return {
    menu: vi.fn(async () => menu),
    permissions: vi.fn(async () => ({ ...DENY_ALL, add: true })),
    ...overrides,
  };
}

async function renderShell(service = fakeShell()) {
  const user = userEvent.setup();
  render(<UiShell service={service} registry={registry} />);
  await user.click(await screen.findByRole('button', { name: 'Maestros' }));
  return { user, service };
}

const leaf = (name: string) => screen.getByRole('button', { name });
const tabNames = () => screen.queryAllByRole('tab').map((tab) => tab.textContent);
// Inactive panels are `hidden`, which removes their accessible name, so they are found by attribute.
const panelEl = (name: string) =>
  screen.getAllByRole('tabpanel', { hidden: true }).find((el) => el.getAttribute('aria-label') === name)!;
const panel = (name: string) => within(panelEl(name));

describe('UiShell tab workspace', () => {
  it('S-SHELL-4 opens a tab titled by the menu description and selects it', async () => {
    const { user, service } = await renderShell();

    await user.click(leaf('Alfa'));

    expect(tabNames()).toEqual(['Alfa']);
    expect(screen.getByRole('tab', { name: 'Alfa' }).getAttribute('aria-selected')).toBe('true');
    expect(await screen.findByText('Acciones permitidas: add')).toBeTruthy();
    expect(service.permissions).toHaveBeenCalledWith('form_a');
  });

  it('S-SHELL-11 two forms get two tabs and each keeps its own state when switching', async () => {
    const { user } = await renderShell();
    await user.click(leaf('Alfa'));
    await user.type(await panel('Alfa').findByLabelText('Filtro'), 'uno');
    await user.click(leaf('Beta'));
    await user.type(await panel('Beta').findByLabelText('Filtro'), 'dos');

    await user.click(screen.getByRole('tab', { name: 'Alfa' }));

    expect(tabNames()).toEqual(['Alfa', 'Beta']);
    expect((panel('Alfa').getByLabelText('Filtro') as HTMLInputElement).value).toBe('uno');
    expect((panel('Beta').getByLabelText('Filtro') as HTMLInputElement).value).toBe('dos');
    expect(panelEl('Alfa').hidden).toBe(false);
    expect(panelEl('Beta').hidden).toBe(true);
  });

  it('S-SHELL-10 re-selecting an open form selects its tab, adds none, does not refetch and keeps the filter', async () => {
    const { user, service } = await renderShell();
    await user.click(leaf('Alfa'));
    await user.type(await panel('Alfa').findByLabelText('Filtro'), 'lim');
    await user.click(leaf('Beta'));
    await panel('Beta').findByLabelText('Filtro');

    await user.click(leaf('Alfa'));

    expect(tabNames()).toEqual(['Alfa', 'Beta']);
    expect(screen.getByRole('tab', { name: 'Alfa' }).getAttribute('aria-selected')).toBe('true');
    expect((panel('Alfa').getByLabelText('Filtro') as HTMLInputElement).value).toBe('lim');
    expect(panelEl('Alfa').hidden).toBe(false);
    expect(service.permissions).toHaveBeenCalledTimes(2);
  });

  it('S-SHELL-13 shows the empty workspace message until a tab opens and again after the last one closes', async () => {
    const { user } = await renderShell();
    expect(screen.getByText(EMPTY_MESSAGE)).toBeTruthy();

    await user.click(leaf('Alfa'));
    expect(screen.queryByText(EMPTY_MESSAGE)).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Cerrar pestaña Alfa' }));
    expect(tabNames()).toEqual([]);
    expect(screen.getByText(EMPTY_MESSAGE)).toBeTruthy();
  });

  it('closing the active tab selects its neighbor', async () => {
    const { user } = await renderShell();
    await user.click(leaf('Alfa'));
    await user.click(leaf('Beta'));

    await user.click(screen.getByRole('button', { name: 'Cerrar pestaña Beta' }));

    expect(tabNames()).toEqual(['Alfa']);
    expect(screen.getByRole('tab', { name: 'Alfa' }).getAttribute('aria-selected')).toBe('true');
  });

  it('S-SHELL-14 reopening a closed form opens a fresh tab and reloads its permissions', async () => {
    const { user, service } = await renderShell();
    await user.click(leaf('Alfa'));
    await user.type(await panel('Alfa').findByLabelText('Filtro'), 'viejo');
    await user.click(screen.getByRole('button', { name: 'Cerrar pestaña Alfa' }));

    await user.click(leaf('Alfa'));

    expect(service.permissions).toHaveBeenCalledTimes(2);
    expect(((await panel('Alfa').findByLabelText('Filtro')) as HTMLInputElement).value).toBe('');
  });
});

describe('UiShell menu states', () => {
  it('S-SHELL-5 an unknown leaf shows a not-available notice and opens no tab', async () => {
    const { user } = await renderShell();

    await user.click(leaf('Pantalla X'));

    const notice = screen.getByRole('alertdialog');
    expect(notice.textContent).toContain('Pantalla X');
    expect(notice.textContent).toContain('no está disponible');
    expect(tabNames()).toEqual([]);

    await user.click(within(notice).getByRole('button', { name: 'Cerrar' }));
    expect(screen.queryByRole('alertdialog')).toBeNull();
  });

  it('S-SHELL-16 Esc closes the notice registered in the stack and leaves the open tab alone', async () => {
    const { user } = await renderShell();
    await user.click(leaf('Alfa'));
    await user.click(leaf('Pantalla X'));
    expect(screen.getByRole('alertdialog')).toBeTruthy();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect(tabNames()).toEqual(['Alfa']);
  });

  it('shows a loading message while the menu loads', async () => {
    let resolve!: (items: MenuItem[]) => void;
    const service = fakeShell({ menu: () => new Promise<MenuItem[]>((r) => (resolve = r)) });
    render(<UiShell service={service} registry={registry} />);

    expect(screen.getByText('Cargando menú...')).toBeTruthy();
    resolve(menu);
    expect(await screen.findByRole('button', { name: 'Maestros' })).toBeTruthy();
    expect(screen.queryByText('Cargando menú...')).toBeNull();
  });

  it('S-SHELL-6 a menu error offers retry and keeps the workspace usable', async () => {
    const failure = new ApiError(500, { code: 'INTERNAL_ERROR', message: 'Menu unavailable', details: [], traceId: 'trace-9' });
    const menuFn = vi.fn<InterShellService['menu']>().mockRejectedValueOnce(failure).mockResolvedValue(menu);
    const user = userEvent.setup();
    render(<UiShell service={fakeShell({ menu: menuFn })} registry={registry} />);

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain('Menu unavailable');
    expect(alert.textContent).toContain('trace-9');
    expect(screen.getByText(EMPTY_MESSAGE)).toBeTruthy();

    await user.click(screen.getByRole('button', { name: 'Reintentar' }));

    expect(await screen.findByRole('button', { name: 'Maestros' })).toBeTruthy();
    expect(screen.queryByRole('alert')).toBeNull();
    expect(menuFn).toHaveBeenCalledTimes(2);
  });
});
