import React, { createRef, useState } from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { vi } from 'vitest';
import { InterJWorkspaceTabs, JWorkspaceTab, JWorkspaceTabs, JWorkspaceTabsHandle } from '../JWorkspaceTabs';
import { JDialog } from '../../molecules/JDialog';
import { seriousViolations } from '../../__tests__/quality/axe';

const TABS: JWorkspaceTab[] = [
  { id: 'alfa', title: 'Alfa' },
  { id: 'beta', title: 'Beta' },
  { id: 'gama', title: 'Gama' },
];

const EIGHT: JWorkspaceTab[] = ['Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho'].map((title) => ({
  id: title.toLowerCase(),
  title,
}));

const tabs = (props: Partial<InterJWorkspaceTabs> = {}) => (
  <JWorkspaceTabs
    tabs={TABS}
    activeId="alfa"
    renderPanel={(id) => <p>Contenido {id}</p>}
    onSelect={() => undefined}
    onCloseRequest={() => undefined}
    {...props}
  />
);

const keyDown = (key: string) => fireEvent.keyDown(document.activeElement as Element, { key });

/** A panel with its own state, to prove it survives a tab switch. */
const Counter: React.FC<{ id: string }> = ({ id }) => {
  const [count, setCount] = useState(0);
  return (
    <button type="button" onClick={() => setCount(count + 1)}>
      {id} {count}
    </button>
  );
};

const Host: React.FC<{ initial: string }> = ({ initial }) => {
  const [activeId, setActiveId] = useState(initial);
  return (
    <JWorkspaceTabs
      tabs={TABS}
      activeId={activeId}
      renderPanel={(id) => <Counter id={id} />}
      onSelect={setActiveId}
      onCloseRequest={() => undefined}
    />
  );
};

describe('JWorkspaceTabs (R-CHR-5)', () => {
  it('S-CHR-14: the tablist holds only tabs; the close buttons sit outside it', () => {
    render(tabs());

    const tablist = screen.getByRole('tablist', { name: 'Pestañas de trabajo' });
    const roles = Array.from(tablist.querySelectorAll('[role]')).map((element) => element.getAttribute('role'));
    expect(roles).toEqual(['tab', 'tab', 'tab']);
    ['Alfa', 'Beta', 'Gama'].forEach((title) => {
      const close = screen.getByRole('button', { name: `Cerrar pestaña ${title}` });
      expect(tablist.contains(close)).toBe(false);
    });
    expect(within(tablist).queryAllByRole('button')).toEqual([]);
  });

  it('wires each tab to its panel, named by the tab', () => {
    render(tabs());

    const alfa = screen.getByRole('tab', { name: 'Alfa' });
    expect(alfa).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAttribute('aria-selected', 'false');
    const panel = screen.getByRole('tabpanel', { name: 'Alfa' });
    expect(alfa).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveTextContent('Contenido alfa');
  });

  it('S-CHR-15: the close button and a middle-click request a close; the tab stays until the host removes it', () => {
    const onCloseRequest = vi.fn();
    const onSelect = vi.fn();
    render(tabs({ onCloseRequest, onSelect }));

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar pestaña Alfa' }));
    expect(onCloseRequest).toHaveBeenCalledWith('alfa');

    act(() => {
      screen.getByRole('tab', { name: 'Beta' }).dispatchEvent(
        new MouseEvent('auxclick', { button: 1, bubbles: true, cancelable: true }),
      );
    });
    expect(onCloseRequest).toHaveBeenLastCalledWith('beta');
    expect(onCloseRequest).toHaveBeenCalledTimes(2);
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole('tab', { name: 'Alfa' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Beta' })).toBeInTheDocument();
  });

  it('a right-button auxclick does not request a close', () => {
    const onCloseRequest = vi.fn();
    render(tabs({ onCloseRequest }));

    act(() => {
      screen.getByRole('tab', { name: 'Gama' }).dispatchEvent(
        new MouseEvent('auxclick', { button: 2, bubbles: true, cancelable: true }),
      );
    });

    expect(onCloseRequest).not.toHaveBeenCalled();
  });

  it('S-CHR-16: a dirty tab keeps its name and is described as unsaved', () => {
    render(tabs({ tabs: [{ id: 'alfa', title: 'Alfa', dirty: true }, TABS[1]] }));

    const alfa = screen.getByRole('tab', { name: 'Alfa' });
    expect(alfa).toHaveAccessibleName('Alfa');
    expect(alfa).toHaveAccessibleDescription('Cambios sin guardar');
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAccessibleDescription('');
  });

  it('custom close and dirty labels', () => {
    render(
      tabs({
        tabs: [{ id: 'alfa', title: 'Alfa', dirty: true }],
        ariaLabel: 'Formularios',
        closeLabel: (title) => `Quitar ${title}`,
        dirtyLabel: 'Pendiente',
      }),
    );

    expect(screen.getByRole('tablist', { name: 'Formularios' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Quitar Alfa' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Alfa' })).toHaveAccessibleDescription('Pendiente');
  });

  it('← → Home End move between tabs and select on focus; only the active tab is a tab stop', () => {
    const onSelect = vi.fn();
    render(tabs({ onSelect }));
    const [alfa, beta, gama] = screen.getAllByRole('tab');
    expect([alfa, beta, gama].map((tab) => tab.tabIndex)).toEqual([0, -1, -1]);

    alfa.focus();
    keyDown('ArrowRight');
    expect(beta).toHaveFocus();
    expect(onSelect).toHaveBeenLastCalledWith('beta');
    keyDown('End');
    expect(gama).toHaveFocus();
    expect(onSelect).toHaveBeenLastCalledWith('gama');
    keyDown('ArrowRight');
    expect(gama).toHaveFocus();
    keyDown('Home');
    expect(alfa).toHaveFocus();
    expect(onSelect).toHaveBeenLastCalledWith('alfa');
    keyDown('ArrowLeft');
    expect(alfa).toHaveFocus();
    expect(onSelect).toHaveBeenCalledTimes(3);
  });

  it('a click selects a tab', () => {
    const onSelect = vi.fn();
    render(tabs({ onSelect }));

    fireEvent.click(screen.getByRole('tab', { name: 'Gama' }));

    expect(onSelect).toHaveBeenCalledWith('gama');
  });

  it('S-CHR-17: inactive panels stay mounted and hidden, and keep their state', () => {
    render(<Host initial="alfa" />);
    fireEvent.click(screen.getByRole('button', { name: 'alfa 0' }));
    expect(screen.getByRole('button', { name: 'alfa 1' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Beta' }));

    // A hidden element has no computed name, so the panel is found through its tab.
    const alfaPanel = document.getElementById(screen.getByRole('tab', { name: 'Alfa' }).getAttribute('aria-controls') ?? '');
    expect(alfaPanel).toHaveAttribute('role', 'tabpanel');
    expect(alfaPanel).toHaveAttribute('hidden');
    expect(alfaPanel).toHaveTextContent('alfa 1');
    expect(screen.getByRole('tabpanel', { name: 'Beta' })).not.toHaveAttribute('hidden');

    fireEvent.click(screen.getByRole('tab', { name: 'Alfa' }));
    expect(screen.getByRole('button', { name: 'alfa 1' })).toBeVisible();
  });

  it('S-CHR-18: with maxVisible, Más pestañas lists the other tabs and selecting one selects it', () => {
    const onSelect = vi.fn();
    render(tabs({ tabs: EIGHT, activeId: 'uno', maxVisible: 5, onSelect }));

    expect(screen.getAllByRole('tab').map((tab) => tab.textContent)).toEqual(['Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco']);
    const more = screen.getByRole('button', { name: 'Más pestañas' });
    expect(more).toHaveAttribute('aria-haspopup', 'menu');
    expect(more).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(more);

    const menu = screen.getByRole('menu', { name: 'Más pestañas' });
    expect(more).toHaveAttribute('aria-expanded', 'true');
    expect(within(menu).getAllByRole('menuitem').map((item) => item.textContent)).toEqual(['Seis', 'Siete', 'Ocho']);
    expect(within(menu).getByRole('menuitem', { name: 'Seis' })).toHaveFocus();
    keyDown('ArrowDown');
    expect(within(menu).getByRole('menuitem', { name: 'Siete' })).toHaveFocus();
    keyDown('Enter');

    expect(onSelect).toHaveBeenCalledWith('siete');
    expect(screen.queryByRole('menu')).toBeNull();
    // every panel stays mounted, the overflowed ones too
    expect(screen.getAllByRole('tabpanel', { hidden: true })).toHaveLength(8);
  });

  it('keeps an overflowed active tab visible in the last slot', () => {
    render(tabs({ tabs: EIGHT, activeId: 'siete', maxVisible: 5 }));

    expect(screen.getAllByRole('tab').map((tab) => tab.textContent)).toEqual(['Uno', 'Dos', 'Tres', 'Cuatro', 'Siete']);
    expect(screen.getByRole('tab', { name: 'Siete' })).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Más pestañas' }));
    expect(screen.getAllByRole('menuitem').map((item) => item.textContent)).toEqual(['Cinco', 'Seis', 'Ocho']);
  });

  it('shows no overflow button when the tabs fit', () => {
    render(tabs({ maxVisible: 5 }));

    expect(screen.queryByRole('button', { name: 'Más pestañas' })).toBeNull();
  });

  it('D9: Esc closes the overflow menu and leaves a JDialog beneath open', () => {
    const onClose = vi.fn();
    render(
      <JDialog open title="Cliente" onClose={onClose}>
        {tabs({ tabs: EIGHT, activeId: 'uno', maxVisible: 5 })}
      </JDialog>,
    );
    const more = screen.getByRole('button', { name: 'Más pestañas' });
    fireEvent.click(more);
    const item = screen.getByRole('menuitem', { name: 'Seis' });

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
        {tabs({ tabs: EIGHT, activeId: 'uno', maxVisible: 5 })}
        <p>Fuera</p>
      </>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Más pestañas' }));

    fireEvent.pointerDown(screen.getByText('Fuera'));

    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('focusPanel(id) focuses that tab panel', () => {
    const ref = createRef<JWorkspaceTabsHandle>();
    render(<JWorkspaceTabs ref={ref} {...{ tabs: TABS, activeId: 'beta', renderPanel: (id: string) => <p>{id}</p>, onSelect: () => undefined, onCloseRequest: () => undefined }} />);

    act(() => ref.current?.focusPanel('beta'));

    expect(screen.getByRole('tabpanel', { name: 'Beta' })).toHaveFocus();
  });

  it('has no serious axe violations, with the overflow menu closed and open', async () => {
    const { container } = render(tabs({ tabs: [{ ...EIGHT[0], dirty: true }, ...EIGHT.slice(1)], activeId: 'uno', maxVisible: 5 }));
    expect(await seriousViolations(container)).toEqual([]);

    fireEvent.click(screen.getByRole('button', { name: 'Más pestañas' }));
    expect(await seriousViolations(container)).toEqual([]);
  });
});
