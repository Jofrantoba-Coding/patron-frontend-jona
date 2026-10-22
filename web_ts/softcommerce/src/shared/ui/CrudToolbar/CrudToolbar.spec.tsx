import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { CrudAction } from '../../../catalogs/CatalogConfig';
import { DEFAULT_ACTIONS } from '../../../domain/crud/toolbarGate';
import { TOOLBAR_SHORTCUTS } from '../../../domain/crud/toolbarShortcuts';
import { DENY_ALL, type Permissions } from '../../../domain/permissions';
import { CrudToolbar } from './CrudToolbar';
import { useCrudToolbarImpl, type CrudToolbarProps } from './CrudToolbarImpl';

const allow = (...flags: (keyof Permissions)[]): Permissions => ({
  ...DENY_ALL,
  ...Object.fromEntries(flags.map((f) => [f, true])),
});
const button = (name: string) => screen.getByRole('button', { name }) as HTMLButtonElement;

describe('CrudToolbar', () => {
  it('S-CRUD-2 enables Agregar and disables Modificar when only add is granted, even with a row selected', () => {
    render(<CrudToolbar actions={['add', 'modify']} permissions={allow('add')} selectedId="7" />);

    expect(button('Agregar').disabled).toBe(false);
    expect(button('Modificar').disabled).toBe(true);
  });

  it('S-CRUD-3 enables Modificar only once a row is selected', () => {
    const { rerender } = render(<CrudToolbar actions={['modify']} permissions={allow('modify')} />);
    expect(button('Modificar').disabled).toBe(true);

    rerender(<CrudToolbar actions={['modify']} permissions={allow('modify')} selectedId="7" />);
    expect(button('Modificar').disabled).toBe(false);
  });

  it('calls onAction with the action when an enabled button is clicked', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<CrudToolbar actions={['add', 'refresh']} permissions={allow('add', 'refresh')} onAction={onAction} />);

    await user.click(button('Agregar'));
    await user.click(button('Actualizar'));

    expect(onAction.mock.calls).toEqual([['add'], ['refresh']]);
  });

  it('S-CRUD-4 / S-SHELL-8 clicking a permission-denied Eliminar sends nothing', async () => {
    const onAction = vi.fn();
    render(<CrudToolbar actions={['eliminate']} permissions={allow('add')} selectedId="7" onAction={onAction} />);

    await userEvent.setup().click(button('Eliminar'));

    expect(button('Eliminar').disabled).toBe(true);
    expect(onAction).not.toHaveBeenCalled();
  });

  it('renders export disabled with a "No disponible" tooltip, even with its flag granted', async () => {
    const onAction = vi.fn();
    render(<CrudToolbar actions={['export']} permissions={allow('export')} selectedId="7" onAction={onAction} />);

    await userEvent.setup().click(button('Exportar'));

    expect(button('Exportar').disabled).toBe(true);
    expect(screen.getByTitle('No disponible')).toBeTruthy();
    expect(onAction).not.toHaveBeenCalled();
  });

  it('exposes the toolbar landmark and only the configured actions in order', () => {
    render(<CrudToolbar actions={['refresh', 'add']} permissions={allow('add')} />);

    expect(screen.getByRole('toolbar', { name: 'Acciones' })).toBeTruthy();
    expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual(['Actualizar', 'Agregar']);
  });
});

describe('useCrudToolbarImpl shortcut path (S-CRUD-4)', () => {
  it('the handler a shortcut would call drops a denied action and forwards a granted one', () => {
    const onAction = vi.fn();
    const denied = renderHook(() =>
      useCrudToolbarImpl({ actions: ['eliminate'], permissions: allow('add'), selectedId: '7', onAction }),
    );
    denied.result.current.onAction?.('eliminate');
    expect(onAction).not.toHaveBeenCalled();

    const granted = renderHook(() =>
      useCrudToolbarImpl({ actions: ['eliminate'], permissions: allow('eliminate'), selectedId: '7', onAction }),
    );
    granted.result.current.onAction?.('eliminate');
    expect(onAction.mock.calls).toEqual([['eliminate']]);
  });
});

const ROW_DEPENDENT: CrudAction[] = ['modify', 'eliminate', 'clone', 'details'];
/** Every toolbar action that can fire, with its Alt+letter from the single map. */
const FIRING = DEFAULT_ACTIONS.map((action) => ({ action, letter: TOOLBAR_SHORTCUTS[action]! }));

/** A toolbar inside its shortcut scope, plus an input outside of it. */
function Scoped(props: Omit<CrudToolbarProps, 'shortcutScope'> & { shortcutsBlocked?: () => boolean }) {
  const scope = useRef<HTMLDivElement>(null);
  return (
    <>
      <input aria-label="fuera" />
      <div ref={scope}>
        <input aria-label="dentro" />
        <CrudToolbar {...props} shortcutScope={scope} />
      </div>
    </>
  );
}

async function press(keys: string, props: Parameters<typeof Scoped>[0], focus = 'dentro') {
  const onAction = vi.fn();
  render(<Scoped selectedId="7" {...props} onAction={onAction} />);
  const user = userEvent.setup();
  await user.click(screen.getByLabelText(focus));
  await user.keyboard(keys);
  return onAction;
}
const alt = (letter: string) => `{Alt>}${letter.toLowerCase()}{/Alt}`;

describe('CrudToolbar shortcuts (Alt+letter, S-CRUD-4 / S-SHELL-8)', () => {
  it.each(FIRING)('a granted $action fires once on Alt+$letter', async ({ action, letter }) => {
    const onAction = await press(alt(letter), { permissions: allow(action) });
    expect(onAction.mock.calls).toEqual([[action]]);
  });

  it.each(FIRING)('a denied $action does nothing on Alt+$letter', async ({ letter }) => {
    expect(await press(alt(letter), { permissions: DENY_ALL })).not.toHaveBeenCalled();
  });

  it.each(ROW_DEPENDENT)('%s needs a selected row, like the click path', async (action) => {
    const onAction = await press(alt(TOOLBAR_SHORTCUTS[action]!), { permissions: allow(action), selectedId: undefined });
    expect(onAction).not.toHaveBeenCalled();
  });

  it('only fires for actions present in the toolbar', async () => {
    expect(await press(alt('A'), { actions: ['refresh'], permissions: allow('add', 'refresh') })).not.toHaveBeenCalled();
  });

  it('is scoped to its container: focus outside it never fires', async () => {
    expect(await press(alt('A'), { permissions: allow('add') }, 'fuera')).not.toHaveBeenCalled();
  });

  it('does nothing while shortcuts are blocked (a dialog is open)', async () => {
    expect(await press(alt('A'), { permissions: allow('add'), shortcutsBlocked: () => true })).not.toHaveBeenCalled();
  });

  it.each(['{Control>}{Alt>}a{/Alt}{/Control}', '{Shift>}{Alt>}A{/Alt}{/Shift}', '{Meta>}{Alt>}a{/Alt}{/Meta}', 'a'])(
    'ignores %s',
    async (keys) => {
      expect(await press(keys, { permissions: allow('add') })).not.toHaveBeenCalled();
    },
  );

  it('prevents the browser default only for a handled shortcut', () => {
    render(<Scoped permissions={allow('add')} />);
    const inside = screen.getByLabelText('dentro');
    expect(fireEvent.keyDown(inside, { altKey: true, code: 'KeyA' })).toBe(false);
    expect(fireEvent.keyDown(inside, { altKey: true, code: 'KeyQ' })).toBe(true);
  });

  it('each button exposes its shortcut through aria-keyshortcuts and its title', () => {
    render(<CrudToolbar actions={['add', 'eliminate']} permissions={allow('add')} />);
    const wrapper = (name: string) => button(name).parentElement!;
    expect(wrapper('Agregar').getAttribute('aria-keyshortcuts')).toBe('Alt+A');
    expect(wrapper('Agregar').title).toBe('Agregar (Alt+A)');
    expect(wrapper('Eliminar').getAttribute('aria-keyshortcuts')).toBe('Alt+E');
    expect(wrapper('Eliminar').title).toBe('Eliminar (Alt+E)');
  });
});
