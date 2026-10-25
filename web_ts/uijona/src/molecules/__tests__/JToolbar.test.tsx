import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { vi } from 'vitest';
import { JToolbar, JToolbarItem } from '../JToolbar';
import { JDialog } from '../JDialog';
import { seriousViolations } from '../../__tests__/quality/axe';

const ITEMS: JToolbarItem[] = [
  { id: 'add', label: 'Agregar', tone: 'primary', shortcut: 'Alt+A', group: 'edit' },
  { id: 'edit', label: 'Modificar', disabled: true, disabledReason: 'Seleccione un registro', group: 'edit' },
  { id: 'clone', label: 'Clonar', group: 'edit' },
  { id: 'delete', label: 'Eliminar', tone: 'danger', group: 'danger' },
];

const OVERFLOW: JToolbarItem[] = [
  ...ITEMS,
  { id: 'search', label: 'Buscar', overflow: true },
  { id: 'export', label: 'Exportar', overflow: true, disabled: true, disabledReason: 'Sin datos' },
];

const keyDown = (key: string) => fireEvent.keyDown(document.activeElement as Element, { key });

describe('JToolbar (R-DAT-5, R-DAT-6)', () => {
  it('S-DAT-16: a named toolbar with one separator between two groups', () => {
    render(<JToolbar ariaLabel="Acciones" items={ITEMS} onAction={() => undefined} />);

    const toolbar = screen.getByRole('toolbar', { name: 'Acciones' });
    expect(within(toolbar).getAllByRole('separator')).toHaveLength(1);
    expect(within(toolbar).getAllByRole('button').map((button) => button.textContent)).toEqual([
      'Agregar',
      'Modificar',
      'Clonar',
      'Eliminar',
    ]);
  });

  it('S-DAT-17: → skips a disabled item, ← goes back, End and Home jump; one tab stop', () => {
    render(<JToolbar ariaLabel="Acciones" items={ITEMS} onAction={() => undefined} />);
    const add = screen.getByRole('button', { name: 'Agregar' });
    const enabled = ['Agregar', 'Clonar', 'Eliminar'].map((name) => screen.getByRole('button', { name }));
    expect(enabled.map((button) => button.tabIndex)).toEqual([0, -1, -1]);

    add.focus();
    keyDown('ArrowRight');
    expect(screen.getByRole('button', { name: 'Clonar' })).toHaveFocus();
    expect(enabled.map((button) => button.tabIndex)).toEqual([-1, 0, -1]);

    keyDown('ArrowLeft');
    expect(add).toHaveFocus();

    keyDown('End');
    expect(screen.getByRole('button', { name: 'Eliminar' })).toHaveFocus();

    keyDown('Home');
    expect(add).toHaveFocus();
  });

  it('S-DAT-18: a disabled item is natively disabled, keeps its name and is described by its reason', () => {
    const onAction = vi.fn();
    render(<JToolbar ariaLabel="Acciones" items={ITEMS} onAction={onAction} />);

    const edit = screen.getByRole('button', { name: 'Modificar' });
    expect(edit).toBeDisabled();
    expect(edit).toHaveAccessibleDescription('Seleccione un registro');
    expect(edit).toHaveAttribute('title', 'Seleccione un registro');

    fireEvent.click(edit);
    expect(onAction).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Clonar' }));
    expect(onAction).toHaveBeenCalledWith('clone');
  });

  it('S-DAT-19: a shortcut sets aria-keyshortcuts and the tooltip; the toolbar does not listen to it', () => {
    const onAction = vi.fn();
    render(<JToolbar ariaLabel="Acciones" items={ITEMS} onAction={onAction} />);

    const add = screen.getByRole('button', { name: 'Agregar' });
    expect(add).toHaveAttribute('aria-keyshortcuts', 'Alt+A');
    expect(add).toHaveAttribute('title', 'Agregar (Alt+A)');

    add.focus();
    fireEvent.keyDown(add, { key: 'a', altKey: true });
    expect(onAction).not.toHaveBeenCalled();
  });

  it('S-DAT-20: overflow items are listed in the Más acciones menu, not as toolbar buttons', () => {
    const onAction = vi.fn();
    render(<JToolbar ariaLabel="Acciones" items={OVERFLOW} onAction={onAction} />);

    expect(screen.queryByRole('button', { name: 'Buscar' })).toBeNull();
    const more = screen.getByRole('button', { name: 'Más acciones' });
    expect(more).toHaveAttribute('aria-haspopup', 'menu');
    expect(more).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(more);

    expect(more).toHaveAttribute('aria-expanded', 'true');
    const menu = screen.getByRole('menu', { name: 'Más acciones' });
    const items = within(menu).getAllByRole('menuitem');
    expect(items.map((item) => item.textContent)).toEqual(['Buscar', 'Exportar']);
    expect(items[0]).toHaveFocus();
    expect(items[1]).toHaveAttribute('aria-disabled', 'true');
    expect(items[1]).toHaveAccessibleDescription('Sin datos');

    fireEvent.click(items[1]);
    expect(onAction).not.toHaveBeenCalled();

    fireEvent.click(items[0]);
    expect(onAction).toHaveBeenCalledWith('search');
    expect(screen.queryByRole('menu')).toBeNull();
    expect(more).toHaveFocus();
  });

  it('S-DAT-20: the menu moves with ↑ / ↓ and the overflow button is in the toolbar roving set', () => {
    render(<JToolbar ariaLabel="Acciones" items={OVERFLOW} onAction={() => undefined} />);
    screen.getByRole('button', { name: 'Agregar' }).focus();

    keyDown('End');
    const more = screen.getByRole('button', { name: 'Más acciones' });
    expect(more).toHaveFocus();

    fireEvent.click(more);
    keyDown('ArrowDown');
    expect(screen.getByRole('menuitem', { name: 'Exportar' })).toHaveFocus();
    keyDown('ArrowUp');
    expect(screen.getByRole('menuitem', { name: 'Buscar' })).toHaveFocus();
    keyDown('ArrowLeft');
    expect(screen.getByRole('menuitem', { name: 'Buscar' })).toHaveFocus();
  });

  it('S-DAT-21: without overflow items there is no Más acciones button', () => {
    render(<JToolbar ariaLabel="Acciones" items={ITEMS} onAction={() => undefined} />);

    expect(screen.queryByRole('button', { name: 'Más acciones' })).toBeNull();
  });

  it('takes a custom overflow label', () => {
    render(<JToolbar ariaLabel="Acciones" items={OVERFLOW} overflowLabel="Otras" onAction={() => undefined} />);

    expect(screen.getByRole('button', { name: 'Otras' })).toBeInTheDocument();
  });

  it('D9: Esc closes the overflow menu and leaves a JDialog beneath open', () => {
    const onClose = vi.fn();
    render(
      <JDialog open title="Cliente" onClose={onClose}>
        <JToolbar ariaLabel="Acciones" items={OVERFLOW} onAction={() => undefined} />
      </JDialog>,
    );
    const more = screen.getByRole('button', { name: 'Más acciones' });
    fireEvent.click(more);
    const item = screen.getByRole('menuitem', { name: 'Buscar' });

    act(() => {
      item.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    });

    expect(screen.queryByRole('menu')).toBeNull();
    expect(more).toHaveFocus();
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog', { name: 'Cliente' })).toBeInTheDocument();
  });

  it('D9: an outside pointer press closes the overflow menu', () => {
    render(
      <>
        <JToolbar ariaLabel="Acciones" items={OVERFLOW} onAction={() => undefined} />
        <p>Fuera</p>
      </>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Más acciones' }));

    fireEvent.pointerDown(screen.getByText('Fuera'));

    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('has no serious axe violations, closed and open', async () => {
    const { container } = render(<JToolbar ariaLabel="Acciones" items={OVERFLOW} onAction={() => undefined} />);
    expect(await seriousViolations(container)).toEqual([]);

    fireEvent.click(screen.getByRole('button', { name: 'Más acciones' }));
    expect(await seriousViolations(container)).toEqual([]);
  });
});
