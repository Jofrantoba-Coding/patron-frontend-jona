import { useState } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { vi } from 'vitest';
import { JTreeNav, JTreeNavNode, InterJTreeNav } from '../JTreeNav';
import { seriousViolations } from '../../__tests__/quality/axe';

const NODES: JTreeNavNode[] = [
  {
    id: 'maestros',
    label: 'Maestros',
    children: [
      {
        id: 'generales',
        label: 'Generales',
        children: [
          { id: 'color', label: 'Color' },
          { id: 'cliente', label: 'Cliente' },
          { id: 'marca', label: 'Marca' },
        ],
      },
    ],
  },
  {
    id: 'ventas',
    label: 'Ventas',
    children: [
      { id: 'registro', label: 'Registro de Ventas', disabled: true, badge: 'Próximamente' },
    ],
  },
];

type HostProps = Partial<InterJTreeNav> & { initialExpanded?: string[] };

/** A host that owns the expansion, as the contract asks. */
function Host({ initialExpanded = [], onToggle, onSelect, ...props }: HostProps) {
  const [expandedIds, setExpandedIds] = useState(initialExpanded);
  return (
    <JTreeNav
      ariaLabel="Menú principal"
      nodes={NODES}
      expandedIds={expandedIds}
      onToggle={(id, expanded) => {
        onToggle?.(id, expanded);
        setExpandedIds((ids) => (expanded ? [...ids, id] : ids.filter((other) => other !== id)));
      }}
      onSelect={onSelect ?? (() => undefined)}
      {...props}
    />
  );
}

const item = (name: string) => screen.getByRole('treeitem', { name });
const keyDown = (key: string) => fireEvent.keyDown(document.activeElement as Element, { key });

describe('JTreeNav (R-CHR-2)', () => {
  it('S-CHR-5: a named tree of treeitems with aria-level, branches carry aria-expanded', () => {
    render(<Host initialExpanded={['maestros', 'generales']} />);

    const tree = screen.getByRole('tree', { name: 'Menú principal' });
    expect(within(tree).getAllByRole('treeitem').map((node) => node.textContent)).toEqual([
      'Maestros', 'Generales', 'Color', 'Cliente', 'Marca', 'Ventas',
    ]);
    expect(item('Maestros')).toHaveAttribute('aria-level', '1');
    expect(item('Generales')).toHaveAttribute('aria-level', '2');
    expect(item('Cliente')).toHaveAttribute('aria-level', '3');
    expect(item('Maestros')).toHaveAttribute('aria-expanded', 'true');
    expect(item('Generales')).toHaveAttribute('aria-expanded', 'true');
    expect(item('Ventas')).toHaveAttribute('aria-expanded', 'false');
    expect(item('Cliente')).not.toHaveAttribute('aria-expanded');
  });

  it('is one tab stop with a roving focus; ↓ ↑ Home End move over the visible nodes', () => {
    render(<Host initialExpanded={['maestros', 'generales']} />);
    const stops = screen.getAllByRole('treeitem').filter((node) => node.tabIndex === 0);
    expect(stops).toEqual([item('Maestros')]);

    item('Maestros').focus();
    keyDown('ArrowDown');
    expect(item('Generales')).toHaveFocus();
    expect(item('Generales')).toHaveAttribute('tabindex', '0');
    expect(item('Maestros')).toHaveAttribute('tabindex', '-1');

    keyDown('ArrowUp');
    expect(item('Maestros')).toHaveFocus();
    keyDown('End');
    expect(item('Ventas')).toHaveFocus();
    keyDown('Home');
    expect(item('Maestros')).toHaveFocus();
  });

  it('S-CHR-6: → expands a closed branch, then enters it; ← goes back to the parent, then collapses', () => {
    const onToggle = vi.fn();
    render(<Host onToggle={onToggle} />);

    item('Maestros').focus();
    keyDown('ArrowRight');
    expect(onToggle).toHaveBeenCalledWith('maestros', true);
    expect(item('Maestros')).toHaveAttribute('aria-expanded', 'true');

    keyDown('ArrowRight');
    expect(item('Generales')).toHaveFocus();

    keyDown('ArrowLeft');
    expect(item('Maestros')).toHaveFocus();

    keyDown('ArrowLeft');
    expect(onToggle).toHaveBeenLastCalledWith('maestros', false);
    expect(item('Maestros')).toHaveAttribute('aria-expanded', 'false');
  });

  it('S-CHR-7: Enter and Space select a leaf once each; on a branch they toggle', () => {
    const onSelect = vi.fn();
    const onToggle = vi.fn();
    render(<Host initialExpanded={['maestros', 'generales']} onSelect={onSelect} onToggle={onToggle} />);

    item('Cliente').focus();
    keyDown('Enter');
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenLastCalledWith('cliente');
    keyDown(' ');
    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenLastCalledWith('cliente');

    item('Generales').focus();
    keyDown('Enter');
    expect(onToggle).toHaveBeenCalledWith('generales', false);
    expect(onSelect).toHaveBeenCalledTimes(2);
  });

  it('a click toggles a branch and selects a leaf', () => {
    const onSelect = vi.fn();
    const onToggle = vi.fn();
    render(<Host onSelect={onSelect} onToggle={onToggle} />);

    fireEvent.click(item('Ventas'));
    expect(onToggle).toHaveBeenCalledWith('ventas', true);
    fireEvent.click(item('Registro de Ventas'));
    expect(onSelect).toHaveBeenCalledWith('registro');
  });

  describe('type-ahead', () => {
    beforeEach(() => {
      vi.useFakeTimers({ toFake: ['Date'] });
      vi.setSystemTime(0);
    });
    afterEach(() => vi.useRealTimers());

    it('S-CHR-8: a printable character moves to the next visible node that starts with it', () => {
      render(<Host initialExpanded={['maestros', 'generales']} />);

      item('Color').focus();
      keyDown('m');
      expect(item('Marca')).toHaveFocus();

      vi.setSystemTime(1000);
      keyDown('c');
      expect(item('Color')).toHaveFocus();
      keyDown('c');
      expect(item('Cliente')).toHaveFocus();
    });

    it('characters typed in a quick run match the start of a label', () => {
      render(<Host initialExpanded={['maestros', 'generales']} />);

      item('Maestros').focus();
      keyDown('c');
      expect(item('Color')).toHaveFocus();
      keyDown('l');
      expect(item('Cliente')).toHaveFocus();
    });
  });

  it('S-CHR-9: the active node carries aria-current="page", the others do not', () => {
    render(<Host initialExpanded={['maestros', 'generales']} activeId="cliente" />);

    expect(item('Cliente')).toHaveAttribute('aria-current', 'page');
    expect(item('Color')).not.toHaveAttribute('aria-current');
    expect(screen.getAllByRole('treeitem').filter((node) => node.tabIndex === 0)).toEqual([item('Cliente')]);
  });

  it('S-CHR-10: a disabled leaf keeps its exact name, is described by its badge and still reports onSelect', () => {
    const onSelect = vi.fn();
    render(<Host initialExpanded={['ventas']} onSelect={onSelect} />);

    const registro = screen.getByRole('treeitem', { name: 'Registro de Ventas' });
    expect(registro).toHaveAccessibleName('Registro de Ventas');
    expect(registro).toHaveAttribute('aria-disabled', 'true');
    expect(registro).toHaveAccessibleDescription('Próximamente');
    expect(screen.getByText('Próximamente')).toBeVisible();

    registro.focus();
    expect(registro).toHaveFocus();
    keyDown('Enter');
    expect(onSelect).toHaveBeenCalledWith('registro');
  });

  it('has no serious axe violations', async () => {
    const { container } = render(<Host initialExpanded={['maestros', 'generales', 'ventas']} activeId="cliente" />);

    expect(await seriousViolations(container)).toEqual([]);
  });
});
