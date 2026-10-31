import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import postcss, { type Root } from 'postcss';
import postcssImport from 'postcss-import';
import tailwindcss from 'tailwindcss';
import { vi } from 'vitest';
import tailwindConfig from '../../../tailwind.config.js';
import { JAppShell, InterJAppShell } from '../JAppShell';
import { utilityStyle } from '../../__tests__/css/utilityStyle';
import { seriousViolations } from '../../__tests__/quality/axe';

async function compileLibStylesheet(): Promise<Root> {
  const from = resolve(process.cwd(), 'src/styles/index.css');
  const result = await postcss([postcssImport(), tailwindcss(tailwindConfig)]).process(readFileSync(from, 'utf8'), { from });
  return result.root;
}

const shell = (props: Partial<InterJAppShell> = {}) => (
  <JAppShell
    brand={<span>SoftCommerce</span>}
    topbarEnd={<button type="button">Administrador</button>}
    navLabel="Menú principal"
    sidebar={(api) => (
      <button type="button" onClick={api.close}>
        {api.collapsed ? 'C' : 'Cliente'}
      </button>
    )}
    {...props}
  >
    <p>Contenido</p>
  </JAppShell>
);

const openButton = () => screen.getByRole('button', { name: 'Abrir menú' });

describe('JAppShell (R-CHR-1)', () => {
  let css: Root;

  beforeAll(async () => {
    css = await compileLibStylesheet();
  }, 60_000);

  it('S-CHR-1: one banner with the brand and the topbar end, one named navigation and one main', () => {
    render(shell());

    const banner = screen.getByRole('banner');
    expect(within(banner).getByText('SoftCommerce')).toBeInTheDocument();
    expect(within(banner).getByRole('button', { name: 'Administrador' })).toBeInTheDocument();
    expect(screen.getAllByRole('navigation')).toEqual([screen.getByRole('navigation', { name: 'Menú principal' })]);
    expect(within(screen.getByRole('main')).getByText('Contenido')).toBeInTheDocument();
    expect(utilityStyle(css, banner, 1024, 'height')).toBe('var(--jona-topbar-h)');
  });

  it('S-CHR-2: the collapse toggle controls the sidebar; collapsing turns aria-expanded false and applies the rail width', () => {
    const onCollapsedChange = vi.fn();
    render(shell({ onCollapsedChange }));
    const toggle = screen.getByRole('button', { name: 'Contraer menú' });
    const nav = screen.getByRole('navigation', { name: 'Menú principal' });
    const sidebar = nav.parentElement as HTMLElement;

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(toggle).toHaveAttribute('aria-controls', nav.id);
    expect(utilityStyle(css, sidebar, 1024, 'width')).toBe('var(--jona-shell-sidebar-w)');

    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
    expect(utilityStyle(css, sidebar, 1024, 'width')).toBe('var(--jona-shell-rail-w)');
    expect(within(nav).getByRole('button', { name: 'C' })).toBeInTheDocument();
  });

  it('sets the sidebar and rail widths as CSS variables (16.5rem and 3.5rem by default)', () => {
    const { rerender, container } = render(shell());
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.getPropertyValue('--jona-shell-sidebar-w')).toBe('16.5rem');
    expect(root.style.getPropertyValue('--jona-shell-rail-w')).toBe('3.5rem');

    rerender(shell({ sidebarWidth: '18rem', railWidth: '4rem', defaultCollapsed: true }));
    expect((container.firstElementChild as HTMLElement).style.getPropertyValue('--jona-shell-sidebar-w')).toBe('18rem');
    expect(screen.getByRole('button', { name: 'Contraer menú' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('defaultCollapsed starts as a rail', () => {
    render(shell({ defaultCollapsed: true }));

    expect(screen.getByRole('button', { name: 'Contraer menú' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('S-CHR-3: Abrir menú opens the drawer with focus inside; Esc closes it on its own root and focus returns', () => {
    const documentKeys = vi.fn();
    document.addEventListener('keydown', documentKeys);
    render(shell());
    const open = openButton();
    expect(open).toHaveAttribute('aria-expanded', 'false');

    open.focus();
    fireEvent.click(open);

    const drawer = screen.getByRole('dialog', { name: 'Menú principal' });
    expect(open).toHaveAttribute('aria-expanded', 'true');
    expect(drawer).toContainElement(document.activeElement as HTMLElement);
    expect(within(drawer).getByRole('navigation', { name: 'Menú principal' })).toBeInTheDocument();

    fireEvent.keyDown(document.activeElement as Element, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(open).toHaveFocus();
    expect(documentKeys).not.toHaveBeenCalled();
    document.removeEventListener('keydown', documentKeys);
  });

  it('Cerrar menú and selecting an item close the drawer and give focus back to Abrir menú', () => {
    render(shell());
    const open = openButton();

    open.focus();
    fireEvent.click(open);
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar menú' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(open).toHaveFocus();

    fireEvent.click(open);
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Cliente' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(open).toHaveFocus();
  });

  it('an outside press closes the drawer', () => {
    render(shell());

    fireEvent.click(openButton());
    act(() => {
      document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('S-CHR-4: the Abrir menú container is hidden from lg and shown below', () => {
    render(shell());
    const container = openButton().parentElement as HTMLElement;

    expect(utilityStyle(css, container, 1024, 'display')).toBe('none');
    expect(utilityStyle(css, container, 1023, 'display')).toBe('flex');
  });

  it('the brand keeps its width and the topbar end shrinks first', () => {
    render(shell());
    const brand = screen.getByText('SoftCommerce').parentElement as HTMLElement;
    const end = screen.getByRole('button', { name: 'Administrador' }).parentElement as HTMLElement;

    expect(utilityStyle(css, brand, 375, 'flex-shrink')).toBe('0');
    expect(utilityStyle(css, end, 375, 'min-width')).toBe('0px');
    expect(utilityStyle(css, end, 375, 'flex')).toBe('1 1 0%');
  });

  it('uses the custom labels', () => {
    render(shell({ openMenuLabel: 'Menú', closeMenuLabel: 'Cerrar', collapseLabel: 'Riel' }));

    fireEvent.click(screen.getByRole('button', { name: 'Menú' }));
    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Riel' })).toBeInTheDocument();
  });

  it('has no serious axe violations, closed and open', async () => {
    const { container } = render(shell());
    expect(await seriousViolations(container)).toEqual([]);

    fireEvent.click(openButton());
    expect(await seriousViolations(container)).toEqual([]);
  });
});
