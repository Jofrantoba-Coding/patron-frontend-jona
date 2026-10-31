import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { vi } from 'vitest';
import { JUserMenu, JUserMenuItem, InterJUserMenu } from '../JUserMenu';
import { JDialog } from '../JDialog';
import { seriousViolations } from '../../__tests__/quality/axe';

const ITEMS: JUserMenuItem[] = [
  {
    kind: 'radio',
    id: 'tema',
    label: 'Tema',
    value: 'light',
    options: [
      { value: 'system', label: 'Sistema' },
      { value: 'light', label: 'Claro' },
      { value: 'dark', label: 'Oscuro' },
    ],
  },
  { kind: 'action', id: 'perfil', label: 'Mi perfil', disabled: true },
  { kind: 'action', id: 'logout', label: 'Cerrar sesión', tone: 'danger' },
];

const menu = (props: Partial<InterJUserMenu> = {}) => (
  <JUserMenu
    name="Administrador"
    subtitle="Comercial Demo SAC"
    items={ITEMS}
    onAction={() => undefined}
    {...props}
  />
);

const button = () => screen.getByRole('button', { name: 'Administrador' });
const keyDown = (key: string) => fireEvent.keyDown(document.activeElement as Element, { key });

describe('JUserMenu (R-CHR-7)', () => {
  it('S-CHR-21: a menu button named by the user opens a menu; ↓ moves; Esc closes and focuses the button', () => {
    render(menu());
    const trigger = button();
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).toBeNull();

    fireEvent.click(trigger);

    const opened = screen.getByRole('menu', { name: 'Administrador' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', opened.id);
    expect(screen.getByRole('menuitemradio', { name: 'Sistema' })).toHaveFocus();

    keyDown('ArrowDown');
    expect(screen.getByRole('menuitemradio', { name: 'Claro' })).toHaveFocus();
    keyDown('End');
    expect(screen.getByRole('menuitem', { name: 'Cerrar sesión' })).toHaveFocus();
    keyDown('ArrowUp');
    expect(screen.getByRole('menuitem', { name: 'Mi perfil' })).toHaveFocus();

    keyDown('Escape');
    expect(screen.queryByRole('menu')).toBeNull();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
  });

  it('shows the name and subtitle as a header outside the menu items', () => {
    render(menu());
    fireEvent.click(button());

    expect(screen.getByText('Comercial Demo SAC')).toBeVisible();
    expect(within(screen.getByRole('menu')).queryByText('Comercial Demo SAC')).toBeNull();
    expect(
      Array.from(screen.getByRole('menu').querySelectorAll('[role^="menuitem"]')).map((item) => item.textContent),
    ).toEqual(['Sistema', 'Claro', 'Oscuro', 'Mi perfil', 'Cerrar sesión']);
  });

  it('S-CHR-22: a labelled radio group; only the current value is checked; choosing calls the handler value-first', () => {
    const onRadioChange = vi.fn();
    render(menu({ onRadioChange }));
    fireEvent.click(button());

    expect(screen.getByRole('group', { name: 'Tema' })).toBeInTheDocument();
    const radios = screen.getAllByRole('menuitemradio');
    expect(radios.map((radio) => radio.getAttribute('aria-checked'))).toEqual(['false', 'true', 'false']);

    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Oscuro' }));
    expect(onRadioChange).toHaveBeenCalledWith('dark', 'tema');
    expect(screen.queryByRole('menu')).toBeNull();
    expect(button()).toHaveFocus();
  });

  it('Enter and Space activate the focused item and close the menu', () => {
    const onAction = vi.fn();
    const onRadioChange = vi.fn();
    render(menu({ onAction, onRadioChange }));

    fireEvent.click(button());
    keyDown('End');
    keyDown('Enter');
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onAction).toHaveBeenCalledWith('logout');
    expect(screen.queryByRole('menu')).toBeNull();

    fireEvent.click(button());
    keyDown(' ');
    expect(onRadioChange).toHaveBeenCalledWith('system', 'tema');
  });

  it('a disabled action stays focusable, is aria-disabled and does nothing', () => {
    const onAction = vi.fn();
    render(menu({ onAction }));
    fireEvent.click(button());
    const perfil = screen.getByRole('menuitem', { name: 'Mi perfil' });

    expect(perfil).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(perfil);
    expect(onAction).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('↓ on the closed button opens the menu', () => {
    render(menu());
    button().focus();

    keyDown('ArrowDown');
    expect(screen.getByRole('menuitemradio', { name: 'Sistema' })).toHaveFocus();
  });

  it('D9: Esc closes the menu and leaves a JDialog beneath open', () => {
    const onClose = vi.fn();
    render(
      <JDialog open title="Cliente" onClose={onClose}>
        {menu()}
      </JDialog>,
    );
    fireEvent.click(button());
    const item = screen.getByRole('menuitemradio', { name: 'Sistema' });

    act(() => {
      item.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    });

    expect(screen.queryByRole('menu')).toBeNull();
    expect(button()).toHaveFocus();
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog', { name: 'Cliente' })).toBeInTheDocument();
  });

  it('D9: an outside pointer press closes the menu; a press inside does not', () => {
    render(
      <>
        {menu()}
        <p>Fuera</p>
      </>,
    );
    fireEvent.click(button());
    fireEvent.pointerDown(screen.getByRole('menuitemradio', { name: 'Claro' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.pointerDown(screen.getByText('Fuera'));
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('has no serious axe violations, closed and open', async () => {
    const { container } = render(menu());
    expect(await seriousViolations(container)).toEqual([]);

    fireEvent.click(button());
    expect(await seriousViolations(container)).toEqual([]);
  });
});
